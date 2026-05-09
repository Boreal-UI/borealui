/* eslint-disable no-undef */
import {
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { VERSION } from "../utils/constants.js";
import { runCommand } from "../utils/filesystem.js";
import { fail } from "../utils/help.js";
import { promptForOptions } from "../utils/prompts.js";

const SOURCE_EXTENSIONS = ["tsx", "jsx", "ts", "js"];
const BOREAL_CONFIG_CALL = `setBorealStyleConfig({
  defaultTheme: "primary",
  defaultSize: "medium",
  defaultRounding: "medium",
  defaultShadow: "light",
  defaultBorderWidth: "none",
  defaultColorSchemeName: "Forest Dusk",
});
`;
const NEXT_APP_THEME_PROVIDER_PROPS =
  'initialSchemeName="Forest Dusk" enableThemeScript={false}';
const NEXT_RECOMMENDED_GLOBALS = `html {
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: inherit;
}

body {
  margin: 0;
}
`;

export async function initCommand(rawOptions) {
  const options = await promptForOptions(rawOptions);
  const root = resolve(options.cwd);

  if (!existsSync(root) || !statSync(root).isDirectory()) {
    fail(`Project directory does not exist: ${root}`);
  }

  const packageJsonPath = join(root, "package.json");

  if (!existsSync(packageJsonPath)) {
    fail("Could not find package.json. Run this inside an existing React or Next.js project.");
  }

  const packageJson = readPackageJson(packageJsonPath);
  const framework = resolveFramework(root, packageJson, options.framework);
  const packageManager = resolvePackageManager(root, options.packageManager);
  options.recommendedGlobals = await resolveRecommendedGlobalsOption(options, framework);
  const plan = createSetupPlan(root, packageJsonPath, packageJson, framework, options);

  if (plan.length === 0) {
    console.log("Boreal UI already looks configured for this project.");
    return;
  }

  printPlan(root, framework, plan, options.dryRun);

  if (options.dryRun) {
    return;
  }

  const rl = createInterface({ input, output });
  let appliedCount = 0;

  try {
    for (const change of plan) {
      if (await shouldApplyChange(rl, change, options.yes)) {
        mkdirSync(dirname(change.path), { recursive: true });
        writeFileSync(change.path, change.nextContents, "utf8");
        appliedCount += 1;
        console.log(`Updated ${relative(root, change.path) || basename(change.path)}`);
      } else {
        console.log(`Skipped ${relative(root, change.path) || basename(change.path)}`);
      }
    }
  } finally {
    rl.close();
  }

  if (appliedCount > 0 && options.install) {
    const installArgs = packageManager === "yarn" ? [] : ["install"];
    runCommand(packageManager, installArgs, root, "Installed dependencies.");
  }

  printSuccess(root, framework, packageManager, options.install);
}

function readPackageJson(packageJsonPath) {
  try {
    return JSON.parse(readFileSync(packageJsonPath, "utf8"));
  } catch {
    fail("Could not parse package.json.");
  }
}

function resolveFramework(root, packageJson, requestedFramework) {
  if (requestedFramework) return requestedFramework;

  const dependencies = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
    ...packageJson.peerDependencies,
  };

  if (dependencies.next || findFirst(root, nextLayoutCandidates()) || findFirst(root, nextPagesAppCandidates())) {
    return "next";
  }

  if (dependencies.react || findFirst(root, reactEntryCandidates())) {
    return "react";
  }

  fail("Could not detect React or Next.js. Pass --framework react or --framework next.");
}

function resolvePackageManager(root, requestedPackageManager) {
  if (requestedPackageManager) return requestedPackageManager;
  if (existsSync(join(root, "pnpm-lock.yaml"))) return "pnpm";
  if (existsSync(join(root, "yarn.lock"))) return "yarn";
  return "npm";
}

