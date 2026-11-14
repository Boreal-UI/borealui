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
const entries = ["core", "next"];
for (const pkg of entries) {
  for (const subpath of ["", "/NumberInput"]) {
    const component = `Number${imports.length}`;
    imports.push(`import { ${subpath ? "default" : "NumberInput"} as ${component} } from "@boreal-ui/${pkg}${subpath}";`);
    imports.push(`<${component} value={10} onChange={(value, event) => { const next: number | "" = value; const type: string = event.type; void next; void type; }} />;`);
    imports.push(`// @ts-expect-error An input-only ChangeEvent handler cannot handle stepper clicks or blur commits.\n<${component} onChange={(value: number | "", event: import("react").ChangeEvent<HTMLInputElement>) => { void value; void event; }} />;`);
  }
  imports.push(`import { default as Sidebar${pkg} } from "@boreal-ui/${pkg}/Sidebar";`);
  imports.push(`<Sidebar${pkg} links={[{ id: "stable", label: "Reports", children: [] }]} />;`);
  imports.push(`import { default as Notes${pkg} } from "@boreal-ui/${pkg}/NotificationCenter";`);
  imports.push(`<Notes${pkg} notifications={[]} onRemove={() => {}} locale="en-US" timeZone="America/Toronto" />;`);
}
imports.push('import type { NumberInputChangeEvent, SidebarLink, NotificationCenterProps } from "@boreal-ui/types";');
imports.push('const item: SidebarLink = { id: "stable", label: "Reports" }; void item;');
imports.push('const eventType = (event: NumberInputChangeEvent) => event.type; void eventType;');
imports.push('const notes: NotificationCenterProps = { notifications: [], onRemove: () => {}, locale: "en-US", timeZone: "UTC" }; void notes;');
const fixture = path.join(root, ".release-consumer.tsx");
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
  const docs = require(path.join(root, "packages/docs/dist/docs/index.js"));
  for (const [name, prop] of [["numberInputPropDocs", "onChange"], ["notificationCenterPropDocs", "locale"], ["notificationCenterPropDocs", "timeZone"]]) {
    assert.ok(docs[name].props.find(p => p.name === prop), `${name}.${prop} missing`);
  }
  console.log("Release consumer declarations and packaged docs passed.");
} finally {
  fs.unlinkSync(fixture);
}
