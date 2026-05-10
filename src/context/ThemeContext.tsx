"use client";
import React, {
  createContext,
  useState,
  useEffect,
  useInsertionEffect,
  useMemo,
  useRef,
} from "react";
import { ThemeContextType, ThemeProviderProps } from "./ThemeContext.types";
import {
  applyThemeScheme,
  dispatchThemeChange,
  getAvailableSchemes,
  getSchemeIndexByName,
  getThemeInitializationScript,
  readSavedSchemeName,
  resolveSchemeIndex,
  THEME_CHANGE_EVENT,
  THEME_STORAGE_KEY,
  writeSavedSchemeName,
} from "./themeRuntime";

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined,
);

const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  customSchemes = [],
  enableThemeScript = true,
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
  const hasCheckedInitialStorageRef = useRef(false);

  useEffect(() => {
    const savedSchemeName =
      typeof window === "undefined"
        ? null
        : readSavedSchemeName(window.localStorage);
    const savedIndex = getSchemeIndexByName(schemes, savedSchemeName);
    const nextIndex = resolveSchemeIndex(schemes, {
      initialSchemeName,
      savedSchemeName,
    });

    setSelectedScheme((current) => {
      if (initialSchemeName) return nextIndex;
      if (savedIndex !== -1) return savedIndex;
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
    if (typeof window === "undefined") return;

    const syncSchemeName = (schemeName?: string | null) => {
      const nextIndex = getSchemeIndexByName(schemes, schemeName);

      if (nextIndex === -1) return;

      setSelectedScheme((current) =>
        current === nextIndex ? current : nextIndex,
      );
    };

    const handleThemeChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ schemeName?: string }>;
      syncSchemeName(customEvent.detail?.schemeName);
    };

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key !== THEME_STORAGE_KEY) return;
      syncSchemeName(event.newValue);
    };

    window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);
    window.addEventListener("storage", handleStorageChange);
    syncSchemeName(readSavedSchemeName(window.localStorage));

    return () => {
      window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [schemes]);

  useEffect(() => {
    const scheme = schemes[selectedScheme] ?? schemes[0];

    if (!scheme) return;

    const storage =
      typeof window === "undefined" ? undefined : window.localStorage;
    const savedSchemeName = readSavedSchemeName(storage);
    const savedIndex = getSchemeIndexByName(schemes, savedSchemeName);

    if (
      !hasCheckedInitialStorageRef.current &&
      !initialSchemeName &&
      savedIndex !== -1 &&
      savedIndex !== selectedScheme
    ) {
      hasCheckedInitialStorageRef.current = true;
      setSelectedScheme(savedIndex);
      return;
    }

    hasCheckedInitialStorageRef.current = true;

    const didSave = writeSavedSchemeName(storage, scheme.name);

    if (didSave) {
      dispatchThemeChange(scheme.name);
    }
  }, [initialSchemeName, selectedScheme, schemes]);

  return (
    <ThemeContext.Provider
      value={{
        selectedScheme,
        setSelectedScheme,
        schemes,
      }}
    >
      {enableThemeScript ? (
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
      ) : null}
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
export { getThemeInitializationScript } from "./themeRuntime";
