/// <reference types="cypress" />

import React from "react";
import { TimePicker as CoreTimePicker } from "../../src/index.core";
import { TimePicker as NextTimePicker } from "../../src/index.next";

const implementations = [
  { name: "core", TimePicker: CoreTimePicker },
  { name: "next", TimePicker: NextTimePicker },
];

implementations.forEach(({ name, TimePicker }) => {
  describe(`${name} TimePicker`, () => {
    beforeEach(() => {
      cy.viewport(800, 520);
    });

    it("changes time values and exposes form attributes", () => {
      const onChange = cy.stub().as("timeChange");

      cy.mount(
        <div style={{ padding: 24 }}>
          <TimePicker
            label="Start time"
            name="startTime"
            min="08:00"
            max="17:00"
            step={900}
            onChange={onChange}
            data-testid="start-time"
          />
        </div>,
      );

      cy.get('[data-testid="start-time-input"]')
        .should("have.attr", "type", "time")
        .and("have.attr", "name", "startTime")
        .and("have.attr", "step", "900")
        .type("09:30")
        .should("have.value", "09:30");
      cy.get("@timeChange").should("have.been.calledWith", "09:30");
    });

    it("connects helper and error messaging", () => {
      cy.mount(
        <div style={{ padding: 24 }}>
          <TimePicker
            id="appointment"
            label="Appointment"
            helperText="Business hours only"
            error="Choose a valid time"
            data-testid="appointment-time"
          />
        </div>,
      );

      cy.get('[data-testid="appointment-time-helper"]').should("not.exist");
      cy.get('[data-testid="appointment-time-error"]')
        .should("have.attr", "role", "alert")
        .and("contain.text", "Choose a valid time");
      cy.get('[data-testid="appointment-time-input"]')
        .should("have.attr", "aria-invalid", "true")
        .and("have.attr", "aria-errormessage", "appointment-error");
    });

    it("disables the input and trigger during loading or disabled states", () => {
      cy.mount(
        <div style={{ padding: 24 }}>
          <TimePicker
            label="Start time"
            disabled
            loading
            data-testid="disabled-time"
          />
        </div>,
      );

      cy.get('[data-testid="disabled-time-root"]').should(
        "have.attr",
        "aria-busy",
        "true",
      );
      cy.get('[data-testid="disabled-time-loader"]').should("exist");
      cy.get('[data-testid="disabled-time-input"]').should("be.disabled");
      cy.get('[data-testid="disabled-time-button"]').should("be.disabled");
    });
  });
});
