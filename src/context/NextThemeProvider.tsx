"use client";

import ThemeProvider from "./ThemeContext";
import { ThemeProviderProps } from "./ThemeContext.types";

export default function NextThemeProvider({
  syncThemeCookie = true,
  ...props
}: ThemeProviderProps) {
  return (
    <ThemeProvider
      enableThemeScript={false}
      syncThemeCookie={syncThemeCookie}
      {...props}
    />
  );
}
