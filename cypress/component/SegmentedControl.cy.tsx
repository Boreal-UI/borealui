/// <reference types="cypress" />

import { SegmentedControl as CoreSegmentedControl } from "../../src/index.core";
import { SegmentedControl as NextSegmentedControl } from "../../src/index.next";

const implementations = [
  { name: "core", SegmentedControl: CoreSegmentedControl },
  { name: "next", SegmentedControl: NextSegmentedControl },
];

const options = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
];

implementations.forEach(({ name, SegmentedControl }) => {
  describe(`${name} SegmentedControl`, () => {
    beforeEach(() => {
      cy.viewport(800, 520);
    });

    it("selects options and updates the hidden form value", () => {
      cy.mount(
        <div style={{ padding: 24 }}>
          <SegmentedControl
            label="Range"
            name="range"
            options={options}
            defaultValue="day"
            data-testid="range-control"
          />
        </div>,
      );

      cy.get('[role="radiogroup"]').should("have.attr", "aria-labelledby");
      cy.contains('[role="radio"]', "Day").should(
        "have.attr",
        "aria-checked",
        "true",
      );
      cy.contains('[role="radio"]', "Week").click();
      cy.contains('[role="radio"]', "Week").should(
        "have.attr",
        "aria-checked",
        "true",
      );
      cy.get('[data-testid="range-control-input"]').should(
        "have.value",
        "week",
      );
    });

    it("supports keyboard navigation and skips disabled options", () => {
      cy.mount(
        <div style={{ padding: 24 }}>
          <SegmentedControl
            label="View"
            options={[
              { value: "list", label: "List" },
              { value: "grid", label: "Grid", disabled: true },
              { value: "kanban", label: "Kanban" },
            ]}
            defaultValue="list"
            data-testid="view-control"
          />
        </div>,
      );

      cy.contains('[role="radio"]', "List").focus().type("{rightarrow}");
      cy.contains('[role="radio"]', "Kanban").should("be.focused");
      cy.contains('[role="radio"]', "Kanban").should(
        "have.attr",
        "aria-checked",
        "true",
      );
      cy.contains('[role="radio"]', "Grid").should("be.disabled");
    });
  });
});
