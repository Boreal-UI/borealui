const SAFE_NAVIGATION_SCHEMES = new Set(["http", "https", "mailto", "tel"]);
const URL_SCHEME = /^([a-z][a-z\d+.-]*):/i;

function containsAsciiControlCharacter(value: string): boolean {
  return [...value].some((character) => {
    const code = character.charCodeAt(0);
    return code <= 0x1f || code === 0x7f;
  });
}

export function sanitizeNavigationHref(
  href?: string | null,
): string | undefined {
  if (typeof href !== "string") return undefined;

  const value = href.trim();

  if (
    !value ||
    containsAsciiControlCharacter(value) ||
    value.startsWith("//") ||
    value.startsWith("\\\\")
  ) {
    return undefined;
  }

  const scheme = URL_SCHEME.exec(value)?.[1]?.toLowerCase();
  return scheme && !SAFE_NAVIGATION_SCHEMES.has(scheme) ? undefined : value;
}

export function mergeSafeRel(
  target?: string,
  rel?: string,
): string | undefined {
  const normalizedTarget = target?.toLowerCase();
  const staysInCurrentContext =
    normalizedTarget === "_self" ||
    normalizedTarget === "_parent" ||
    normalizedTarget === "_top";
  const requiresOpenerIsolation = Boolean(target) && !staysInCurrentContext;
  const tokens = (rel ?? "").split(/\s+/).filter(Boolean);
  const uniqueTokens: string[] = [];
  const seen = new Set<string>();

  for (const token of tokens) {
    const normalized = token.toLowerCase();
    if (requiresOpenerIsolation && normalized === "opener") continue;
    if (seen.has(normalized)) continue;
    seen.add(normalized);
    uniqueTokens.push(token);
  }

  if (requiresOpenerIsolation) {
    for (const token of ["noopener", "noreferrer"]) {
      if (!seen.has(token)) uniqueTokens.push(token);
    }
  }

  return uniqueTokens.length > 0 ? uniqueTokens.join(" ") : undefined;
}
