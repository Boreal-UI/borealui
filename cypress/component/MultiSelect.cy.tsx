/// <reference types="cypress" />

import React from "react";
import { MultiSelect as CoreMultiSelect } from "../../src/index.core";
import { MultiSelect as NextMultiSelect } from "../../src/index.next";

const options = [
  { value: "button", label: "Button" },
  { value: "card", label: "Card" },
  { value: "modal", label: "Modal", disabled: true },
  { value: "tabs", label: "Tabs" },
];

const implementations = [
  { name: "core", MultiSelect: CoreMultiSelect },
  { name: "next", MultiSelect: NextMultiSelect },
];

implementations.forEach(({ name, MultiSelect }) => {
  describe(`${name} MultiSelect`, () => {
    beforeEach(() => {
      cy.viewport(800, 520);
    });

    it("selects, filters, and clears values", () => {
      const onChange = cy.stub().as("multiChange");

      cy.mount(
        <div style={{ padding: 24 }}>
          <MultiSelect
            label="Components"
            options={options}
            onChange={onChange}
            data-testid="components"
          />
        </div>,
      );

      cy.get('[data-testid="components-trigger"]').click();
      cy.get('[data-testid="components-listbox"]').should("be.visible");
      cy.get('[data-testid="components-option-button"]').click();
      cy.get("@multiChange").should("have.been.calledWith", ["button"]);
      cy.get('[data-testid="components-chip-button"]').should(
        "contain",
        "Button",
      );

      cy.get('[data-testid="components-search"]').clear().type("tab");
      cy.get('[data-testid="components-option-tabs"]').should("be.visible");
      cy.get('[data-testid="components-option-button"]').should("not.exist");
      cy.get('[data-testid="components-option-tabs"]').click();
      cy.get("@multiChange").should("have.been.calledWith", [
        "button",
        "tabs",
      ]);

      cy.get('[data-testid="components-clear"]').click();
      cy.get("@multiChange").should("have.been.calledWith", []);
      cy.get('[data-testid="components-chip-button"]').should("not.exist");
    });

    it("supports max selection and hidden form inputs", () => {
      cy.mount(
        <div style={{ padding: 24 }}>
          <MultiSelect
            aria-label="Component choices"
            options={options}
            defaultValue={["button"]}
            maxSelected={1}
            name="components"
            data-testid="choices"
          />
        </div>,
      );

      cy.get('[data-testid="choices-hidden-button"]').should(
        "have.value",
        "button",
      );
      cy.get('[data-testid="choices-trigger"]').click();
      cy.get('[data-testid="choices-option-card"]').should("be.disabled");
      cy.get('[data-testid="choices-option-button"]').should("not.be.disabled");
    });
  });
});
