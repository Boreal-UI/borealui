const fs = require("fs");
const path = require("path");

const componentsPath = path.resolve(__dirname, "../dist/types/components");
const outputPath = path.resolve(__dirname, "../dist/types/public.types.d.ts");

function getTypeFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      fs.readdirSync(filePath).forEach((innerFile) => {
        if (innerFile.endsWith(".types.d.ts")) {
          results.push(path.join(filePath, innerFile));
        }
      });
    }
  });
  return results;
}

const files = getTypeFiles(componentsPath);

const exportStatements = files
  .map((f) => {
    const relPath =
      "./" +
      path
        .relative(path.dirname(outputPath), f)
        .replace(/\\/g, "/")
        .replace(/\.d\.ts$/, "");
    return `export * from "${relPath}";`;
  })
  .join("\n");

fs.writeFileSync(
  outputPath,
  'export type * from "./types/types.js";\n' + exportStatements + "\n",
);

console.log(`Generated ${outputPath} with ${files.length} exports.`);
