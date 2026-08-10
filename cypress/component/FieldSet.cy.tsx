/// <reference types="cypress" />

import { FieldSet as CoreFieldSet } from "../../src/index.core";
import { FieldSet as NextFieldSet } from "../../src/index.next";

const implementations = [
  { name: "core", FieldSet: CoreFieldSet },
  { name: "next", FieldSet: NextFieldSet },
];

implementations.forEach(({ name, FieldSet }) => {
  describe(`${name} FieldSet`, () => {
    beforeEach(() => {
      cy.viewport(800, 520);
    });

    it("groups controls with a legend and helper text", () => {
      cy.mount(
        <div style={{ padding: 24 }}>
          <FieldSet
            legend="Contact preferences"
            helperText="Choose how account updates should reach you. You can change this later."
            data-testid="contact-fieldset"
          >
            <label htmlFor={`${name}-email-updates`}>
              <input id={`${name}-email-updates`} type="checkbox" /> Email
            </label>
          </FieldSet>
        </div>,
      );

      cy.get("fieldset").should("contain", "Contact preferences");
      cy.get('[data-testid="contact-fieldset-helperText"]').should(
        "contain",
        "Choose how account updates should reach you. You can change this later.",
      );
      cy.get('[data-testid="contact-fieldset-root"]').should(
        "have.attr",
        "aria-describedby",
      );
    });

    it("disables descendant controls and announces errors", () => {
      cy.mount(
        <div style={{ padding: 24 }}>
          <FieldSet
            legend="Delivery speed"
            disabled
            errorMessage="Pick a delivery speed before continuing."
            data-testid="delivery-fieldset"
          >
            <label htmlFor={`${name}-standard-speed`}>
              <input id={`${name}-standard-speed`} type="radio" name="speed" />
              Standard
            </label>
          </FieldSet>
        </div>,
      );

      cy.get('[data-testid="delivery-fieldset-root"]').should("be.disabled");
      cy.get(`#${name}-standard-speed`).should("be.disabled");
      cy.get('[role="alert"]').should(
        "contain",
        "Pick a delivery speed before continuing.",
      );
    });
  });
});
