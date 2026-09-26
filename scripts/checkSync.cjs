const fs = require("fs");
const path = require("path");
const postcss = require("postcss");
const sass = require("sass");
const { Node, Project, SyntaxKind } = require("ts-morph");
const parityExceptions = require("./styleParityExceptions.cjs");

const REPO_ROOT = path.resolve(__dirname, "..");
const COMPONENTS_DIR = path.join(REPO_ROOT, "src", "components");

const normalizePath = (value) => value.split(path.sep).join("/");
const sorted = (values) =>
  [...values].sort((left, right) => left.localeCompare(right));
const classAliases = new Map([
  ["p", "primary"],
  ["s", "secondary"],
  ["t", "tertiary"],
  ["q", "quaternary"],
  ["c", "clear"],
  ["sm", "small"],
  ["md", "medium"],
  ["lg", "large"],
  ["lt", "light"],
  ["str", "strong"],
  ["xl", "intense"],
  ["h", "horizontal"],
  ["v", "vertical"],
  ["tl", "topLeft"],
  ["tc", "topCenter"],
  ["tr", "topRight"],
  ["bl", "bottomLeft"],
  ["bc", "bottomCenter"],
  ["br", "bottomRight"],
  ["st", "static"],
  ["fx", "fixed"],
  ["sk", "sticky"],
  ["shadowSm", "shadowLight"],
  ["shadowMd", "shadowMedium"],
  ["shadowLg", "shadowStrong"],
  ["shadowXl", "shadowIntense"],
  ["shadowLt", "shadowLight"],
  ["shadowStr", "shadowStrong"],
  ["roundSm", "roundSmall"],
  ["roundMd", "roundMedium"],
  ["roundLg", "roundLarge"],
  ["borderSm", "borderSmall"],
  ["borderMd", "borderMedium"],
  ["borderLg", "borderLarge"],
  ["labelT", "labelTop"],
  ["labelB", "labelBottom"],
  ["labelL", "labelLeft"],
  ["labelR", "labelRight"],
  ["attachmentSt", "attachmentStatic"],
  ["attachmentFx", "attachmentFixed"],
  ["attachmentSk", "attachmentSticky"],
]);

function walkDirectories(root) {
  const directories = [];
  const visit = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const child = path.join(directory, entry.name);
      directories.push(child);
      visit(child);
    }
  };
  visit(root);
  return directories;
}

