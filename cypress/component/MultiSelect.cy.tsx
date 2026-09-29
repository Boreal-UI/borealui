/// <reference types="cypress" />

import { useState } from "react";
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

    it("keeps input focus and clamps navigation across the filtered sequence", () => {
      const onChange = cy.stub();
      cy.mount(
        <MultiSelect
          label="Components"
          options={options}
          onChange={onChange}
          data-testid="keyboard"
        />,
      );

      cy.get('[data-testid="keyboard-trigger"]').focus().type("{downArrow}");
      cy.get('[data-testid="keyboard-search"]').should("be.focused");

      cy.get('[data-testid="keyboard-search"]').type("{upArrow}{enter}");
      cy.then(() => {
        expect(onChange).to.have.been.calledWith(["button"]);
      });

      cy.get('[data-testid="keyboard-search"]').type(
        "{downArrow}{downArrow}{enter}",
      );
      cy.then(() => {
        expect(onChange).to.have.callCount(1);
      });

      cy.get('[data-testid="keyboard-search"]').type("{downArrow}{enter}");
      cy.then(() => {
        expect(onChange).to.have.been.calledWith(["button", "tabs"]);
      });

      cy.get('[data-testid="keyboard-search"]').type("{downArrow}{enter}");
      cy.then(() => {
        expect(onChange).to.have.been.calledWith(["button"]);
      });
      cy.get('[data-testid="keyboard-search"]').should("be.focused");
    });

    it("resets the active option when filtering removes it", () => {
      const onChange = cy.stub();
      cy.mount(
        <MultiSelect
          label="Components"
          options={options}
          onChange={onChange}
          data-testid="filtered"
        />,
      );

      cy.get('[data-testid="filtered-trigger"]').click();
      cy.get('[data-testid="filtered-search"]')
        .type("{downArrow}")
        .type("but")
        .type("{enter}");

      cy.get('[data-testid="filtered-option-button"]').should("be.visible");
      cy.get('[data-testid="filtered-option-card"]').should("not.exist");
      cy.then(() => {
        expect(onChange).to.have.been.calledWith(["button"]);
      });
    });

    it("keeps empty and all-disabled results stable", () => {
      const onChange = cy.stub();
      cy.mount(
        <MultiSelect
          label="Disabled choices"
          options={[
            { value: "first", label: "First", disabled: true },
            { value: "second", label: "Second", disabled: true },
          ]}
          onChange={onChange}
          data-testid="disabled-results"
        />,
      );

      cy.get('[data-testid="disabled-results-trigger"]').click();
      cy.get('[data-testid="disabled-results-search"]')
        .type("{downArrow}{enter}");
      cy.then(() => {
        expect(onChange).not.to.have.been.called;
      });

      cy.get('[data-testid="disabled-results-search"]')
        .type("no match")
        .type("{downArrow}{upArrow}{enter}");
      cy.get('[data-testid="disabled-results-empty"]').should("be.visible");
      cy.then(() => {
        expect(onChange).not.to.have.been.called;
      });
    });

    it("preserves Space, Escape, and Tab input behavior", () => {
      cy.mount(
        <div>
          <MultiSelect
            label="Components"
            options={options}
            defaultValue={["button"]}
            data-testid="dismissal"
          />
          <button type="button" data-testid="outside-focus">
            Outside
          </button>
        </div>,
      );

      cy.get('[data-testid="dismissal-trigger"]').click();
      cy.get('[data-testid="dismissal-search"]').type("a b");
      cy.get('[data-testid="dismissal-search"]').should("have.value", "a b");
      cy.get('[data-testid="dismissal-popover"]').should("be.visible");

      cy.get('[data-testid="dismissal-search"]').then(($search) => {
        const tabEvent = new KeyboardEvent("keydown", {
          key: "Tab",
          bubbles: true,
          cancelable: true,
        });
        expect($search[0].dispatchEvent(tabEvent)).to.equal(true);
      });
      cy.get('[data-testid="dismissal-popover"]').should("be.visible");
      cy.get('[data-testid="outside-focus"]').focus();
      cy.get('[data-testid="dismissal-popover"]').should("not.exist");

      cy.get('[data-testid="dismissal-trigger"]').click();
      cy.get('[data-testid="dismissal-search"]').type("{esc}");
      cy.get('[data-testid="dismissal-popover"]').should("not.exist");
      cy.get('[data-testid="dismissal-chip-button"]').should("exist");
    });

    it("keeps controlled selection owned by updated consumer props", () => {
      const ControlledMultiSelect = () => {
        const [value, setValue] = useState(["button"]);
        return (
          <MultiSelect
            label="Controlled components"
            options={options}
            value={value}
            onChange={setValue}
            data-testid="controlled"
          />
        );
      };

      cy.mount(<ControlledMultiSelect />);
      cy.get('[data-testid="controlled-trigger"]').click();
      cy.get('[data-testid="controlled-search"]').type("{downArrow}{enter}");
      cy.get('[data-testid="controlled-chip-button"]').should("exist");
      cy.get('[data-testid="controlled-chip-card"]').should("exist");
      cy.get('[data-testid="controlled-option-card"]').should(
        "have.attr",
        "aria-selected",
        "true",
      );
    });

    it("honors consumer cancellation before internal keyboard behavior", () => {
      const onChange = cy.stub();
      const onKeyDown = cy.stub().callsFake((event) => {
        if (event.key === "ArrowDown" || event.key === "Enter") {
          event.preventDefault();
        }
      });
      cy.mount(
        <MultiSelect
          label="Components"
          options={options}
          onChange={onChange}
          onKeyDown={onKeyDown}
          data-testid="cancelled"
        />,
      );

      cy.get('[data-testid="cancelled-trigger"]').focus().type("{downArrow}");
      cy.get('[data-testid="cancelled-popover"]').should("not.exist");

      cy.get('[data-testid="cancelled-trigger"]').click();
      cy.get('[data-testid="cancelled-search"]').type("{enter}");
      cy.then(() => {
        expect(onKeyDown).to.have.been.called;
        expect(onChange).not.to.have.been.called;
      });
    });
  });
});
