import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const repositoryRoot = path.resolve(__dirname, "../..");
const scriptPath = path.join(repositoryRoot, "scripts", "stylesEquivalence.cjs");
const fixturesRoot = path.join(
  repositoryRoot,
  "__tests__",
  "fixtures",
  "styles-equivalence",
);
const tempPrefix = "boreal-styles-equivalence-";

type CliResult = ReturnType<typeof spawnSync>;

function copyContents(source: string, destination: string) {
  if (!existsSync(source)) return;
  mkdirSync(destination, { recursive: true });
  for (const entry of readdirSync(source, { withFileTypes: true })) {
    cpSync(path.join(source, entry.name), path.join(destination, entry.name), {
      recursive: true,
    });
  }
}

function git(root: string, args: string[]) {
  const result = spawnSync("git", args, {
    cwd: root,
    encoding: "utf8",
    shell: false,
    windowsHide: true,
  });
  if (result.status !== 0) {
    throw new Error(result.stderr || `git ${args.join(" ")} failed`);
  }
  return result.stdout.trim();
}

describe("compiled CSS equivalence CLI", () => {
  const roots: string[] = [];

  afterEach(() => {
    roots
      .splice(0)
      .forEach((root) => rmSync(root, { recursive: true, force: true }));
  });

  function createRepository(scenario = "equivalent") {
    const root = mkdtempSync(path.join(tmpdir(), "boreal-equivalence-fixture-"));
    roots.push(root);
    copyContents(path.join(fixturesRoot, "baseline"), root);
    git(root, ["init", "--quiet"]);
    git(root, ["config", "user.email", "fixture@example.invalid"]);
    git(root, ["config", "user.name", "Boreal Fixture"]);
    git(root, ["add", "src"]);
    git(root, ["commit", "--quiet", "-m", "baseline"]);
    const base = git(root, ["rev-parse", "HEAD"]);
    copyContents(path.join(fixturesRoot, "equivalent"), root);
    if (scenario !== "equivalent") {
      copyContents(path.join(fixturesRoot, scenario), root);
    }
    return { root, base };
  }

  function run(root: string, args: string[] = []): CliResult {
    return spawnSync(process.execPath, [scriptPath, ...args], {
      cwd: root,
      encoding: "utf8",
      shell: false,
      windowsHide: true,
    });
  }

  it("uses HEAD by default and accepts an equivalent shared-mixin refactor", () => {
    const { root } = createRepository();
    const result = run(root);

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Aggregate (2 entries)");
    expect(result.stdout).toContain("Core  PASS");
    expect(result.stdout).toContain("Next  PASS");
    expect(result.stdout).toContain("Compiled CSS is exactly equivalent.");
  });

  it("accepts an explicit base revision", () => {
    const { root, base } = createRepository();
    const result = run(root, ["--base", base, "--component", "Fixture"]);

    expect(result.status).toBe(0);
    expect(result.stdout).toContain(base.slice(0, 12));
  });

  it("does not treat CRLF Sass source as a compiled CSS change", () => {
    const { root } = createRepository();
    const files = [
      path.join(root, "src", "components", "Fixture", "core", "Fixture.scss"),
      path.join(root, "src", "components", "Fixture", "next", "Fixture.module.scss"),
      path.join(root, "src", "components", "Fixture", "_Fixture.shared.scss"),
    ];
    files.forEach((file) => {
      const source = readFileSync(file, "utf8").replace(/\r?\n/g, "\r\n");
      writeFileSync(file, source);
    });

    expect(run(root, ["--component", "Fixture"]).status).toBe(0);
  });

  it("filters to one component", () => {
    const { root } = createRepository("declaration-change");
    const result = run(root, ["--component", "Other"]);

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Other");
    expect(result.stdout).not.toContain("Fixture\n");
  });

  it("accepts repeated component options", () => {
    const { root } = createRepository();
    const result = run(root, [
      "--component",
      "Fixture",
      "--component",
      "Other",
    ]);

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Fixture");
    expect(result.stdout).toContain("Other");
  });

  it("rejects an invalid or unknown component", () => {
    const { root } = createRepository();
    const unsafe = run(root, ["--component", "../Fixture"]);
    const unknown = run(root, ["--component", "Missing"]);

    expect(unsafe.status).toBe(2);
    expect(unsafe.stderr).toContain("Invalid component name");
    expect(unknown.status).toBe(2);
    expect(unknown.stderr).toContain("Unknown component 'Missing'");
  });

  it("fails cleanly for a missing base revision", () => {
    const { root } = createRepository();
    const result = run(root, ["--base", "definitely-not-a-revision"]);

    expect(result.status).toBe(2);
    expect(result.stderr).toContain("does not resolve to a commit");
  });

  it("reports Sass compilation failures as tool failures", () => {
    const { root } = createRepository("compile-error");
    const result = run(root, ["--component", "Fixture"]);

    expect(result.status).toBe(2);
    expect(result.stderr).toContain("Sass compilation failed");
  });

  it.each([
    ["declaration-change", "Core"],
    ["selector-change", "Core"],
    ["rule-order-change", "Core"],
    ["media-change", "Next"],
    ["fallback-change", "Next"],
  ])("detects the %s fixture", (scenario, surface) => {
    const { root } = createRepository(scenario);
    const result = run(root, ["--component", "Fixture"]);

    expect(result.status).toBe(1);
    expect(result.stdout).toContain(`${surface} FAIL`);
    expect(result.stdout).toContain("first differing byte");
    expect(result.stdout.length).toBeLessThan(4_000);
  });

  it("identifies a Core-only change", () => {
    const { root } = createRepository("core-change");
    const result = run(root, ["--component", "Fixture"]);

    expect(result.status).toBe(1);
    expect(result.stdout).toContain("Core FAIL");
    expect(result.stdout).toContain("Next PASS");
  });

  it("identifies a Next-only change", () => {
    const { root } = createRepository("next-change");
    const result = run(root, ["--component", "Fixture"]);

    expect(result.status).toBe(1);
    expect(result.stdout).toContain("Core PASS");
    expect(result.stdout).toContain("Next FAIL");
  });

  it("removes its temporary Git materialization after success and failure", () => {
    const before = new Set(
      readdirSync(tmpdir()).filter((name) => name.startsWith(tempPrefix)),
    );
    const passing = createRepository();
    const failing = createRepository("declaration-change");

    expect(run(passing.root).status).toBe(0);
    expect(run(failing.root).status).toBe(1);

    const leaked = readdirSync(tmpdir()).filter(
      (name) => name.startsWith(tempPrefix) && !before.has(name),
    );
    expect(leaked).toEqual([]);
  });
});
