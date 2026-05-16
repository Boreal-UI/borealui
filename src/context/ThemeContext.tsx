"use client";
import React, {
  createContext,
  useState,
  useEffect,
  useInsertionEffect,
  useMemo,
  useCallback,
  useLayoutEffect,
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

const useBrowserLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

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

  const [hasResolvedInitialScheme, setHasResolvedInitialScheme] =
    useState(false);

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

  const resolveSelectedSchemeName = useCallback(
    (savedSchemeName?: string | null) => {
      const nextIndex = resolveSchemeIndex(schemes, {
        initialSchemeName,
        savedSchemeName,
      });

      return schemes[nextIndex]?.name ?? schemes[0]?.name ?? "";
    },
    [initialSchemeName, schemes],
  );

  const [selectedSchemeName, setSelectedSchemeNameState] = useState<string>(
    () => {
      const savedSchemeName =
        typeof window === "undefined"
          ? null
          : readSavedSchemeName(window.localStorage);

      return resolveSelectedSchemeName(savedSchemeName);
    },
  );

  const selectedScheme = useMemo(() => {
    const index = getSchemeIndexByName(schemes, selectedSchemeName);
    return index === -1 ? 0 : index;
  }, [schemes, selectedSchemeName]);

  const setSelectedSchemeName = useCallback<
    ThemeContextType["setSelectedSchemeName"]
  >(
    (value) => {
      setSelectedSchemeNameState((currentName) => {
        const nextName =
          typeof value === "function" ? value(currentName) : value;

        return getSchemeIndexByName(schemes, nextName) === -1
          ? currentName
          : nextName;
      });
    },
    [schemes],
  );

  const setSelectedScheme = useCallback<ThemeContextType["setSelectedScheme"]>(
    (value) => {
      setSelectedSchemeNameState((currentName) => {
        const currentIndex = getSchemeIndexByName(schemes, currentName);
        const nextIndex =
          typeof value === "function"
            ? value(currentIndex === -1 ? 0 : currentIndex)
            : value;

        return schemes[nextIndex]?.name ?? currentName;
      });
    },
    [schemes],
  );

  useBrowserLayoutEffect(() => {
    const savedSchemeName =
      typeof window === "undefined"
        ? null
        : readSavedSchemeName(window.localStorage);

    const savedIndex = getSchemeIndexByName(schemes, savedSchemeName);
    const nextSchemeName = resolveSelectedSchemeName(savedSchemeName);

    setSelectedSchemeNameState((currentName) => {
      if (initialSchemeName) return nextSchemeName;
      if (savedIndex !== -1) return savedSchemeName as string;

      if (getSchemeIndexByName(schemes, currentName) !== -1) {
        return currentName;
      }

      return nextSchemeName;
    });

    setHasResolvedInitialScheme(true);
  }, [initialSchemeName, resolveSelectedSchemeName, schemes]);

  useInsertionEffect(() => {
    const scheme = schemes[selectedScheme] ?? schemes[0];

    if (!scheme || typeof document === "undefined") return;

    applyThemeScheme(scheme, document);
  }, [selectedScheme, schemes]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const syncSchemeName = (schemeName?: string | null) => {
      if (getSchemeIndexByName(schemes, schemeName) === -1) return;
      setSelectedSchemeNameState((current) =>
        current === schemeName ? current : (schemeName as string),
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

    if (!initialSchemeName) {
      syncSchemeName(readSavedSchemeName(window.localStorage));
    }

    return () => {
      window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [initialSchemeName, schemes]);

  useEffect(() => {
    if (!hasResolvedInitialScheme) return;

    const scheme = schemes[selectedScheme] ?? schemes[0];

    if (!scheme) return;

    const didSave = writeSavedSchemeName(
      typeof window === "undefined" ? undefined : window.localStorage,
      scheme.name,
    );

    if (didSave) {
      dispatchThemeChange(scheme.name);
    }
  }, [hasResolvedInitialScheme, selectedScheme, schemes]);

  return (
    <ThemeContext.Provider
      value={{
        selectedScheme,
        selectedSchemeName,
        setSelectedScheme,
        setSelectedSchemeName,
        schemes,
      }}
    >
      {enableThemeScript ? (
        <script suppressHydrationWarning>
          {getThemeInitializationScript({
            customSchemes: parsedCustomSchemes,
            initialSchemeName,
            useOnlyCustomSchemes,
          })}
        </script>
      ) : null}
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
export { getThemeInitializationScript } from "./themeRuntime";