async function resolveRecommendedGlobalsOption(options, framework) {
  if (framework !== "next") return false;
  if (typeof options.recommendedGlobals === "boolean") return options.recommendedGlobals;
  if (options.yes) return true;
  if (options.dryRun) return false;

  const rl = createInterface({ input, output });

  try {
    return await promptBoolean(
      rl,
      "Create or repair a Boreal-safe Next globals.css baseline?",
      true,
    );
  } finally {
    rl.close();
  }
}

function createSetupPlan(root, packageJsonPath, packageJson, framework, options) {
  const changes = [];

  addPackageJsonChange(changes, packageJsonPath, packageJson);

  if (framework === "next") {
    addNextChanges(changes, root, options);
    return changes;
  }

  addReactChanges(changes, root);
  return changes;
}

function addPackageJsonChange(changes, packageJsonPath, packageJson) {
  const hasBoreal =
    packageJson.dependencies?.["boreal-ui"] ||
    packageJson.devDependencies?.["boreal-ui"] ||
    packageJson.peerDependencies?.["boreal-ui"];

  if (hasBoreal) return;

  const nextPackageJson = {
    ...packageJson,
    dependencies: {
      ...packageJson.dependencies,
      "boreal-ui": `^${VERSION}`,
    },
  };

  changes.push({
    path: packageJsonPath,
    summary: 'Add "boreal-ui" to dependencies.',
    nextContents: `${JSON.stringify(nextPackageJson, null, 2)}\n`,
  });
}

function addReactChanges(changes, root) {
  const entryPath = findFirst(root, reactEntryCandidates());

  if (!entryPath) {
    fail("Could not find a React entry file such as src/main.tsx or src/index.jsx.");
  }

  let source = readFileSync(entryPath, "utf8");
  let nextSource = source;

  nextSource = ensureSideEffectImport(nextSource, "boreal-ui/core/globals.css");
  nextSource = ensureNamedImport(nextSource, "boreal-ui/core", [
    "ThemeProvider",
    "setBorealStyleConfig",
  ]);
  nextSource = ensureBorealConfig(nextSource);
  nextSource = ensureReactThemeProvider(nextSource);

  if (nextSource !== source) {
    changes.push({
      path: entryPath,
      summary:
        "Import Boreal globals, configure Boreal defaults, and wrap the React app in ThemeProvider.",
      nextContents: nextSource,
    });
  }
}

function addNextChanges(changes, root, options) {
  const pagesAppPath = findFirst(root, nextPagesAppCandidates());

  if (pagesAppPath) {
    const globalsPath = resolveNextGlobalsPath(root, pagesAppPath, "pages", options);

    addNextPagesRouterChange(changes, pagesAppPath, globalsPath);
    addNextRecommendedGlobalsChange(changes, root, {
      enabled: options.recommendedGlobals,
      globalsPath,
      routerEntryPath: pagesAppPath,
      routerType: "pages",
    });
    return;
  }

  const layoutPath = findFirst(root, nextLayoutCandidates());

  if (!layoutPath) {
    fail("Could not find a Next.js app/layout file or pages/_app file.");
  }

  const providerPath = findFirst(root, nextProviderCandidates(dirname(layoutPath)));
  const resolvedProviderPath =
    providerPath ?? join(dirname(layoutPath), `boreal-provider.${extensionFor(layoutPath)}`);
  const providerImportPath = `./${basename(resolvedProviderPath).replace(/\.[^.]+$/, "")}`;
  const globalsPath = resolveNextGlobalsPath(root, layoutPath, "app", options);

  addNextProviderChange(changes, resolvedProviderPath);
  addNextLayoutChange(changes, layoutPath, providerImportPath, globalsPath);
  addNextRecommendedGlobalsChange(changes, root, {
    enabled: options.recommendedGlobals,
    globalsPath,
    routerEntryPath: layoutPath,
    routerType: "app",
  });
}

