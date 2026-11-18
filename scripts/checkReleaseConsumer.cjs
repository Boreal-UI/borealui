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
  for (const [name, props] of [
    ["SearchInput", 'value="query" onChange={(value, event) => { const next: string = value; void next; if (event.currentTarget instanceof HTMLInputElement) { event.currentTarget.select(); } }}'],
    ["ColorPicker", 'name="chosen-color" defaultValue="#123456" required allowCustom colors={[{ label: "Red", value: "#ff0000" }]}'],
    ["DataTable", 'data={[{ id: 1, name: "One" }]} columns={[{ key: "name", label: "Name" }]} rowKey={row => row.id} selectableRows virtualized onSelectionChange={(keys, rows) => { const id: number = rows[0].id; void id; void keys; }}'],
    ["DatePicker", 'aria-label="Reservation date" aria-invalid="true" aria-errormessage="external-error"'],
    ["DateRangePicker", 'value={{ start: "", end: "" }} onChange={() => {}} startInputProps={{ "aria-label": "Departure" }} endInputProps={{ "aria-labelledby": "return-label" }} startPickerButtonAriaLabel="Choose departure"'],
    ["TimePicker", 'defaultValue="23:00" min="22:00" max="02:00" step="any" aria-label="Reservation time" aria-invalid="true"'],
    ["CommandPalette", 'open commands={[]} onClose={() => {}} asyncSearch={async () => []}'],
  ]) {
    for (const subpath of ["", `/${name}`]) {
      const local = `Advanced${imports.length}`;
      imports.push(`import { ${subpath ? "default" : name} as ${local} } from "@boreal-ui/${pkg}${subpath}";`);
      imports.push(`<${local} ${props} />;`);
    }
  }
  imports.push(`import Search${pkg} from "@boreal-ui/${pkg}/SearchInput";`);
  imports.push(`// @ts-expect-error Input-only events cannot represent clear-button activation.\n<Search${pkg} onChange={(value: string, event: import("react").ChangeEvent<HTMLInputElement>) => { void value; void event; }} />;`);
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
imports.push('import type { SearchInputChangeEvent } from "@boreal-ui/types"; const searchEventType = (event: SearchInputChangeEvent) => event.type; void searchEventType;');
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
  // Bundle through staged runtime export maps, then inspect actual SSR composition.
  for (const pkg of entries) {
    const dir = path.join(root, "packages", pkg);
    const manifest = JSON.parse(fs.readFileSync(path.join(dir, "package.json"), "utf8"));
    const runtime = path.join(root, `.advanced-controls-${pkg}-consumer.cjs`);
    const sources = ["DatePicker", "DateRangePicker", "TimePicker", "CommandPalette", "ColorPicker", "SearchInput", "DataTable"].map(name =>
      `import ${name} from ${JSON.stringify(path.resolve(dir, manifest.exports[`./${name}`].import))};`);
    try {
      require("esbuild").buildSync({
        stdin: { contents: `import React from "react"; import {renderToStaticMarkup} from "react-dom/server";
          ${sources.join("\n")}
          export const range = renderToStaticMarkup(React.createElement(DateRangePicker, {id:"trip", label:"Trip", startLabel:"Departure", endLabel:"Return", value:{start:"",end:""}, onChange:()=>{}}));
          export const rangeError = renderToStaticMarkup(React.createElement(DateRangePicker, {id:"invalid-trip", label:"Trip", errorMessage:"Unavailable", min:"2026-11-01", max:"2026-11-30", value:{start:"2026-10-20",end:"2026-12-20"}, onChange:()=>{}}));
          export const dateAria = renderToStaticMarkup(React.createElement(DatePicker, {"aria-label":"Reservation date", "aria-invalid":true, "aria-errormessage":"external-error"}));
          export const time = renderToStaticMarkup(React.createElement(TimePicker, {label:"Night", defaultValue:"23:00", min:"22:00", max:"02:00"}));
          export const invalidTime = renderToStaticMarkup(React.createElement(TimePicker, {label:"Night", defaultValue:"12:00", min:"22:00", max:"02:00"}));
          export const color = renderToStaticMarkup(React.createElement(ColorPicker, {name:"chosen-color", required:true, allowCustom:true, defaultValue:"#123456", colors:[{label:"Red",value:"#ff0000"}]}));
          export const search = renderToStaticMarkup(React.createElement(SearchInput, {label:"Search", defaultValue:"query"}));
          export const table = renderToStaticMarkup(React.createElement(DataTable, {data:Array.from({length:200},(_,id)=>({id,name:String(id)})), columns:[{key:"name",label:"Name"}], rowKey:row=>row.id, selectableRows:true, selectedRowKeys:[0,1,2,3,4,5,6,7], virtualized:true, virtualRowHeight:48, virtualViewportHeight:192, virtualOverscan:2}));
          export const palette = renderToStaticMarkup(React.createElement(CommandPalette, {open:true, commands:[], onClose:()=>{}}));`, resolveDir: root },
        bundle: true, platform: "node", format: "cjs", outfile: runtime,
        external: ["react", "react-dom", "react-dom/server"], loader: { ".css": "empty" },
      });
      const html = require(runtime);
      assert.match(html.range, /<input[^>]*aria-labelledby="trip-start-label"/);
      assert.match(html.range, /<input[^>]*aria-labelledby="trip-end-label"/);
      assert.match(html.range, /aria-labelledby="trip-start-action trip-start-label"/);
      assert.match(html.range, /<legend[^>]*>Trip<\/legend>/);
      assert.match(html.dateAria, /<input[^>]*aria-label="Reservation date"[^>]*aria-invalid="true"[^>]*aria-errormessage="external-error"/);
      assert.match(html.rangeError, /<input[^>]*max="2026-11-30"[^>]*aria-invalid="true"[^>]*aria-errormessage="invalid-trip-errorMessage"/);
      assert.match(html.rangeError, /<input[^>]*min="2026-11-01"/);
      assert.doesNotMatch(html.time, /aria-invalid="true"/);
      assert.match(html.invalidTime, /aria-invalid="true"/);
      assert.equal(html.palette, "");
      assert.match(html.color, /<input(?=[^>]*type="radio")(?=[^>]*name="chosen-color")(?=[^>]*checked="")(?=[^>]*value="#123456")[^>]*>/);
      assert.match(html.search, /aria-label="Clear search"/);
      assert.match(html.table, /<input(?=[^>]*aria-label="Select all rows")(?=[^>]*aria-checked="mixed")[^>]*>/);
    } finally {
      delete require.cache[runtime];
      if (fs.existsSync(runtime)) fs.unlinkSync(runtime);
    }
  }
  for (const prop of ["startInputProps", "endInputProps", "startPickerButtonAriaLabel", "endPickerButtonAriaLabel"]) {
    assert.ok(docs.dateRangePickerPropDocs.props.find(p => p.name === prop), `DateRangePicker.${prop} missing`);
  }
  for (const [name, prop] of [["numberInputPropDocs", "onChange"], ["notificationCenterPropDocs", "locale"], ["notificationCenterPropDocs", "timeZone"]]) {
    assert.ok(docs[name].props.find(p => p.name === prop), `${name}.${prop} missing`);
  }
  console.log("Release consumer declarations and packaged docs passed.");
} finally {
  fs.unlinkSync(fixture);
}
