"use client";

import { useContext, useMemo, forwardRef } from "react";
import { Select } from "@/index.next";
import { ThemeContext } from "../../../../context/ThemeContext";
import {
  getDefaultRounding,
  getDefaultShadow,
  getDefaultTheme,
} from "@/config/boreal-style-config";
import { ThemeSelectProps } from "../../Select.types";

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
      name,
      id,
    },
    ref,
  ) => {
    const ctx = useContext(ThemeContext);
    if (!ctx)
      throw new Error("ThemeContext is undefined. Wrap with ThemeProvider.");

    const { selectedScheme, setSelectedScheme, schemes } = ctx;

    const options = useMemo(
      () =>
        schemes.map((scheme, index) => ({
          value: String(index),
          label: scheme.name,
        })),
      [schemes],
    );

    const handleChange = (value: string | number) => {
      const nextIndex = Number.parseInt(String(value), 10);

      if (!Number.isInteger(nextIndex) || !schemes[nextIndex]) return;

      setSelectedScheme(nextIndex);
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
          value={String(selectedScheme)}
          aria-label={ariaLabel}
          aria-description={ariaDescription}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          aria-invalid={ariaInvalid}
          aria-required={ariaRequired}
          disabled={disabled}
          label={label}
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
