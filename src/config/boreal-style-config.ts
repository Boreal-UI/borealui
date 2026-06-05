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
 * - Glass and outline variants
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
 *   defaultGlass: true,
 *   defaultOutline: true,
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
import { capitalize } from "../utils/capitalize";
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
  defaultGlass: boolean;
  defaultOutline: boolean;
  defaultColorSchemeName: string;
};

const fallback: BorealStyleConfig = {
  defaultTheme: "primary",
  defaultRounding: "medium",
  defaultShadow: "light",
  defaultSize: "medium",
  defaultBorderWidth: "none",
  defaultGlass: false,
  defaultOutline: false,
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
 * Alias for a concise app-level setup API.
 */
export const borealConfig = setBorealStyleConfig;

/**
 * Alias matching the package-level Boreal config naming.
 */
export const setBorealConfig = setBorealStyleConfig;

/**
 * Gets the complete effective Boreal UI styling configuration.
 */
export const getBorealStyleConfig = (): BorealStyleConfig => ({
  ...fallback,
  ...userConfig,
  defaultTheme: getDefaultTheme(),
});

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
 * Resolves the class for component shadows while keeping the clear theme layout-first.
 *
 * Clear-themed components omit the configured default shadow, but still honor an
 * explicit shadow prop from consumers.
 */
export const getShadowClassName = (
  classMap: Record<string, string>,
  theme: ThemeType,
  shadow?: ShadowType,
): string | undefined => {
  const resolvedShadow =
    shadow ?? (theme === "clear" ? undefined : getDefaultShadow());

  return resolvedShadow
    ? classMap[`shadow${capitalize(resolvedShadow)}`]
    : undefined;
};

/**
 * Gets the default component size (e.g., "small", "medium", "large").
 */
export const getDefaultSize = (): SizeType =>
  userConfig.defaultSize ?? fallback.defaultSize;

/**
 * Gets whether glass styling should be enabled by default.
 */
export const getDefaultGlass = (): boolean =>
  userConfig.defaultGlass ?? fallback.defaultGlass;

/**
 * Gets whether outline styling should be enabled by default.
 */
export const getDefaultOutline = (): boolean =>
  userConfig.defaultOutline ?? fallback.defaultOutline;

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
