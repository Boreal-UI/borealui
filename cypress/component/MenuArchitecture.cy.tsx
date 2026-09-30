/// <reference types="cypress" />

import type React from "react";
import * as Core from "../../src/index.core";
import * as Next from "../../src/index.next";

type MenuComponent = typeof Core.Menu;

const mountMenu = (
  Menu: MenuComponent,
  props: Partial<React.ComponentProps<MenuComponent>> = {},
) => {
  cy.mount(
    <div style={{ minHeight: 320, padding: 24 }}>
      <Menu
        trigger="Open actions"
        activation="click"
        aria-label="Project actions"
        data-testid="menu"
        items={[
          {
            label: "First action",
            "data-testid": "menu-first",
            onClick: cy.stub().as("firstClick"),
          },
          {
            label: "Unavailable action",
            disabled: true,
            "data-testid": "menu-disabled",
          },
          {
            label: "Last action",
            "data-testid": "menu-last",
            onClick: cy.stub().as("lastClick"),
          },
        ]}
        {...props}
      />
      <button type="button" data-testid="outside">
        Outside
      </button>
    </div>,
  );
};

const runMenuArchitectureTests = (
  flavor: "core" | "next",
  Menu: MenuComponent,
) => {
  describe(`${flavor} Menu architecture`, () => {
    beforeEach(() => {
      cy.viewport(900, 620);
    });

    it("navigates vertically with disabled skipping, wrapping, Home, and End", () => {
      mountMenu(Menu);

      cy.get('[data-testid="menu-trigger"]').click();
      cy.get('[data-testid="menu-first"]').should("be.focused");

      cy.focused().type("{downArrow}");
      cy.get('[data-testid="menu-last"]').should("be.focused");
      cy.focused().type("{downArrow}");
      cy.get('[data-testid="menu-first"]').should("be.focused");
      cy.focused().type("{upArrow}");
      cy.get('[data-testid="menu-last"]').should("be.focused");
      cy.focused().type("{home}");
      cy.get('[data-testid="menu-first"]').should("be.focused");
      cy.focused().type("{end}");
      cy.get('[data-testid="menu-last"]').should("be.focused");
    });

    it("activates enabled items with Enter and Space", () => {
      mountMenu(Menu);

      cy.get('[data-testid="menu-trigger"]').click();
      cy.focused().type("{enter}");
      cy.get("@firstClick").should("have.been.calledOnce");
      cy.get('[data-testid="menu-menu"]').should("not.exist");

      cy.get('[data-testid="menu-trigger"]').click();
      cy.focused().type("{end}");
      cy.focused().trigger("keydown", { key: " ", code: "Space", which: 32 });
      cy.get("@lastClick").should("have.been.calledOnce");
      cy.get('[data-testid="menu-menu"]').should("not.exist");
    });

    it("opens and returns from a submenu, then Escape dismisses the hierarchy", () => {
      mountMenu(Menu, {
        items: [
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
          { label: "Archive", "data-testid": "menu-archive" },
        ],
      });

      cy.get('[data-testid="menu-trigger"]').as("trigger").click();
      cy.get('[data-testid="menu-projects"]').should("be.focused");
      cy.focused().type("{rightArrow}");
      cy.get('[data-testid="menu-aurora"]').should("be.focused");
      cy.get('[data-testid="menu-projects-submenu"]').should("be.visible");

      cy.focused().type("{leftArrow}");
      cy.get('[data-testid="menu-projects"]').should("be.focused");
      cy.get('[data-testid="menu-projects-submenu"]').should("not.exist");

      cy.focused().type("{rightArrow}");
      cy.get('[data-testid="menu-aurora"]').should("be.focused");
      cy.focused().type("{esc}");
      cy.get('[data-testid="menu-menu"]').should("not.exist");
      cy.get("@trigger").should("be.focused");
    });

    it("dismisses outside the hierarchy and restores trigger focus", () => {
      mountMenu(Menu);

      cy.get('[data-testid="menu-trigger"]').as("trigger").click();
      cy.get('[data-testid="outside"]').trigger("mousedown");

      cy.get('[data-testid="menu-menu"]').should("not.exist");
      cy.get("@trigger").should("be.focused");
    });

    it("lets consumers cancel internal keyboard navigation", () => {
      const onKeyDown = cy
        .stub()
        .callsFake((event: React.KeyboardEvent<HTMLDivElement>) => {
          if (event.key === "ArrowDown") event.preventDefault();
        })
        .as("consumerKeyDown");
      mountMenu(Menu, { onKeyDown });

      cy.get('[data-testid="menu-trigger"]').click();
      cy.get('[data-testid="menu-first"]').should("be.focused");
      cy.focused().type("{downArrow}");

      cy.get("@consumerKeyDown").should("have.been.called");
      cy.get('[data-testid="menu-first"]').should("be.focused");
      cy.focused().type("{end}");
      cy.get('[data-testid="menu-last"]').should("be.focused");
    });
  });
};

runMenuArchitectureTests("core", Core.Menu);
runMenuArchitectureTests("next", Next.Menu);
