// Run after build and stage:split-packages. Resolve actual package export maps.
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");
const assert = require("node:assert/strict");
const root = path.resolve(__dirname, "..");
const paths = {};
const imports = [];
for (const pkg of ["core", "next", "types"]) {
  const dir = path.join(root, "packages", pkg);
  const manifest = JSON.parse(fs.readFileSync(path.join(dir, "package.json"), "utf8"));
  for (const [key, value] of Object.entries(manifest.exports)) {
    if (value.types) paths[manifest.name + (key === "." ? "" : key.slice(1))] = [path.resolve(dir, value.types)];
  }
}
const entries = [
  ["@boreal-ui/core", "Toolbar"],
  ["@boreal-ui/core/Toolbar", "default"],
  ["@boreal-ui/next", "Toolbar"],
  ["@boreal-ui/next/Toolbar", "default"],
  ["@boreal-ui/next/server", "Toolbar"],
  ["@boreal-ui/next/server/Toolbar", "default"],
];
entries.forEach(([entry, name], i) => {
  imports.push(`import { ${name} as Toolbar${i} } from "${entry}";`);
  for (const level of [1, 2, 3, 4, 5, 6]) imports.push(`<Toolbar${i} title="Admin" headingLevel={${level}} />;`);
  for (const level of ["0", "7", '"2"']) imports.push(`// @ts-expect-error Invalid public heading level\n<Toolbar${i} headingLevel={${level}} />;`);
});
imports.push('import type { ToolbarProps } from "@boreal-ui/types";');
imports.push('const props: ToolbarProps = { headingLevel: 2 }; void props;');
for (const level of ["0", "7", '"2"']) imports.push(`// @ts-expect-error Invalid public prop type\nconst invalid${imports.length}: ToolbarProps = { headingLevel: ${level} };`);
const fixture = path.join(root, ".toolbar-consumer.tsx");
try {
  fs.writeFileSync(fixture, imports.join("\n"));
  const program = ts.createProgram([fixture], {
    // Match the repository consumer configuration; still check every fixture
    // expression and @ts-expect-error against the published declarations.
    strict: true, noEmit: true, skipLibCheck: true, types: ["react", "node"],
    jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler, paths,
    esModuleInterop: true, target: ts.ScriptTarget.ES2020,
  });
  const errors = ts.getPreEmitDiagnostics(program);
  assert.equal(errors.length, 0, ts.formatDiagnosticsWithColorAndContext(errors, {
    getCurrentDirectory: () => root, getCanonicalFileName: f => f, getNewLine: () => "\n",
  }));
  const { toolbarPropDocs } = require(path.join(root, "packages/docs/dist/docs/index.js"));
  const prop = toolbarPropDocs.props.find(p => p.name === "headingLevel");
  assert.ok(prop);
  assert.equal(prop.defaultValue, "1");
  assert.equal(prop.required, false);
  assert.match(prop.type, /1.*2.*3.*4.*5.*6/);
  console.log("Toolbar consumer declarations and packaged docs passed.");
} finally {
  fs.unlinkSync(fixture);
}
