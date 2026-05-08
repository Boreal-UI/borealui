import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import ThemeProvider, { ThemeContext } from "../../src/context/ThemeContext";
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
}));

import { defaultColorSchemes } from "../../src/styles/Themes";
import { getDefaultColorSchemeName } from "../../src/config/boreal-style-config";

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
        document.documentElement.style.getPropertyValue("--border-color"),
      ).not.toBe("");
      expect(
        document.documentElement.style.getPropertyValue("--divider-color"),
      ).not.toBe("");
    });
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

  it("logs an error if custom schemes cannot be parsed", async () => {
    const stringifySpy = jest
      .spyOn(JSON, "stringify")
      .mockReturnValueOnce("not-json");
    const parseSpy = jest.spyOn(JSON, "parse").mockImplementationOnce(() => {
      throw new Error("bad json");
    });

    render(
      <ThemeProvider customSchemes={[baseSchemes[0]]}>
        <Consumer />
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Failed to parse custom schemes",
      );
    });

    stringifySpy.mockRestore();
    parseSpy.mockRestore();
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
