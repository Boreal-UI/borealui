const fs = require("fs");
const path = require("path");
const { updateFileSync } = require("./safeFileUpdates.cjs");

const rootDir = path.resolve(__dirname, "..");
const isCheckMode = process.argv.includes("--check");
const flavors = ["core", "next"];

function getEntryNames(flavor) {
  const sourceDir = path.join(rootDir, "src", flavor);

  if (!fs.existsSync(sourceDir)) {
    throw new Error(`Missing source entry directory: ${sourceDir}`);
  }

  return fs
    .readdirSync(sourceDir)
    .filter((file) => /\.(ts|tsx)$/.test(file))
    .map((file) => file.replace(/\.(ts|tsx)$/, ""))
    .sort((a, b) => a.localeCompare(b));
}

function getCssImport(name) {
  return `import './${name}.css';`;
}

function hasCssImport(source, name) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const cssImportPattern = new RegExp(
    `import\\s+["']\\./${escapedName}\\.css["'];?`,
  );

  return cssImportPattern.test(source);
}

function getInsertionIndex(source) {
  const directivePattern = /^(["']use client["'];\r?\n)/;
  let index = 0;
  let remainingSource = source;
  let match = remainingSource.match(directivePattern);

  while (match) {
    index += match[0].length;
    remainingSource = source.slice(index);
    match = remainingSource.match(directivePattern);
  }

  return index;
}

function addCssImport(source, name) {
  const cssImport = `${getCssImport(name)}\n`;
  const insertionIndex = getInsertionIndex(source);

  return `${source.slice(0, insertionIndex)}${cssImport}${source.slice(
    insertionIndex,
  )}`;
}

function patchFlavor(flavor) {
  const distDir = path.join(rootDir, "dist", flavor);

  if (!fs.existsSync(distDir)) {
    throw new Error(
      `Missing ${flavor} dist output. Run the ${flavor} build first.`,
    );
  }

  const missingImports = [];
  const patchedFiles = [];

  for (const name of getEntryNames(flavor)) {
    const jsPath = path.join(distDir, `${name}.js`);
    const cssPath = path.join(distDir, `${name}.css`);

    if (!fs.existsSync(cssPath)) continue;

    try {
      if (isCheckMode) {
        const source = fs.readFileSync(jsPath, "utf8");
        if (!hasCssImport(source, name)) {
          missingImports.push(`${flavor}/${name}.js`);
        }
        continue;
      }

      const changed = updateFileSync(jsPath, (source) =>
        hasCssImport(source, name) ? source : addCssImport(source, name),
      );

      if (changed) {
        missingImports.push(`${flavor}/${name}.js`);
        patchedFiles.push(`${flavor}/${name}.js`);
      }
    } catch (error) {
      if (error?.code === "ENOENT") continue;
      throw error;
    }
  }

  if (patchedFiles.length > 0) {
    console.log(
      `Patched ${patchedFiles.length} ${flavor} CSS sidecar imports.`,
    );
  }

  return missingImports;
}

const missingImports = flavors.flatMap(patchFlavor);

if (missingImports.length > 0 && isCheckMode) {
  console.error(
    [
      "Missing CSS sidecar imports:",
      ...missingImports.map((file) => `- dist/${file}`),
      "",
      "Run npm run patch:style-sidecars after building.",
    ].join("\n"),
  );
  process.exitCode = 1;
} else if (missingImports.length === 0) {
  console.log("All CSS sidecar imports are present.");
}
