/// <reference types="cypress" />

import CoreToolbar from "../../src/components/Toolbar/core/Toolbar";
import NextToolbar from "../../src/components/Toolbar/next/Toolbar";
import "../../src/styles/globals.scss";

[
  { name: "core", Toolbar: CoreToolbar },
  { name: "next", Toolbar: NextToolbar },
].forEach(({ name, Toolbar }) => {
  describe(`${name} Toolbar custom sections`, () => {
    [280, 900].forEach((width) => {
      it(`applies section and content classes at ${width}px`, () => {
        cy.viewport(1100, 600);
        cy.mount(
          <>
            <style>{`
              @layer boreal-ui.components {
                .custom-toolbar-section { justify-content: center; }
                .custom-toolbar-content { gap: 23px; }
              }
            `}</style>
            <div style={{ width }}>
              <Toolbar
                left={<button>Left</button>}
                center={<button>Center</button>}
                right={<button>Right</button>}
                leftClassName="custom-toolbar-section"
                centerClassName="custom-toolbar-section"
                rightClassName="custom-toolbar-section"
                leftSectionClassName="left-override"
                centerSectionClassName="center-override"
                rightSectionClassName="right-override"
                leftContentClassName="custom-toolbar-content"
                centerContentClassName="custom-toolbar-content"
                rightContentClassName="custom-toolbar-content"
              />
            </div>
          </>,
        );
        ["left", "center", "right"].forEach((section) => {
          cy.get(`[data-testid="toolbar-${section}"]`)
            .should("have.class", "custom-toolbar-section")
            .and("have.class", `${section}-override`)
            .and("have.css", "justify-content", "center");
          cy.get(`[data-testid="toolbar-${section}-content"]`)
            .should("have.class", "custom-toolbar-content")
            .and("have.css", "gap", "23px");
        });
        if (width === 280) {
          cy.get('[data-testid="toolbar-left"]').then(($left) => {
            cy.get('[data-testid="toolbar-center"]').should(($center) => {
              expect($center[0].getBoundingClientRect().top).to.be.greaterThan(
                $left[0].getBoundingClientRect().top,
              );
            });
          });
        }
      });
    });
  });
});
