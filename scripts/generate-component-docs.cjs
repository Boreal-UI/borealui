#!/usr/bin/env node

const path = require("path");
const fsSync = require("fs");
const fs = require("fs/promises");
const fg = require("fast-glob");
const { Project, Node, SyntaxKind } = require("ts-morph");
const rootDir = path.resolve(__dirname, "..");

const TypeFormatFlagsForDocs = {
  NoTruncation: 1,
  MultilineObjectLiterals: 1024,
  UseAliasDefinedOutsideCurrentScope: 16384,
  AddUndefined: 131072,
  WriteArrowStyleSignature: 262144,
  UseSingleQuotesForStringLiteralType: 268435456,
};

const config = {
  tsConfigFilePath: path.join(rootDir, "tsconfig.json"),
  include: ["src/components/**/*.types.ts"],
  exclude: ["**/*.test.ts", "**/*.test.tsx", "**/*.stories.tsx"],
  outputDir: path.join(rootDir, "src", "generated-docs"),
};
const isCheckMode = process.argv.includes("--check");

function compareText(left, right) {
  if (left < right) return -1;
  if (left > right) return 1;
  return 0;
}

function toPosixPath(filePath) {
  return filePath.replace(/\\/g, "/");
}

async function resetDir(dirPath) {
  await fs.rm(dirPath, { recursive: true, force: true });
  await fs.mkdir(dirPath, { recursive: true });
}