function addNextPagesRouterChange(changes, pagesAppPath, globalsPath) {
  const source = readFileSync(pagesAppPath, "utf8");
  let nextSource = source;

  nextSource = ensureSideEffectImport(nextSource, "boreal-ui/next/globals.css");
  if (globalsPath) {
    nextSource = ensureSideEffectImportAfter(
      nextSource,
      toImportSpecifier(pagesAppPath, globalsPath),
      "boreal-ui/next/globals.css",
    );
  }
  nextSource = ensureNamedImport(nextSource, "boreal-ui/next", [
    "ThemeProvider",
    "setBorealStyleConfig",
  ]);
  nextSource = ensureBorealConfig(nextSource);
  nextSource = ensureNextPagesThemeProvider(nextSource);

  if (nextSource !== source) {
    changes.push({
      path: pagesAppPath,
      summary:
        "Import Boreal globals, configure Boreal defaults, and wrap the Next.js pages app in ThemeProvider.",
      nextContents: nextSource,
    });
  }
}

function addNextLayoutChange(changes, layoutPath, providerImportPath, globalsPath) {
  const source = readFileSync(layoutPath, "utf8");
  let nextSource = source;
  const providerImportName =
    getDefaultImportName(source, providerImportPath) ?? "BorealProvider";

  nextSource = ensureSideEffectImport(nextSource, "boreal-ui/next/globals.css");
  if (globalsPath) {
    nextSource = ensureSideEffectImportAfter(
      nextSource,
      toImportSpecifier(layoutPath, globalsPath),
      "boreal-ui/next/globals.css",
    );
  }
  nextSource = ensureDefaultImport(nextSource, providerImportName, providerImportPath);
  nextSource = ensureNextLayoutProvider(nextSource, providerImportName);

  if (nextSource !== source) {
    changes.push({
      path: layoutPath,
      summary:
        "Import Boreal globals and ensure the app layout uses the Boreal provider.",
      nextContents: nextSource,
    });
  }
}

function addNextProviderChange(changes, providerPath) {
  const exists = existsSync(providerPath);
  const source = exists ? readFileSync(providerPath, "utf8") : "";
  let nextSource = source;

  if (!source.trim()) {
    nextSource = getNextProviderContents(extensionFor(providerPath));
  } else {
    nextSource = ensureUseClient(nextSource);
    nextSource = ensureNamedImport(nextSource, "boreal-ui/next", [
      "ThemeProvider",
      "setBorealStyleConfig",
    ]);
    nextSource = ensureBorealConfig(nextSource);
    nextSource = ensureProviderComponent(nextSource);
  }

  nextSource = ensureNextAppThemeProviderProps(nextSource);

  if (nextSource !== source) {
    changes.push({
      path: providerPath,
      summary: exists
        ? "Add Boreal ThemeProvider and default style config to the existing provider file."
        : "Create the small client provider required by the Next.js app router.",
      nextContents: nextSource,
    });
  }
}

function addNextRecommendedGlobalsChange(
  changes,
  root,
  { enabled, globalsPath, routerEntryPath, routerType },
) {
  if (!enabled) return;

  const resolvedGlobalsPath =
    globalsPath ?? defaultNextGlobalsPath(root, routerEntryPath, routerType);
  const exists = existsSync(resolvedGlobalsPath);
  const source = exists ? readFileSync(resolvedGlobalsPath, "utf8") : "";
  const nextSource = ensureRecommendedNextGlobals(source);

  if (nextSource !== source) {
    changes.push({
      path: resolvedGlobalsPath,
      summary: exists
        ? "Replace broad Next.js global spacing resets with a Boreal-safe globals.css baseline."
        : "Create a Boreal-safe Next.js globals.css baseline.",
      nextContents: nextSource,
    });
  }
}

function resolveNextGlobalsPath(root, routerEntryPath, routerType, options) {
  if (!options.recommendedGlobals) return undefined;

  return (
    findFirst(root, nextGlobalsCandidates()) ??
    defaultNextGlobalsPath(root, routerEntryPath, routerType)
  );
}

function toImportSpecifier(fromPath, targetPath) {
  let specifier = relative(dirname(fromPath), targetPath).replace(/\\/g, "/");

  if (!specifier.startsWith(".")) {
    specifier = `./${specifier}`;
  }

  return specifier;
}

