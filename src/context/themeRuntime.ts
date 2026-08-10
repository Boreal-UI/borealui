import { getDefaultColorSchemeName } from "../config/boreal-style-config";
import { defaultColorSchemes } from "../styles/Themes";
import { ColorScheme } from "@/types";
import type { CSSProperties } from "react";

export const THEME_STORAGE_KEY = "boreal:selectedSchemeName";
export const THEME_COOKIE_NAME = "boreal-theme";
export const THEME_CHANGE_EVENT = "boreal:theme-change";
export const MIN_TEXT_CONTRAST = 4.5;
export const MIN_UI_CONTRAST = 3;

export type ThemeVariableMap = Record<string, string>;
export type ThemeStyle = CSSProperties & ThemeVariableMap;
export type ThemeHtmlAttributes = {
  "data-boreal-theme": string;
  style: ThemeStyle;
};

export type ThemeResolutionOptions = {
  customSchemes?: ColorScheme[];
  initialSchemeName?: string;
  savedSchemeName?: string | null;
  themeCookieName?: string;
  useOnlyCustomSchemes?: boolean;
};

export type ThemeCookieOptions = {
  cookieName?: string;
  maxAge?: number;
  path?: string;
  sameSite?: "Strict" | "Lax" | "None";
  secure?: boolean;
};

export type ServerThemeResolutionOptions = Pick<
  ThemeResolutionOptions,
  "customSchemes" | "useOnlyCustomSchemes"
> & {
  fallbackSchemeName?: string;
};

export function mergeSchemes(
  baseSchemes: ColorScheme[],
  customSchemes: ColorScheme[] = [],
): ColorScheme[] {
  const merged = [...baseSchemes];

  for (const scheme of customSchemes) {
    const index = merged.findIndex((s) => s.name === scheme.name);

    if (index >= 0) {
      merged[index] = scheme;
    } else {
      merged.push(scheme);
    }
  }

  return merged;
}

export function getSchemeIndexByName(
  schemes: { name: string }[],
  name?: string | null,
): number {
  if (!name) return -1;
  return schemes.findIndex((scheme) => scheme.name === name);
}

export function getAvailableSchemes({
  customSchemes = [],
  useOnlyCustomSchemes = false,
}: Pick<
  ThemeResolutionOptions,
  "customSchemes" | "useOnlyCustomSchemes"
>): ColorScheme[] {
  return useOnlyCustomSchemes
    ? [...customSchemes]
    : mergeSchemes([...defaultColorSchemes], customSchemes);
}

export function resolveSchemeIndex(
  schemes: { name: string }[],
  {
    initialSchemeName,
    savedSchemeName,
  }: Pick<ThemeResolutionOptions, "initialSchemeName" | "savedSchemeName">,
): number {
  const initialIndex = getSchemeIndexByName(schemes, initialSchemeName);
  const savedIndex = getSchemeIndexByName(schemes, savedSchemeName);
  const defaultIndex = getSchemeIndexByName(
    schemes,
    getDefaultColorSchemeName(),
  );

  if (initialIndex !== -1) return initialIndex;
  if (savedIndex !== -1) return savedIndex;
  if (defaultIndex !== -1) return defaultIndex;
  return 0;
}

export function readSavedSchemeName(
  storage: Storage | undefined,
): string | null {
  if (!storage) return null;

  try {
    return storage.getItem(THEME_STORAGE_KEY);
  } catch {
    console.error("Failed to load saved theme name");
    return null;
  }
}

export function writeSavedSchemeName(
  storage: Storage | undefined,
  schemeName: string,
): boolean {
  if (!storage) return false;

  try {
    if (storage.getItem(THEME_STORAGE_KEY) === schemeName) {
      return false;
    }

    storage.setItem(THEME_STORAGE_KEY, schemeName);
    return true;
  } catch {
    console.error("Failed to save theme name");
    return false;
  }
}

export function readSavedSchemeCookie(
  cookieSource?: string | null,
  cookieName = THEME_COOKIE_NAME,
): string | null {
  if (!cookieSource) return null;

  const encodedName = `${encodeURIComponent(cookieName)}=`;
  const cookie = cookieSource
    .split(";")
    .map((value) => value.trim())
    .find((value) => value.startsWith(encodedName));

  if (!cookie) return null;

  try {
    return decodeURIComponent(cookie.slice(encodedName.length));
  } catch {
    return cookie.slice(encodedName.length);
  }
}

