import type { ColorScheme, SemanticThemeToken } from "@/types";

const HEX_COLOR = /^#(?:[\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i;
const REQUIRED_COLOR_FIELDS = [
  "primaryColor",
  "secondaryColor",
  "tertiaryColor",
  "quaternaryColor",
  "backgroundColor",
] as const;

export function assertSafeColorScheme(scheme: ColorScheme): ColorScheme {
  for (const field of REQUIRED_COLOR_FIELDS) {
    assertHexColor(scheme, field, scheme[field]);
  }

  if (scheme.forceTextColor !== undefined) {
    assertHexColor(scheme, "forceTextColor", scheme.forceTextColor);
  }
  for (const [token, value] of Object.entries(scheme.semanticTokens ?? {})) {
    if (!SEMANTIC_THEME_TOKENS.some((known) => known === token)) throw new TypeError(`Unknown semantic token: ${token}`);
    assertHexColor(scheme, token, value);
    if (!/^#(?:[\da-f]{3}|[\da-f]{6})$/i.test(value.trim())) {
      throw new TypeError(`Semantic token ${token} must be an opaque hexadecimal color.`);
    }
  }

  return scheme;
}

export const SEMANTIC_THEME_TOKENS = [
  "--background-color", "--background-color-surface", "--background-color-subtle",
  "--text-color", "--text-color-light", "--border-color", "--border-color-strong",
  "--focus-outline-color", "--hover-background", "--active-background",
  "--selected-background", "--selected-text-color", "--disabled-background", "--disabled-text-color",
] as const satisfies readonly SemanticThemeToken[];

function assertHexColor(
  scheme: ColorScheme,
  field: string,
  value: unknown,
): asserts value is string {
  if (typeof value !== "string" || !HEX_COLOR.test(value.trim())) {
    throw new TypeError(
      `ColorScheme "${scheme.name}" ${field} must be a hexadecimal color.`,
    );
  }
}
