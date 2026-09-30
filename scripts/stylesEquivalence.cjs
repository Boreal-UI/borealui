#!/usr/bin/env node

const nodeCrypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const sass = require("sass");

const TEMP_PREFIX = "boreal-styles-equivalence-";
const SURFACES = ["core", "next"];
const MAX_DIAGNOSTIC_LINES = 8;

class ToolError extends Error {}

function usage() {
  return [
    "Usage: npm run styles:equivalence -- -- [options]",
    "",
    "Options:",
    "  --base <revision>       Known-good Git revision (default: HEAD)",
    "  --component <name>      Compare one family; repeat for more families",
    "  --help                  Show this help",
  ].join("\n");
}

function parseArgs(argv) {
  const options = { base: "HEAD", components: [], help: false };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--help" || argument === "-h") {
      options.help = true;
    } else if (argument === "--base") {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) {
        throw new ToolError("--base requires a Git revision.");
      }
      options.base = value;
      index += 1;
    } else if (argument === "--component") {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) {
        throw new ToolError("--component requires a component name.");
      }
      if (!/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(value)) {
        throw new ToolError(`Invalid component name: ${value}`);
      }
      options.components.push(value);
      index += 1;
    } else {
      throw new ToolError(`Unknown option: ${argument}`);
    }
  }
  options.components = [...new Set(options.components)];
  return options;
}

function runGit(rootDir, args, { encoding = "utf8", input } = {}) {
  const result = spawnSync("git", args, {
    cwd: rootDir,
    encoding,
    shell: false,
    windowsHide: true,
    maxBuffer: 64 * 1024 * 1024,
    input,
  });
  if (result.error) {
    throw new ToolError(`Unable to run Git: ${result.error.message}`);
  }
  if (result.status !== 0) {
    const detail = Buffer.isBuffer(result.stderr)
      ? result.stderr.toString("utf8").trim()
      : String(result.stderr || "").trim();
    throw new ToolError(detail || `Git exited with status ${result.status}.`);
  }
  return result.stdout;
}

function resolveRepositoryRoot(startDir) {
  return String(runGit(startDir, ["rev-parse", "--show-toplevel"])).trim();
}

function resolveCommit(rootDir, revision) {
  try {
    return String(
      runGit(rootDir, [
        "rev-parse",
        "--verify",
        "--end-of-options",
        `${revision}^{commit}`,
      ]),
    ).trim();
  } catch (error) {
    throw new ToolError(
      `Base revision '${revision}' does not resolve to a commit. ${error.message}`,
    );
  }
}

function assertInside(parent, candidate) {
  const relative = path.relative(parent, candidate);
  if (
    relative === "" ||
    relative === "." ||
    (!relative.startsWith(`..${path.sep}`) && relative !== ".." && !path.isAbsolute(relative))
  ) {
    return;
  }
  throw new ToolError(`Refusing to write outside the temporary tree: ${candidate}`);
}