function ensureSideEffectImport(source, specifier) {
  if (source.includes(`"${specifier}"`) || source.includes(`'${specifier}'`)) {
    return source;
  }

  return insertAfterUseClient(source, `import "${specifier}";\n`);
}

function ensureSideEffectImportAfter(source, specifier, afterSpecifier) {
  if (source.includes(`"${specifier}"`) || source.includes(`'${specifier}'`)) {
    return source;
  }

  const afterImportRegex = new RegExp(
    `(import\\s*["']${escapeRegExp(afterSpecifier)}["'];?\\s*)`,
  );

  if (afterImportRegex.test(source)) {
    return source.replace(afterImportRegex, `$1import "${specifier}";\n`);
  }

  return ensureSideEffectImport(source, specifier);
}

function ensureNamedImport(source, specifier, names) {
  const importRegex = new RegExp(
    `import\\s*\\{([^}]+)\\}\\s*from\\s*["']${escapeRegExp(specifier)}["'];?`,
  );
  const match = source.match(importRegex);

  if (match) {
    const existingNames = match[1].split(",").map((name) => name.trim()).filter(Boolean);
    const missingNames = names.filter((name) => !existingNames.includes(name));

    if (missingNames.length === 0) return source;

    const nextImport = `import { ${[...existingNames, ...missingNames].join(", ")} } from "${specifier}";`;
    return source.replace(importRegex, nextImport);
  }

  return insertAfterImports(source, `import { ${names.join(", ")} } from "${specifier}";\n`);
}

function ensureDefaultImport(source, importName, specifier) {
  if (getDefaultImportName(source, specifier)) {
    return source;
  }

  if (
    source.includes(` ${importName} from "${specifier}"`) ||
    source.includes(` ${importName} from '${specifier}'`)
  ) {
    return source;
  }

  return insertAfterImports(source, `import ${importName} from "${specifier}";\n`);
}

function getDefaultImportName(source, specifier) {
  const importRegex = new RegExp(
    `import\\s+([A-Za-z_$][\\w$]*)\\s+from\\s*["']${escapeRegExp(specifier)}["'];?`,
  );
  const match = source.match(importRegex);

  return match?.[1];
}

function ensureBorealConfig(source) {
  if (source.includes("setBorealStyleConfig(") || source.includes("borealConfig(")) {
    return source;
  }

  return insertAfterImports(source, `\n${BOREAL_CONFIG_CALL}`);
}

function ensureReactThemeProvider(source) {
  if (/<ThemeProvider[\s>]/.test(source)) return source;

  const nextSource = source.replace(
    /<App(\s[^>]*)?\s*\/>/,
    (_, props = "") => {
      const propText = props.trim();

      return `<ThemeProvider initialSchemeName="Forest Dusk">\n      <App${propText ? ` ${propText}` : ""} />\n    </ThemeProvider>`;
    },
  );

  if (nextSource === source) {
    fail("Could not find <App /> in the React entry file to wrap with ThemeProvider.");
  }

  return nextSource;
}

function ensureNextPagesThemeProvider(source) {
  if (/<ThemeProvider[\s>]/.test(source)) return source;

  const nextSource = source.replace(
    /<Component\s+\{\.\.\.pageProps\}\s*\/>/,
    `<ThemeProvider initialSchemeName="Forest Dusk">\n      <Component {...pageProps} />\n    </ThemeProvider>`,
  );

  if (nextSource === source) {
    fail("Could not find <Component {...pageProps} /> in pages/_app to wrap with ThemeProvider.");
  }

  return nextSource;
}

function ensureNextLayoutProvider(source, providerName) {
  const providerPattern = new RegExp(
    `<${escapeRegExp(providerName)}[\\s>][\\s\\S]*\\{children\\}[\\s\\S]*<\\/${escapeRegExp(providerName)}>`,
  );

  if (providerPattern.test(source)) return source;

  const nextSource = source.replace(
    /\{children\}/,
    `<${providerName}>{children}</${providerName}>`,
  );

  if (nextSource === source) {
    fail("Could not find {children} in the Next.js layout to wrap with BorealProvider.");
  }

  return nextSource;
}