function discoverStyleFamilies(componentsDir = COMPONENTS_DIR) {
  const families = [];

  for (const directory of walkDirectories(componentsDir)) {
    if (path.basename(directory) !== "core") continue;

    const familyDir = path.dirname(directory);
    const nextDir = path.join(familyDir, "next");
    const coreStyles = fs
      .readdirSync(directory, { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith(".scss"));

    for (const coreStyle of coreStyles) {
      const component = coreStyle.name.slice(0, -".scss".length);
      families.push({
        component,
        id: normalizePath(path.relative(componentsDir, familyDir)),
        familyDir,
        coreDir: directory,
        nextDir,
        coreStylePath: path.join(directory, coreStyle.name),
        nextStylePath: path.join(nextDir, `${component}.module.scss`),
      });
    }
  }

  return families.sort((left, right) => left.id.localeCompare(right.id));
}

function hasFileCaseInsensitive(directory, expectedName) {
  return (
    fs.existsSync(directory) &&
    fs
      .readdirSync(directory)
      .some((file) => file.toLowerCase() === expectedName.toLowerCase())
  );
}

function createProject(rootDir, sourcePaths) {
  const tsconfigPath = path.join(rootDir, "tsconfig.json");
  const project = fs.existsSync(tsconfigPath)
    ? new Project({
        tsConfigFilePath: tsconfigPath,
        skipAddingFilesFromTsConfig: true,
      })
    : new Project({
        skipAddingFilesFromTsConfig: true,
        compilerOptions: { allowJs: true, jsx: 4, strict: true },
      });

  sourcePaths.forEach((sourcePath) => project.addSourceFileAtPath(sourcePath));
  return project;
}

function unwrapObjectLiteral(initializer) {
  if (!initializer) return undefined;
  if (Node.isObjectLiteralExpression(initializer)) return initializer;
  if (Node.isCallExpression(initializer)) {
    const [firstArgument] = initializer.getArguments();
    return Node.isObjectLiteralExpression(firstArgument)
      ? firstArgument
      : undefined;
  }
  return undefined;
}

function extractCoreClassMap(sourceFiles) {
  const entries = new Map();

  for (const sourceFile of sourceFiles) {
    for (const declaration of sourceFile.getVariableDeclarations()) {
      const objectLiteral = unwrapObjectLiteral(declaration.getInitializer());
      if (!objectLiteral) continue;
      const properties = objectLiteral.getProperties();
      if (
        properties.length === 0 ||
        properties.some((property) => {
          if (!Node.isPropertyAssignment(property)) return true;
          const value = property.getInitializer();
          return (
            !value ||
            (!Node.isStringLiteral(value) &&
              !Node.isNoSubstitutionTemplateLiteral(value))
          );
        })
      ) {
        continue;
      }

      for (const property of properties) {
        const value = property.getInitializer();
        entries.set(
          property.getName().replace(/^['"]|['"]$/g, ""),
          value.getLiteralValue(),
        );
      }
    }
  }

  return entries;
}

function extractClassMapUsage(sourceFiles) {
  const requiredKeys = new Set();
  let hasUnknownDynamicAccess = false;

  for (const sourceFile of sourceFiles) {
    for (const access of sourceFile.getDescendantsOfKind(
      SyntaxKind.PropertyAccessExpression,
    )) {
      if (access.getExpression().getText() === "classMap") {
        requiredKeys.add(access.getName());
      }
    }

    for (const access of sourceFile.getDescendantsOfKind(
      SyntaxKind.ElementAccessExpression,
    )) {
      if (access.getExpression().getText() !== "classMap") continue;
      const argument = access.getArgumentExpression();
      if (!argument) continue;
      if (
        Node.isStringLiteral(argument) ||
        Node.isNoSubstitutionTemplateLiteral(argument)
      ) {
        requiredKeys.add(argument.getLiteralValue());
        continue;
      }

      const types = argument.getType().isUnion()
        ? argument.getType().getUnionTypes()
        : [argument.getType()];
      const literals = types
        .filter((candidate) => candidate.isStringLiteral())
        .map((candidate) => candidate.getLiteralValue())
        .filter((literal) => !["custom", "inherit", "solid"].includes(literal));
      if (literals.length > 0) {
        literals.forEach((literal) => requiredKeys.add(literal));
      } else {
        hasUnknownDynamicAccess = true;
      }
    }
  }

  for (const [alias, canonical] of classAliases) {
    if (requiredKeys.has(alias) && requiredKeys.has(canonical)) {
      requiredKeys.delete(alias);
    }
  }

  return { requiredKeys, hasUnknownDynamicAccess };
}

function compileClassNames(stylePath, rootDir) {
  const result = sass.compile(stylePath, {
    loadPaths: [rootDir, path.join(rootDir, "node_modules")],
    logger: sass.Logger.silent,
    style: "expanded",
  });
  const classes = new Set();
  const classPattern = /\.(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)/g;
  postcss.parse(result.css).walkRules((rule) => {
    let match;
    while ((match = classPattern.exec(rule.selector)) !== null) {
      classes.add(match[1]);
    }
  });
  return classes;
}

function sourceFeatures(stylePath) {
  const source = fs.readFileSync(stylePath, "utf8");
  const features = new Map([
    ["focus-visible", /:focus-visible/.test(source)],
    ["focus-within", /:focus-within/.test(source)],
    ["reduced-motion", /prefers-reduced-motion/.test(source)],
    ["forced-colors", /forced-colors/.test(source)],
  ]);
  const variables = new Set(
    [...source.matchAll(/var\(\s*(--[\w-]+)/g)].map((match) => match[1]),
  );
  return { features, variables };
}

function familySourcePaths(family) {
  const baseSources = fs
    .readdirSync(family.familyDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /Base\.(ts|tsx)$/.test(entry.name))
    .map((entry) => path.join(family.familyDir, entry.name));
  const sourcesIn = (directory) =>
    fs.existsSync(directory)
      ? fs
          .readdirSync(directory, { withFileTypes: true })
          .filter((entry) => entry.isFile() && entry.name.endsWith(".tsx"))
          .map((entry) => path.join(directory, entry.name))
      : [];
  return {
    baseSources,
    coreSources: sourcesIn(family.coreDir),
    nextSources: sourcesIn(family.nextDir),
  };
}

function exceptionMatches(exception, diagnostic) {
  return (
    exception.component === diagnostic.component &&
    exception.kind === diagnostic.kind &&
    exception.surface === diagnostic.surface &&
    (exception.key ?? null) === (diagnostic.key ?? null)
  );
}

function makeDiagnostic(component, kind, surface, message, key) {
  return { component, kind, surface, message, ...(key ? { key } : {}) };
}

function resolveBackingKey(keys, semanticKey) {
  if (keys.has(semanticKey)) return semanticKey;
  const canonical = classAliases.get(semanticKey);
  return canonical && keys.has(canonical) ? canonical : undefined;
}

function analyzeFamily(family, options) {
  const { rootDir, exceptions, projectFiles } = options;
  const errors = [];
  const warnings = [];
  const suppressed = [];
  const { baseSources, coreSources, nextSources } = familySourcePaths(family);
  const missing = [];
  if (
    !hasFileCaseInsensitive(family.familyDir, `${family.component}.types.ts`)
  ) {
    missing.push(`${family.component}.types.ts`);
  }
  if (
    !hasFileCaseInsensitive(family.familyDir, `${family.component}Base.tsx`)
  ) {
    missing.push(`${family.component}Base.tsx`);
  }
  if (
    !coreSources.some(
      (file) => path.basename(file) === `${family.component}.tsx`,
    )
  ) {
    missing.push(`core/${family.component}.tsx`);
  }
  if (!fs.existsSync(family.coreStylePath)) {
    missing.push(`core/${family.component}.scss`);
  }
  if (
    !nextSources.some(
      (file) => path.basename(file) === `${family.component}.tsx`,
    )
  ) {
    missing.push(`next/${family.component}.tsx`);
  }
  if (!fs.existsSync(family.nextStylePath)) {
    missing.push(`next/${family.component}.module.scss`);
  }

  if (missing.length > 0) {
    errors.push(
      makeDiagnostic(
        family.id,
        "structure",
        "family",
        `missing expected files: ${missing.join(", ")}`,
      ),
    );
    return { errors, warnings, suppressed, inventory: undefined };
  }

  const coreWrapperSource = fs.readFileSync(
    path.join(family.coreDir, `${family.component}.tsx`),
    "utf8",
  );
  const nextWrapperSource = fs.readFileSync(
    path.join(family.nextDir, `${family.component}.tsx`),
    "utf8",
  );
  if (
    !coreWrapperSource.includes(`./${family.component}.scss`) ||
    !coreWrapperSource.includes("classMap=")
  ) {
    errors.push(
      makeDiagnostic(
        family.id,
        "wrapper",
        "core",
        "Core wrapper must import its SCSS and pass a classMap.",
      ),
    );
  }
  if (
    !nextWrapperSource.includes(`./${family.component}.module.scss`) ||
    !nextWrapperSource.includes("classMap=")
  ) {
    errors.push(
      makeDiagnostic(
        family.id,
        "wrapper",
        "next",
        "Next wrapper must import its CSS Module and pass a classMap.",
      ),
    );
  }

  const sourceFiles = (paths) =>
    paths.map((file) => projectFiles.get(path.resolve(file))).filter(Boolean);
  const coreMap = extractCoreClassMap(sourceFiles(coreSources));
  const { requiredKeys, hasUnknownDynamicAccess } = extractClassMapUsage(
    sourceFiles(baseSources),
  );
  const coreClasses = compileClassNames(family.coreStylePath, rootDir);
  const nextClasses = compileClassNames(family.nextStylePath, rootDir);
  const reported = new Set();
  const usedCoreKeys = new Set();

  const report = (diagnostic, severity = "error") => {
    const signature = [
      diagnostic.component,
      diagnostic.kind,
      diagnostic.surface,
      diagnostic.key ?? "",
    ].join("|");
    if (reported.has(signature)) return;
    reported.add(signature);
    const exception = exceptions.find((candidate) =>
      exceptionMatches(candidate, diagnostic),
    );
    if (exception) {
      suppressed.push({ ...diagnostic, reason: exception.reason });
    } else if (severity === "warning") {
      warnings.push(diagnostic);
    } else {
      errors.push(diagnostic);
    }
  };

  for (const key of sorted(requiredKeys)) {
    const coreBackingKey = resolveBackingKey(new Set(coreMap.keys()), key);
    const nextBackingKey = resolveBackingKey(nextClasses, key);
    if (!coreBackingKey) {
      report(
        makeDiagnostic(
          family.id,
          "missing-key",
          "core",
          `Core missing classMap key: ${key}`,
          key,
        ),
      );
    } else {
      usedCoreKeys.add(coreBackingKey);
      const mappedClass = coreMap.get(coreBackingKey);
      if (mappedClass && !coreClasses.has(mappedClass)) {
        report(
          makeDiagnostic(
            family.id,
            "missing-class",
            "core",
            `Core classMap.${coreBackingKey} references missing SCSS class: ${mappedClass}`,
            key,
          ),
        );
      }
    }
    if (!nextBackingKey) {
      report(
        makeDiagnostic(
          family.id,
          "missing-key",
          "next",
          `Next missing classMap key: ${key}`,
          key,
        ),
      );
    }
  }

  if (!hasUnknownDynamicAccess) {
    for (const key of sorted(coreMap.keys())) {
      if (!usedCoreKeys.has(key)) {
        report(
          makeDiagnostic(
            family.id,
            "dead-key",
            "both",
            `Possible dead styling key: ${key}`,
            key,
          ),
          "warning",
        );
      }
    }
  }

  const coreSourceFeatures = sourceFeatures(family.coreStylePath);
  const nextSourceFeatures = sourceFeatures(family.nextStylePath);
  for (const [feature, coreHasFeature] of coreSourceFeatures.features) {
    const nextHasFeature = nextSourceFeatures.features.get(feature);
    if (coreHasFeature !== nextHasFeature) {
      const surface = coreHasFeature ? "next" : "core";
      report(
        makeDiagnostic(
          family.id,
          "accessibility-feature",
          surface,
          `${surface === "next" ? "Next" : "Core"} missing accessibility feature: ${feature}`,
          feature,
        ),
      );
    }
  }

  for (const variable of coreSourceFeatures.variables) {
    if (!nextSourceFeatures.variables.has(variable)) {
      report(
        makeDiagnostic(
          family.id,
          "token",
          "next",
          `Next missing CSS variable usage: ${variable}`,
          variable,
        ),
        "warning",
      );
    }
  }
  for (const variable of nextSourceFeatures.variables) {
    if (!coreSourceFeatures.variables.has(variable)) {
      report(
        makeDiagnostic(
          family.id,
          "token",
          "core",
          `Core missing CSS variable usage: ${variable}`,
          variable,
        ),
        "warning",
      );
    }
  }

  return {
    errors,
    warnings,
    suppressed,
    inventory: {
      component: family.id,
      coreStyle: normalizePath(path.relative(rootDir, family.coreStylePath)),
      nextStyle: normalizePath(path.relative(rootDir, family.nextStylePath)),
      requiredKeys: sorted(requiredKeys),
      coreKeys: sorted(coreMap.keys()),
      nextKeys: sorted(nextClasses),
      hasUnknownDynamicAccess,
    },
  };
}

function validateExceptions(exceptions) {
  for (const exception of exceptions) {
    if (
      !exception.component ||
      !exception.kind ||
      !exception.surface ||
      !exception.reason
    ) {
      throw new Error(
        "Every style parity exception requires component, kind, surface, and reason.",
      );
    }
  }
}

function analyzeRepository(options = {}) {
  const rootDir = path.resolve(options.rootDir ?? REPO_ROOT);
  const componentsDir = path.resolve(
    options.componentsDir ?? path.join(rootDir, "src", "components"),
  );
  const exceptions = options.exceptions ?? parityExceptions;
  validateExceptions(exceptions);
  const families = discoverStyleFamilies(componentsDir);
  const sourcePaths = [
    ...new Set(
      families.flatMap((family) => {
        const { baseSources, coreSources, nextSources } =
          familySourcePaths(family);
        return [...baseSources, ...coreSources, ...nextSources];
      }),
    ),
  ];
  const project = createProject(rootDir, sourcePaths);
  const projectFiles = new Map(
    project
      .getSourceFiles()
      .map((file) => [path.resolve(file.getFilePath()), file]),
  );
  const results = families.map((family) =>
    analyzeFamily(family, { rootDir, exceptions, projectFiles }),
  );
  return {
    families: results.map((result) => result.inventory).filter(Boolean),
    errors: results.flatMap((result) => result.errors),
    warnings: results.flatMap((result) => result.warnings),
    suppressed: results.flatMap((result) => result.suppressed),
  };
}

function formatReport(report, elapsedMs) {
  const lines = [
    `Style parity inventory: ${report.families.length} Core/Next paired families.`,
  ];
  const grouped = new Map();
  for (const diagnostic of [...report.errors, ...report.warnings]) {
    const entries = grouped.get(diagnostic.component) ?? [];
    entries.push(diagnostic);
    grouped.set(diagnostic.component, entries);
  }
  for (const component of sorted(grouped.keys())) {
    lines.push(component);
    for (const diagnostic of grouped.get(component)) {
      const prefix = report.warnings.includes(diagnostic) ? "warning" : "error";
      lines.push(`  ${prefix}: ${diagnostic.message}`);
    }
  }
  if (report.suppressed.length > 0) {
    lines.push(`Intentional exceptions applied: ${report.suppressed.length}.`);
  }
  if (report.errors.length === 0) {
    lines.push("Core/Next styling semantics are in parity.");
  }
  lines.push(`Style parity check completed in ${elapsedMs.toFixed(1)}ms.`);
  return lines.join("\n");
}

function runCheck(options = {}) {
  const startedAt = process.hrtime.bigint();
  const report = analyzeRepository(options);
  const elapsedMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
  return { report, elapsedMs, output: formatReport(report, elapsedMs) };
}

if (require.main === module) {
  try {
    const result = runCheck();
    console.log(result.output);
    if (result.report.errors.length > 0) process.exitCode = 1;
  } catch (error) {
    console.error(
      `Style parity check failed: ${error instanceof Error ? error.message : String(error)}`,
    );
    process.exitCode = 1;
  }
}

module.exports = {
  analyzeRepository,
  discoverStyleFamilies,
  formatReport,
  runCheck,
};