export function writeSavedSchemeCookie(
  documentRef: Document | undefined,
  schemeName: string,
  {
    cookieName = THEME_COOKIE_NAME,
    maxAge = 60 * 60 * 24 * 365,
    path = "/",
    sameSite = "Lax",
    secure = false,
  }: ThemeCookieOptions = {},
): boolean {
  if (!documentRef) return false;

  const currentSchemeName = readSavedSchemeCookie(
    documentRef.cookie,
    cookieName,
  );

  if (currentSchemeName === schemeName) return false;

  const parts = [
    `${encodeURIComponent(cookieName)}=${encodeURIComponent(schemeName)}`,
    `Max-Age=${maxAge}`,
    `Path=${path}`,
    `SameSite=${sameSite}`,
  ];

  if (secure) parts.push("Secure");

  documentRef.cookie = parts.join("; ");
  return true;
}

export function dispatchThemeChange(
  schemeName: string,
  windowRef: Window | undefined = typeof window === "undefined"
    ? undefined
    : window,
) {
  if (!windowRef) return;

  windowRef.dispatchEvent(
    new CustomEvent(THEME_CHANGE_EVENT, {
      detail: { schemeName },
    }),
  );
}

function normalizeHex(hex: string): string | null {
  const trimmed = hex.trim();
  const expanded = /^#([\da-f])([\da-f])([\da-f])$/i.exec(trimmed);

  if (expanded) {
    return `#${expanded[1]}${expanded[1]}${expanded[2]}${expanded[2]}${expanded[3]}${expanded[3]}`.toLowerCase();
  }

  const full = /^#[\da-f]{6}([\da-f]{2})?$/i.exec(trimmed);
  return full ? trimmed.slice(0, 7).toLowerCase() : null;
}

function hexToHSL(hex: string) {
  const normalized = normalizeHex(hex) ?? "#000000";
  const r = parseInt(normalized.slice(1, 3), 16) / 255;
  const g = parseInt(normalized.slice(3, 5), 16) / 255;
  const b = parseInt(normalized.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    Math.round(
      255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))),
    );

  return `#${[f(0), f(8), f(4)]
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("")}`;
}

function adjustLightness(hex: string, percent: number): string {
  const { h, s, l } = hexToHSL(hex);
  return hslToHex(h, s, Math.min(100, Math.max(0, l + percent)));
}

