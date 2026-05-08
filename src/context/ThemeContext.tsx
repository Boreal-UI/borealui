"use client";
import React, {
  createContext,
  useState,
  useEffect,
  useInsertionEffect,
  useMemo,
} from "react";
import { ThemeContextType, ThemeProviderProps } from "./ThemeContext.types";
import {
  applyThemeScheme,
  getAvailableSchemes,
  getThemeInitializationScript,
  readSavedSchemeName,
  resolveSchemeIndex,
  writeSavedSchemeName,
} from "./themeRuntime";

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined,
);

const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  customSchemes = [],
  initialSchemeName,
  useOnlyCustomSchemes = false,
}) => {
  const customSchemesKey = useMemo(
    () => JSON.stringify(customSchemes ?? []),
    [customSchemes],
  );

  const parsedCustomSchemes = useMemo(() => {
    try {
      const parsed: unknown = JSON.parse(customSchemesKey);
      if (Array.isArray(parsed)) {
        return parsed as typeof customSchemes;
      }
    } catch {
      console.error("Failed to parse custom schemes");
    }

    return [];
  }, [customSchemesKey]);

  const schemes = useMemo(
    () =>
      getAvailableSchemes({
        customSchemes: parsedCustomSchemes,
        useOnlyCustomSchemes,
      }),
    [parsedCustomSchemes, useOnlyCustomSchemes],
  );

  const [selectedScheme, setSelectedScheme] = useState<number>(() =>
    resolveSchemeIndex(schemes, {
      initialSchemeName,
      savedSchemeName:
        typeof window === "undefined"
          ? null
          : readSavedSchemeName(window.localStorage),
    }),
  );

  useEffect(() => {
    const nextIndex = resolveSchemeIndex(schemes, {
      initialSchemeName,
      savedSchemeName:
        typeof window === "undefined"
          ? null
          : readSavedSchemeName(window.localStorage),
    });

    setSelectedScheme((current) => {
      if (initialSchemeName) return nextIndex;
      if (schemes[current]) return current;
      return nextIndex;
    });
  }, [schemes, initialSchemeName]);

  useInsertionEffect(() => {
    const scheme = schemes[selectedScheme] ?? schemes[0];

    if (!scheme || typeof document === "undefined") return;

    applyThemeScheme(scheme, document);
  }, [selectedScheme, schemes]);

  useEffect(() => {
    const scheme = schemes[selectedScheme] ?? schemes[0];

    if (!scheme) return;

    writeSavedSchemeName(
      typeof window === "undefined" ? undefined : window.localStorage,
      scheme.name,
    );
  }, [selectedScheme, schemes]);

  return (
    <ThemeContext.Provider
      value={{
        selectedScheme,
        setSelectedScheme,
        schemes,
      }}
    >
      <script
        dangerouslySetInnerHTML={{
          __html: getThemeInitializationScript({
            customSchemes: parsedCustomSchemes,
            initialSchemeName,
            useOnlyCustomSchemes,
          }),
        }}
        suppressHydrationWarning
      />
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
export { getThemeInitializationScript } from "./themeRuntime";
