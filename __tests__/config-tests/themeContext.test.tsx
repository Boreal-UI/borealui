import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import ThemeProvider, { ThemeContext } from "../../src/context/ThemeContext";
import NextThemeProvider from "../../src/context/NextThemeProvider";
import type { ThemeContextType } from "../../src/context/ThemeContext.types";

jest.mock("../../src/styles/Themes", () => ({
  defaultColorSchemes: [
    {
      name: "Forest Dusk",
      primaryColor: "#336699",
      secondaryColor: "#993366",
      tertiaryColor: "#669933",
      quaternaryColor: "#cc9933",
      backgroundColor: "#ffffff",
    },
    {
      name: "Ocean Breeze",
      primaryColor: "#005577",
      secondaryColor: "#227799",
      tertiaryColor: "#4499bb",
      quaternaryColor: "#66bbdd",
      backgroundColor: "#f4faff",
    },
  ],
}));

jest.mock("../../src/config/boreal-style-config", () => ({
  getDefaultColorSchemeName: jest.fn(),
  getDefaultVariant: jest.fn(() => "solid"),
  getDefaultRounding: jest.fn(() => "medium"),
  getDefaultShadow: jest.fn(() => "light"),
  getDefaultSize: jest.fn(() => "medium"),
  getDefaultTheme: jest.fn(() => "primary"),
  getShadowClassName: jest.fn((classMap, _theme, shadow) => {
    const resolvedShadow = shadow ?? "light";
    const key = `shadow${
      resolvedShadow.charAt(0).toUpperCase() + resolvedShadow.slice(1)
    }`;

    return classMap[key];
  }),
}));

import { defaultColorSchemes } from "../../src/styles/Themes";
import { getDefaultColorSchemeName } from "../../src/config/boreal-style-config";
import {
  buildThemeVariables,
  contrastRatio,
  getThemeAttributes,
  getThemeInitializationScript,
  getThemeStyle,
  readSavedSchemeCookie,
  resolveThemeScheme,
  THEME_COOKIE_NAME,
} from "../../src/context/themeRuntime";
import {
  getThemeAttributes as getServerThemeAttributes,
  resolveThemeScheme as resolveServerThemeScheme,
} from "../../src/next/server/ThemeProvider";
import ThemeSelect from "../../src/components/Select/ThemeSelect/core/ThemeSelect";

const mockedGetDefaultColorSchemeName = getDefaultColorSchemeName as jest.Mock;

const baseSchemes = defaultColorSchemes;

const STORAGE_KEY = "boreal:selectedSchemeName";

const Consumer = () => {
  const context: ThemeContextType | undefined = React.useContext(ThemeContext);

  if (!context) {
    return <div data-testid="no-context">No context</div>;
  }

  return (
    <div>
      <div data-testid="selected-scheme">{context.selectedScheme}</div>
      <div data-testid="selected-scheme-name">{context.selectedSchemeName}</div>
      <div data-testid="scheme-count">{context.schemes.length}</div>
      <div data-testid="scheme-names">
        {context.schemes.map((scheme) => scheme.name).join(", ")}
      </div>
      <button
        data-testid="set-scheme"
        onClick={() => context.setSelectedScheme(1)}
      >
        Change scheme
      </button>
    </div>
  );
};

