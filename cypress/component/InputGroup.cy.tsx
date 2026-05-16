/// <reference types="cypress" />

import { InputGroup as CoreInputGroup } from "../../src/index.core";
import { InputGroup as NextInputGroup } from "../../src/index.next";

const implementations = [
  { name: "core", InputGroup: CoreInputGroup },
  { name: "next", InputGroup: NextInputGroup },
];

implementations.forEach(({ name, InputGroup }) => {
  describe(`${name} InputGroup`, () => {
    beforeEach(() => {
      cy.viewport(800, 520);
    });

    it("labels the input and wires helper text", () => {
      cy.mount(
        <div style={{ padding: 24 }}>
          <InputGroup
            id={`${name}-amount`}
            label="Amount"
            helperText="Use whole dollars."
            prefix="$"
            suffix="USD"
            data-testid="amount-group"
          >
            <input title="number" type="number" />
          </InputGroup>
        </div>,
      );

      cy.get(`#${name}-amount`).should("exist");
      cy.get("label").should("have.attr", "for", `${name}-amount`);
      cy.get(`#${name}-amount`).should(
        "have.attr",
        "aria-describedby",
        `${name}-amount-helper`,
      );
      cy.get('[data-testid="amount-group-prefix"]').should("contain", "$");
      cy.get('[data-testid="amount-group-suffix"]').should("contain", "USD");
    });

    it("renders addons and disables descendant controls", () => {
      cy.mount(
        <div style={{ padding: 24 }}>
          <InputGroup
            id={`${name}-domain`}
            label="Workspace domain"
            startAddon="https://"
            endAddon=".com"
            disabled
            error="Domain is required."
            data-testid="domain-group"
          >
            <input title="text" type="text" />
          </InputGroup>
        </div>,
      );

      cy.get('[data-testid="domain-group-start-addon"]').should(
        "contain",
        "https://",
      );
      cy.get('[data-testid="domain-group-end-addon"]').should(
        "contain",
        ".com",
      );
      cy.get(`#${name}-domain`).should("be.disabled");
      cy.get('[role="alert"]').should("contain", "Domain is required.");
    });
  });
});
