import React from "react";
import { renderToString } from "react-dom/server";
import CoreAccordion from "@/components/Accordion/core/Accordion";
import NextAccordion from "@/components/Accordion/next/Accordion";

describe.each([
  ["core", CoreAccordion],
  ["next", NextAccordion],
] as const)("%s Accordion controlled-loading SSR", (_flavor, Accordion) => {
  it("renders loading semantics without DOM globals", () => {
    const html = renderToString(
      <Accordion
        title="Server-rendered details"
        defaultExpanded={true}
        loading={true}
        loadingAriaLabel="Loading server-rendered details"
      >
        Loaded details
      </Accordion>,
    );

    expect(html).toContain('aria-expanded="true"');
    expect(html).toContain('aria-busy="true"');
    expect(html).toContain("Loading server-rendered details");
    expect(html).not.toContain("Loaded details");
  });
});