export function relativeLuminance(hex: string): number {
  const normalized = normalizeHex(hex) ?? "#000000";
  const rgb = [1, 3, 5].map((i) => {
    const c = parseInt(normalized.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

export function contrastRatio(a: string, b: string): number {
  const lum1 = relativeLuminance(a);
  const lum2 = relativeLuminance(b);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

function getReadableColor(
  background: string,
  preferred?: string,
  minimum = MIN_TEXT_CONTRAST,
): string {
  if (preferred && contrastRatio(background, preferred) >= minimum) {
    return preferred;
  }

  const blackContrast = contrastRatio(background, "#000000");
  const whiteContrast = contrastRatio(background, "#ffffff");

  return blackContrast >= whiteContrast ? "#000000" : "#ffffff";
}

function getReadableVariantColor(
  background: string,
  textColor: string,
  amount: number,
): string {
  const candidate = adjustLightness(textColor, amount);

  if (contrastRatio(background, candidate) >= MIN_TEXT_CONTRAST) {
    return candidate;
  }

  return textColor;
}

function getReadableMutedColor(background: string, textColor: string): string {
  const direction = textColor === "#000000" ? 1 : -1;

  for (let amount = 30; amount >= 0; amount -= 5) {
    const candidate = adjustLightness(textColor, amount * direction);

    if (contrastRatio(background, candidate) >= MIN_TEXT_CONTRAST) {
      return candidate;
    }
  }

  return textColor;
}

function getAccessibleInteractiveColor(
  background: string,
  textColor: string,
  amount: number,
): string {
  const base = adjustLightness(background, amount);

  if (contrastRatio(base, textColor) >= MIN_TEXT_CONTRAST) {
    return base;
  }

  const { h, s, l } = hexToHSL(background);
  const shouldDarken = textColor === "#ffffff";

  for (let step = 4; step <= 48; step += 4) {
    const nextLightness = shouldDarken
      ? Math.max(0, l - step)
      : Math.min(100, l + step);
    const candidate = hslToHex(h, s, nextLightness);

    if (contrastRatio(candidate, textColor) >= MIN_TEXT_CONTRAST) {
      return candidate;
    }
  }

  return background;
}

function getAdaptiveBorderColor(
  backgroundHex: string,
  amountLight = 14,
  amountDark = 14,
): string {
  const { h, s, l } = hexToHSL(backgroundHex);
  const nextLightness =
    l >= 50 ? Math.max(0, l - amountDark) : Math.min(100, l + amountLight);
  const nextSaturation = s > 8 ? Math.max(0, s - 8) : s;
  const candidate = hslToHex(h, nextSaturation, nextLightness);

  if (contrastRatio(backgroundHex, candidate) >= MIN_UI_CONTRAST) {
    return candidate;
  }

  return getReadableColor(backgroundHex, undefined, MIN_UI_CONTRAST);
}

export function buildThemeVariables(scheme: ColorScheme): ThemeVariableMap {
  const {
    primaryColor,
    secondaryColor,
    tertiaryColor,
    quaternaryColor,
    backgroundColor,
    forceTextColor,
  } = scheme;
  const pageTextColor = getReadableColor(backgroundColor, forceTextColor);
  const mutedTextColor = getReadableMutedColor(backgroundColor, pageTextColor);
  const primaryTextColor = getReadableColor(primaryColor, forceTextColor);
  const secondaryTextColor = getReadableColor(secondaryColor);
  const tertiaryTextColor = getReadableColor(tertiaryColor);
  const quaternaryTextColor = getReadableColor(quaternaryColor);

  return {
    "--primary-color": primaryColor,
    "--primary-color-light": adjustLightness(primaryColor, 10),
    "--primary-color-hover": getAccessibleInteractiveColor(
      primaryColor,
      primaryTextColor,
      -10,
    ),
    "--text-color-primary": primaryTextColor,
    "--text-color-primary-contrast": pageTextColor,
    "--text-color": pageTextColor,
    "--text-color-light": mutedTextColor,
    "--text-color-lighter": mutedTextColor,
    "--text-color-placeholder": mutedTextColor,
    "--secondary-color": secondaryColor,
    "--secondary-color-light": adjustLightness(secondaryColor, 10),
    "--secondary-color-hover": getAccessibleInteractiveColor(
      secondaryColor,
      secondaryTextColor,
      -10,
    ),
    "--text-color-secondary": secondaryTextColor,
    "--tertiary-color": tertiaryColor,
    "--tertiary-color-light": adjustLightness(tertiaryColor, 10),
    "--tertiary-color-hover": getAccessibleInteractiveColor(
      tertiaryColor,
      tertiaryTextColor,
      -10,
    ),
    "--text-color-tertiary": tertiaryTextColor,
    "--quaternary-color": quaternaryColor,
    "--quaternary-color-light": adjustLightness(quaternaryColor, 10),
    "--quaternary-color-hover": getAccessibleInteractiveColor(
      quaternaryColor,
      quaternaryTextColor,
      -10,
    ),
    "--text-color-quaternary": quaternaryTextColor,
    "--background-color": backgroundColor,
    "--background-color-surface": adjustLightness(backgroundColor, 5),
    "--background-color-dark": adjustLightness(backgroundColor, -10),
    "--background-color-darker": adjustLightness(backgroundColor, -25),
    "--background-color-light": adjustLightness(backgroundColor, 10),
    "--background-color-lighter": adjustLightness(backgroundColor, 20),
    "--link-color": pageTextColor,
    "--link-hover-color": getReadableVariantColor(
      backgroundColor,
      pageTextColor,
      pageTextColor === "#ffffff" ? -20 : 20,
    ),
    "--link-hover-color-primary": getAccessibleInteractiveColor(
      primaryColor,
      primaryTextColor,
      -10,
    ),
    "--link-hover-color-secondary": getAccessibleInteractiveColor(
      secondaryColor,
      secondaryTextColor,
      -10,
    ),
    "--link-hover-color-tertiary": getAccessibleInteractiveColor(
      tertiaryColor,
      tertiaryTextColor,
      -10,
    ),
    "--link-hover-color-quaternary": getAccessibleInteractiveColor(
      quaternaryColor,
      quaternaryTextColor,
      -10,
    ),
    "--success-text-color": pageTextColor,
    "--warning-text-color": pageTextColor,
    "--error-text-color": pageTextColor,
    "--focus-outline-color": pageTextColor,
    "--divider-color": getAdaptiveBorderColor(backgroundColor),
    "--border-color": getAdaptiveBorderColor(backgroundColor),
    "--border-color-subtle": getAdaptiveBorderColor(backgroundColor, 10, 10),
    "--border-color-strong": getAdaptiveBorderColor(backgroundColor, 20, 20),
  };
}

export function applyThemeVariables(
  targetStyle: CSSStyleDeclaration,
  vars: ThemeVariableMap,
) {
  for (const [key, value] of Object.entries(vars)) {
    targetStyle.setProperty(key, value);
  }
}

export function applyThemeScheme(scheme: ColorScheme, documentRef = document) {
  applyThemeVariables(
    documentRef.documentElement.style,
    buildThemeVariables(scheme),
  );
  documentRef.documentElement.dataset.borealTheme = scheme.name;
}

export function resolveThemeScheme(
  schemeName?: string | null,
  {
    customSchemes = [],
    fallbackSchemeName,
    useOnlyCustomSchemes = false,
  }: ServerThemeResolutionOptions = {},
): ColorScheme {
  const schemes = getAvailableSchemes({ customSchemes, useOnlyCustomSchemes });
  const resolvedScheme =
    schemes.find((scheme) => scheme.name === schemeName) ??
    schemes.find((scheme) => scheme.name === fallbackSchemeName) ??
    schemes.find((scheme) => scheme.name === getDefaultColorSchemeName()) ??
    schemes[0];

  if (!resolvedScheme) {
    throw new Error(
      "No Boreal color schemes are available. Provide at least one custom scheme.",
    );
  }

  return resolvedScheme;
}

export function getThemeStyle(scheme: ColorScheme): ThemeStyle {
  return buildThemeVariables(scheme) as ThemeStyle;
}

export function getThemeAttributes(scheme: ColorScheme): ThemeHtmlAttributes {
  return {
    "data-boreal-theme": scheme.name,
    style: getThemeStyle(scheme),
  };
}

export function getThemeInitializationScript({
  customSchemes = [],
  initialSchemeName,
  themeCookieName = THEME_COOKIE_NAME,
  useOnlyCustomSchemes = false,
}: Omit<ThemeResolutionOptions, "savedSchemeName"> = {}): string {
  const schemes = getAvailableSchemes({ customSchemes, useOnlyCustomSchemes });
  const defaultSchemeName = getDefaultColorSchemeName();
  const schemesWithVariables = schemes.map((scheme) => ({
    name: scheme.name,
    variables: buildThemeVariables(scheme),
  }));

  return `(function(){try{var s=${JSON.stringify(schemesWithVariables).replace(/</g, "\\u003c")};var k=${JSON.stringify(THEME_STORAGE_KEY)};var ck=${JSON.stringify(themeCookieName)};var initial=${JSON.stringify(initialSchemeName ?? null)};var fallback=${JSON.stringify(defaultSchemeName)};var saved=null;try{saved=localStorage.getItem(k)}catch(e){}var cv=null;try{var n=encodeURIComponent(ck)+"=";var c=(document.cookie||"").split(";").map(function(x){return x.trim()}).find(function(x){return x.indexOf(n)===0});if(c)cv=decodeURIComponent(c.slice(n.length))}catch(e){}var name=initial||saved||cv||fallback;var scheme=s.find(function(x){return x.name===name})||s.find(function(x){return x.name===fallback})||s[0];if(!scheme)return;var d=document.documentElement.style;Object.keys(scheme.variables).forEach(function(key){d.setProperty(key,scheme.variables[key])});document.documentElement.dataset.borealTheme=scheme.name}catch(e){}})();`;
}
