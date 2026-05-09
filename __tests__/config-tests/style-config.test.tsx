import {
  borealConfig,
  getBorealStyleConfig,
  getDefaultBorder,
  getDefaultColorSchemeName,
  getDefaultGlass,
  getDefaultOutline,
  getDefaultRounding,
  getDefaultShadow,
  getDefaultSize,
  getDefaultTheme,
  setBorealStyleConfig,
} from "../../src/config/boreal-style-config";

describe("boreal-style-config", () => {
  beforeEach(() => {
    setBorealStyleConfig({});
  });

  afterEach(() => {
    setBorealStyleConfig({});
  });

  it("returns fallback defaults when no user config is set", () => {
    expect(getDefaultTheme()).toBe("primary");
    expect(getDefaultRounding()).toBe("medium");
    expect(getDefaultShadow()).toBe("light");
    expect(getDefaultSize()).toBe("medium");
    expect(getDefaultBorder()).toBe("none");
    expect(getDefaultGlass()).toBe(false);
    expect(getDefaultOutline()).toBe(false);
    expect(getDefaultColorSchemeName()).toBe("Forest Dusk");
  });

  it("overrides all defaults when full config is provided", () => {
    setBorealStyleConfig({
      defaultTheme: "secondary",
      defaultRounding: "large",
      defaultShadow: "strong",
      defaultSize: "large",
      defaultBorderWidth: "small",
      defaultGlass: true,
      defaultOutline: true,
      defaultColorSchemeName: "Ocean Breeze",
    });

    expect(getDefaultTheme()).toBe("secondary");
    expect(getDefaultRounding()).toBe("large");
    expect(getDefaultShadow()).toBe("strong");
    expect(getDefaultSize()).toBe("large");
    expect(getDefaultBorder()).toBe("small");
    expect(getDefaultGlass()).toBe(true);
    expect(getDefaultOutline()).toBe(true);
    expect(getDefaultColorSchemeName()).toBe("Ocean Breeze");
  });

  it("falls back for values not included in partial config", () => {
    setBorealStyleConfig({
      defaultTheme: "tertiary",
      defaultSize: "small",
    });

    expect(getDefaultTheme()).toBe("tertiary");
    expect(getDefaultSize()).toBe("small");

    expect(getDefaultRounding()).toBe("medium");
    expect(getDefaultShadow()).toBe("light");
    expect(getDefaultBorder()).toBe("none");
    expect(getDefaultGlass()).toBe(false);
    expect(getDefaultOutline()).toBe(false);
    expect(getDefaultColorSchemeName()).toBe("Forest Dusk");
  });

  it("replaces the previous config when called again", () => {
    setBorealStyleConfig({
      defaultTheme: "secondary",
      defaultShadow: "intense",
      defaultBorderWidth: "large",
    });

    expect(getDefaultTheme()).toBe("secondary");
    expect(getDefaultShadow()).toBe("intense");
    expect(getDefaultBorder()).toBe("large");

    setBorealStyleConfig({
      defaultRounding: "full",
    });

    expect(getDefaultRounding()).toBe("full");

    // Previous values should no longer persist because config is replaced
    expect(getDefaultTheme()).toBe("primary");
    expect(getDefaultShadow()).toBe("light");
    expect(getDefaultBorder()).toBe("none");
    expect(getDefaultGlass()).toBe(false);
    expect(getDefaultOutline()).toBe(false);
  });

  it("resets back to fallback defaults when an empty config is set", () => {
    setBorealStyleConfig({
      defaultTheme: "quaternary",
      defaultRounding: "small",
      defaultShadow: "medium",
      defaultSize: "xl",
      defaultBorderWidth: "medium",
      defaultGlass: true,
      defaultOutline: true,
      defaultColorSchemeName: "Sunny Day",
    });

    setBorealStyleConfig({});

    expect(getDefaultTheme()).toBe("primary");
    expect(getDefaultRounding()).toBe("medium");
    expect(getDefaultShadow()).toBe("light");
    expect(getDefaultSize()).toBe("medium");
    expect(getDefaultBorder()).toBe("none");
    expect(getDefaultGlass()).toBe(false);
    expect(getDefaultOutline()).toBe(false);
    expect(getDefaultColorSchemeName()).toBe("Forest Dusk");
  });

  it("supports the concise borealConfig alias and exposes effective config", () => {
    borealConfig({
      defaultTheme: "s",
      defaultRounding: "lg",
      defaultShadow: "xl",
      defaultSize: "sm",
      defaultBorderWidth: "md",
      defaultGlass: true,
      defaultOutline: true,
      defaultColorSchemeName: "Custom Scheme",
    });

    expect(getBorealStyleConfig()).toEqual({
      defaultTheme: "secondary",
      defaultRounding: "lg",
      defaultShadow: "xl",
      defaultSize: "sm",
      defaultBorderWidth: "md",
      defaultGlass: true,
      defaultOutline: true,
      defaultColorSchemeName: "Custom Scheme",
    });
  });
});
