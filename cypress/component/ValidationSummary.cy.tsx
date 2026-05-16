/// <reference types="cypress" />

import { ValidationSummary as CoreValidationSummary } from "../../src/index.core";
import { ValidationSummary as NextValidationSummary } from "../../src/index.next";

const implementations = [
  { name: "core", ValidationSummary: CoreValidationSummary },
  { name: "next", ValidationSummary: NextValidationSummary },
];

implementations.forEach(({ name, ValidationSummary }) => {
  describe(`${name} ValidationSummary`, () => {
    beforeEach(() => {
      cy.viewport(800, 520);
    });

    it("renders linked validation issues", () => {
      cy.mount(
        <div style={{ padding: 24 }}>
          <input id={`${name}-email`} aria-label="Email" />
          <ValidationSummary
            label="Fix the following"
            description="Review these fields before submitting."
            items={[
              {
                id: "email",
                message: "Email is required.",
                fieldId: `${name}-email`,
              },
              "Choose an account type.",
            ]}
            data-testid="validation-summary"
          />
        </div>,
      );

      cy.get('[data-testid="validation-summary-root"]').should(
        "have.attr",
        "role",
        "alert",
      );
      cy.get('[data-testid="validation-summary-list"]').should(
        "contain",
        "Email is required.",
      );
      cy.get('[data-testid="validation-summary-item-0-link"]').should(
        "have.attr",
        "href",
        `#${name}-email`,
      );
      cy.get('[data-testid="validation-summary-item-1-button"]').should(
        "contain",
        "Choose an account type.",
      );
    });

    it("supports focus on mount and empty rendering", () => {
      cy.mount(
        <div style={{ padding: 24 }}>
          <ValidationSummary
            label="Fix the following"
            focusOnMount
            items={["Password is required."]}
            data-testid="validation-summary"
          />
        </div>,
      );

      cy.get('[data-testid="validation-summary-root"]').should("be.focused");

      cy.mount(
        <div style={{ padding: 24 }}>
          <ValidationSummary
            items={[]}
            hideWhenEmpty={false}
            emptyMessage="No validation issues."
            role="status"
            data-testid="validation-summary-empty"
          />
        </div>,
      );

      cy.get('[data-testid="validation-summary-empty-root"]').should(
        "have.attr",
        "role",
        "status",
      );
      cy.get('[data-testid="validation-summary-empty-empty"]').should(
        "contain",
        "No validation issues.",
      );
    });
  });
});
