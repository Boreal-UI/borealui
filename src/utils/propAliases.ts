type ClassMap = Record<string, string>;

const expandedClassMapCache = new WeakMap<ClassMap, ClassMap>();

const propAliases: Record<string, string> = {
  p: "primary",
  s: "secondary",
  t: "tertiary",
  q: "quaternary",
  c: "clear",

  sm: "small",
  md: "medium",
  lg: "large",

  lt: "light",
  str: "strong",
  xl: "intense",

  h: "horizontal",
  v: "vertical",

  tl: "topLeft",
  tc: "topCenter",
  tr: "topRight",
  bl: "bottomLeft",
  bc: "bottomCenter",
  br: "bottomRight",

  st: "static",
  fx: "fixed",
  sk: "sticky",
};

const runtimeAliases: Record<string, string> = {
  h: "horizontal",
  v: "vertical",
  t: "top",
  b: "bottom",
  l: "left",
  r: "right",
  tl: "topLeft",
  tc: "topCenter",
  tr: "topRight",
  bl: "bottomLeft",
  bc: "bottomCenter",
  br: "bottomRight",
  st: "static",
  fx: "fixed",
  sk: "sticky",
};

const themeAliases: Record<string, string> = {
  p: "primary",
  s: "secondary",
  t: "tertiary",
  q: "quaternary",
  c: "clear",
};

const prefixedAliases: Array<[string, string, string]> = [
  ["shadowSm", "shadowSmall", "shadowLight"],
  ["shadowMd", "shadowMedium", "shadowMedium"],
  ["shadowLg", "shadowLarge", "shadowStrong"],
  ["shadowXl", "shadowXl", "shadowIntense"],
  ["shadowLt", "shadowLight", "shadowLight"],
  ["shadowStr", "shadowStrong", "shadowStrong"],
  ["roundSm", "roundSmall", "roundSmall"],
  ["roundMd", "roundMedium", "roundMedium"],
  ["roundLg", "roundLarge", "roundLarge"],
  ["borderSm", "borderSmall", "borderSmall"],
  ["borderMd", "borderMedium", "borderMedium"],
  ["borderLg", "borderLarge", "borderLarge"],
  ["labelT", "labelTop", "labelTop"],
  ["labelB", "labelBottom", "labelBottom"],
  ["labelL", "labelLeft", "labelLeft"],
  ["labelR", "labelRight", "labelRight"],
  ["attachmentSt", "attachmentStatic", "attachmentStatic"],
  ["attachmentFx", "attachmentFixed", "attachmentFixed"],
  ["attachmentSk", "attachmentSticky", "attachmentSticky"],
];

const resolveClass = (classMap: ClassMap, ...keys: string[]) => {
  for (const key of keys) {
    if (classMap[key]) return classMap[key];
  }

  return undefined;
};

export function resolvePropAlias<T extends string>(value: T): T;
export function resolvePropAlias<T extends string>(
  value: T | undefined,
): T | undefined;
export function resolvePropAlias<T extends string>(
  value: T | undefined,
): T | undefined {
  if (!value) return value;

  return (runtimeAliases[value] ?? value) as T;
}

export function resolveThemeAlias<T extends string>(value: T): T;
export function resolveThemeAlias<T extends string>(
  value: T | undefined,
): T | undefined;
export function resolveThemeAlias<T extends string>(
  value: T | undefined,
): T | undefined {
  if (!value) return value;

  return (themeAliases[value] ?? value) as T;
}

export const expandClassMap = <T extends ClassMap>(classMap: T): T => {
  const cached = expandedClassMapCache.get(classMap);
  if (cached) return cached as T;

  const expanded: ClassMap = { ...classMap };

  for (const [alias, canonical] of Object.entries(propAliases)) {
    const resolved = resolveClass(classMap, canonical, alias);
    if (resolved) expanded[alias] = resolved;
  }

  for (const [aliasKey, canonicalKey, fallbackKey] of prefixedAliases) {
    const resolved = resolveClass(
      classMap,
      canonicalKey,
      fallbackKey,
      aliasKey,
    );
    if (resolved) expanded[aliasKey] = resolved;
  }

  expandedClassMapCache.set(classMap, expanded);

  return expanded as T;
};
