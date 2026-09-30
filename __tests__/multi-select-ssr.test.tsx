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
    const controls = Array.from(
      html.matchAll(/aria-controls="([^"]+)"/g),
      (match) => match[1],
    );

    expect(controls).toHaveLength(2);
    expect(new Set(controls).size).toBe(2);
  });
});
