const fs = require("fs");
const path = require("path");

const typesDir = path.resolve(__dirname, "../dist/types");

function walk(dir) {
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(entryPath) : [entryPath];
  });
}

function relativeTypeSpecifier(fromFile, targetFile) {
  let specifier = path
    .relative(path.dirname(fromFile), targetFile)
    .replace(/\\/g, "/")
    .replace(/\.d\.ts$/, "");

  if (!specifier.startsWith(".")) {
    specifier = `./${specifier}`;
  }

  return specifier;
}

function patchDeclaration(filePath) {
  let source = fs.readFileSync(filePath, "utf8");
  const originalSource = source;
  const sharedTypes = relativeTypeSpecifier(
    filePath,
    path.join(typesDir, "types", "types.d.ts"),
  );
  const sharedTypesIndex = relativeTypeSpecifier(
    filePath,
    path.join(typesDir, "types", "index.d.ts"),
  );

  source = source
    .replace(/^import\s+["'][^"']+\.(?:module\.)?s?css["'];\r?\n/gm, "")
    .replace(/^\/\/# sourceMappingURL=.*\r?\n?/gm, "")
    .replace(/from\s+["']@\/types\/types["']/g, `from "${sharedTypes}"`)
    .replace(/from\s+["']@\/types["']/g, `from "${sharedTypesIndex}"`);

  if (source !== originalSource) {
    fs.writeFileSync(filePath, source);
  }
}

for (const filePath of walk(typesDir)) {
  if (filePath.endsWith(".d.ts")) {
    patchDeclaration(filePath);
  }
}

console.log("Patched public declaration imports.");
