const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const runtimeFlavors = ["core", "next", "docs"];

function listFiles(directoryPath) {
  if (!fs.existsSync(directoryPath)) return [];

  return fs
    .readdirSync(directoryPath, { withFileTypes: true })
    .flatMap((entry) => {
      const entryPath = path.join(directoryPath, entry.name);
      return entry.isDirectory() ? listFiles(entryPath) : [entryPath];
    });
}

function findRequireConditions(value, currentPath = "exports") {
  if (!value || typeof value !== "object") return [];

  return Object.entries(value).flatMap(([key, child]) => {
    const childPath = `${currentPath}.${key}`;
    return key === "require"
      ? [childPath]
      : findRequireConditions(child, childPath);
  });
}

const errors = [];

for (const flavor of runtimeFlavors) {
  const distDir = path.join(rootDir, "dist", flavor);
  if (!fs.existsSync(distDir)) {
    errors.push(`missing dist/${flavor}; run the library build first`);
    continue;
  }

  const commonJsFiles = listFiles(distDir).filter((filePath) =>
    /\.cjs(?:\.|$)/i.test(path.basename(filePath)),
  );

  for (const filePath of commonJsFiles) {
    errors.push(
      `CommonJS artifact generated: ${path.relative(rootDir, filePath).replace(/\\/g, "/")}`,
    );
  }

  const packagePath = path.join(rootDir, "packages", flavor, "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));

  for (const conditionPath of findRequireConditions(packageJson.exports)) {
    errors.push(
      `${path.relative(rootDir, packagePath).replace(/\\/g, "/")} contains ${conditionPath}`,
    );
  }
}

if (errors.length > 0) {
  console.error(["ESM-only audit failed:", ...errors.map((error) => `- ${error}`)].join("\n"));
  process.exitCode = 1;
} else {
  console.log("Core, Next, and Docs outputs are ESM-only with no require exports.");
}

module.exports = {
  findRequireConditions,
  listFiles,
};
