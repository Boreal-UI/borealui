const fs = require("fs");
const path = require("path");

const typesDir = path.resolve(__dirname, "../dist/types");
const sharedTypesSource = path.resolve(__dirname, "../src/types/types.d.ts");
const sharedTypesOutput = path.join(typesDir, "types", "types.d.ts");

fs.mkdirSync(path.dirname(sharedTypesOutput), { recursive: true });
fs.copyFileSync(sharedTypesSource, sharedTypesOutput);

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
    sharedTypesOutput,
  );
  const sharedTypesIndex = relativeTypeSpecifier(
    filePath,
    path.join(typesDir, "types", "index.d.ts"),
  );

  source = source
    .replace(/^import\s+["'][^"']+\.(?:module\.)?s?css["'];\r?\n/gm, "")
    .replace(/^\/\/# sourceMappingURL=.*\r?\n?/gm, "")
    .replace(/from\s+["']\.\/types\.d["']/g, 'from "./types"')
    .replace(/(["'])@\/types\/types\1/g, `"${sharedTypes}"`)
    .replace(/(["'])@\/types\1/g, `"${sharedTypesIndex}"`);

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
