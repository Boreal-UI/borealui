/**
 * ---------------------------------------------------------------------
 * ThemeContext.types.ts
 * ---------------------------------------------------------------------
 * Type definitions for the ThemeProvider and ThemeContext used
 * in the Boreal UI theming system.
 */

import { ColorScheme } from "../types/types";
import { ReactNode } from "react";

/**
 * Props for the `<ThemeProvider>` component.
 *
 * @property {ReactNode} children - The wrapped application or subtree.
 * @property {ColorScheme[]} [customSchemes] - Optional array of custom color schemes
 *                                             to be registered at runtime.
 * @property {string} [initialSchemeName] - Optional name of the color scheme to be selected on initial load. If not provided, the provider will
 *                                          attempt to use the saved scheme from localStorage or the default scheme.
 * @property {boolean} [useOnlyCustomSchemes] - Optional flag to indicate if only custom schemes should be used, ignoring default schemes.
 * @property {boolean} [enableThemeScript] - Optional flag to render the pre-hydration script that applies theme variables before React effects run.
 *                                           Defaults to true for core and false for Next.
 *
 * @example
 * <ThemeProvider customSchemes={[customTheme]}>
 *   <App />
 * </ThemeProvider>
 */
export interface ThemeProviderProps {
  children: ReactNode;
  customSchemes?: ColorScheme[];
  enableThemeScript?: boolean;
  initialSchemeName?: string;
  useOnlyCustomSchemes?: boolean;
}

/**
 * Context value provided by the ThemeProvider.
 *
 * @property {number} selectedScheme - Index of the currently active color scheme.
 * @property {string} selectedSchemeName - Name of the currently active color scheme.
 * @property {ColorScheme[]} schemes - Array of available color schemes.
 * @property {Dispatch<SetStateAction<number>>} setSelectedScheme - Function to update the selected scheme index.
 * @property {Dispatch<SetStateAction<string>>} setSelectedSchemeName - Function to update the selected scheme name.
 *
 * @example
 * const { selectedSchemeName, setSelectedSchemeName } = useContext(ThemeContext);
 */
export interface ThemeContextType {
  selectedScheme: number;
  selectedSchemeName: string;
  schemes: ColorScheme[];
  setSelectedScheme: React.Dispatch<React.SetStateAction<number>>;
  setSelectedSchemeName: React.Dispatch<React.SetStateAction<string>>;
}
