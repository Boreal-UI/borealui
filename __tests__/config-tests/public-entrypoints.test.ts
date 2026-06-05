import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import CoreThemeProviderDefault, {
  ThemeProvider as CoreThemeProviderNamed,
} from "../../src/core/ThemeProvider";
import NextThemeProviderDefault, {
  ThemeProvider as NextThemeProviderNamed,
} from "../../src/next/ThemeProvider";
import {
  getBorealStyleConfig,
  setBorealConfig,
  setBorealStyleConfig,
} from "../../src/core/styleConfig";
import {
  setBorealConfig as setNextBorealConfig,
  setBorealStyleConfig as setNextBorealStyleConfig,
} from "../../src/next/styleConfig";

describe("public entrypoints", () => {
  afterEach(() => {
    setBorealStyleConfig({});
  });

  it("exports ThemeProvider from root entrypoints for CLI init imports", () => {
    const coreIndex = readFileSync(resolve("src/index.core.ts"), "utf8");
    const nextIndex = readFileSync(resolve("src/index.next.ts"), "utf8");

    expect(coreIndex).toContain('export * from "./core/ThemeProvider";');
    expect(coreIndex).toContain('export * from "./core/styleConfig";');
    expect(nextIndex).toContain('export * from "./next/ThemeProvider";');
    expect(nextIndex).toContain('export * from "./next/styleConfig";');
  });

  it("exports ThemeProvider as the default from core and next subpaths", () => {
    expect(CoreThemeProviderDefault).toBe(CoreThemeProviderNamed);
    expect(NextThemeProviderDefault).toBe(NextThemeProviderNamed);
  });

  it("exports config setters from both root entrypoints", () => {
    expect(setBorealConfig).toBe(setBorealStyleConfig);
    expect(setNextBorealConfig).toBe(setNextBorealStyleConfig);

    setBorealConfig({ defaultTheme: "secondary" });

    expect(getBorealStyleConfig().defaultTheme).toBe("secondary");
  });
});