function materializeStyles(rootDir, commit, destination) {
  const output = runGit(
    rootDir,
    ["ls-tree", "-r", "-z", "--full-tree", commit, "--", "src"],
    { encoding: null },
  );
  const entries = output.toString("utf8").split("\0").filter(Boolean);
  const stylesheets = [];
  for (const entry of entries) {
    const separator = entry.indexOf("\t");
    if (separator < 0) throw new ToolError("Git returned an invalid tree entry.");
    const metadata = entry.slice(0, separator).split(" ");
    const gitPath = entry.slice(separator + 1);
    const extension = path.posix.extname(gitPath).toLowerCase();
    if (extension !== ".scss" && extension !== ".css") continue;
    if (metadata[0] === "120000") {
      throw new ToolError(`Refusing to materialize stylesheet symlink: ${gitPath}`);
    }
    if (metadata[1] !== "blob" || !gitPath.startsWith("src/")) {
      throw new ToolError(`Unexpected stylesheet tree entry: ${gitPath}`);
    }
    const segments = gitPath.split("/");
    if (segments.some((segment) => segment === "" || segment === "." || segment === "..")) {
      throw new ToolError(`Unsafe stylesheet path in Git tree: ${gitPath}`);
    }
    const outputPath = path.join(destination, ...segments);
    assertInside(destination, outputPath);
    stylesheets.push({ gitPath, objectId: metadata[2], outputPath });
  }
  const batch = runGit(rootDir, ["cat-file", "--batch"], {
    encoding: null,
    input: `${stylesheets.map(({ objectId }) => objectId).join("\n")}\n`,
  });
  let offset = 0;
  for (const stylesheet of stylesheets) {
    const headerEnd = batch.indexOf(0x0a, offset);
    if (headerEnd < 0) throw new ToolError("Git returned a truncated batch header.");
    const header = batch.subarray(offset, headerEnd).toString("utf8").split(" ");
    const size = Number(header[2]);
    if (header[0] !== stylesheet.objectId || header[1] !== "blob" || !Number.isSafeInteger(size)) {
      throw new ToolError(`Git returned an invalid blob for ${stylesheet.gitPath}.`);
    }
    const contentStart = headerEnd + 1;
    const contentEnd = contentStart + size;
    if (contentEnd >= batch.length || batch[contentEnd] !== 0x0a) {
      throw new ToolError(`Git returned truncated content for ${stylesheet.gitPath}.`);
    }
    fs.mkdirSync(path.dirname(stylesheet.outputPath), { recursive: true });
    fs.writeFileSync(stylesheet.outputPath, batch.subarray(contentStart, contentEnd));
    offset = contentEnd + 1;
  }
}

function walkDirectories(directory) {
  if (!fs.existsSync(directory)) return [];
  const directories = [directory];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isSymbolicLink()) continue;
    if (entry.isDirectory()) {
      directories.push(...walkDirectories(path.join(directory, entry.name)));
    }
  }
  return directories;
}

function assertSafeRegularFile(treeRoot, filePath) {
  const stats = fs.lstatSync(filePath);
  if (stats.isSymbolicLink() || !stats.isFile()) {
    throw new ToolError(`Stylesheet entry must be a regular file: ${filePath}`);
  }
  const realPath = fs.realpathSync(filePath);
  assertInside(fs.realpathSync(treeRoot), realPath);
}

function discoverEntries(treeRoot) {
  const componentsRoot = path.join(treeRoot, "src", "components");
  const entries = new Map();
  for (const directory of walkDirectories(componentsRoot)) {
    const coreDir = path.join(directory, "core");
    if (!fs.existsSync(coreDir) || !fs.statSync(coreDir).isDirectory()) continue;
    for (const item of fs.readdirSync(coreDir, { withFileTypes: true })) {
      if (!item.isFile() || item.name.startsWith("_") || !item.name.endsWith(".scss")) continue;
      const stem = item.name.slice(0, -".scss".length);
      const nextPath = path.join(directory, "next", `${stem}.module.scss`);
      if (!fs.existsSync(nextPath)) continue;
      assertSafeRegularFile(treeRoot, path.join(coreDir, item.name));
      assertSafeRegularFile(treeRoot, nextPath);
      if (entries.has(stem)) {
        throw new ToolError(`Duplicate style family name discovered: ${stem}`);
      }
      entries.set(stem, {
        name: stem,
        core: path.join(coreDir, item.name),
        next: nextPath,
      });
    }
  }
  const globals = path.join(treeRoot, "src", "styles", "globals.scss");
  if (fs.existsSync(globals)) {
    assertSafeRegularFile(treeRoot, globals);
    entries.set("globals", { name: "globals", core: globals, next: globals });
  }
  return entries;
}

function createLogger(label, warnings) {
  return {
    warn(message) {
      warnings.push({ label, message });
    },
    debug() {},
  };
}

function compileEntry(filePath, treeRoot, dependencyRoot, label, warnings) {
  try {
    const result = sass.compile(filePath, {
      style: "expanded",
      sourceMap: false,
      loadPaths: [treeRoot, path.join(dependencyRoot, "node_modules")],
      logger: createLogger(label, warnings),
    });
    return Buffer.from(result.css, "utf8");
  } catch (error) {
    throw new ToolError(`Sass compilation failed for ${label}: ${error.message}`);
  }
}

function sha256(contents) {
  return nodeCrypto.createHash("sha256").update(contents).digest("hex");
}