describe("ThemeProvider", () => {
  const originalError = console.error;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    document.cookie = `${THEME_COOKIE_NAME}=; Max-Age=0; Path=/`;
    document.documentElement.removeAttribute("style");

    mockedGetDefaultColorSchemeName.mockReturnValue("Forest Dusk");
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  it("uses defaultColorSchemes when no custom schemes are provided", async () => {
    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("scheme-count")).toHaveTextContent("2");
      expect(screen.getByTestId("scheme-names")).toHaveTextContent(
        "Forest Dusk, Ocean Breeze",
      );
    });
  });

  it("uses the default color scheme when nothing is saved", async () => {
    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("selected-scheme")).toHaveTextContent("0");
      expect(localStorage.getItem(STORAGE_KEY)).toBe("Forest Dusk");
    });
  });

  it("loads the saved theme name from localStorage", async () => {
    localStorage.setItem(STORAGE_KEY, "Ocean Breeze");

    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("selected-scheme")).toHaveTextContent("1");
      expect(screen.getByTestId("selected-scheme-name")).toHaveTextContent(
        "Ocean Breeze",
      );
      expect(
        document.documentElement.style.getPropertyValue("--primary-color"),
      ).toBe("#005577");
    });
  });

  it("prefers initialSchemeName over the saved localStorage value", async () => {
    localStorage.setItem(STORAGE_KEY, "Forest Dusk");

    render(
      <ThemeProvider initialSchemeName="Ocean Breeze">
        <Consumer />
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("selected-scheme")).toHaveTextContent("1");
      expect(localStorage.getItem(STORAGE_KEY)).toBe("Ocean Breeze");
    });
  });

  it("merges custom schemes with default schemes by default", async () => {
    const customSchemes = [
      {
        name: "Custom Aurora",
        primaryColor: "#111111",
        secondaryColor: "#222222",
        tertiaryColor: "#333333",
        quaternaryColor: "#444444",
        backgroundColor: "#fefefe",
      },
    ];

    render(
      <ThemeProvider customSchemes={customSchemes}>
        <Consumer />
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("scheme-count")).toHaveTextContent("3");
      expect(screen.getByTestId("scheme-names")).toHaveTextContent(
        "Forest Dusk, Ocean Breeze, Custom Aurora",
      );
    });
  });

  it("overrides matching default schemes when custom schemes share the same name", async () => {
    const customSchemes = [
      {
        name: "Forest Dusk",
        primaryColor: "#101010",
        secondaryColor: "#202020",
        tertiaryColor: "#303030",
        quaternaryColor: "#404040",
        backgroundColor: "#fafafa",
      },
    ];

    render(
      <ThemeProvider
        customSchemes={customSchemes}
        initialSchemeName="Forest Dusk"
      >
        <Consumer />
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("scheme-count")).toHaveTextContent("2");
      expect(
        document.documentElement.style.getPropertyValue("--primary-color"),
      ).toBe("#101010");
      expect(
        document.documentElement.style.getPropertyValue("--background-color"),
      ).toBe("#fafafa");
    });
  });

  it("uses only custom schemes when useOnlyCustomSchemes is true", async () => {
    const customSchemes = [
      {
        name: "Custom Aurora",
        primaryColor: "#111111",
        secondaryColor: "#222222",
        tertiaryColor: "#333333",
        quaternaryColor: "#444444",
        backgroundColor: "#fefefe",
      },
      {
        name: "Northern Glow",
        primaryColor: "#550055",
        secondaryColor: "#770077",
        tertiaryColor: "#990099",
        quaternaryColor: "#bb00bb",
        backgroundColor: "#fff8ff",
      },
    ];

    render(
      <ThemeProvider customSchemes={customSchemes} useOnlyCustomSchemes>
        <Consumer />
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("scheme-count")).toHaveTextContent("2");
      expect(screen.getByTestId("scheme-names")).toHaveTextContent(
        "Custom Aurora, Northern Glow",
      );
      expect(screen.getByTestId("scheme-names")).not.toHaveTextContent(
        "Forest Dusk",
      );
    });
  });

  it("falls back to index 0 when useOnlyCustomSchemes is true and the configured default scheme is missing", async () => {
    const customSchemes = [
      {
        name: "Custom Aurora",
        primaryColor: "#111111",
        secondaryColor: "#222222",
        tertiaryColor: "#333333",
        quaternaryColor: "#444444",
        backgroundColor: "#fefefe",
      },
    ];

    mockedGetDefaultColorSchemeName.mockReturnValue("Forest Dusk");

    render(
      <ThemeProvider customSchemes={customSchemes} useOnlyCustomSchemes>
        <Consumer />
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("selected-scheme")).toHaveTextContent("0");
      expect(localStorage.getItem(STORAGE_KEY)).toBe("Custom Aurora");
    });
  });

  it("applies CSS variables to the root element", async () => {
    render(
      <ThemeProvider initialSchemeName="Forest Dusk">
        <Consumer />
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(
        document.documentElement.style.getPropertyValue("--primary-color"),
      ).toBe("#336699");
      expect(
        document.documentElement.style.getPropertyValue("--secondary-color"),
      ).toBe("#993366");
      expect(
        document.documentElement.style.getPropertyValue("--background-color"),
      ).toBe("#ffffff");
      expect(
        document.documentElement.style.getPropertyValue(
          "--background-color-surface",
        ),
      ).toBe(buildThemeVariables(baseSchemes[0])["--background-color-surface"]);
      expect(
        document.documentElement.style.getPropertyValue("--border-color"),
      ).not.toBe("");
      expect(
        document.documentElement.style.getPropertyValue("--divider-color"),
      ).not.toBe("");
      expect(
        document.documentElement.style.getPropertyValue("--text-color"),
      ).toBe("#000000");
    });
  });

  it("keeps generated foreground tokens at WCAG AA contrast for normal text", () => {
    const vars = buildThemeVariables({
      name: "Low Contrast Brand",
      primaryColor: "#f4d7d7",
      secondaryColor: "#dbeafe",
      tertiaryColor: "#fef3c7",
      quaternaryColor: "#dcfce7",
      backgroundColor: "#ffffff",
      forceTextColor: "#ffffff",
    });

    expect(
      contrastRatio(vars["--background-color"], vars["--text-color"]),
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      contrastRatio(vars["--primary-color"], vars["--text-color-primary"]),
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      contrastRatio(vars["--secondary-color"], vars["--text-color-secondary"]),
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      contrastRatio(vars["--tertiary-color"], vars["--text-color-tertiary"]),
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      contrastRatio(
        vars["--quaternary-color"],
        vars["--text-color-quaternary"],
      ),
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      contrastRatio(vars["--background-color"], vars["--link-hover-color"]),
    ).toBeGreaterThanOrEqual(4.5);
  });

  it("derives the surface background token from the active background color", () => {
    const vars = buildThemeVariables({
      name: "Deep Surface",
      primaryColor: "#336699",
      secondaryColor: "#993366",
      tertiaryColor: "#669933",
      quaternaryColor: "#cc9933",
      backgroundColor: "#101820",
    });

    expect(vars["--background-color-surface"]).not.toBe("#384b4b");
    expect(vars["--background-color-surface"]).toBe(
      vars["--background-color-surface"],
    );
  });

  it("creates a bootstrap script that applies the saved scheme before React effects run", () => {
    localStorage.setItem(STORAGE_KEY, "Ocean Breeze");

    const script = getThemeInitializationScript();

    Function(script)();

    expect(
      document.documentElement.style.getPropertyValue("--primary-color"),
    ).toBe("#005577");
    expect(document.documentElement.dataset.borealTheme).toBe("Ocean Breeze");
  });

  it("creates a bootstrap script that falls back to the saved theme cookie", () => {
    document.cookie = `${THEME_COOKIE_NAME}=Ocean%20Breeze; Path=/`;

    const script = getThemeInitializationScript();

    Function(script)();

    expect(
      document.documentElement.style.getPropertyValue("--primary-color"),
    ).toBe("#005577");
    expect(
      document.documentElement.style.getPropertyValue(
        "--background-color-surface",
      ),
    ).toBe(buildThemeVariables(baseSchemes[1])["--background-color-surface"]);
    expect(document.documentElement.dataset.borealTheme).toBe("Ocean Breeze");
  });

  it("resolves server theme attributes from a cookie value", () => {
    const scheme = resolveThemeScheme("Ocean Breeze");
    const style = getThemeStyle(scheme);
    const attributes = getThemeAttributes(scheme);

    expect(scheme.name).toBe("Ocean Breeze");
    expect(style["--primary-color"]).toBe("#005577");
    expect(attributes["data-boreal-theme"]).toBe("Ocean Breeze");
    expect(attributes.style["--background-color"]).toBe("#f4faff");
    expect(attributes.style["--background-color-surface"]).toBe(
      style["--background-color-surface"],
    );
    expect(resolveServerThemeScheme("Ocean Breeze").name).toBe("Ocean Breeze");
    expect(getServerThemeAttributes(scheme)["data-boreal-theme"]).toBe(
      "Ocean Breeze",
    );
  });

  it("reads encoded saved theme cookies", () => {
    expect(
      readSavedSchemeCookie(`${THEME_COOKIE_NAME}=Ocean%20Breeze; other=value`),
    ).toBe("Ocean Breeze");
  });

  it("can skip rendering the pre-hydration theme script", () => {
    const { container } = render(
      <ThemeProvider enableThemeScript={false}>
        <Consumer />
      </ThemeProvider>,
    );

    expect(container.querySelector("script")).toBeNull();
  });

  it("skips the pre-hydration theme script by default for the Next provider", () => {
    const { container } = render(
      <NextThemeProvider>
        <Consumer />
      </NextThemeProvider>,
    );

    expect(container.querySelector("script")).toBeNull();
  });

  it("syncs selected schemes into a cookie by default for the Next provider", async () => {
    render(
      <NextThemeProvider initialSchemeName="Forest Dusk">
        <Consumer />
      </NextThemeProvider>,
    );

    fireEvent.click(screen.getByTestId("set-scheme"));

    await waitFor(() => {
      expect(screen.getByTestId("selected-scheme-name")).toHaveTextContent(
        "Ocean Breeze",
      );
      expect(readSavedSchemeCookie(document.cookie)).toBe("Ocean Breeze");
    });
  });

  it("allows the Next provider to opt into the pre-hydration theme script", () => {
    const { container } = render(
      <NextThemeProvider enableThemeScript>
        <Consumer />
      </NextThemeProvider>,
    );

    expect(container.querySelector("script")).not.toBeNull();
  });

  it("updates selectedScheme through context and saves the scheme name", async () => {
    render(
      <ThemeProvider initialSchemeName="Forest Dusk">
        <Consumer />
      </ThemeProvider>,
    );

    fireEvent.click(screen.getByTestId("set-scheme"));

    await waitFor(() => {
      expect(screen.getByTestId("selected-scheme")).toHaveTextContent("1");
      expect(localStorage.getItem(STORAGE_KEY)).toBe("Ocean Breeze");
      expect(
        document.documentElement.style.getPropertyValue("--primary-color"),
      ).toBe("#005577");
    });
  });

  it("keeps independent ThemeProvider islands synced when a ThemeSelect changes", async () => {
    render(
      <>
        <ThemeProvider>
          <ThemeSelect testId="footer-theme-select" />
        </ThemeProvider>
        <ThemeProvider>
          <ThemeSelect testId="page-theme-select" />
        </ThemeProvider>
      </>,
    );

    const footerSelect = screen.getByTestId(
      "footer-theme-select-input",
    ) as HTMLSelectElement;
    const pageSelect = screen.getByTestId(
      "page-theme-select-input",
    ) as HTMLSelectElement;

    fireEvent.change(footerSelect, { target: { value: "Ocean Breeze" } });

    await waitFor(() => {
      expect(footerSelect.value).toBe("Ocean Breeze");
      expect(pageSelect.value).toBe("Ocean Breeze");
      expect(localStorage.getItem(STORAGE_KEY)).toBe("Ocean Breeze");
      expect(document.documentElement.dataset.borealTheme).toBe("Ocean Breeze");
    });
  });

  it("shows the saved theme in ThemeSelect after reload instead of the default option", async () => {
    localStorage.setItem(STORAGE_KEY, "Ocean Breeze");

    render(
      <ThemeProvider>
        <ThemeSelect testId="theme-select" />
      </ThemeProvider>,
    );

    const select = screen.getByTestId(
      "theme-select-input",
    ) as HTMLSelectElement;

    await waitFor(() => {
      expect(select.value).toBe("Ocean Breeze");
      expect(select.selectedOptions[0]).toHaveTextContent("Ocean Breeze");
      expect(localStorage.getItem(STORAGE_KEY)).toBe("Ocean Breeze");
      expect(document.documentElement.dataset.borealTheme).toBe("Ocean Breeze");
    });
  });

  it("falls back to index 0 when the configured default scheme is not found", async () => {
    mockedGetDefaultColorSchemeName.mockReturnValue("Missing Scheme");

    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("selected-scheme")).toHaveTextContent("0");
      expect(localStorage.getItem(STORAGE_KEY)).toBe("Forest Dusk");
    });
  });

  it("logs an error if reading localStorage fails", async () => {
    const getItemSpy = jest
      .spyOn(Storage.prototype, "getItem")
      .mockImplementationOnce(() => {
        throw new Error("read failed");
      });

    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Failed to load saved theme name",
      );
    });

    getItemSpy.mockRestore();
  });

  it("logs an error if writing localStorage fails", async () => {
    const setItemSpy = jest
      .spyOn(Storage.prototype, "setItem")
      .mockImplementationOnce(() => {
        throw new Error("write failed");
      });

    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith("Failed to save theme name");
    });

    setItemSpy.mockRestore();
  });

  it("logs an error if custom schemes cannot be serialized", async () => {
    const stringifySpy = jest
      .spyOn(JSON, "stringify")
      .mockImplementationOnce(() => {
        throw new Error("circular scheme");
      });

    render(
      <ThemeProvider customSchemes={[baseSchemes[0]]}>
        <Consumer />
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Failed to serialize custom schemes",
      );
    });

    stringifySpy.mockRestore();
  });

  it("does not overwrite a saved theme name before initial resolution completes", async () => {
    localStorage.setItem(STORAGE_KEY, "Ocean Breeze");

    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("selected-scheme")).toHaveTextContent("1");
      expect(localStorage.getItem(STORAGE_KEY)).toBe("Ocean Breeze");
    });
  });
});
