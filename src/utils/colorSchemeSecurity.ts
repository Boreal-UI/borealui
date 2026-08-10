import type { ColorScheme } from "@/types";

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

  return scheme;
}

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
