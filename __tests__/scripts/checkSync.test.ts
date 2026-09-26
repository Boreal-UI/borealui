import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import path from "path";
import { analyzeRepository, formatReport } from "../../scripts/checkSync.cjs";

type FixtureOptions = {
  baseKeys?: string[];
  baseSource?: string;
  coreKeys?: Record<string, string>;
  nextKeys?: string[];
  coreClasses?: string[];
};

describe("Core/Next style semantic parity", () => {
  const roots: string[] = [];

  afterEach(() => {
    roots
      .splice(0)
      .forEach((root) => rmSync(root, { recursive: true, force: true }));
  });

  const createFixture = ({
    baseKeys = ["root", "disabled", "loading"],
    baseSource,
    coreKeys = {
      root: "fixture",
      disabled: "fixture_disabled",
      loading: "fixture_loading",
    },
    nextKeys = ["root", "disabled", "loading"],
    coreClasses = Object.values(coreKeys),
  }: FixtureOptions = {}) => {
    const root = mkdtempSync(path.join(tmpdir(), "boreal-style-parity-"));
    roots.push(root);
    const family = path.join(root, "src", "components", "Fixture");
    mkdirSync(path.join(family, "core"), { recursive: true });
    mkdirSync(path.join(family, "next"), { recursive: true });
    writeFileSync(
      path.join(family, "Fixture.types.ts"),
      "export type FixtureProps = Record<string, never>;\n",
    );
    writeFileSync(
      path.join(family, "FixtureBase.tsx"),
      baseSource ??
        `export const FixtureBase = ({ classMap }: { classMap: Record<string, string> }) => <div className={[${baseKeys
          .map((key) => `classMap.${key}`)
          .join(", ")}].join(" ")} />;\n`,
    );
    writeFileSync(
      path.join(family, "core", "Fixture.tsx"),
      `import "./Fixture.scss";\nconst classes = ${JSON.stringify(coreKeys)};\nexport default () => <div classMap={classes} />;\n`,
    );
    writeFileSync(
      path.join(family, "next", "Fixture.tsx"),
      `import styles from "./Fixture.module.scss";\nexport default () => <div classMap={styles} />;\n`,
    );
    writeFileSync(
      path.join(family, "core", "Fixture.scss"),
      `${coreClasses.map((key) => `.${key} { color: var(--fixture-color); }`).join("\n")}\n`,
    );
    writeFileSync(
      path.join(family, "next", "Fixture.module.scss"),
      `${nextKeys.map((key) => `.${key} { color: var(--fixture-color); }`).join("\n")}\n`,
    );
    return root;
  };

  const analyze = (root: string, exceptions: object[] = []) =>
    analyzeRepository({ rootDir: root, exceptions });

  it("passes healthy parity", () => {
    const report = analyze(createFixture());
    expect(report.errors).toEqual([]);
    expect(report.families).toHaveLength(1);
  });

  it("isolates each styled family from sibling base components", () => {
    const root = createFixture();
    writeFileSync(
      path.join(root, "src", "components", "Fixture", "SiblingBase.tsx"),
      "export const SiblingBase = ({ classMap }: { classMap: Record<string, string> }) => <div className={classMap.siblingOnly} />;\n",
    );

    const report = analyze(root);
    expect(report.errors).toEqual([]);
    expect(report.families[0]?.requiredKeys).not.toContain("siblingOnly");
  });

  it("fails when Core omits a required key", () => {
    const root = createFixture({
      coreKeys: { root: "fixture", disabled: "fixture_disabled" },
    });
    expect(analyze(root).errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ surface: "core", key: "loading" }),
      ]),
    );
  });

  it("identifies exactly the missing Next key in the regression fixture", () => {
    const root = createFixture({ nextKeys: ["root", "disabled"] });
    const report = analyze(root);
    const missingNext = report.errors.filter(
      (error: { kind: string; surface: string }) =>
        error.kind === "missing-key" && error.surface === "next",
    );
    expect(missingNext).toEqual([
      expect.objectContaining({ component: "Fixture", key: "loading" }),
    ]);
    expect(formatReport(report, 1)).toContain(
      "Next missing classMap key: loading",
    );
  });

  it("fails when a Core classMap value has no compiled SCSS class", () => {
    const root = createFixture({
      coreClasses: ["fixture", "fixture_disabled"],
    });
    expect(analyze(root).errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ kind: "missing-class", key: "loading" }),
      ]),
    );
  });

  it("reports a provably dead key as a warning", () => {
    const root = createFixture({
      coreKeys: {
        root: "fixture",
        disabled: "fixture_disabled",
        loading: "fixture_loading",
        stale: "fixture_stale",
      },
      nextKeys: ["root", "disabled", "loading", "stale"],
    });
    expect(analyze(root).warnings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ kind: "dead-key", key: "stale" }),
      ]),
    );
  });

  it("recognizes styling keys consumed by the shared shadow helper", () => {
    const root = createFixture({
      baseSource: `export const FixtureBase = ({ classMap }: { classMap: Record<string, string> }) => <div className={getShadowClassName(classMap, "primary", "light")} />;\n`,
      coreKeys: {
        root: "fixture",
        disabled: "fixture_disabled",
        loading: "fixture_loading",
        shadowLight: "fixture_shadowLight",
      },
      nextKeys: ["root", "disabled", "loading", "shadowLight"],
      coreClasses: [
        "fixture",
        "fixture_disabled",
        "fixture_loading",
        "fixture_shadowLight",
      ],
    });

    expect(analyze(root).warnings).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ kind: "dead-key", key: "shadowLight" }),
      ]),
    );
  });

  it("applies only an exact intentional exception", () => {
    const root = createFixture({ nextKeys: ["root", "disabled"] });
    const exception = {
      component: "Fixture",
      kind: "missing-key",
      surface: "next",
      key: "loading",
      reason: "Fixture intentionally demonstrates a narrowly unstyled state.",
    };
    const report = analyze(root, [exception]);
    expect(report.errors).toEqual([]);
    expect(report.suppressed).toEqual([expect.objectContaining(exception)]);
  });

  it.each([
    ["variant", "variant", "outline"],
    ["size", "size", "small"],
  ])("fails on a %s mismatch", (_label, propName, missingKey) => {
    const root = createFixture({
      baseSource: `export const FixtureBase = ({ classMap, ${propName} }: { classMap: Record<string, string>; ${propName}: "root" | "${missingKey}" }) => <div className={classMap[${propName}]} />;\n`,
      coreKeys: {
        root: "fixture",
        disabled: "fixture_disabled",
        loading: "fixture_loading",
        [missingKey]: `fixture_${missingKey}`,
      },
      nextKeys: ["root", "disabled", "loading"],
    });
    expect(analyze(root).errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ surface: "next", key: missingKey }),
      ]),
    );
  });
});
