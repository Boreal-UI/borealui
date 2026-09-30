const { execFileSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { createRequire } = require("module");
const { getFixture, assertNodeBoundary, TOOL_VERSIONS } = require("./compatibilityMatrix.cjs");

function parseArgs(argv) {
  const result = {};
  const positional = [];
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--keep") result.keep = true;
    else if (argument.startsWith("--")) result[argument.slice(2)] = argv[++index];
    else positional.push(argument);
  }
  result.fixture ??= positional[0];
  result["tarball-dir"] ??= positional[1];
  return result;
}

function write(filePath, source) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, source);
}

function run(command, args, cwd, options = {}) {
  console.log(`> ${command} ${args.join(" ")}`);
  return execFileSync(command, args, {
    cwd,
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1", CI: "1" },
    stdio: options.capture ? ["ignore", "pipe", "inherit"] : "inherit",
    encoding: options.capture ? "utf8" : undefined,
    shell: process.platform === "win32" && /\.cmd$/i.test(command),
  });
}

function findTarball(tarballDir, packageName) {
  const metadataPath = path.join(tarballDir, "compatibility-artifacts.json");
  const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"));
  const filename = metadata.artifacts[packageName];
  if (!filename) throw new Error(`No packed artifact recorded for ${packageName}.`);
  const tarball = path.join(tarballDir, filename);
  if (!fs.existsSync(tarball)) throw new Error(`Missing packed artifact ${tarball}.`);
  return tarball;
}

function packageVersion(fixtureDir, packageName) {
  const requireFromFixture = createRequire(path.join(fixtureDir, "version-probe.cjs"));
  const packageJsonPath = requireFromFixture.resolve(`${packageName}/package.json`);
  const expectedRoot = path.join(fixtureDir, "node_modules") + path.sep;
  if (!packageJsonPath.startsWith(expectedRoot)) {
    throw new Error(`${packageName} resolved outside the isolated fixture: ${packageJsonPath}`);
  }
  return JSON.parse(fs.readFileSync(packageJsonPath, "utf8")).version;
}

function verifyVersions(fixtureDir, fixture) {
  const resolved = {
    node: process.versions.node,
    react: fixture.react ? packageVersion(fixtureDir, "react") : undefined,
    reactDom: fixture.reactDom ? packageVersion(fixtureDir, "react-dom") : undefined,
    next: fixture.next ? packageVersion(fixtureDir, "next") : undefined,
  };
  for (const [key, expected] of Object.entries({
    react: fixture.react,
    reactDom: fixture.reactDom,
    next: fixture.next,
  })) {
    if (expected && resolved[key] !== expected) {
      throw new Error(`Expected ${key} ${expected}, resolved ${resolved[key]}.`);
    }
  }
  console.log(`RESOLVED_VERSIONS=${JSON.stringify(resolved)}`);
}

function commonManifest(dependencies, devDependencies = {}) {
  return `${JSON.stringify({ private: true, type: "module", dependencies, devDependencies }, null, 2)}\n`;
}

