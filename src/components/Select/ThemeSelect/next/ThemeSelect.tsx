"use client";

import {
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  forwardRef,
} from "react";
import { Select } from "@/index.next";
import { ThemeContext } from "../../../../context/ThemeContext";
import { readSavedSchemeName } from "../../../../context/themeRuntime";
import {
  getDefaultRounding,
  getDefaultShadow,
  getDefaultTheme,
} from "@/config/boreal-style-config";
import { ThemeSelectProps } from "../../Select.types";

const useBrowserLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

const UserThemeSettings = forwardRef<HTMLSelectElement, ThemeSelectProps>(
  (
    {
      theme = getDefaultTheme(),
      glass,
      shadow = getDefaultShadow(),
      rounding = getDefaultRounding(),
      state = "",
      "data-testid": dataTestId,
      testId = dataTestId ?? "theme-select",
      "aria-label": ariaLabel = "Select Theme",
      "aria-description": ariaDescription,
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": ariaDescribedBy,
      "aria-invalid": ariaInvalid,
      "aria-required": ariaRequired,
      disabled,
      label,
      labelPosition,
      name,
      id,
    },
    ref,
  ) => {
    const ctx = useContext(ThemeContext);
    if (!ctx)
      throw new Error("ThemeContext is undefined. Wrap with ThemeProvider.");

    const { selectedSchemeName, setSelectedSchemeName, schemes } = ctx;

    const options = useMemo(
      () =>
        schemes.map((scheme) => ({
          value: scheme.name,
          label: scheme.name,
        })),
      [schemes],
    );

    useBrowserLayoutEffect(() => {
      const savedSchemeName = readSavedSchemeName(window.localStorage);

      if (
        savedSchemeName &&
        savedSchemeName !== selectedSchemeName &&
        schemes.some((scheme) => scheme.name === savedSchemeName)
      ) {
        setSelectedSchemeName(savedSchemeName);
      }
    }, [schemes, selectedSchemeName, setSelectedSchemeName]);

    const handleChange = (value: string | number) => {
      const nextSchemeName = String(value);

      if (!schemes.some((scheme) => scheme.name === nextSchemeName)) return;

      setSelectedSchemeName(nextSchemeName);
    };

    return (
      <div className={`control-container`}>
        <Select
          ref={ref}
          theme={theme}
          glass={glass}
          state={state}
          shadow={shadow}
          rounding={rounding}
          options={options}
          data-testid={testId}
          value={selectedSchemeName}
          aria-label={ariaLabel}
          aria-description={ariaDescription}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          aria-invalid={ariaInvalid}
          aria-required={ariaRequired}
          disabled={disabled}
          label={label}
          labelPosition={labelPosition}
          name={name}
          id={id}
          onChange={handleChange}
        />
      </div>
    );
  },
);
UserThemeSettings.displayName = "UserThemeSettings";
export default UserThemeSettings;
