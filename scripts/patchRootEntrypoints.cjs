const fs = require("fs");
const path = require("path");
const { overwriteFileSync } = require("./safeFileUpdates.cjs");

const rootDir = path.resolve(__dirname, "..");
const isCheckMode = process.argv.includes("--check");
const flavors = ["core", "next"];

function createRootEntrypoint(flavor) {
  const sourcePath = path.join(rootDir, "src", `index.${flavor}.ts`);
  const source = fs.readFileSync(sourcePath, "utf8").replace(/\r\n/g, "\n");

  return source
    .replace(/^export \* from "\.\/types\/index";\n?/m, "")
    .replace(/^import "\.\/styles\/globals\.scss";\n?/m, "")
    .replace(new RegExp(`from "\\./${flavor}/([^\"]+)"`, "g"), 'from "./$1.js"')
    .trimEnd()
    .concat("\n");
}

function getCssImports(source) {
  return Array.from(
    source.matchAll(/import\s+["'](\.\/[^"']+\.css)["'];?/g),
    (match) => match[1],
  );
}

function getJavaScriptReexports(source) {
  return Array.from(
    source.matchAll(/from\s+["'](\.\/[^"']+\.js)["'];?/g),
    (match) => match[1],
  );
}

function validateRootEntrypoint(flavor, source, expectedSource) {
  const errors = [];

  if (source !== expectedSource) {
    errors.push(`dist/${flavor}/index.js is not the generated facade barrel`);
  }

  const cssImports = getCssImports(source);
  if (cssImports.length > 0) {
    errors.push(
      `dist/${flavor}/index.js owns component CSS directly: ${cssImports.join(", ")}`,
    );
  }

  for (const specifier of getJavaScriptReexports(source)) {
    const targetPath = path.resolve(
      rootDir,
      "dist",
      flavor,
      specifier.slice(2),
    );

    if (!fs.existsSync(targetPath)) {
      errors.push(
        `dist/${flavor}/index.js re-exports missing facade ${specifier}`,
      );
    }
  }

  return errors;
}

function processFlavor(flavor) {
  const outputPath = path.join(rootDir, "dist", flavor, "index.js");
  const expectedSource = createRootEntrypoint(flavor);

  if (!isCheckMode) {
    try {
      overwriteFileSync(outputPath, expectedSource);
    } catch (error) {
      if (error?.code === "ENOENT") {
        throw new Error(`Missing ${outputPath}. Run the library build first.`, {
          cause: error,
        });
      }
      throw error;
    }
    console.log(`Patched root facade barrel: dist/${flavor}/index.js`);
    return [];
  }

  let source;
  try {
    source = fs.readFileSync(outputPath, "utf8").replace(/\r\n/g, "\n");
  } catch (error) {
    if (error?.code === "ENOENT") {
      throw new Error(`Missing ${outputPath}. Run the library build first.`, {
        cause: error,
      });
    }
    throw error;
  }
  return validateRootEntrypoint(flavor, source, expectedSource);
}

const errors = flavors.flatMap(processFlavor);

if (isCheckMode && errors.length > 0) {
  console.error(
    [
      "Invalid root entrypoint CSS ownership:",
      ...errors.map((error) => `- ${error}`),
      "",
      "Run npm run patch:root-entrypoints after building.",
    ].join("\n"),
  );
  process.exitCode = 1;
} else if (isCheckMode) {
  console.log("Root entrypoints delegate CSS ownership to component facades.");
}

module.exports = {
  createRootEntrypoint,
  getCssImports,
  getJavaScriptReexports,
  validateRootEntrypoint,
};