function createCoreFixture(fixtureDir, fixture, tarballDir) {
  write(
    path.join(fixtureDir, "package.json"),
    commonManifest(
      {
        "@boreal-ui/core": `file:${findTarball(tarballDir, "core")}`,
        "@boreal-ui/types": `file:${findTarball(tarballDir, "types")}`,
        marked: TOOL_VERSIONS.marked,
        react: fixture.react,
        "react-dom": fixture.reactDom,
      },
      {
        "@types/node": TOOL_VERSIONS.typesNode,
        "@types/react": fixture.reactTypes,
        "@types/react-dom": fixture.reactDomTypes,
        esbuild: TOOL_VERSIONS.esbuild,
        jsdom: TOOL_VERSIONS.jsdom,
        typescript: TOOL_VERSIONS.typescript,
        vite: TOOL_VERSIONS.vite,
      },
    ),
  );
  write(path.join(fixtureDir, "index.html"), '<div id="root"></div><script type="module" src="/src/main.jsx"></script>\n');
  write(
    path.join(fixtureDir, "src", "main.jsx"),
    `import React from "react";
import { createRoot } from "react-dom/client";
import { Button, Card, TextInput, ThemeProvider } from "@boreal-ui/core";
import "@boreal-ui/core/globals.css";
function App(){return <ThemeProvider enableThemeScript={false}><Card title="Compatibility"><TextInput label="Name"/><Button>Save</Button></Card></ThemeProvider>}
createRoot(document.getElementById("root")).render(<App/>);
`,
  );
  write(
    path.join(fixtureDir, "src", "typecheck.tsx"),
    `import { Button, Card, TextInput, ThemeProvider } from "@boreal-ui/core";
export const fixture = <ThemeProvider enableThemeScript={false}><Card title="Typed"><TextInput label="Name"/><Button type="button">Save</Button></Card></ThemeProvider>;
`,
  );
  write(
    path.join(fixtureDir, "runtime-smoke.jsx"),
    `import React, { useState } from "react";
import { JSDOM } from "jsdom";
const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: "https://example.test" });
Object.defineProperties(globalThis,{window:{value:dom.window,configurable:true},document:{value:dom.window.document,configurable:true},navigator:{value:dom.window.navigator,configurable:true},HTMLElement:{value:dom.window.HTMLElement,configurable:true},Node:{value:dom.window.Node,configurable:true},MouseEvent:{value:dom.window.MouseEvent,configurable:true},CustomEvent:{value:dom.window.CustomEvent,configurable:true},IS_REACT_ACT_ENVIRONMENT:{value:true,configurable:true}});
const [{ createRoot }, testUtils, { default: Button }, { default: Card }, { default: TextInput }, { ThemeProvider }] = await Promise.all([import("react-dom/client"),import("react-dom/test-utils"),import("@boreal-ui/core/Button"),import("@boreal-ui/core/Card"),import("@boreal-ui/core/TextInput"),import("@boreal-ui/core/ThemeProvider")]);
const act=React.act??testUtils.act;
function App(){const [count,setCount]=useState(0);return <ThemeProvider enableThemeScript={false}><Card title="Runtime"><TextInput label="Name"/><Button onClick={()=>setCount(value=>value+1)}>Count {count}</Button></Card></ThemeProvider>}
const root=createRoot(document.getElementById("root"));
await act(async()=>{root.render(<App/>)});
const button=document.querySelector("button");
if(!button||!document.querySelector("input")) throw new Error("Representative Boreal controls did not render.");
await act(async()=>{button.dispatchEvent(new MouseEvent("click",{bubbles:true}))});
if(!button.textContent.includes("1")) throw new Error("Button interaction did not update state.");
await act(async()=>{root.unmount()});
dom.window.close();
console.log("CORE_RUNTIME_SMOKE=PASS");
process.exit(0);
`,
  );
  write(
    path.join(fixtureDir, "tsconfig.json"),
    `${JSON.stringify({ compilerOptions: { target: "ES2020", lib: ["DOM", "ES2020"], module: "ESNext", moduleResolution: "Bundler", jsx: "react-jsx", strict: true, noEmit: true, skipLibCheck: false }, include: ["src/typecheck.tsx"] }, null, 2)}\n`,
  );
}

function createNextFixture(fixtureDir, fixture, tarballDir) {
  write(
    path.join(fixtureDir, "package.json"),
    commonManifest(
      {
        "@boreal-ui/next": `file:${findTarball(tarballDir, "next")}`,
        "@boreal-ui/types": `file:${findTarball(tarballDir, "types")}`,
        marked: TOOL_VERSIONS.marked,
        next: fixture.next,
        react: fixture.react,
        "react-dom": fixture.reactDom,
      },
      {
        "@types/node": TOOL_VERSIONS.typesNode,
        "@types/react": fixture.reactTypes,
        "@types/react-dom": fixture.reactDomTypes,
        typescript: TOOL_VERSIONS.typescript,
      },
    ),
  );
  write(
    path.join(fixtureDir, "app", "layout.tsx"),
    `import type { ReactNode } from "react";
import "@boreal-ui/next/globals.css";
export default function RootLayout({children}:{children:ReactNode}){return <html lang="en"><body>{children}</body></html>}
`,
  );
  write(
    path.join(fixtureDir, "app", "client-smoke.tsx"),
    `"use client";
import { useState } from "react";
import { Button, TextInput, ThemeProvider } from "@boreal-ui/next";
export default function ClientSmoke(){const [count,setCount]=useState(0);return <ThemeProvider enableThemeScript={false}><TextInput label="Name"/><Button onClick={()=>setCount(value=>value+1)}>Count {count}</Button></ThemeProvider>}
`,
  );
  write(
    path.join(fixtureDir, "app", "page.tsx"),
    `import { Card, Typography, getThemeAttributes, resolveThemeScheme } from "@boreal-ui/next/server";
import ClientSmoke from "./client-smoke";
export default function Page(){const theme=getThemeAttributes(resolveThemeScheme());return <main {...theme}><Card title="Server component"><Typography>Boreal compatibility</Typography></Card><ClientSmoke/></main>}
`,
  );
  write(
    path.join(fixtureDir, "tsconfig.json"),
    `${JSON.stringify({ compilerOptions: { target: "ES2020", lib: ["DOM", "DOM.Iterable", "ESNext"], allowJs: false, skipLibCheck: true, strict: true, noEmit: true, esModuleInterop: true, module: "ESNext", moduleResolution: "Bundler", resolveJsonModule: true, isolatedModules: true, jsx: "preserve", plugins: [{ name: "next" }] }, include: ["next-env.d.ts", ".next/types/**/*.ts", "**/*.ts", "**/*.tsx"], exclude: ["node_modules"] }, null, 2)}\n`,
  );
  write(path.join(fixtureDir, "next-env.d.ts"), '/// <reference types="next" />\n/// <reference types="next/image-types/global" />\n');
  write(path.join(fixtureDir, "next.config.mjs"), "export default {};\n");
}

