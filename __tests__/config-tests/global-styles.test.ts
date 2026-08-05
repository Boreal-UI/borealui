import { readFileSync } from "fs";
import { resolve } from "path";

describe("global styles", () => {
  it("does not enable smooth root scrolling", () => {
    const css = readFileSync(resolve("src/styles/style.css"), "utf8");

    expect(css).not.toMatch(/scroll-behavior:\s*smooth/);
    expect(css).not.toContain("html:focus-within");
  });

  it("uses the theme placeholder token for native form placeholders", () => {
    const css = readFileSync(resolve("src/styles/style.css"), "utf8");

    expect(css).toMatch(
      /--text-color-placeholder:\s*var\(--text-color\)/,
    );
    expect(css).toMatch(
      /input::placeholder,\s*textarea::placeholder\s*{[\s\S]*?color:\s*var\(--text-color-placeholder\)/,
    );
  });
});
