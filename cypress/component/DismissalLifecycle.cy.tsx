/// <reference types="cypress" />

import * as Core from "../../src/index.core";
import * as Next from "../../src/index.next";

type DismissalComponents = Pick<
  typeof Core,
  "Dropdown" | "Menu" | "PopOver"
>;

const TestIcon = ({
  className,
  "aria-hidden": ariaHidden,
  focusable,
}: {
  className?: string;
  "aria-hidden"?: boolean;
  focusable?: boolean;
}) => (
  <svg
    className={className}
    aria-hidden={ariaHidden}
    focusable={focusable}
    viewBox="0 0 16 16"
  >
    <circle cx="8" cy="8" r="6" />
  </svg>
);

const runDismissalLifecycleTests = (
  flavor: "core" | "next",
  Components: DismissalComponents,
) => {
  describe(`${flavor} floating surface dismissal`, () => {
    it("keeps Menu hierarchy open for inside interaction and dismisses outside or on Escape", () => {
      cy.mount(
        <Components.Menu
          trigger="Open menu"
          data-testid="menu"
          items={[
            {
              label: "Projects",
              "data-testid": "menu-projects",
              items: [
                {
                  label: "Aurora",
                  "data-testid": "menu-aurora",
                },
              ],
            },
          ]}
        />,
      );

      cy.get('[data-testid="menu-trigger"]').click();
      cy.get('[data-testid="menu-projects"]').click();
      cy.get('[data-testid="menu-aurora"]').trigger("mousedown");
      cy.get('[data-testid="menu-menu"]').should("exist");
      cy.get('[data-testid="menu-projects-submenu"]').should("exist");

      cy.get("body").trigger("mousedown", { clientX: 1, clientY: 1 });
      cy.get('[data-testid="menu-menu"]').should("not.exist");

      cy.get('[data-testid="menu-trigger"]').click();
      cy.get('[data-testid="menu"]').trigger("keydown", { key: "Escape" });
      cy.get('[data-testid="menu-menu"]').should("not.exist");
    });

    it("keeps Dropdown open inside and dismisses outside or on Escape", () => {
      cy.mount(
        <Components.Dropdown
          triggerIcon={TestIcon}
          aria-label="Actions"
          data-testid="dropdown"
          items={[{ label: "Profile", "data-testid": "dropdown-profile" }]}
        />,
      );

      cy.get('[data-testid="dropdown-trigger"]').click();
      cy.get('[data-testid="dropdown-profile"]').trigger("mousedown");
      cy.get('[data-testid="dropdown-trigger"]').should(
        "have.attr",
        "aria-expanded",
        "true",
      );

      cy.get("body").trigger("mousedown", { clientX: 1, clientY: 1 });
      cy.get('[data-testid="dropdown-trigger"]').should(
        "have.attr",
        "aria-expanded",
        "false",
      );

      cy.get('[data-testid="dropdown-trigger"]').click();
      cy.get('[data-testid="dropdown"]').trigger("keydown", { key: "Escape" });
      cy.get('[data-testid="dropdown-trigger"]').should(
        "have.attr",
        "aria-expanded",
        "false",
      );
    });

    it("keeps PopOver open inside and dismisses outside or on Escape", () => {
      cy.mount(
        <Components.PopOver
          trigger="Details"
          content={<button type="button" data-testid="popover-action">Action</button>}
          data-testid="popover"
        />,
      );

      cy.get('[data-testid="popover-trigger"]').click();
      cy.get('[data-testid="popover-action"]').trigger("mousedown");
      cy.get('[data-testid="popover-trigger"]').should(
        "have.attr",
        "aria-expanded",
        "true",
      );

      cy.get("body").trigger("mousedown", { clientX: 1, clientY: 1 });
      cy.get('[data-testid="popover-trigger"]').should(
        "have.attr",
        "aria-expanded",
        "false",
      );

      cy.get('[data-testid="popover-trigger"]').click();
      cy.get("body").trigger("keydown", { key: "Escape" });
      cy.get('[data-testid="popover-trigger"]').should(
        "have.attr",
        "aria-expanded",
        "false",
      );
    });

    it("treats an inline Dropdown inside PopOver as inside both surfaces", () => {
      cy.mount(
        <Components.PopOver
          trigger="Open tools"
          data-testid="parent-popover"
          content={
            <Components.Dropdown
              triggerIcon={TestIcon}
              aria-label="Nested actions"
              data-testid="nested-dropdown"
              items={[
                {
                  label: "Nested action",
                  "data-testid": "nested-action",
                },
              ]}
            />
          }
        />,
      );

      cy.get('[data-testid="parent-popover-trigger"]').click();
      cy.get('[data-testid="nested-dropdown-trigger"]').click();
      cy.get('[data-testid="nested-action"]').trigger("mousedown");

      cy.get('[data-testid="parent-popover-trigger"]').should(
        "have.attr",
        "aria-expanded",
        "true",
      );
      cy.get('[data-testid="nested-dropdown-trigger"]').should(
        "have.attr",
        "aria-expanded",
        "true",
      );

      cy.get("body").trigger("mousedown", { clientX: 1, clientY: 1 });
      cy.get('[data-testid="parent-popover-trigger"]').should(
        "have.attr",
        "aria-expanded",
        "false",
      );
    });
  });
};

runDismissalLifecycleTests("core", Core);
runDismissalLifecycleTests("next", Next);
