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
 *
 * @example
 * <ThemeProvider customSchemes={[customTheme]}>
 *   <App />
 * </ThemeProvider>
 */
export interface ThemeProviderProps {
  children: ReactNode;
  customSchemes?: ColorScheme[];
  initialSchemeName?: string;
  useOnlyCustomSchemes?: boolean;
}

/**
 * Context value provided by the ThemeProvider.
 *
 * @property {number} selectedScheme - Index of the currently active color scheme.
 * @property {ColorScheme[]} schemes - Array of available color schemes.
 * @property {Dispatch<SetStateAction<number>>} setSelectedScheme - Function to update the selected scheme index.
 *
 * @example
 * const { selectedScheme, setSelectedScheme } = useContext(ThemeContext);
 */
export interface ThemeContextType {
  selectedScheme: number;
  schemes: ColorScheme[];
  setSelectedScheme: React.Dispatch<React.SetStateAction<number>>;
}
