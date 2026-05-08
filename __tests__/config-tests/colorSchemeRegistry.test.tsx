import {
  registerColorScheme,
  removeColorScheme,
  getAllColorSchemes,
} from "../../src/styles/colorSchemeRegistry";
import { defaultColorSchemes } from "../../src/styles/Themes";

describe("colorSchemeRegistry", () => {
  const originalSchemes = [...defaultColorSchemes];
  const originalWarn = console.warn;
  const originalEnv = process.env.NODE_ENV;

  const resetRegistry = () => {
    const current = getAllColorSchemes();
    const defaultNames = new Set(originalSchemes.map((scheme) => scheme.name));

    for (const scheme of current) {
      if (!defaultNames.has(scheme.name)) {
        removeColorScheme(scheme.name);
      }
    }

    registerColorScheme(originalSchemes, true);
  };

  beforeEach(() => {
    resetRegistry();
    console.warn = jest.fn();
    process.env.NODE_ENV = originalEnv;
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  afterAll(() => {
    console.warn = originalWarn;
  });

  it("registers a new color scheme when the name does not already exist", () => {
    const newScheme = {
      name: "Custom Aurora",
      primaryColor: "#111111",
      secondaryColor: "#222222",
      tertiaryColor: "#333333",
      quaternaryColor: "#444444",
      backgroundColor: "#fefefe",
    };

    const before = getAllColorSchemes().length;

    registerColorScheme([newScheme]);

    const result = getAllColorSchemes();

    expect(result).toHaveLength(before + 1);
    expect(result.find((s) => s.name === "Custom Aurora")).toEqual(newScheme);
  });

  it("skips a duplicate color scheme when override is false", () => {
    const existing = getAllColorSchemes()[0];
    const replacement = {
      ...existing,
      primaryColor: "#123456",
    };

    const before = getAllColorSchemes();

    registerColorScheme([replacement], false);

    const result = getAllColorSchemes();

    expect(result).toHaveLength(before.length);
    expect(result[0].primaryColor).toBe(existing.primaryColor);
  });

  it("overrides an existing color scheme when override is true", () => {
    const existing = getAllColorSchemes()[0];
    const replacement = {
      ...existing,
      primaryColor: "#123456",
      secondaryColor: "#654321",
    };

    registerColorScheme([replacement], true);

    const result = getAllColorSchemes();

    expect(result[0]).toEqual(replacement);
  });

  it("warns in development when trying to register a duplicate without override", () => {
    process.env.NODE_ENV = "development";

    const existing = getAllColorSchemes()[0];

    registerColorScheme([existing], false);

    expect(console.warn).toHaveBeenCalledWith(
      `Color scheme "${existing.name}" already exists. Skipping.`,
    );
  });

  it("does not warn outside development when trying to register a duplicate without override", () => {
    process.env.NODE_ENV = "test";

    const existing = getAllColorSchemes()[0];

    registerColorScheme([existing], false);

    expect(console.warn).not.toHaveBeenCalled();
  });

  it("removes a color scheme by name and returns true when found", () => {
    const newScheme = {
      name: "Temp Scheme",
      primaryColor: "#111111",
      secondaryColor: "#222222",
      tertiaryColor: "#333333",
      quaternaryColor: "#444444",
      backgroundColor: "#ffffff",
    };

    registerColorScheme([newScheme]);

    const removed = removeColorScheme("Temp Scheme");
    const result = getAllColorSchemes();

    expect(removed).toBe(true);
    expect(result.find((s) => s.name === "Temp Scheme")).toBeUndefined();
  });

  it("returns false when removing a color scheme that does not exist", () => {
    const removed = removeColorScheme("Does Not Exist");

    expect(removed).toBe(false);
  });

  it("returns a copy of all color schemes", () => {
    const result = getAllColorSchemes();
    const secondResult = getAllColorSchemes();

    expect(result).toEqual(secondResult);
    expect(result).not.toBe(secondResult);
  });

  it("does not mutate the original registry array when the returned copy is changed", () => {
    const result = getAllColorSchemes();
    const originalLength = result.length;

    result.push({
      name: "Fake Added To Copy",
      primaryColor: "#000000",
      secondaryColor: "#111111",
      tertiaryColor: "#222222",
      quaternaryColor: "#333333",
      backgroundColor: "#ffffff",
    });

    expect(result).toHaveLength(originalLength + 1);
    expect(getAllColorSchemes()).toHaveLength(originalLength);
  });
});
