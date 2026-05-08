/**
 * ---------------------------------------------------------------------
 * boreal-style-config.ts
 * ---------------------------------------------------------------------
 * Provides global configuration for default Boreal UI styles.
 *
 * Allows applications to override default values for:
 * - Theme type (e.g., primary, secondary)
 * - Component rounding
 * - Shadow intensity
 * - Default border width
 * - Default size
 * - Default color scheme name
 *
 * These defaults are used when components are rendered without
 * explicit props or style overrides.
 *
 * Usage:
 * ```ts
 * setBorealStyleConfig({
 *   defaultTheme: "secondary",
 *   defaultRounding: "large",
 *   defaultShadow: "strong",
 *   defaultBorderWidth: "sm",
 *   defaultSize: "large",
 *   defaultColorSchemeName: "Ocean Breeze",
 * });
 * ```
 *
 * Accessor functions ensure safe fallback to internal defaults.
 */

import {
  BorderType,
  RoundingType,
  ShadowType,
  SizeType,
  ThemeType,
} from "../types/types";
import { resolveThemeAlias } from "../utils/propAliases";

/**
 * Type for configuring global Boreal UI style defaults.
 */
export type BorealStyleConfig = {
  defaultTheme: ThemeType;
  defaultRounding: RoundingType;
  defaultShadow: ShadowType;
  defaultSize: SizeType;
  defaultBorderWidth: BorderType;
  defaultColorSchemeName: string;
};

const fallback: BorealStyleConfig = {
  defaultTheme: "primary",
  defaultRounding: "medium",
  defaultShadow: "light",
  defaultSize: "medium",
  defaultBorderWidth: "none",
  defaultColorSchemeName: "Forest Dusk",
};

let userConfig: Partial<BorealStyleConfig> = {};

/**
 * Overrides the default Boreal UI styling configuration.
 *
 * @param {Partial<BorealStyleConfig>} config - A partial configuration object with any default values to override.
 */
export const setBorealStyleConfig = (config: Partial<BorealStyleConfig>) => {
  userConfig = config;
};

/**
 * Gets the default theme type (e.g., "primary", "secondary").
 */
export const getDefaultTheme = (): ThemeType =>
  resolveThemeAlias(userConfig.defaultTheme ?? fallback.defaultTheme);

/**
 * Gets the default component rounding type (e.g., "medium", "large").
 */
export const getDefaultRounding = (): RoundingType =>
  userConfig.defaultRounding ?? fallback.defaultRounding;

/**
 * Gets the default shadow depth (e.g., "light", "strong").
 */
export const getDefaultShadow = (): ShadowType =>
  userConfig.defaultShadow ?? fallback.defaultShadow;

/**
 * Gets the default component size (e.g., "small", "medium", "large").
 */
export const getDefaultSize = (): SizeType =>
  userConfig.defaultSize ?? fallback.defaultSize;

/**
 * Gets the default color scheme name (e.g., "Forest Dusk").
 */

export const getDefaultColorSchemeName = (): string =>
  userConfig.defaultColorSchemeName ?? fallback.defaultColorSchemeName;

/**
 * Gets the default border width (e.g., "none", "sm", "md", "lg").
 */
export const getDefaultBorder = (): BorderType =>
  userConfig.defaultBorderWidth ?? fallback.defaultBorderWidth;
