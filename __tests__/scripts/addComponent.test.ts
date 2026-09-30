import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "fs";
import { tmpdir } from "os";
import path from "path";
import {
  ensurePathInside,
  generateComponent,
} from "../../scripts/addComponent.cjs";
import { parseLegacyArgs } from "../../scripts/boreal.cjs";

const nodeFs = jest.requireActual<typeof import("fs")>("fs");

describe("component generator safety", () => {
  let temporaryRoots: string[] = [];
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    temporaryRoots = [];
    logSpy = jest.spyOn(console, "log").mockImplementation(() => undefined);
  });

  afterEach(() => {
    logSpy.mockRestore();
    for (const root of temporaryRoots) {
      rmSync(root, { recursive: true, force: true });
    }
  });

  const createRoot = () => {
    const root = mkdtempSync(path.join(tmpdir(), "boreal-generator-"));
    temporaryRoots.push(root);
    return root;
  };

  it("creates every expected file for a valid PascalCase component", () => {
    const root = createRoot();
    mkdirSync(path.join(root, "src"), { recursive: true });
    writeFileSync(
      path.join(root, "src", "index.core.ts"),
      'export {\n  Stack,\n} from "./core/Layout";\nexport { default as Alert } from "./core/Alert";\n',
      "utf8",
    );
    writeFileSync(
      path.join(root, "src", "index.next.ts"),
      '"use client";\nexport {\n  Stack,\n} from "./next/Layout";\nexport { default as Alert } from "./next/Alert";\n',
      "utf8",
    );
    writeFileSync(
      path.join(root, "package.json"),
      '{"name":"generator-fixture","exports":{}}\n',
      "utf8",
    );

    const files = generateComponent(["SafeWidget"], {
      repoRoot: root,
    });

    expect(files).toHaveLength(11);
    expect(
      existsSync(
        path.join(root, "src", "components", "SafeWidget", "SafeWidgetBase.tsx"),
      ),
    ).toBe(true);
    expect(
      existsSync(
        path.join(root, "stories-next", "components", "SafeWidget.stories.tsx"),
      ),
    ).toBe(true);
    for (const file of files) {
      expect(ensurePathInside(root, file)).toBe(path.resolve(file));
    }
    expect(readFileSync(path.join(root, "src", "index.core.ts"), "utf8"))
      .toContain('export {\n  Stack,\n} from "./core/Layout";');
    expect(
      readFileSync(path.join(root, "src", "index.next.ts"), "utf8").startsWith(
        '"use client";',
      ),
    ).toBe(true);
    expect(
      JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"))
        .exports["./core/SafeWidget"],
    ).toEqual({
      types: "./dist/types/core/SafeWidget.d.ts",
      import: "./dist/core/SafeWidget.js",
    });
  });

  it.each([
    "../Example",
    "..\\Example",
    "foo/bar",
    "foo\\bar",
    "C:\\temp\\Example",
    "/absolute/Example",
    ".",
    "..",
    "lowercase",
    "Bad-Name",
  ])("rejects unsafe or invalid component name %s", (name) => {
    const root = createRoot();

    expect(() =>
      generateComponent([name, "--skip-exports"], { repoRoot: root }),
    ).toThrow(/PascalCase identifier/);
    expect(existsSync(path.join(root, "src"))).toBe(false);
  });

  it("rejects absolute and sibling destinations during containment checks", () => {
    const root = createRoot();
    const sibling = `${root}-outside`;

    expect(() => ensurePathInside(root, sibling)).toThrow(
      /Refusing to generate outside/,
    );
    expect(() => ensurePathInside(root, path.resolve(sibling, "file.ts"))).toThrow(
      /Refusing to generate outside/,
    );
  });

  it("rejects generation through a symlinked parent outside the canonical root", () => {
    const root = createRoot();
    const outside = createRoot();
    const linkedComponents = path.join(root, "src", "components");
    mkdirSync(path.dirname(linkedComponents), { recursive: true });

    try {
      nodeFs.symlinkSync(
        outside,
        linkedComponents,
        process.platform === "win32" ? "junction" : "dir",
      );
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        ["EPERM", "EACCES", "ENOTSUP"].includes(String(error.code))
      ) {
        console.warn(
          `Skipping symlink containment assertion: ${String(error.code)}`,
        );
        return;
      }
      throw error;
    }

    expect(() =>
      generateComponent(["EscapeWidget", "--skip-exports"], {
        repoRoot: root,
      }),
    ).toThrow(/Refusing to generate outside/);
    expect(
      existsSync(path.join(outside, "EscapeWidget", "EscapeWidget.types.ts")),
    ).toBe(false);
  });

  it("rejects metadata hardlinks that alias files outside the root", () => {
    const root = createRoot();
    const outside = createRoot();
    const outsidePackage = path.join(outside, "package.json");
    const outsideContents =
      '{\n  "name": "outside-metadata",\n  "exports": {}\n}\n';

    mkdirSync(path.join(root, "src"), { recursive: true });
    writeFileSync(
      path.join(root, "src", "index.core.ts"),
      'export { default as Alert } from "./core/Alert";\n',
      "utf8",
    );
    writeFileSync(
      path.join(root, "src", "index.next.ts"),
      '"use client";\nexport { default as Alert } from "./next/Alert";\n',
      "utf8",
    );
    writeFileSync(outsidePackage, outsideContents, "utf8");
    nodeFs.linkSync(outsidePackage, path.join(root, "package.json"));

    expect(() =>
      generateComponent(["AliasedWidget"], { repoRoot: root }),
    ).toThrow(/Refusing to update aliased or non-regular file/);
    expect(readFileSync(outsidePackage, "utf8")).toBe(outsideContents);
    expect(
      existsSync(path.join(root, "src", "components", "AliasedWidget")),
    ).toBe(false);
  });

  it("refuses overwrite before creating any other component file", () => {
    const root = createRoot();
    const existingFile = path.join(
      root,
      "src",
      "components",
      "ExistingWidget",
      "ExistingWidget.types.ts",
    );
    mkdirSync(path.dirname(existingFile), { recursive: true });
    writeFileSync(existingFile, "consumer-owned content", "utf8");

    expect(() =>
      generateComponent(["ExistingWidget", "--skip-exports"], {
        repoRoot: root,
      }),
    ).toThrow(/already exists\. No files were created/);

    expect(readFileSync(existingFile, "utf8")).toBe("consumer-owned content");
    expect(
      existsSync(
        path.join(
          root,
          "src",
          "components",
          "ExistingWidget",
          "ExistingWidgetBase.tsx",
        ),
      ),
    ).toBe(false);
  });

  it("rejects the retired force-overwrite option", () => {
    const root = createRoot();

    expect(() =>
      generateComponent(["SafeWidget", "--force", "--skip-exports"], {
        repoRoot: root,
      }),
    ).toThrow('Unknown option "--force"');
    expect(existsSync(path.join(root, "src"))).toBe(false);
  });

  it("keeps dry runs read-only", () => {
    const root = createRoot();

    generateComponent(["DryRunWidget", "--dry-run", "--skip-exports"], {
      repoRoot: root,
    });

    expect(existsSync(path.join(root, "src"))).toBe(false);
  });

  it("rolls back generated files and metadata after a late write failure", () => {
    const root = createRoot();
    const coreIndexPath = path.join(root, "src", "index.core.ts");
    const nextIndexPath = path.join(root, "src", "index.next.ts");
    const packagePath = path.join(root, "package.json");
    const coreIndex = 'export { default as Alert } from "./core/Alert";\n';
    const nextIndex =
      '"use client";\nexport { default as Alert } from "./next/Alert";\n';
    const packageContents =
      '{\n  "name": "generator-fixture",\n  "exports": {}\n}\n';

    mkdirSync(path.join(root, "src"), { recursive: true });
    writeFileSync(coreIndexPath, coreIndex, "utf8");
    writeFileSync(nextIndexPath, nextIndex, "utf8");
    writeFileSync(packagePath, packageContents, "utf8");

    const originalWriteFileSync = nodeFs.writeFileSync.bind(nodeFs);
    let failureInjected = false;
    const writeSpy = jest
      .spyOn(nodeFs, "writeFileSync")
      .mockImplementation(((target, data, options) => {
        if (
          !failureInjected &&
          typeof target !== "number" &&
          path.resolve(String(target)) === packagePath
        ) {
          failureInjected = true;
          throw new Error("forced late package update failure");
        }

        return originalWriteFileSync(target, data, options);
      }) as typeof nodeFs.writeFileSync);

    try {
      expect(() =>
        generateComponent(["RollbackWidget"], { repoRoot: root }),
      ).toThrow("forced late package update failure");
    } finally {
      writeSpy.mockRestore();
    }

    expect(failureInjected).toBe(true);
    expect(readFileSync(coreIndexPath, "utf8")).toBe(coreIndex);
    expect(readFileSync(nextIndexPath, "utf8")).toBe(nextIndex);
    expect(readFileSync(packagePath, "utf8")).toBe(packageContents);
    expect(
      existsSync(path.join(root, "src", "components", "RollbackWidget")),
    ).toBe(false);
    expect(
      existsSync(
        path.join(
          root,
          "__tests__",
          "base-component-test",
          "RollbackWidget.test.tsx",
        ),
      ),
    ).toBe(false);
    expect(existsSync(path.join(root, "stories-core"))).toBe(false);
    expect(existsSync(path.join(root, "stories-next"))).toBe(false);
  });

  it("preserves the legacy new command while delegating its arguments", () => {
    expect(
      parseLegacyArgs(["new", "SafeWidget", "--dry-run", "--skip-exports"]),
    ).toEqual(["SafeWidget", "--dry-run", "--skip-exports"]);
    expect(() => parseLegacyArgs(["remove", "SafeWidget"])).toThrow(
      /npm run boreal new/,
    );
  });
});
