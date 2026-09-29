/// <reference types="cypress" />

import * as Core from "../../src/index.core";
import * as Next from "../../src/index.next";

const runNamedTargetTests = (
  flavor: "core" | "next",
  MarkdownRenderer: typeof Core.MarkdownRenderer,
) => {
  describe(`${flavor} named-target navigation security`, () => {
    it("renders named raw HTML targets without opener access", () => {
      cy.mount(
        <MarkdownRenderer
          content={
            '<a href="https://example.com" target="docs-window" rel="nofollow opener">Documentation</a>'
          }
          allowHtml
          data-testid="markdown"
        />,
      );

      cy.get('[data-testid="markdown"] a').should(
        "have.attr",
        "target",
        "docs-window",
      );
      cy.get('[data-testid="markdown"] a')
        .invoke("attr", "rel")
        .then((rel) => {
          if (!rel) throw new Error("Expected a rendered rel attribute");
          const tokens = rel.toLowerCase().split(/\s+/);

          expect(tokens).to.include.members([
            "nofollow",
            "noopener",
            "noreferrer",
          ]);
          expect(tokens).not.to.include("opener");
        });
    });
  });
};

runNamedTargetTests("core", Core.MarkdownRenderer);
runNamedTargetTests("next", Next.MarkdownRenderer);