function ensureProviderComponent(source) {
  if (/ThemeProvider[\s\S]*\{children\}[\s\S]*<\/ThemeProvider>/.test(source)) {
    return source;
  }

  let nextSource = source.replace(
    /\{children\}/,
    `<ThemeProvider ${NEXT_APP_THEME_PROVIDER_PROPS}>{children}</ThemeProvider>`,
  );

  if (nextSource !== source) {
    return nextSource;
  }

  nextSource = source.replace(
    /return\s+children\s*;/,
    `return <ThemeProvider ${NEXT_APP_THEME_PROVIDER_PROPS}>{children}</ThemeProvider>;`,
  );

  if (nextSource === source) {
    fail("Could not find provider children to wrap with ThemeProvider.");
  }

  return nextSource;
}

function ensureNextAppThemeProviderProps(source) {
  return source.replace(/<ThemeProvider\b([^>]*)>/, (match, attrs = "") => {
    let nextAttrs = attrs;

    if (!/\binitialSchemeName(?:\s|=|$)/.test(nextAttrs)) {
      nextAttrs += ' initialSchemeName="Forest Dusk"';
    }

    if (!/\benableThemeScript(?:\s|=|$)/.test(nextAttrs)) {
      nextAttrs += " enableThemeScript={false}";
    }

    return nextAttrs === attrs ? match : `<ThemeProvider${nextAttrs}>`;
  });
}

function ensureUseClient(source) {
  const trimmed = source.trimStart();

  if (trimmed.startsWith('"use client"') || trimmed.startsWith("'use client'")) {
    return source;
  }

  return `"use client";\n\n${source}`;
}

function ensureRecommendedNextGlobals(source) {
  if (!source.trim()) return NEXT_RECOMMENDED_GLOBALS;

  const starterResetRegex = /\*\s*\{(?=[^}]*box-sizing\s*:\s*border-box\s*;?)(?=[^}]*padding\s*:\s*0\s*;?)(?=[^}]*margin\s*:\s*0\s*;?)[^}]*\}/m;
  const hasRecommendedBoxSizing =
    /html\s*\{[^}]*box-sizing\s*:\s*border-box\s*;?[^}]*\}/m.test(source) &&
    /\*\s*,\s*\*::before\s*,\s*\*::after\s*\{[^}]*box-sizing\s*:\s*inherit\s*;?[^}]*\}/m.test(source);

  let nextSource = source;

  if (starterResetRegex.test(nextSource)) {
    nextSource = nextSource.replace(starterResetRegex, NEXT_RECOMMENDED_GLOBALS.trimEnd());
  } else if (!hasRecommendedBoxSizing) {
    nextSource = `${NEXT_RECOMMENDED_GLOBALS}\n${nextSource}`;
  }

  if (!/body\s*\{[^}]*margin\s*:\s*0\s*;?[^}]*\}/m.test(nextSource)) {
    nextSource = `${nextSource.trimEnd()}\n\nbody {\n  margin: 0;\n}\n`;
  }

  return nextSource.endsWith("\n") ? nextSource : `${nextSource}\n`;
}

function insertAfterUseClient(source, text) {
  const useClientRegex = /^(\s*["']use client["'];?\s*)/;
  const match = source.match(useClientRegex);

  if (match) {
    return source.replace(useClientRegex, `${match[1]}${text}`);
  }

  return `${text}${source}`;
}

function insertAfterImports(source, text) {
  const lines = source.split(/\r?\n/);
  let insertAt = 0;
  let sawImport = false;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index].trim();

    if (line === "" && !sawImport) {
      insertAt = index + 1;
      continue;
    }

    if (line === '"use client";' || line === "'use client';") {
      insertAt = index + 1;
      continue;
    }

    if (line.startsWith("import ")) {
      sawImport = true;
      insertAt = index + 1;
      continue;
    }

    break;
  }

  lines.splice(insertAt, 0, text.trimEnd());
  return lines.join("\n");
}

