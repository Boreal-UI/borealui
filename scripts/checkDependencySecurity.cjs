const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { createRequire } = require("node:module");
const semver = require("semver");

const root = path.resolve(__dirname, "..");
const fromRoot = createRequire(path.join(root, "package.json"));
const lock = JSON.parse(fs.readFileSync(path.join(root, "package-lock.json"), "utf8"));
const affected = {
  glob: ">=9.0.0 <=14.0.1",
  minimatch: ">=7.0.0 <11.0.1",
  next: ">=16.3.0 <=16.4.4",
  qs: ">=6.7.0 <=6.16.0",
  systeminformation: "<5.33.16",
};
for (const [location, pkg] of Object.entries(lock.packages)) {
  const name = location.split("node_modules/").at(-1);
  if (affected[name]) assert.ok(!semver.satisfies(pkg.version, affected[name]), `${location}@${pkg.version} is affected`);
}
assert.ok(semver.gte(fromRoot("jest/package.json").version, "30.5.2"), "Do not downgrade Jest");

const requireFor = name => createRequire(fromRoot.resolve(name));
const glob = requireFor("jest-config")("glob");
const minimatch = requireFor("test-exclude")("minimatch");
assert.equal(typeof glob.glob, "function");
assert.equal(typeof glob.glob.sync, "function");
assert.equal(typeof glob.globSync, "function");
assert.equal(typeof minimatch.minimatch, "function");
assert.equal(minimatch.minimatch("src/nested/button.tsx", "src/**/*.tsx"), true);
assert.equal(minimatch.minimatch("src/button.scss", "src/**/*.tsx"), false);

// Exercise the amplification pattern and a distinct repeated-parent variant.
// The outer test process supplies a timeout to catch renewed unbounded growth.
for (const segment of ["**/../", "a/**/../"]) {
  try {
    const matcher = new minimatch.Minimatch(`src/${segment.repeat(64)}target.ts`, { optimizationLevel: 2 });
    assert.equal(typeof matcher.match("src/target.ts"), "boolean");
  } catch (error) {
    assert.ok(error instanceof RangeError);
    assert.match(error.message, /too many patterns/);
  }
}

const qs = requireFor("@cypress/request")("qs");
assert.doesNotThrow(() => qs.stringify({ a: [{ toString: "not callable" }] }, { arrayFormat: "comma" }));
assert.doesNotThrow(() => qs.stringify({ a: [Object.assign(Object.create(null), { b: "value" })] }, { arrayFormat: "comma" }));
assert.equal(qs.stringify({ a: ["one", "two"] }, { arrayFormat: "comma" }), "a=one%2Ctwo");

const tempRoot = path.resolve(process.env.BOREAL_SECURITY_TMPDIR ?? os.tmpdir());
const fixture = fs.mkdtempSync(path.join(tempRoot, "boreal-dependency-security-"));
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function abortedWalk(stream, preAborted) {
  const controller = new AbortController();
  let reads = 0;
  const filesystem = {
    ...fs,
    readdir(...args) {
      reads += 1;
      if (reads === 1) controller.abort(new Error("probe-abort"));
      return fs.readdir(...args);
    },
  };
  if (preAborted) controller.abort(new Error("probe-abort"));
  const options = { cwd: fixture, fs: filesystem, signal: controller.signal };
  await assert.rejects(async () => {
    if (stream) {
      for await (const item of glob.globStream("**", options)) void item;
    } else await glob.glob("**", options);
  }, /probe-abort/);
  const atReject = reads;
  await delay(100);
  assert.equal(reads, atReject, "Aborted glob must not continue filesystem traversal after rejection");
  assert.equal(preAborted ? reads : reads > 0, preAborted ? 0 : true);
}

async function main() {
  try {
    fs.mkdirSync(path.join(fixture, "src", "nested"), { recursive: true });
    fs.mkdirSync(path.join(fixture, "test"));
    fs.writeFileSync(path.join(fixture, "src", "one.ts"), "export const one = 1;");
    fs.writeFileSync(path.join(fixture, "src", "nested", "two.ts"), "export const two = 2;");
    fs.writeFileSync(path.join(fixture, "test", "one.test.ts"), "test fixture");
    const expected = ["src/nested/two.ts", "src/one.ts"];
    const normalize = files => files.map(file => file.split(path.sep).join("/")).sort();
    assert.deepEqual(normalize(glob.globSync("src/**/*.ts", { cwd: fixture })), expected);
    assert.deepEqual(normalize(await glob.glob("src/**/*.ts", { cwd: fixture })), expected);
    const TestExclude = fromRoot("test-exclude");
    const exclude = new TestExclude({ cwd: fixture, include: ["src/**/*.ts"], extension: [".ts"] });
    assert.equal(exclude.shouldInstrument(path.join(fixture, "src", "one.ts")), true);
    assert.equal(exclude.shouldInstrument(path.join(fixture, "test", "one.test.ts")), false);
    assert.deepEqual(normalize(exclude.globSync()), expected);
    assert.deepEqual(normalize(await exclude.glob()), expected);
    for (const stream of [false, true]) {
      for (const preAborted of [false, true]) await abortedWalk(stream, preAborted);
    }
    console.log(`Dependency security and glob/coverage compatibility checks passed on Node ${process.versions.node}; Jest ${fromRoot("jest/package.json").version}.`);
  } finally {
    // Only remove the fixture directory created by this process beneath its temp root.
    assert.ok(fixture.startsWith(tempRoot + path.sep));
    assert.ok(path.basename(fixture).startsWith("boreal-dependency-security-"));
    fs.rmSync(fixture, { recursive: true, force: true });
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
