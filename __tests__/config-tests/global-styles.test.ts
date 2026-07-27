import { readFileSync } from "fs";
import { resolve } from "path";

describe("global styles", () => {
  it("leaves root scrolling automatic for framework route restoration", () => {
    const css = readFileSync(resolve("src/styles/style.css"), "utf8");
    const finalRootScrollRule = css.lastIndexOf("html:focus-within");

    expect(finalRootScrollRule).toBeGreaterThan(-1);
    expect(css.slice(finalRootScrollRule)).toMatch(
      /html:focus-within\s*\{\s*scroll-behavior:\s*auto;/,
    );
  });
});