function getNextProviderContents(extension) {
  const isTypeScript = extension === "tsx" || extension === "ts";
  const props = isTypeScript ? "{ children }: { children: React.ReactNode }" : "{ children }";

  return `"use client";

import React from "react";
import { ThemeProvider, setBorealStyleConfig } from "boreal-ui/next";

${BOREAL_CONFIG_CALL}
export default function BorealProvider(${props}) {
  return (
    <ThemeProvider ${NEXT_APP_THEME_PROVIDER_PROPS}>{children}</ThemeProvider>
  );
}
`;
}

function reactEntryCandidates() {
  return SOURCE_EXTENSIONS.flatMap((extension) => [
    `src/main.${extension}`,
    `src/index.${extension}`,
  ]);
}

function nextLayoutCandidates() {
  return SOURCE_EXTENSIONS.flatMap((extension) => [
    `app/layout.${extension}`,
    `src/app/layout.${extension}`,
  ]);
}

function nextPagesAppCandidates() {
  return SOURCE_EXTENSIONS.flatMap((extension) => [
    `pages/_app.${extension}`,
    `src/pages/_app.${extension}`,
  ]);
}

function nextGlobalsCandidates() {
  return [
    "app/globals.css",
    "src/app/globals.css",
    "styles/globals.css",
    "src/styles/globals.css",
  ];
}

function defaultNextGlobalsPath(root, routerEntryPath, routerType) {
  if (routerType === "app") {
    return join(dirname(routerEntryPath), "globals.css");
  }

  const pagesDirectory = dirname(routerEntryPath);
  const sourceDirectory = basename(pagesDirectory) === "pages" ? dirname(pagesDirectory) : root;

  return join(sourceDirectory, "styles", "globals.css");
}

function nextProviderCandidates(layoutDirectory) {
  return SOURCE_EXTENSIONS.flatMap((extension) => [
    join(layoutDirectory, `providers.${extension}`),
    join(layoutDirectory, `provider.${extension}`),
    join(layoutDirectory, `boreal-provider.${extension}`),
  ]);
}

function findFirst(root, candidates) {
  return candidates
    .map((candidate) => (candidate.includes(root) ? candidate : join(root, candidate)))
    .find((candidate) => existsSync(candidate));
}

function extensionFor(filePath) {
  return filePath.split(".").pop() ?? "jsx";
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function shouldApplyChange(rl, change, yes) {
  if (yes) return true;

  const answer = (
    await rl.question(`${change.summary}\nEdit ${change.path}? (Y/n): `)
  )
    .trim()
    .toLowerCase();

  return !answer || ["y", "yes", "true", "1"].includes(answer);
}

async function promptBoolean(rl, question, defaultValue) {
  const suffix = defaultValue ? "Y/n" : "y/N";
  const answer = (await rl.question(`${question} (${suffix}): `))
    .trim()
    .toLowerCase();

  if (!answer) return defaultValue;

  return ["y", "yes", "true", "1"].includes(answer);
}

function printPlan(root, framework, plan, dryRun) {
  console.log(`Boreal UI setup for ${framework === "next" ? "Next.js" : "React"} at ${root}`);
  console.log(dryRun ? "Planned changes:" : "Proposed changes:");

  for (const change of plan) {
    console.log(`- ${relative(root, change.path) || basename(change.path)}: ${change.summary}`);
  }
}

function printSuccess(root, framework, packageManager, installWasRun) {
  const installCommand = packageManager === "npm" ? "npm install" : `${packageManager} install`;

  console.log(`
Boreal UI setup complete.

${installWasRun ? "" : `Run ${installCommand} if dependencies have not been installed yet.\n`}
Use components from ${framework === "next" ? "boreal-ui/next" : "boreal-ui/core"}.
`);
}
