/// <reference types="cypress" />

import * as Core from "../../src/index.core";
import * as Next from "../../src/index.next";

type FloatingComponents = Pick<typeof Core, "Menu" | "PopOver">;
type PopOverPlacement = "top" | "bottom" | "left" | "right";

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

const edgeCases: Array<{
  requested: PopOverPlacement;
  wrapperStyle: React.CSSProperties;
  assertResolved: (content: DOMRect, trigger: DOMRect) => void;
}> = [
  {
    requested: "bottom",
    wrapperStyle: { position: "fixed", bottom: 0, left: 240 },
    assertResolved: (content, trigger) => {
      expect(content.bottom).to.be.at.most(trigger.top + 2);
    },
  },
  {
    requested: "top",
    wrapperStyle: { position: "fixed", top: 0, left: 240 },
    assertResolved: (content, trigger) => {
      expect(content.top).to.be.at.least(trigger.bottom);
    },
  },
  {
    requested: "left",
    wrapperStyle: { position: "fixed", left: 0, top: 180 },
    assertResolved: (content, trigger) => {
      expect(content.left).to.be.at.least(trigger.right);
    },
  },
  {
    requested: "right",
    wrapperStyle: { position: "fixed", right: 0, top: 180 },
    assertResolved: (content, trigger) => {
      expect(content.right).to.be.at.most(trigger.left);
    },
  },
];

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

    edgeCases.forEach(({ requested, wrapperStyle, assertResolved }) => {
      it(`positions an initially ${requested}-placed PopOver within the viewport edge`, () => {
        cy.mount(
          <div style={wrapperStyle}>
            <Components.PopOver
              trigger={`${requested} edge details`}
              content={
                <div style={{ minHeight: 96, width: 180 }}>
                  Edge panel content
                </div>
              }
              placement={requested}
              data-testid={`${requested}-edge-popover`}
            />
          </div>,
        );

        const contentSelector = `[data-testid="${requested}-edge-popover-content"]`;
        const triggerSelector = `[data-testid="${requested}-edge-popover-trigger"]`;

        cy.get(triggerSelector).click();
        cy.get(contentSelector)
          .should("be.visible")
          .then(($content) => {
            cy.get(triggerSelector).then(($trigger) => {
              assertResolved(
                $content[0].getBoundingClientRect(),
                $trigger[0].getBoundingClientRect(),
              );
            });
          });
        assertWithinViewport(contentSelector);
      });
    });

    it("remeasures an edge PopOver after close and reopen", () => {
      cy.mount(
        <div style={{ position: "fixed", bottom: 0, left: 240 }}>
          <Components.PopOver
            trigger="Reopen edge details"
            content={<div style={{ minHeight: 96 }}>Edge panel content</div>}
            placement="bottom"
            data-testid="reopen-edge-popover"
          />
        </div>,
      );

      const trigger = '[data-testid="reopen-edge-popover-trigger"]';
      const content = '[data-testid="reopen-edge-popover-content"]';

      cy.get(trigger).click();
      assertWithinViewport(content);
      cy.get(trigger).click();
      cy.get(content).should("have.attr", "aria-hidden", "true");
      cy.wait(200);
      cy.get(content).should("not.exist");
      cy.get(trigger).click();
      assertWithinViewport(content);
    });
  });
};

runFloatingPanelTests("core", Core);
runFloatingPanelTests("next", Next);