function normalizeWhitespace(input) {
  return String(input || "")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanPropName(name) {
  return String(name).replace(/^["']|["']$/g, "");
}

function getJsDocText(node) {
  if (!node || typeof node.getJsDocs !== "function") return "";

  const docs = node.getJsDocs();
  if (!docs.length) return "";

  return docs
    .map((doc) => (doc.getCommentText() ?? doc.getInnerText()).trim())
    .filter(Boolean)
    .map(normalizeWhitespace)
    .join("\n\n");
}

function removeUndefinedFromOptionalType(typeText) {
  return typeText
    .replace(/\s*\|\s*undefined/g, "")
    .replace(/undefined\s*\|\s*/g, "")
    .trim();
}

function simplifyImportedTypes(typeText) {
  return typeText
    .replace(/import\(".*?@types\/react\/index"\)\./g, "React.")
    .replace(/import\(".*?@types\\react\\index"\)\./g, "React.")
    .replace(/import\("@\/types\/types"\)\./g, "")
    .replace(
      /import\(".*?[\\/]src[\\/]index\.(?:core|next)"\)\./g,
      "",
    )
    .replace(/\bReact\.ReactNode\b/g, "ReactNode")
    .replace(/\bReact\.ComponentType</g, "ComponentType<")
    .replace(/\bReact\.JSXElementConstructor\b/g, "JSXElementConstructor");
}

function simplifyTypeText(typeText) {
  const simplified = normalizeWhitespace(
    simplifyImportedTypes(removeUndefinedFromOptionalType(typeText)),
  );

  if (/[A-Za-z]:[\\/]/.test(simplified) || /import\("\//.test(simplified)) {
    throw new Error(`Generated type contains an absolute path: ${simplified}`);
  }

  return simplified;
}

const knownDefaultAccessors = new Map([
  ["getDefaultTheme()", 'configured default theme (fallback: "primary")'],
  ["getDefaultRounding()", 'configured default rounding (fallback: "medium")'],
  ["getDefaultShadow()", 'configured default shadow (fallback: "light")'],
  ["getDefaultSize()", 'configured default size (fallback: "medium")'],
  ["getDefaultGlass()", "configured default glass setting (fallback: false)"],
  [
    "getDefaultOutline()",
    "configured default outline setting (fallback: false)",
  ],
  ["getDefaultBorder()", 'configured default border width (fallback: "none")'],
  [
    "getDefaultColorSchemeName()",
    'configured default color scheme (fallback: "Forest Dusk")',
  ],
]);

function formatDefaultValue(initializerText) {
  const normalized = normalizeWhitespace(initializerText);
  return knownDefaultAccessors.get(normalized) ?? normalized;
}

function getBaseComponentPath(typesFilePath, componentName) {
  const componentDir = path.dirname(typesFilePath);
  const fileBaseName = path.basename(typesFilePath, ".types.ts");
  const candidates = [
    path.join(componentDir, `${componentName}Base.tsx`),
    path.join(componentDir, `${fileBaseName}Base.tsx`),
  ];

  const matchingCandidate = candidates.find((candidate) => {
    try {
      return fsSync.existsSync(candidate);
    } catch {
      return false;
    }
  });

  if (matchingCandidate) return matchingCandidate;

  try {
    const expected = `${componentName}base.tsx`.toLowerCase();
    const match = fsSync
      .readdirSync(componentDir)
      .find((entry) => entry.toLowerCase() === expected);

    if (match) return path.join(componentDir, match);
  } catch {
    // Fall through to the conventional path. The caller already tolerates misses.
  }

  return candidates[0];
}

function getBindingElementPropName(bindingElement) {
  const propertyName = bindingElement.getPropertyNameNode();

  if (propertyName) {
    if (
      Node.isStringLiteral(propertyName) ||
      Node.isNumericLiteral(propertyName)
    ) {
      return propertyName.getLiteralText();
    }

    return propertyName.getText();
  }

  const nameNode = bindingElement.getNameNode();
  if (!Node.isIdentifier(nameNode)) return null;

  return nameNode.getText();
}

async function getComponentDefaultValues(
  project,
  typesFilePath,
  componentName,
) {
  const baseComponentPath = getBaseComponentPath(typesFilePath, componentName);

  try {
    await fs.access(baseComponentPath);
  } catch {
    return new Map();
  }

  const sourceFile =
    project.getSourceFile(baseComponentPath) ||
    project.addSourceFileAtPath(baseComponentPath);

  const defaults = new Map();

  for (const bindingElement of sourceFile.getDescendantsOfKind(
    SyntaxKind.BindingElement,
  )) {
    const initializer = bindingElement.getInitializer();
    if (!initializer) continue;

    const propName = getBindingElementPropName(bindingElement);
    if (!propName || isInternalPropName(propName)) continue;

    defaults.set(propName, formatDefaultValue(initializer.getText()));
  }

  return defaults;
}

function isInternalPropName(name) {
  return [
    "classMap",
    "IconButton",
    "ImageComponent",
    "LinkComponent",
    "ButtonComponent",
    "Button",
    "FormGroup",
    "ProgressBar",
    "ThemeSelect",
    "LinkWrapper",
    "sanitizeHtml",
    "renderItem",
  ].includes(name);
}

function shouldExcludeProp(name, typeText) {
  if (isInternalPropName(name)) return true;

  // Exclude nested prop bags like buttonProps, inputProps, menuProps, etc.
  if (/Props$/.test(name)) return true;

  // Exclude renderer / wrapper / injected implementation details
  if (/(Component|Renderer|Render|Wrapper)$/.test(name)) return true;

  // Exclude HTML passthrough bags
  if (
    /^(button|input|trigger|menu|dialog|popover|content|label|wrapper|container|root)[A-Z].*Props$/.test(
      name,
    ) ||
    /^(button|input|trigger|menu|dialog|popover|content|label|wrapper|container|root)Props$/.test(
      name,
    )
  ) {
    return true;
  }

  // Exclude prop bags whose type is HTML attribute passthrough
  if (
    /^(Omit|Pick|Partial|Required|Readonly)</.test(typeText) &&
    /(HTMLAttributes|ButtonHTMLAttributes|InputHTMLAttributes|TextareaHTMLAttributes|SelectHTMLAttributes|LabelHTMLAttributes|AriaAttributes)/.test(
      typeText,
    )
  ) {
    return true;
  }

  return false;
}

function categorizeProp(name, typeText) {
  if (shouldExcludeProp(name, typeText)) return "internal";

  if (name.startsWith("aria-") || /^aria[A-Z]/.test(name) || name === "role") {
    return "aria";
  }

  if (name === "data-testid" || name.startsWith("data-")) {
    return "testing";
  }

  if (
    [
      "theme",
      "state",
      "size",
      "rounding",
      "shadow",
      "outline",
      "className",
    ].includes(name)
  ) {
    return "styling";
  }

  if (/^on[A-Z]/.test(name) || /^\(.*\)\s*=>/.test(typeText)) {
    return "events";
  }

  return "props";
}

function shouldSkipPropsLikeName(name) {
  return (
    !/Props$/.test(name) ||
    /^Base[A-Z]/.test(name) ||
    /BaseProps$/.test(name) ||
    /AccessibilityProps$/.test(name) ||
    /InternalProps$/.test(name) ||
    /InjectedProps$/.test(name) ||
    /ElementProps$/.test(name) ||
    /WrapperProps$/.test(name) ||
    /Image.*Props$/.test(name) ||
    /^Html.*Props$/.test(name) ||
    /^NextLike.*Props$/.test(name)
  );
}

function getExpectedPropsNameFromFile(filePath) {
  const base = path.basename(filePath, ".types.ts");
  return `${base}Props`;
}

function getComponentNameFromPropsName(propsName) {
  return propsName.replace(/Props$/, "");
}

function toExportName(componentName) {
  return `${componentName.charAt(0).toLowerCase()}${componentName.slice(1)}PropDocs`;
}

function makePropDoc(member, inherited = false) {
  const name = cleanPropName(member.getName());

  let typeText = member.getType().getText(member, TypeFormatFlagsForDocs);
  typeText = simplifyTypeText(typeText);

  const description = getJsDocText(member);
  const required = !member.hasQuestionToken();
  const category = categorizeProp(name, typeText);
  const internal = category === "internal";

  if (internal) return null;

  return {
    name,
    type: typeText,
    description,
    required,
    inherited,
    category,
  };
}

function mergePropDocs(existingProps, newProps) {
  const map = new Map();

  for (const prop of existingProps) {
    map.set(prop.name, prop);
  }

  for (const prop of newProps) {
    if (!prop) continue;

    if (!map.has(prop.name)) {
      map.set(prop.name, prop);
      continue;
    }

    const existing = map.get(prop.name);

    // Prefer richer description
    const description =
      existing.description &&
      existing.description.length >= prop.description.length
        ? existing.description
        : prop.description;

    // If the prop appears optional in one branch and required in another,
    // keep it optional for the union doc surface.
    const required = existing.required && prop.required;

    // Prefer non-inherited over inherited
    const inherited = existing.inherited && prop.inherited;

    map.set(prop.name, {
      ...existing,
      description,
      required,
      inherited,
      defaultValue: existing.defaultValue ?? prop.defaultValue,
    });
  }

  return Array.from(map.values()).sort((a, b) => compareText(a.name, b.name));
}

function applyDefaultValues(props, defaultValues) {
  if (!defaultValues.size) return props;

  return props.map((prop) => {
    const defaultValue = defaultValues.get(prop.name);
    if (!defaultValue) return prop;

    return {
      ...prop,
      defaultValue,
    };
  });
}

function getPropertySignaturesFromTypeLiteral(typeLiteralNode) {
  return typeLiteralNode
    .getMembers()
    .filter((member) => Node.isPropertySignature(member));
}

function getPropertySignaturesFromInterfaceDeclaration(interfaceDecl) {
  return interfaceDecl
    .getMembers()
    .filter((member) => Node.isPropertySignature(member));
}

function getPropertySignaturesFromIntersection(typeNode, sourceFile) {
  let props = [];

  for (const part of typeNode.getTypeNodes()) {
    props = mergePropDocs(props, getPropDocsFromTypeNode(part, sourceFile));
  }

  return props;
}

function getPropertySignaturesFromUnion(typeNode, sourceFile) {
  let props = [];

  for (const part of typeNode.getTypeNodes()) {
    props = mergePropDocs(props, getPropDocsFromTypeNode(part, sourceFile));
  }

  return props;
}

function resolveTypeReferenceNode(typeRefNode, sourceFile) {
  const typeNameNode = typeRefNode.getTypeName();
  const typeName = typeNameNode.getText();

  const localInterface = sourceFile.getInterface(typeName);
  if (localInterface) {
    return {
      kind: "interface",
      node: localInterface,
    };
  }

  const localTypeAlias = sourceFile.getTypeAlias(typeName);
  if (localTypeAlias) {
    return {
      kind: "typeAlias",
      node: localTypeAlias,
    };
  }

  return null;
}

function getPropDocsFromInterface(iface, inherited = false) {
  const props = [];

  for (const member of getPropertySignaturesFromInterfaceDeclaration(iface)) {
    const propDoc = makePropDoc(member, inherited);
    if (propDoc) props.push(propDoc);
  }

  return props.sort((a, b) => compareText(a.name, b.name));
}

function getPropDocsFromTypeLiteral(typeLiteralNode, inherited = false) {
  const props = [];

  for (const member of getPropertySignaturesFromTypeLiteral(typeLiteralNode)) {
    const propDoc = makePropDoc(member, inherited);
    if (propDoc) props.push(propDoc);
  }

  return props.sort((a, b) => compareText(a.name, b.name));
}

function getPropDocsFromTypeNode(typeNode, sourceFile, inherited = false) {
  if (!typeNode) return [];

  if (Node.isTypeLiteral(typeNode)) {
    return getPropDocsFromTypeLiteral(typeNode, inherited);
  }

  if (Node.isIntersectionTypeNode(typeNode)) {
    return getPropertySignaturesFromIntersection(typeNode, sourceFile);
  }

  if (Node.isUnionTypeNode(typeNode)) {
    return getPropertySignaturesFromUnion(typeNode, sourceFile);
  }

  if (Node.isTypeReference(typeNode)) {
    const resolved = resolveTypeReferenceNode(typeNode, sourceFile);
    if (!resolved) return [];

    if (resolved.kind === "interface") {
      return getPropDocsFromInterface(resolved.node, true);
    }

    if (resolved.kind === "typeAlias") {
      return getPropDocsFromTypeAlias(resolved.node, sourceFile, true);
    }
  }

  if (typeNode.getKind() === SyntaxKind.ParenthesizedType) {
    return getPropDocsFromTypeNode(
      typeNode.getTypeNode(),
      sourceFile,
      inherited,
    );
  }

  return [];
}

function getPropDocsFromTypeAlias(typeAlias, sourceFile, inherited = false) {
  const typeNode = typeAlias.getTypeNode();
  if (!typeNode) return [];

  return getPropDocsFromTypeNode(typeNode, sourceFile, inherited);
}

function buildTypesFile() {
  return `/**
 * AUTO-GENERATED FILE. DO NOT EDIT.
 * Generated by scripts/generate-component-docs.cjs
 */

export interface GeneratedPropDoc {
  name: string;
  type: string;
  description: string;
  required: boolean;
  inherited: boolean;
  category: string;
  defaultValue?: string;
}

export interface GeneratedComponentDoc {
  name: string;
  interfaceName: string;
  description: string;
  sourcePath: string;
  props: GeneratedPropDoc[];
}
`;
}

function buildComponentFile(doc) {
  const exportName = toExportName(doc.name);

  return `/**
 * AUTO-GENERATED FILE. DO NOT EDIT.
 * Generated by scripts/generate-component-docs.cjs
 */

import type { GeneratedComponentDoc } from "./types.js";

export const ${exportName}: GeneratedComponentDoc = ${JSON.stringify(doc, null, 2)};
`;
}

function buildIndexFile(componentNames) {
  const uniqueNames = [...new Set(componentNames)].sort(compareText);

  const lines = uniqueNames.map((name) => {
    const exportName = toExportName(name);
    return `export { ${exportName} } from "./${name}.props.js";`;
  });

  return `/**
 * AUTO-GENERATED FILE. DO NOT EDIT.
 * Generated by scripts/generate-component-docs.cjs
 */

export type { GeneratedComponentDoc, GeneratedPropDoc } from "./types.js";
${lines.join("\n")}
`;
}

function getCandidateInterfaces(sourceFile) {
  return sourceFile
    .getInterfaces()
    .filter(
      (candidate) =>
        candidate.isExported() && !shouldSkipPropsLikeName(candidate.getName()),
    );
}

function getCandidateTypeAliases(sourceFile) {
  return sourceFile
    .getTypeAliases()
    .filter(
      (candidate) =>
        candidate.isExported() && !shouldSkipPropsLikeName(candidate.getName()),
    );
}

function findBestPropsDeclaration(sourceFile, expectedPropsName) {
  const interfaces = getCandidateInterfaces(sourceFile);
  const typeAliases = getCandidateTypeAliases(sourceFile);

  const exactInterface = interfaces.find(
    (candidate) => candidate.getName() === expectedPropsName,
  );
  if (exactInterface) {
    return { kind: "interface", node: exactInterface };
  }

  const exactTypeAlias = typeAliases.find(
    (candidate) => candidate.getName() === expectedPropsName,
  );
  if (exactTypeAlias) {
    return { kind: "typeAlias", node: exactTypeAlias };
  }

  const caseInsensitiveInterface = interfaces.find(
    (candidate) =>
      candidate.getName().toLowerCase() === expectedPropsName.toLowerCase(),
  );
  if (caseInsensitiveInterface) {
    return { kind: "interface", node: caseInsensitiveInterface };
  }

  const caseInsensitiveTypeAlias = typeAliases.find(
    (candidate) =>
      candidate.getName().toLowerCase() === expectedPropsName.toLowerCase(),
  );
  if (caseInsensitiveTypeAlias) {
    return { kind: "typeAlias", node: caseInsensitiveTypeAlias };
  }

  if (interfaces[0]) {
    return { kind: "interface", node: interfaces[0] };
  }

  if (typeAliases[0]) {
    return { kind: "typeAlias", node: typeAliases[0] };
  }

  return null;
}

function findPublicPropsDeclarations(sourceFile, expectedPropsName) {
  const declarations = [];
  const seen = new Set();
  const best = findBestPropsDeclaration(sourceFile, expectedPropsName);

  if (best) {
    declarations.push(best);
    seen.add(best.node.getName());
  }

  const candidates = [
    ...getCandidateInterfaces(sourceFile).map((node) => ({
      kind: "interface",
      node,
    })),
    ...getCandidateTypeAliases(sourceFile).map((node) => ({
      kind: "typeAlias",
      node,
    })),
  ];

  for (const candidate of candidates) {
    const name = candidate.node.getName();
    if (seen.has(name)) continue;

    const componentName = getComponentNameFromPropsName(name);
    if (!hasComponentWrapper(sourceFile.getFilePath(), componentName)) continue;

    declarations.push(candidate);
    seen.add(name);
  }

  return declarations;
}

function hasComponentWrapper(typesFilePath, componentName) {
  const componentDir = path.dirname(typesFilePath);
  const expected = `${componentName}.tsx`.toLowerCase();
  const searchDirs = [
    path.join(componentDir, "core"),
    path.join(componentDir, "next"),
    path.join(componentDir, componentName, "core"),
    path.join(componentDir, componentName, "next"),
  ];

  for (const searchDir of searchDirs) {
    try {
      const match = fsSync
        .readdirSync(searchDir)
        .find((entry) => entry.toLowerCase() === expected);

      if (match) return true;
    } catch {
      // Directory layouts differ by component; missing candidates are expected.
    }
  }

  return false;
}

function normalizeGeneratedContent(content) {
  return content.replace(/\r\n/g, "\n");
}

function getExistingGeneratedFileNames() {
  if (!fsSync.existsSync(config.outputDir)) return [];

  return fsSync
    .readdirSync(config.outputDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".ts"))
    .map((entry) => entry.name)
    .sort(compareText);
}

async function createGeneratedFiles() {
  const project = new Project({
    tsConfigFilePath: config.tsConfigFilePath,
    skipAddingFilesFromTsConfig: false,
  });

  const filePaths = await fg(config.include, {
    cwd: rootDir,
    absolute: true,
    ignore: config.exclude,
  });

  if (!filePaths.length) {
    throw new Error("No .types.ts files found.");
  }

  filePaths.sort(compareText);
  const generatedFiles = new Map([["types.ts", buildTypesFile()]]);
  const generatedComponentNames = [];

  for (const filePath of filePaths) {
    const sourceFile =
      project.getSourceFile(filePath) || project.addSourceFileAtPath(filePath);

    const expectedPropsName = getExpectedPropsNameFromFile(filePath);
    const declarations = findPublicPropsDeclarations(
      sourceFile,
      expectedPropsName,
    );

    for (const declaration of declarations) {
      const propsName = declaration.node.getName();
      const componentName = getComponentNameFromPropsName(propsName);

      const rawProps =
        declaration.kind === "interface"
          ? getPropDocsFromInterface(declaration.node, false)
          : getPropDocsFromTypeAlias(declaration.node, sourceFile, false);

      const defaultValues = await getComponentDefaultValues(
        project,
        filePath,
        componentName,
      );
      const props = applyDefaultValues(rawProps, defaultValues);

      const doc = {
        name: componentName,
        interfaceName: propsName,
        description: getJsDocText(declaration.node),
        sourcePath: toPosixPath(path.relative(rootDir, filePath)),
        props,
      };

      generatedFiles.set(
        `${componentName}.props.ts`,
        buildComponentFile(doc),
      );

      generatedComponentNames.push(componentName);
    }
  }

  generatedFiles.set(
    "index.ts",
    buildIndexFile(generatedComponentNames),
  );

  return {
    generatedComponentNames,
    generatedFiles,
  };
}

function verifyGeneratedFiles(generatedFiles) {
  const expectedFileNames = [...generatedFiles.keys()].sort(compareText);
  const existingFileNames = getExistingGeneratedFileNames();
  const errors = [];

  if (expectedFileNames.join("\n") !== existingFileNames.join("\n")) {
    errors.push("generated file names do not match the expected component set");
  }

  for (const fileName of expectedFileNames) {
    const filePath = path.join(config.outputDir, fileName);
    if (!fsSync.existsSync(filePath)) continue;

    const actual = normalizeGeneratedContent(fsSync.readFileSync(filePath, "utf8"));
    const expected = normalizeGeneratedContent(generatedFiles.get(fileName));

    if (actual !== expected) {
      errors.push(`${toPosixPath(path.relative(rootDir, filePath))} is stale`);
    }
  }

  if (errors.length > 0) {
    throw new Error(
      [
        "Generated component documentation is not reproducible:",
        ...errors.map((error) => `- ${error}`),
        "Run npm run gen:docs and commit the generated output.",
      ].join("\n"),
    );
  }
}

async function writeGeneratedFiles(generatedFiles) {
  await resetDir(config.outputDir);

  for (const fileName of [...generatedFiles.keys()].sort(compareText)) {
    await fs.writeFile(
      path.join(config.outputDir, fileName),
      generatedFiles.get(fileName),
      "utf8",
    );
  }
}

async function main() {
  const { generatedComponentNames, generatedFiles } =
    await createGeneratedFiles();

  if (isCheckMode) {
    verifyGeneratedFiles(generatedFiles);
    console.log(
      `Verified ${generatedComponentNames.length} reproducible component prop docs files.`,
    );
    return;
  }

  await writeGeneratedFiles(generatedFiles);

  console.log(
    `Generated ${generatedComponentNames.length} component prop docs files in ${path.relative(
      rootDir,
      config.outputDir,
    )}`,
  );
}

main().catch((error) => {
  console.error("Failed to generate component docs.");
  console.error(error);
  process.exit(1);
});
