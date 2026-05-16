/// <reference types="cypress" />

import { NumberInput as CoreNumberInput } from "../../src/index.core";
import { NumberInput as NextNumberInput } from "../../src/index.next";

const implementations = [
  { name: "core", NumberInput: CoreNumberInput },
  { name: "next", NumberInput: NextNumberInput },
];

implementations.forEach(({ name, NumberInput }) => {
  describe(`${name} NumberInput`, () => {
    beforeEach(() => {
      cy.viewport(800, 520);
    });

    it("changes value from typing and stepper controls", () => {
      const onChange = cy.stub().as("numberChange");
      const onValueChange = cy.stub().as("numberValueChange");

      cy.mount(
        <div style={{ padding: 24 }}>
          <NumberInput
            label="Quantity"
            defaultValue={2}
            min={0}
            max={5}
            onChange={onChange}
            onValueChange={onValueChange}
            data-testid="quantity"
          />
        </div>,
      );

      cy.get('[data-testid="quantity-input"]').should("have.value", "2");
      cy.get('[data-testid="quantity-increment"]').click();
      cy.get('[data-testid="quantity-input"]').should("have.value", "3");
      cy.get("@numberValueChange").should("have.been.calledWith", 3);

      cy.get('[data-testid="quantity-input"]').clear().type("4");
      cy.get("@numberChange").should("have.been.calledWith", 4);

      cy.get('[data-testid="quantity-decrement"]').click();
      cy.get('[data-testid="quantity-input"]').should("have.value", "3");
    });

    it("clamps on blur and supports hidden controls", () => {
      const onValueChange = cy.stub().as("numberClamp");

      cy.mount(
        <div style={{ padding: 24 }}>
          <NumberInput
            aria-label="Budget"
            defaultValue={5}
            min={0}
            max={10}
            showControls={false}
            onValueChange={onValueChange}
            data-testid="budget"
          />
        </div>,
      );

      cy.get('[data-testid="budget-controls"]').should("not.exist");
      cy.get('[data-testid="budget-input"]').clear().type("25").blur();
      cy.get('[data-testid="budget-input"]').should("have.value", "10");
      cy.get("@numberClamp").should("have.been.calledWith", 10);
    });
  });
});
