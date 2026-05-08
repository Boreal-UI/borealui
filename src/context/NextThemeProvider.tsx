"use client";

import ThemeProvider from "./ThemeContext";
import { ThemeProviderProps } from "./ThemeContext.types";

export default function NextThemeProvider(props: ThemeProviderProps) {
  return <ThemeProvider {...props} />;
}