function firstDifference(before, after) {
  const sharedLength = Math.min(before.length, after.length);
  let offset = 0;
  while (offset < sharedLength && before[offset] === after[offset]) offset += 1;
  if (offset === sharedLength && before.length === after.length) return null;
  return offset;
}

function lineAt(contents, offset) {
  const prefix = contents.subarray(0, Math.min(offset, contents.length)).toString("utf8");
  const lineNumber = prefix.split("\n").length;
  const lines = contents.toString("utf8").split("\n");
  const start = Math.max(0, lineNumber - 2);
  return {
    lineNumber,
    lines: lines.slice(start, start + MAX_DIAGNOSTIC_LINES / 2),
    startLine: start + 1,
  };
}

function diagnostic(before, after) {
  const offset = firstDifference(before, after);
  if (offset === null) return [];
  const oldLocation = lineAt(before, offset);
  const newLocation = lineAt(after, offset);
  const lines = [`first differing byte: ${offset}`];
  lines.push(`base line ${oldLocation.lineNumber}:`);
  oldLocation.lines.forEach((line, index) =>
    lines.push(`  - ${oldLocation.startLine + index} | ${line.slice(0, 180)}`),
  );
  lines.push(`current line ${newLocation.lineNumber}:`);
  newLocation.lines.forEach((line, index) =>
    lines.push(`  + ${newLocation.startLine + index} | ${line.slice(0, 180)}`),
  );
  return lines;
}

function aggregate(outputs) {
  const ordered = [...outputs.entries()].sort(([left], [right]) => left.localeCompare(right));
  const contents = Buffer.concat(ordered.map(([, value]) => value));
  return { bytes: contents.length, hash: sha256(contents), contents };
}

function formatBytes(value) {
  return `${value.toLocaleString("en-US")} B`;
}

function compareTrees({ baseRoot, currentRoot, dependencyRoot, requestedComponents }) {
  const baselineEntries = discoverEntries(baseRoot);
  const currentEntries = discoverEntries(currentRoot);
  const allNames = [...new Set([...baselineEntries.keys(), ...currentEntries.keys()])].sort();
  const selectableNames = allNames.filter((name) => name !== "globals");
  for (const component of requestedComponents) {
    if (!selectableNames.includes(component)) {
      throw new ToolError(
        `Unknown component '${component}'. Available families: ${selectableNames.join(", ")}`,
      );
    }
  }
  const aggregateMode = requestedComponents.length === 0;
  const names = aggregateMode ? allNames : requestedComponents;
  const results = [];
  const warnings = [];
  const compiled = {
    base: { core: new Map(), next: new Map() },
    current: { core: new Map(), next: new Map() },
  };

  for (const name of names) {
    const baseEntry = baselineEntries.get(name);
    const currentEntry = currentEntries.get(name);
    for (const surface of SURFACES) {
      if (!baseEntry || !currentEntry) {
        results.push({ name, surface, missing: !baseEntry ? "base" : "current", pass: false });
        continue;
      }
      const before = compileEntry(baseEntry[surface], baseRoot, dependencyRoot, `base ${name} ${surface}`, warnings);
      const after = compileEntry(currentEntry[surface], currentRoot, dependencyRoot, `current ${name} ${surface}`, warnings);
      compiled.base[surface].set(name, before);
      compiled.current[surface].set(name, after);
      results.push({
        name,
        surface,
        pass: before.equals(after),
        before,
        after,
        beforeHash: sha256(before),
        afterHash: sha256(after),
      });
    }
  }
  return { aggregateMode, results, compiled, warnings };
}

function printWarnings(warnings) {
  if (warnings.length === 0) return;
  const grouped = new Map();
  for (const warning of warnings) {
    const group = grouped.get(warning.message) || [];
    group.push(warning.label);
    grouped.set(warning.message, group);
  }
  console.error(`Sass warnings: ${grouped.size} unique, ${warnings.length} occurrences.`);
  const visible = [...grouped.entries()].slice(0, 20);
  for (const [message, labels] of visible) {
    const summary = message.split("\n").filter(Boolean).slice(0, 3).join(" ");
    console.error(`  [${labels.length}x; ${labels.slice(0, 2).join(", ")}] ${summary}`);
  }
  if (grouped.size > visible.length) {
    console.error(`  ... ${grouped.size - visible.length} additional unique warnings omitted.`);
  }
}

