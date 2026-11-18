import React from "react";
import { renderToString } from "react-dom/server";
import MultiSelectBase from "@/components/MultiSelect/MultiSelectBase";

describe("MultiSelect SSR", () => {
  it("renders without browser globals and produces unique generated IDs", () => {
    const html = renderToString(
      <>
        <MultiSelectBase
          aria-label="First picker"
          options={[{ value: "first", label: "First" }]}
          classMap={{}}
        />
        <MultiSelectBase
          aria-label="Second picker"
          options={[{ value: "second", label: "Second" }]}
          classMap={{}}
        />
      </>,
    );
    const ids = Array.from(
      html.matchAll(/ id="([^"]+)"/g),
      (match) => match[1],
    );

    expect(ids.filter(id => !id.endsWith("-displayed-value"))).toHaveLength(2);
    expect(new Set(ids).size).toBe(ids.length);
    expect(html).not.toContain("aria-controls=");
    expect(html.match(/aria-expanded="false"/g)).toHaveLength(2);
  });
});
