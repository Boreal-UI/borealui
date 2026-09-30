/// <reference types="cypress" />

import * as Core from "../../src/index.core";
import * as Next from "../../src/index.next";

type ComponentLibrary = typeof Core;

const implementations: Array<{
  name: "core" | "next";
  library: ComponentLibrary;
}> = [
  { name: "core", library: Core },
  { name: "next", library: Next },
];

const expectContained = ($container: JQuery<HTMLElement>) => {
  const container = $container[0];
  expect(container.scrollWidth).to.be.at.most(container.clientWidth);
};

describe("container-aware component responsiveness", () => {
  beforeEach(() => {
    cy.viewport(1200, 800);
  });

  implementations.forEach(({ name, library }) => {
    it(`${name} Card remains inside a 240px parent at a wide viewport`, () => {
      const { Card } = library;

      cy.mount(
        <div data-testid="card-container" style={{ width: 240 }}>
          <Card
            title="Container-aware card"
            description="A long unbroken value must remain contained"
            data-testid="responsive-card"
          >
            abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz
          </Card>
        </div>,
      );

      cy.get('[data-testid="card-container"]').should(expectContained);
      cy.get('[data-testid="responsive-card"]').then(($card) => {
        const cardRect = $card[0].getBoundingClientRect();
        cy.get('[data-testid="card-container"]').then(($container) => {
          const containerRect = $container[0].getBoundingClientRect();
          expect(cardRect.right).to.be.at.most(containerRect.right);
        });
      });
    });

    it(`${name} Pager adapts to a 320px parent independently of viewport width`, () => {
      const { Pager } = library;

      cy.mount(
        <div data-testid="pager-container" style={{ width: 320 }}>
          <Pager
            totalItems={100}
            itemsPerPage={10}
            currentPage={4}
            onPageChange={cy.stub()}
            data-testid="responsive-pager"
          />
        </div>,
      );

      cy.get('[data-testid="pager-container"]').should(expectContained);
      cy.get('[data-testid="responsive-pager-page-list"]')
        .should("have.css", "flex-wrap", "wrap")
        .and("have.css", "flex-basis", "100%");
    });

    it(`${name} Pager keeps its full row above the 30rem container threshold`, () => {
      const { Pager } = library;

      cy.mount(
        <div data-testid="pager-container" style={{ width: 500 }}>
          <Pager
            totalItems={50}
            itemsPerPage={10}
            currentPage={3}
            onPageChange={cy.stub()}
            data-testid="responsive-pager"
          />
        </div>,
      );

      cy.get('[data-testid="pager-container"]').should(expectContained);
      cy.get('[data-testid="responsive-pager-page-list"]').should(
        "have.css",
        "flex-basis",
        "auto",
      );
    });
  });
});
