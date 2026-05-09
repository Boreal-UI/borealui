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
      shadow = getDefaultShadow(),
      rounding = getDefaultRounding(),
      state = "",
      "data-testid": dataTestId,
      testId = dataTestId ?? "theme-select",
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

    return (
      <div className={`control-container`}>
        <Select
          ref={ref}
          theme={theme}
          state={state}
          shadow={shadow}
          rounding={rounding}
          options={options}
          data-testid={testId}
          value={String(selectedScheme)}
          aria-label="Select Theme"
          onChange={(value: string | number) =>
            setSelectedScheme(parseInt(String(value), 10))
          }
        />
      </div>
    );
  },
);
UserThemeSettings.displayName = "UserThemeSettings";
export default UserThemeSettings;
