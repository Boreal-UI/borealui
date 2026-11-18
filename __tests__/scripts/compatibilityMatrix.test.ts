const {
  MATRIX,
  getFixture,
  assertNodeBoundary,
} = require("../../scripts/compatibilityMatrix.cjs");
import { readFileSync } from "fs";
import path from "path";
import { runInNewContext } from "vm";

describe("published compatibility matrix", () => {
  it("covers the published React and Next boundaries", () => {
    expect(MATRIX["core-react-18"]).toMatchObject({ react: "18.2.0", reactDom: "18.2.0" });
    expect(MATRIX["next-13"]).toMatchObject({ next: "13.5.11", react: "18.2.0" });
    expect(MATRIX["next-15"].next).toMatch(/^15\./);
    expect(MATRIX["next-16-node-20"].next).toMatch(/^16\./);
  });

  it("covers Node 20 and 22 plus the CLI's Node 18 claim", () => {
    expect(new Set(Object.values(MATRIX).map((fixture: any) => fixture.node))).toEqual(
      new Set(["18", "20", "22"]),
    );
    expect(MATRIX["cli-node-18"]).toMatchObject({ kind: "cli", node: "18" });
  });

  it("rejects unknown fixtures and the wrong runtime", () => {
    expect(() => getFixture("unknown")).toThrow(/Unknown compatibility fixture/);
    expect(() => assertNodeBoundary(MATRIX["core-react-18"], "22.12.0")).toThrow(
      /requires Node 20\.x/,
    );
  });

  it.each(["next-16-node-20", "next-16-node-22"])(
    "%s pins browser mapping in the isolated install manifest",
    (name) => {
      const files = new Map<string, string>();
      const installStarted = new Error("install captured");
      const execFileSync = jest.fn(() => { throw installStarted; });
      const fixtureDir = path.join(process.cwd(), "isolated-fixture");
      const source = readFileSync(path.join(process.cwd(), "scripts/runCompatibility.cjs"), "utf8");
      expect(() => runInNewContext(source, {
        require: (id: string) => {
          if (id === "./compatibilityMatrix.cjs") return {
            ...require("../../scripts/compatibilityMatrix.cjs"),
            assertNodeBoundary: (fixture: { node: string }) =>
              assertNodeBoundary(fixture, `${MATRIX[name].node}.19.0`),
          };
          if (id === "child_process") return { execFileSync };
          if (id === "fs") return {
            mkdtempSync: () => fixtureDir,
            mkdirSync: jest.fn(),
            writeFileSync: (file: string, content: string) => files.set(file, content),
            readFileSync: () => JSON.stringify({ artifacts: { next: "next.tgz", types: "types.tgz" } }),
            existsSync: () => true,
            rmSync: jest.fn(),
          };
          return require(id);
        },
        process: {
          argv: ["node", "runCompatibility.cjs", "--fixture", name, "--tarball-dir", "artifacts"],
          versions: { node: `${MATRIX[name].node}.19.0` },
          platform: "linux",
          env: {},
        },
        console: { log: jest.fn() },
      })).toThrow(installStarted);
      const manifest = JSON.parse(files.get(path.join(fixtureDir, "package.json"))!);
      expect(manifest.overrides).toEqual({ "baseline-browser-mapping": "2.11.26" });
      expect(manifest.dependencies.next).toBe(MATRIX[name].next);
      expect(execFileSync).toHaveBeenCalledWith("npm", expect.arrayContaining([
        "install", "--ignore-scripts", "--strict-peer-deps",
      ]), expect.objectContaining({ cwd: fixtureDir }));
    },
  );

  it("stages shared declarations and does not infer aliased defaults as root defaults", () => {
    const patchDeclarations = readFileSync(
      path.join(process.cwd(), "scripts", "patchDeclarations.cjs"),
      "utf8",
    );
    const stagePackages = readFileSync(
      path.join(process.cwd(), "scripts", "stageSplitPackage.cjs"),
      "utf8",
    );
    expect(patchDeclarations).toContain("fs.copyFileSync(sharedTypesSource, sharedTypesOutput)");
    expect(patchDeclarations).toContain("\\.\\/types\\.d");
    expect(stagePackages).toContain("default\\s*\\}\\s*from");
  });
});
