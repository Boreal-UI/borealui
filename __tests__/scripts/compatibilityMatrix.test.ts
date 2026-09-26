const {
  MATRIX,
  getFixture,
  assertNodeBoundary,
} = require("../../scripts/compatibilityMatrix.cjs");
import { readFileSync } from "fs";
import path from "path";

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
