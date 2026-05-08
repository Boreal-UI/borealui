"use client";
import React, {
  createContext,
  useState,
  useEffect,
  useLayoutEffect,
  useMemo,
} from "react";
import { getDefaultColorSchemeName } from "../config/boreal-style-config";
import { ThemeContextType, ThemeProviderProps } from "./ThemeContext.types";
import { defaultColorSchemes } from "../styles/Themes";
import { ColorScheme } from "@/types";

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined,
);

const STORAGE_KEY = "boreal:selectedSchemeName";

function mergeSchemes(
  baseSchemes: ColorScheme[],
  customSchemes: ColorScheme[],
): ColorScheme[] {
  const merged = [...baseSchemes];

  for (const scheme of customSchemes) {
    const index = merged.findIndex((s) => s.name === scheme.name);

    if (index >= 0) {
      merged[index] = scheme;
    } else {
      merged.push(scheme);
    }
  }

  return merged;
}

function shallowEqualByName(a: { name: string }[], b: { name: string }[]) {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i].name !== b[i].name) return false;
  }
  return true;
}

function getSchemeIndexByName(
  schemes: { name: string }[],
  name?: string | null,
): number {
  if (!name) return -1;
  return schemes.findIndex((scheme) => scheme.name === name);
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  customSchemes = [],
  initialSchemeName,
  useOnlyCustomSchemes = false,
}) => {
  const [schemes, setSchemes] = useState<ColorScheme[]>(() => {
    if (useOnlyCustomSchemes) {
      return [...customSchemes];
    }

    return mergeSchemes([...defaultColorSchemes], customSchemes);
  });
  const [selectedScheme, setSelectedScheme] = useState<number>(0);
  const [hasResolvedInitialScheme, setHasResolvedInitialScheme] =
    useState(false);

  const customSchemesKey = useMemo(
    () => JSON.stringify(customSchemes ?? []),
    [customSchemes],
  );

  useEffect(() => {
    let parsedCustomSchemes: ColorScheme[] = [];

    try {
      const parsed = JSON.parse(customSchemesKey);
      if (Array.isArray(parsed)) {
        parsedCustomSchemes = parsed;
      }
    } catch {
      console.error("Failed to parse custom schemes");
    }

    const nextSchemes = useOnlyCustomSchemes
      ? [...parsedCustomSchemes]
      : mergeSchemes([...defaultColorSchemes], parsedCustomSchemes);

    setSchemes((prev) =>
      shallowEqualByName(prev, nextSchemes) ? prev : nextSchemes,
    );

    let nextIndex = 0;
    let savedName: string | null = null;

    if (typeof window !== "undefined") {
      try {
        savedName = localStorage.getItem(STORAGE_KEY);
      } catch {
        console.error("Failed to load saved theme name");
      }
    }

    const savedIndex = getSchemeIndexByName(nextSchemes, savedName);
    const initialIndex = getSchemeIndexByName(nextSchemes, initialSchemeName);
    const defaultIndex = getSchemeIndexByName(
      nextSchemes,
      getDefaultColorSchemeName(),
    );

    if (initialIndex !== -1) {
      nextIndex = initialIndex;
    } else if (savedIndex !== -1) {
      nextIndex = savedIndex;
    } else if (defaultIndex !== -1) {
      nextIndex = defaultIndex;
    } else {
      nextIndex = 0;
    }

    setSelectedScheme(nextIndex);
    setHasResolvedInitialScheme(true);
  }, [customSchemesKey, initialSchemeName, useOnlyCustomSchemes]);

  useLayoutEffect(() => {
    if (!hasResolvedInitialScheme) return;

    const allSchemes = schemes;
    const fallbackIndex = getSchemeIndexByName(
      allSchemes,
      getDefaultColorSchemeName(),
    );

    const safeFallbackIndex = fallbackIndex !== -1 ? fallbackIndex : 0;

    const scheme = allSchemes[selectedScheme] ?? allSchemes[safeFallbackIndex];

    if (!scheme) return;

    const {
      primaryColor,
      secondaryColor,
      tertiaryColor,
      quaternaryColor,
      backgroundColor,
      forceTextColor,
    } = scheme;

    const hexToHSL = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;
      const max = Math.max(r, g, b),
        min = Math.min(r, g, b);
      let h = 0,
        s = 0;
      const l = (max + min) / 2;
      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
          case g:
            h = (b - r) / d + 2;
            break;
          case b:
            h = (r - g) / d + 4;
            break;
        }
        h /= 6;
      }
      return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100),
      };
    };

    const hslToHex = (h: number, s: number, l: number): string => {
      s /= 100;
      l /= 100;
      const k = (n: number) => (n + h / 30) % 12;
      const a = s * Math.min(l, 1 - l);
      const f = (n: number) =>
        Math.round(
          255 *
            (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))),
        );
      return `#${[f(0), f(8), f(4)]
        .map((x) => x.toString(16).padStart(2, "0"))
        .join("")}`;
    };

    const adjustLightness = (hex: string, percent: number): string => {
      const { h, s, l } = hexToHSL(hex);
      return hslToHex(h, s, Math.min(100, Math.max(0, l + percent)));
    };

    const relativeLuminance = (hex: string): number => {
      const rgb = [1, 3, 5].map((i) => {
        const c = parseInt(hex.slice(i, i + 2), 16) / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
    };

    const contrastRatio = (a: string, b: string): number => {
      const lum1 = relativeLuminance(a);
      const lum2 = relativeLuminance(b);
      const lighter = Math.max(lum1, lum2);
      const darker = Math.min(lum1, lum2);
      return (lighter + 0.05) / (darker + 0.05);
    };

    const getAccessibleTextColor = (bg: string): string =>
      contrastRatio(bg, "#000000") >= 4.5 ? "#000000" : "#FFFFFF";

    const getAdaptiveBorderColor = (
      backgroundHex: string,
      amountLight = 14,
      amountDark = 14,
    ): string => {
      const { h, s, l } = hexToHSL(backgroundHex);

      const nextLightness =
        l >= 50 ? Math.max(0, l - amountDark) : Math.min(100, l + amountLight);

      const nextSaturation = s > 8 ? Math.max(0, s - 8) : s;

      return hslToHex(h, nextSaturation, nextLightness);
    };

    const vars = {
      "--primary-color": primaryColor,
      "--primary-color-light": adjustLightness(primaryColor, 10),
      "--primary-color-hover": adjustLightness(primaryColor, -10),
      "--text-color-primary":
        forceTextColor ?? getAccessibleTextColor(primaryColor),
      "--text-color-primary-contrast":
        forceTextColor ?? getAccessibleTextColor(backgroundColor),
      "--text-color": getAccessibleTextColor(backgroundColor),
      "--text-color-light": adjustLightness(
        getAccessibleTextColor(backgroundColor),
        20,
      ),
      "--text-color-lighter": adjustLightness(
        getAccessibleTextColor(backgroundColor),
        40,
      ),
      "--secondary-color": secondaryColor,
      "--secondary-color-light": adjustLightness(secondaryColor, 10),
      "--secondary-color-hover": adjustLightness(secondaryColor, -10),
      "--text-color-secondary": getAccessibleTextColor(secondaryColor),
      "--tertiary-color": tertiaryColor,
      "--tertiary-color-light": adjustLightness(tertiaryColor, 10),
      "--tertiary-color-hover": adjustLightness(tertiaryColor, -10),
      "--text-color-tertiary": getAccessibleTextColor(tertiaryColor),
      "--quaternary-color": quaternaryColor,
      "--quaternary-color-light": adjustLightness(quaternaryColor, 10),
      "--quaternary-color-hover": adjustLightness(quaternaryColor, -10),
      "--text-color-quaternary": getAccessibleTextColor(quaternaryColor),
      "--background-color": backgroundColor,
      "--background-color-dark": adjustLightness(backgroundColor, -10),
      "--background-color-darker": adjustLightness(backgroundColor, -25),
      "--background-color-light": adjustLightness(backgroundColor, 10),
      "--background-color-lighter": adjustLightness(backgroundColor, 20),
      "--link-color": getAccessibleTextColor(backgroundColor),
      "--link-hover-color": adjustLightness(
        getAccessibleTextColor(backgroundColor),
        -20,
      ),
      "--link-hover-color-primary": adjustLightness(primaryColor, -10),
      "--link-hover-color-secondary": adjustLightness(secondaryColor, -10),
      "--link-hover-color-tertiary": adjustLightness(tertiaryColor, -10),
      "--link-hover-color-quaternary": adjustLightness(quaternaryColor, -10),
      "--focus-outline-color": getAccessibleTextColor(backgroundColor),
      "--divider-color": getAdaptiveBorderColor(backgroundColor),
      "--border-color": getAdaptiveBorderColor(backgroundColor),
      "--border-color-subtle": getAdaptiveBorderColor(backgroundColor, 10, 10),
      "--border-color-strong": getAdaptiveBorderColor(backgroundColor, 20, 20),
    } as const;

    const rootStyle = document.documentElement.style;
    for (const [k, v] of Object.entries(vars)) {
      rootStyle.setProperty(k, v);
    }

    try {
      localStorage.setItem(STORAGE_KEY, scheme.name);
    } catch {
      console.error("Failed to save theme name");
    }
  }, [selectedScheme, schemes, hasResolvedInitialScheme]);

  return (
    <ThemeContext.Provider
      value={{ selectedScheme, setSelectedScheme, schemes }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
