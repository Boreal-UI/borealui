/// <reference types="cypress" />

import { DatePicker as CoreDatePicker } from "../../src/index.core";
import { DatePicker as NextDatePicker } from "../../src/index.next";

const implementations = [
  { name: "core", DatePicker: CoreDatePicker },
  { name: "next", DatePicker: NextDatePicker },
];

implementations.forEach(({ name, DatePicker }) => {
  describe(`${name} DatePicker`, () => {
    beforeEach(() => {
      cy.viewport(800, 520);
    });

    it("changes date values and exposes form attributes", () => {
      const onChange = cy.stub().as("dateChange");

      cy.mount(
        <div style={{ padding: 24 }}>
          <DatePicker
            label="Start date"
            name="startDate"
            min="2026-01-01"
            max="2026-12-31"
            onChange={onChange}
            data-testid="start-date"
          />
        </div>,
      );

      cy.get('[data-testid="start-date-input"]')
        .should("have.attr", "type", "date")
        .and("have.attr", "name", "startDate")
        .type("2026-05-14")
        .should("have.value", "2026-05-14");
      cy.get("@dateChange").should("have.been.calledWith", "2026-05-14");
    });

    it("connects helper and error messaging", () => {
      cy.mount(
        <div style={{ padding: 24 }}>
          <DatePicker
            id="deadline"
            label="Deadline"
            helperText="Weekdays are preferred"
            errorMessage="Choose a valid date"
            data-testid="deadline-date"
          />
        </div>,
      );

      cy.get('[data-testid="deadline-date-helperText"]')
        .should("exist")
        .and("contain.text", "Weekdays are preferred");
      cy.get('[data-testid="deadline-date-errorMessage"]')
        .should("have.attr", "role", "alert")
        .and("contain.text", "Choose a valid date");
      cy.get('[data-testid="deadline-date-input"]')
        .should("have.attr", "aria-invalid", "true")
        .and("have.attr", "aria-errormessage", "deadline-errorMessage")
        .and(
          "have.attr",
          "aria-describedby",
          "deadline-helperText deadline-errorMessage",
        );
    });

    it("disables the input and trigger during loading or disabled states", () => {
      cy.mount(
        <div style={{ padding: 24 }}>
          <DatePicker
            label="Start date"
            disabled
            loading
            data-testid="disabled-date"
          />
        </div>,
      );

      cy.get('[data-testid="disabled-date-root"]').should(
        "have.attr",
        "aria-busy",
        "true",
      );
      cy.get('[data-testid="disabled-date-loader"]').should("exist");
      cy.get('[data-testid="disabled-date-input"]').should("be.disabled");
      cy.get('[data-testid="disabled-date-button"]').should("be.disabled");
    });
  });
});