function verifyCssOutput(directory) {
  const cssFiles = [];
  const visit = (current) => {
    if (!fs.existsSync(current)) return;
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) visit(fullPath);
      else if (entry.name.endsWith(".css")) cssFiles.push(fullPath);
    }
  };
  visit(directory);
  const bytes = cssFiles.reduce((total, file) => total + fs.statSync(file).size, 0);
  if (!cssFiles.length || bytes < 1000) throw new Error(`Expected compiled Boreal CSS in ${directory}.`);
  console.log(`CSS_OUTPUT=${cssFiles.length} files/${bytes} bytes`);
}

function install(fixtureDir) {
  const npm = process.platform === "win32" ? "npm.cmd" : "npm";
  run(npm, ["install", "--ignore-scripts", "--no-audit", "--no-fund", "--strict-peer-deps"], fixtureDir);
}

function testCore(fixtureDir) {
  const npx = process.platform === "win32" ? "npx.cmd" : "npx";
  run(npx, ["tsc", "--noEmit"], fixtureDir);
  run(npx, ["vite", "build"], fixtureDir);
  verifyCssOutput(path.join(fixtureDir, "dist"));
  run(npx, ["esbuild", "runtime-smoke.jsx", "--bundle", "--platform=node", "--format=esm", "--target=node18", "--external:jsdom", "--loader:.css=empty", "--loader:.scss=empty", "--outfile=runtime-smoke.mjs"], fixtureDir);
  run(process.execPath, ["runtime-smoke.mjs"], fixtureDir);
}

function testNext(fixtureDir) {
  const npx = process.platform === "win32" ? "npx.cmd" : "npx";
  run(npx, ["tsc", "--noEmit"], fixtureDir);
  run(npx, ["next", "build"], fixtureDir);
  verifyCssOutput(path.join(fixtureDir, ".next"));
}

function testCli(fixtureDir, tarballDir) {
  write(path.join(fixtureDir, "package.json"), commonManifest({ "@boreal-ui/cli": `file:${findTarball(tarballDir, "cli")}` }));
  write(
    path.join(fixtureDir, "src", "main.jsx"),
    'import React from "react";\nimport { createRoot } from "react-dom/client";\nfunction App(){ return <main />; }\ncreateRoot(document.getElementById("root")).render(<App />);\n',
  );
  install(fixtureDir);
  const bin = process.platform === "win32" ? path.join(fixtureDir, "node_modules", ".bin", "boreal-ui.cmd") : path.join(fixtureDir, "node_modules", ".bin", "boreal-ui");
  const version = run(bin, ["--version"], fixtureDir, { capture: true }).trim();
  if (version !== require("../package.json").version) throw new Error(`CLI reported ${version}.`);
  const before = fs.readFileSync(path.join(fixtureDir, "package.json"), "utf8");
  run(bin, ["init", ".", "--framework", "react", "--dry-run", "--no-install", "--yes"], fixtureDir);
  if (fs.readFileSync(path.join(fixtureDir, "package.json"), "utf8") !== before) throw new Error("CLI dry run modified the consumer fixture.");
  console.log(`CLI_VERSION=${version}`);
}

const args = parseArgs(process.argv.slice(2));
if (!args.fixture || !args["tarball-dir"]) {
  throw new Error("Usage: node scripts/runCompatibility.cjs --fixture <name> --tarball-dir <directory> [--keep]");
}
const fixture = getFixture(args.fixture);
assertNodeBoundary(fixture);
const tarballDir = path.resolve(args["tarball-dir"]);
const fixtureDir = fs.mkdtempSync(path.join(os.tmpdir(), `boreal-${args.fixture}-`));
try {
  if (fixture.kind === "core") createCoreFixture(fixtureDir, fixture, tarballDir);
  else if (fixture.kind === "next") createNextFixture(fixtureDir, fixture, tarballDir);
  if (fixture.kind !== "cli") install(fixtureDir);
  verifyVersions(fixtureDir, fixture);
  if (fixture.kind === "core") testCore(fixtureDir);
  else if (fixture.kind === "next") testNext(fixtureDir);
  else testCli(fixtureDir, tarballDir);
  console.log(`COMPATIBILITY_FIXTURE=${args.fixture}:PASS`);
} finally {
  if (args.keep) console.log(`Fixture retained at ${fixtureDir}`);
  else fs.rmSync(fixtureDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
}