function printReport(report, commit, elapsedMilliseconds) {
  printWarnings(report.warnings);
  console.log(`Compiled CSS equivalence against ${commit.slice(0, 12)} (Sass ${sass.info.match(/dart-sass\s+([^\s]+)/)?.[1] || "unknown"})`);
  let failed = false;
  const visibleResults = report.aggregateMode
    ? report.results.filter((result) => !result.pass)
    : report.results;
  for (const name of [...new Set(visibleResults.map((result) => result.name))]) {
    console.log(name);
    for (const result of visibleResults.filter((item) => item.name === name)) {
      const label = result.surface === "core" ? "Core" : "Next";
      if (result.missing) {
        failed = true;
        console.log(`  ${label.padEnd(4)} FAIL  missing from ${result.missing} tree`);
      } else if (result.pass) {
        console.log(`  ${label.padEnd(4)} PASS  ${formatBytes(result.after.length).padStart(11)}  ${result.afterHash.slice(0, 12)}`);
      } else {
        failed = true;
        console.log(`  ${label.padEnd(4)} FAIL  base ${formatBytes(result.before.length)} ${result.beforeHash.slice(0, 12)}`);
        console.log(`             current ${formatBytes(result.after.length)} ${result.afterHash.slice(0, 12)}`);
        diagnostic(result.before, result.after).forEach((line) => console.log(`             ${line}`));
      }
    }
  }
  if (report.aggregateMode) {
    console.log(`Aggregate (${report.compiled.current.core.size} entries)`);
    for (const surface of SURFACES) {
      const before = aggregate(report.compiled.base[surface]);
      const after = aggregate(report.compiled.current[surface]);
      const surfaceHasEntryFailure = report.results.some(
        (result) => result.surface === surface && !result.pass,
      );
      const pass = !surfaceHasEntryFailure && before.contents.equals(after.contents) &&
        report.compiled.base[surface].size === report.compiled.current[surface].size;
      if (!pass) failed = true;
      console.log(`  ${surface === "core" ? "Core" : "Next"}  ${pass ? "PASS" : "FAIL"}  ${formatBytes(after.bytes).padStart(11)}  ${after.hash.slice(0, 12)}`);
    }
  }
  console.log(failed ? "Compiled CSS equivalence failed." : "Compiled CSS is exactly equivalent.");
  console.log(`Completed in ${elapsedMilliseconds.toFixed(1)}ms.`);
  return failed ? 1 : 0;
}

function main(argv = process.argv.slice(2), startDir = process.cwd()) {
  const startedAt = process.hrtime.bigint();
  let tempRoot;
  let signalHandlers;
  try {
    const options = parseArgs(argv);
    if (options.help) {
      console.log(usage());
      return 0;
    }
    const rootDir = resolveRepositoryRoot(startDir);
    const commit = resolveCommit(rootDir, options.base);
    tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), TEMP_PREFIX));
    const cleanupAndExit = (code) => {
      if (tempRoot) fs.rmSync(tempRoot, { recursive: true, force: true });
      process.exit(code);
    };
    signalHandlers = {
      SIGINT: () => cleanupAndExit(130),
      SIGTERM: () => cleanupAndExit(143),
    };
    process.once("SIGINT", signalHandlers.SIGINT);
    process.once("SIGTERM", signalHandlers.SIGTERM);
    materializeStyles(rootDir, commit, tempRoot);
    const report = compareTrees({
      baseRoot: tempRoot,
      currentRoot: rootDir,
      dependencyRoot: rootDir,
      requestedComponents: options.components,
    });
    const elapsedMilliseconds = Number(process.hrtime.bigint() - startedAt) / 1e6;
    return printReport(report, commit, elapsedMilliseconds);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`styles:equivalence error: ${message}`);
    return 2;
  } finally {
    if (signalHandlers) {
      process.removeListener("SIGINT", signalHandlers.SIGINT);
      process.removeListener("SIGTERM", signalHandlers.SIGTERM);
    }
    if (tempRoot) fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

if (require.main === module) {
  process.exitCode = main();
}

module.exports = {
  TEMP_PREFIX,
  aggregate,
  compareTrees,
  diagnostic,
  discoverEntries,
  main,
  materializeStyles,
  parseArgs,
};
