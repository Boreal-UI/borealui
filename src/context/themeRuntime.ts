import { getDefaultColorSchemeName } from "../config/boreal-style-config";
import { defaultColorSchemes } from "../styles/Themes";
import { ColorScheme } from "@/types";

export const THEME_STORAGE_KEY = "boreal:selectedSchemeName";
export const THEME_CHANGE_EVENT = "boreal:theme-change";
export const MIN_TEXT_CONTRAST = 4.5;
export const MIN_UI_CONTRAST = 3;

export type ThemeVariableMap = Record<string, string>;

export type ThemeResolutionOptions = {
  customSchemes?: ColorScheme[];
  initialSchemeName?: string;
  savedSchemeName?: string | null;
  useOnlyCustomSchemes?: boolean;
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
  const defaultIndex = getSchemeIndexByName(schemes, getDefaultColorSchemeName());

  if (initialIndex !== -1) return initialIndex;
  if (savedIndex !== -1) return savedIndex;
  if (defaultIndex !== -1) return defaultIndex;
  return 0;
}

export function readSavedSchemeName(storage: Storage | undefined): string | null {
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
      255 *
        (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))),
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
    "--text-color-light": getReadableMutedColor(backgroundColor, pageTextColor),
    "--text-color-lighter": getReadableMutedColor(
      backgroundColor,
      pageTextColor,
    ),
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

export function getThemeInitializationScript({
  customSchemes = [],
  initialSchemeName,
  useOnlyCustomSchemes = false,
}: Omit<ThemeResolutionOptions, "savedSchemeName"> = {}): string {
  const schemes = getAvailableSchemes({ customSchemes, useOnlyCustomSchemes });
  const defaultSchemeName = getDefaultColorSchemeName();

  return `(function(){try{var s=${JSON.stringify(schemes).replace(/</g, "\\u003c")};var k=${JSON.stringify(THEME_STORAGE_KEY)};var initial=${JSON.stringify(initialSchemeName ?? null)};var fallback=${JSON.stringify(defaultSchemeName)};var saved=null;try{saved=localStorage.getItem(k)}catch(e){}var name=initial||saved||fallback;var scheme=s.find(function(x){return x.name===name})||s.find(function(x){return x.name===fallback})||s[0];if(!scheme)return;var d=document.documentElement.style;var hex=function(v){v=String(v||"").trim();var m=/^#([\\da-f])([\\da-f])([\\da-f])$/i.exec(v);if(m)return("#"+m[1]+m[1]+m[2]+m[2]+m[3]+m[3]).toLowerCase();return /^#[\\da-f]{6}([\\da-f]{2})?$/i.test(v)?v.slice(0,7).toLowerCase():"#000000"};var lum=function(v){v=hex(v);var r=[1,3,5].map(function(i){var c=parseInt(v.slice(i,i+2),16)/255;return c<=.03928?c/12.92:Math.pow((c+.055)/1.055,2.4)});return .2126*r[0]+.7152*r[1]+.0722*r[2]};var contrast=function(a,b){var x=lum(a),y=lum(b),l=Math.max(x,y),q=Math.min(x,y);return(l+.05)/(q+.05)};var text=function(bg,preferred,min){min=min||4.5;if(preferred&&contrast(bg,preferred)>=min)return preferred;return contrast(bg,"#000000")>=contrast(bg,"#ffffff")?"#000000":"#ffffff"};var set=function(n,v){d.setProperty(n,v)};var page=text(scheme.backgroundColor,scheme.forceTextColor);set("--primary-color",scheme.primaryColor);set("--secondary-color",scheme.secondaryColor);set("--tertiary-color",scheme.tertiaryColor);set("--quaternary-color",scheme.quaternaryColor);set("--background-color",scheme.backgroundColor);set("--text-color",page);set("--text-color-primary",text(scheme.primaryColor,scheme.forceTextColor));set("--text-color-primary-contrast",page);set("--text-color-secondary",text(scheme.secondaryColor));set("--text-color-tertiary",text(scheme.tertiaryColor));set("--text-color-quaternary",text(scheme.quaternaryColor));set("--link-color",page);set("--focus-outline-color",page);document.documentElement.dataset.borealTheme=scheme.name}catch(e){}})();`;
}
