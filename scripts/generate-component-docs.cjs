#!/usr/bin/env node

const path = require("path");
const fs = require("fs/promises");
const fg = require("fast-glob");
const { Project, Node, SyntaxKind } = require("ts-morph");

const TypeFormatFlagsForDocs = {
  NoTruncation: 1,
  MultilineObjectLiterals: 1024,
  UseAliasDefinedOutsideCurrentScope: 16384,
  AddUndefined: 131072,
  WriteArrowStyleSignature: 262144,
  UseSingleQuotesForStringLiteralType: 268435456,
};

const config = {
  tsConfigFilePath: path.resolve("tsconfig.json"),
  include: ["src/components/**/*.types.ts"],
  exclude: ["**/*.test.ts", "**/*.test.tsx", "**/*.stories.tsx"],
  outputDir: path.resolve("src/generated-docs"),
};

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
    .map((doc) => doc.getInnerText().trim())
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
    .replace(/\bReact\.ReactNode\b/g, "ReactNode")
    .replace(/\bReact\.ComponentType</g, "ComponentType<")
    .replace(/\bReact\.JSXElementConstructor\b/g, "JSXElementConstructor");
}

function simplifyTypeText(typeText) {
  return normalizeWhitespace(
    simplifyImportedTypes(removeUndefinedFromOptionalType(typeText)),
  );
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
    /ControlProps$/.test(name) ||
    /InternalProps$/.test(name) ||
    /InjectedProps$/.test(name)
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
    });
  }

  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
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

  return props.sort((a, b) => a.name.localeCompare(b.name));
}

function getPropDocsFromTypeLiteral(typeLiteralNode, inherited = false) {
  const props = [];

  for (const member of getPropertySignaturesFromTypeLiteral(typeLiteralNode)) {
    const propDoc = makePropDoc(member, inherited);
    if (propDoc) props.push(propDoc);
  }

  return props.sort((a, b) => a.name.localeCompare(b.name));
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

import type { GeneratedComponentDoc } from "./types";

export const ${exportName}: GeneratedComponentDoc = ${JSON.stringify(doc, null, 2)};
`;
}

function buildIndexFile(componentNames) {
  const uniqueNames = [...new Set(componentNames)].sort((a, b) =>
    a.localeCompare(b),
  );

  const lines = uniqueNames.map((name) => {
    const exportName = toExportName(name);
    return `export { ${exportName} } from "./${name}.props";`;
  });

  return `/**
 * AUTO-GENERATED FILE. DO NOT EDIT.
 * Generated by scripts/generate-component-docs.cjs
 */

export type { GeneratedComponentDoc, GeneratedPropDoc } from "./types";
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

async function main() {
  const project = new Project({
    tsConfigFilePath: config.tsConfigFilePath,
    skipAddingFilesFromTsConfig: false,
  });

  const filePaths = await fg(config.include, {
    cwd: process.cwd(),
    absolute: true,
    ignore: config.exclude,
  });

  if (!filePaths.length) {
    console.warn("No .types.ts files found.");
    return;
  }

  await resetDir(config.outputDir);

  await fs.writeFile(
    path.join(config.outputDir, "types.ts"),
    buildTypesFile(),
    "utf8",
  );

  const generatedComponentNames = [];

  for (const filePath of filePaths) {
    const sourceFile =
      project.getSourceFile(filePath) || project.addSourceFileAtPath(filePath);

    const expectedPropsName = getExpectedPropsNameFromFile(filePath);
    const declaration = findBestPropsDeclaration(sourceFile, expectedPropsName);

    if (!declaration) continue;

    const propsName = declaration.node.getName();
    const componentName = getComponentNameFromPropsName(propsName);

    const props =
      declaration.kind === "interface"
        ? getPropDocsFromInterface(declaration.node, false)
        : getPropDocsFromTypeAlias(declaration.node, sourceFile, false);

    const doc = {
      name: componentName,
      interfaceName: propsName,
      description: getJsDocText(declaration.node),
      sourcePath: path.relative(process.cwd(), filePath),
      props,
    };

    const outputFile = path.join(config.outputDir, `${componentName}.props.ts`);
    await fs.writeFile(outputFile, buildComponentFile(doc), "utf8");

    generatedComponentNames.push(componentName);
  }

  await fs.writeFile(
    path.join(config.outputDir, "index.ts"),
    buildIndexFile(generatedComponentNames),
    "utf8",
  );

  console.log(
    `Generated ${generatedComponentNames.length} component prop docs files in ${path.relative(
      process.cwd(),
      config.outputDir,
    )}`,
  );
}

main().catch((error) => {
  console.error("Failed to generate component docs.");
  console.error(error);
  process.exit(1);
});
