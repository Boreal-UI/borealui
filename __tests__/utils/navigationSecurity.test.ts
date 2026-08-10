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

  it("preserves caller rel tokens for same-context navigation", () => {
    expect(mergeSafeRel("_self", "external opener")).toBe("external opener");
  });
});
