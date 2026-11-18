"use client";
import { createContext, useContext } from "react";
import type { ThemeHtmlAttributes } from "./themeRuntime";

/** Only resolved Boreal variables cross portal boundaries; arbitrary ancestry does not. */
export const ThemeScopeContext = createContext<ThemeHtmlAttributes | undefined>(undefined);
export const useThemeScope = () => useContext(ThemeScopeContext);
