const fs = require("fs");
const path = require("path");

const pkgPath = path.resolve(__dirname, "../package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
const exportsMap = pkg.exports || {};
const preservedDirectExports = new Set([
  "./core/types",
  "./core/globals.css",
  "./next/types",
  "./next/globals.css",
]);

for (const key of Object.keys(exportsMap)) {
  if (
    /^\.\/(core|next)\/[^/]+$/.test(key) &&
    !preservedDirectExports.has(key)
  ) {
    delete exportsMap[key];
  }
}

function buildExportEntry(type, name) {
  const typeCandidates = [
    `../dist/types/${type}/${name}.d.ts`,
    `../dist/types/components/${name}/${type}/${name}.d.ts`,
    `../dist/types/config/${name}.d.ts`,
    `../dist/types/context/${name}.d.ts`,
    `../dist/types/hooks/${name}.d.ts`,
    `../dist/types/icons/${name}.d.ts`,
    `../dist/types/styles/${name}.d.ts`,
    `../dist/types/utils/${name}.d.ts`,
  ];

  let typesPath;
  for (const candidate of typeCandidates) {
    const absPath = path.resolve(__dirname, candidate);
    if (fs.existsSync(absPath)) {
      typesPath = candidate.replace(/\\/g, "/").replace(/\.\.\//g, "./");
      break;
    }
  }

  const exportEntry = {};

  if (typesPath) {
    exportEntry.types = typesPath;
  }

  exportEntry.import = `./dist/${type}/${name}.js`;

  return exportEntry;
}

function addExports(type) {
  const distDir = path.resolve(__dirname, `../dist/${type}`);
  if (!fs.existsSync(distDir)) return;

  fs.readdirSync(distDir)
    .filter((file) => {
      return (
        file.endsWith(".js") && !file.startsWith("index") && !file.includes("-")
      );
    })
    .forEach((file) => {
      const name = file.replace(/\.js$/, "");
      const exportEntry = buildExportEntry(type, name);
      const key = `./${type}/${name}`;
      exportsMap[key] = exportEntry;
    });
}

addExports("core");
addExports("next");

pkg.exports = exportsMap;

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
console.log("Updated package.json exports with per-component entries!");
