/// <reference types="cypress" />

import * as Core from "../../src/index.core";
import * as Next from "../../src/index.next";

type TooltipComponent = typeof Core.Tooltip;

const runTooltipTests = (
  flavor: "core" | "next",
  Tooltip: TooltipComponent,
) => {
  describe(`${flavor} Tooltip trigger semantics`, () => {
    it("discovers a neutral text trigger by keyboard and dismisses with Escape", () => {
      cy.mount(
        <div>
          <button type="button" data-testid="before-tooltip">
            Before tooltip
          </button>
          <Tooltip content="Helpful context" data-testid="plain-tooltip">
            Plain tooltip trigger
          </Tooltip>
        </div>,
      );

      cy.get('[data-testid="plain-tooltip-trigger"]')
        .should("have.attr", "tabindex", "0")
        .and("not.have.attr", "role");
      cy.get('[data-testid="plain-tooltip-trigger"][role="button"]').should(
        "not.exist",
      );

      cy.get('[data-testid="before-tooltip"]').focus();
      cy.press(Cypress.Keyboard.Keys.TAB);
      cy.get('[data-testid="plain-tooltip-trigger"]').should("be.focused");
      cy.get('[data-testid="plain-tooltip"]')
        .should("have.attr", "aria-hidden", "false")
        .and("have.attr", "role", "tooltip")
        .then(($tooltip) => {
          cy.get('[data-testid="plain-tooltip-trigger"]').should(
            "have.attr",
            "aria-describedby",
            $tooltip.attr("id"),
          );
        });

      cy.press(Cypress.Keyboard.Keys.ESC);
      cy.get('[data-testid="plain-tooltip"]').should(
        "have.attr",
        "aria-hidden",
        "true",
      );
      cy.get('[data-testid="plain-tooltip-trigger"]').should(
        "not.have.attr",
        "aria-describedby",
      );
    });

    it("preserves an interactive child's native button semantics", () => {
      cy.mount(
        <Tooltip content="Button context" data-testid="button-tooltip">
          <button type="button">Native action</button>
        </Tooltip>,
      );

      cy.get('[data-testid="button-tooltip-trigger"]')
        .should("match", "button")
        .and("not.have.attr", "tabindex");
      cy.contains("button", "Native action").should("exist");
    });
  });
};

runTooltipTests("core", Core.Tooltip);
runTooltipTests("next", Next.Tooltip);
