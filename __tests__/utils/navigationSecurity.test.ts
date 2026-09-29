import {
  mergeSafeRel,
  sanitizeNavigationHref,
} from "@/utils/navigationSecurity";

describe("navigation security", () => {
  it.each([
    "javascript:alert(1)",
    "data:text/html,<script>alert(1)</script>",
    "vbscript:msgbox(1)",
    "https:\n//example.com",
    "//example.com/path",
  ])("rejects unsafe navigation href %s", (href) => {
    expect(sanitizeNavigationHref(href)).toBeUndefined();
  });

  it.each([
    ["/settings", "/settings"],
    ["../account", "../account"],
    ["#profile", "#profile"],
    ["https://example.com", "https://example.com"],
    ["mailto:team@example.com", "mailto:team@example.com"],
    ["tel:+15551234567", "tel:+15551234567"],
  ])("preserves supported navigation href %s", (href, expected) => {
    expect(sanitizeNavigationHref(href)).toBe(expected);
  });

  it("removes opener and enforces safe rel tokens for blank targets", () => {
    expect(mergeSafeRel("_BLANK", "external opener NOOPENER")).toBe(
      "external NOOPENER noreferrer",
    );
  });

  it.each([
    ["_blank", undefined, "noopener noreferrer"],
    ["_BLANK", "opener", "noopener noreferrer"],
    ["docs-window", undefined, "noopener noreferrer"],
    ["docs-window", "opener", "noopener noreferrer"],
    ["preview", "nofollow", "nofollow noopener noreferrer"],
    ["preview", "nofollow opener", "nofollow noopener noreferrer"],
    ["external", "opener sponsored ugc", "sponsored ugc noopener noreferrer"],
    ["external", "noreferrer opener nofollow noopener", "noreferrer nofollow noopener"],
  ])(
    "enforces opener isolation for target %s with rel %s",
    (target, rel, expected) => {
      expect(mergeSafeRel(target, rel)).toBe(expected);
    },
  );

  it.each(["_self", "_SELF", "_parent", "_PARENT", "_top", "_TOP"])(
    "preserves caller rel tokens for same-context target %s",
    (target) => {
      expect(mergeSafeRel(target, "external opener")).toBe("external opener");
    },
  );

  it("does not change rel semantics when no target is present", () => {
    expect(mergeSafeRel(undefined, "opener nofollow")).toBe("opener nofollow");
    expect(mergeSafeRel("", "opener nofollow")).toBe("opener nofollow");
  });
});
