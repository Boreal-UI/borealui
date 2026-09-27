/// <reference types="cypress" />

import * as Core from "../../src/index.core";
import * as Next from "../../src/index.next";

type FloatingComponents = Pick<typeof Core, "Menu" | "PopOver">;

const assertWithinViewport = (selector: string) => {
  cy.get(selector).then(($element) => {
    const rect = $element[0].getBoundingClientRect();
    const elementWindow = $element[0].ownerDocument.defaultView;
    const width = elementWindow?.innerWidth ?? Cypress.config("viewportWidth");
    const height =
      elementWindow?.innerHeight ?? Cypress.config("viewportHeight");

    expect(rect.left).to.be.at.least(0);
    expect(rect.top).to.be.at.least(0);
    expect(rect.right).to.be.at.most(width);
    expect(rect.bottom).to.be.at.most(height);
  });
};

const runFloatingPanelTests = (
  flavor: "core" | "next",
  Components: FloatingComponents,
) => {
  describe(`${flavor} floating panel positioning`, () => {
    beforeEach(() => {
      cy.viewport(640, 480);
    });

    it("clamps Menu and its submenu after viewport events", () => {
      cy.mount(
        <Components.Menu
          activation="manual"
          defaultOpen
          position={{ x: 632, y: 472 }}
          aria-label="Edge actions"
          data-testid="edge-menu"
          items={[
            {
              label: "Export",
              "data-testid": "edge-menu-export",
              items: [
                { label: "JSON", "data-testid": "edge-menu-json" },
                { label: "CSV", "data-testid": "edge-menu-csv" },
              ],
            },
            { label: "Archive", "data-testid": "edge-menu-archive" },
          ]}
        />,
      );

      assertWithinViewport('[data-testid="edge-menu-menu"]');
      cy.get('[data-testid="edge-menu-export"]').click();
      cy.get('[data-testid="edge-menu-export-submenu"]')
        .should("be.visible")
        .and("have.attr", "data-placement", "left");
      assertWithinViewport('[data-testid="edge-menu-export-submenu"]');

      cy.window().trigger("resize");
      cy.window().trigger("scroll");
      assertWithinViewport('[data-testid="edge-menu-menu"]');
      assertWithinViewport('[data-testid="edge-menu-export-submenu"]');
    });

    it("keeps a normally placed PopOver aligned through viewport events", () => {
      cy.mount(
        <div style={{ padding: 160 }}>
          <Components.PopOver
            trigger="Details"
            content="Panel content"
            placement="bottom"
            data-testid="center-popover"
          />
        </div>,
      );

      cy.get('[data-testid="center-popover-trigger"]').click();
      cy.get('[data-testid="center-popover-content"]')
        .should("be.visible")
        .then(($content) => {
          cy.get('[data-testid="center-popover-trigger"]').then(($trigger) => {
            expect($content[0].getBoundingClientRect().top).to.be.at.least(
              $trigger[0].getBoundingClientRect().bottom,
            );
          });
        });

      cy.window().trigger("resize");
      cy.window().trigger("scroll");
      cy.get('[data-testid="center-popover-content"]').should("be.visible");
    });

    it("records the current PopOver edge-overflow behavior", () => {
      cy.mount(
        <div style={{ position: "fixed", right: 0, bottom: 0 }}>
          <Components.PopOver
            trigger="Edge details"
            content={<div style={{ minHeight: 96 }}>Edge panel content</div>}
            placement="bottom"
            data-testid="edge-popover"
          />
        </div>,
      );

      cy.get('[data-testid="edge-popover-trigger"]').click();
      cy.get('[data-testid="edge-popover-content"]').then(($content) => {
        const rect = $content[0].getBoundingClientRect();
        const height = $content[0].ownerDocument.defaultView?.innerHeight ?? 480;

        expect(rect.bottom).to.be.greaterThan(height);
      });
    });
  });
};

runFloatingPanelTests("core", Core);
runFloatingPanelTests("next", Next);
