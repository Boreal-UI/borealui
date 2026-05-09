const fs = require("fs");
const path = require("path");

const generatedDocsDir = path.resolve(__dirname, "../dist/generated-docs");

if (!fs.existsSync(generatedDocsDir)) {
  console.warn(`Skipped missing generated docs dir: ${generatedDocsDir}`);
  process.exit(0);
}

for (const file of fs.readdirSync(generatedDocsDir)) {
  if (!file.endsWith(".js")) continue;

  const filePath = path.join(generatedDocsDir, file);
  const content = fs.readFileSync(filePath, "utf8");
  const patched = content.replace(
    /(from\s+["']\.\/[^"']+?)(["'])/g,
    (match, specifier, quote) =>
      specifier.endsWith(".js") ? match : `${specifier}.js${quote}`,
  );

  if (patched !== content) {
    fs.writeFileSync(filePath, patched, "utf8");
    console.log(`Patched generated docs imports: ${file}`);
  }
}
