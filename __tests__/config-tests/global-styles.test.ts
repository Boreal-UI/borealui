import { readFileSync } from "fs";
import { resolve } from "path";

describe("global styles", () => {
  it("does not enable smooth root scrolling", () => {
    const css = readFileSync(resolve("src/styles/style.css"), "utf8");

    expect(css).not.toMatch(/scroll-behavior:\s*smooth/);
    expect(css).not.toContain("html:focus-within");
  });
});
