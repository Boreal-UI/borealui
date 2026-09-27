import fs from "node:fs";
import path from "node:path";
import {
  criticalVisualMatrix,
  visualImplementations,
  visualThemes,
  visualViewports,
} from "../../visual-regression/criticalVisualMatrix";

const root = process.cwd();

describe("critical visual regression matrix", () => {
  it("uses unique case and story ids", () => {
    const caseIds = criticalVisualMatrix.map((entry) => entry.id);
    const storyIds = criticalVisualMatrix.flatMap((entry) =>
      visualImplementations.map((implementation) => entry.storyIds[implementation]),
    );

    expect(new Set(caseIds).size).toBe(caseIds.length);
    expect(new Set(storyIds).size).toBe(storyIds.length);
  });

  it("maps every case to matching Core and Next story exports", () => {
    const sources = {
      core: fs.readFileSync(
        path.join(root, "stories-visual/CoreParity.stories.tsx"),
        "utf8",
      ),
      next: fs.readFileSync(
        path.join(root, "stories-visual/NextParity.stories.tsx"),
        "utf8",
      ),
    };

    for (const visualCase of criticalVisualMatrix) {
      for (const implementation of visualImplementations) {
        expect(sources[implementation]).toContain(
          `export const ${visualCase.exportName}`,
        );
        expect(visualCase.storyIds[implementation]).toBe(
          `visual-parity-${implementation}--${visualCase.id}`,
        );
      }
    }
  });

  it("covers required themes, viewports, and accessibility media", () => {
    const themes = new Set(criticalVisualMatrix.map((entry) => entry.theme));
    const viewports = new Set(
      criticalVisualMatrix.flatMap((entry) => entry.viewports),
    );

    expect(themes).toEqual(new Set(Object.keys(visualThemes)));
    expect(viewports).toEqual(new Set(Object.keys(visualViewports)));
    expect(criticalVisualMatrix.some((entry) => entry.forcedColors)).toBe(true);
    expect(criticalVisualMatrix.some((entry) => entry.reducedMotion)).toBe(true);
  });

  it("keeps the first baseline deliberately reviewable", () => {
    const snapshotCount = criticalVisualMatrix.reduce(
      (count, entry) =>
        count + entry.viewports.length * visualImplementations.length,
      0,
    );
    const components = new Set(
      criticalVisualMatrix.flatMap((entry) => entry.components),
    );

    expect(criticalVisualMatrix).toHaveLength(21);
    expect(components.size).toBe(21);
    expect(snapshotCount).toBe(50);
  });
});
