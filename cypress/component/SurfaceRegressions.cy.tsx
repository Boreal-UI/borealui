/// <reference types="cypress" />

import * as Core from "../../src/index.core";
import * as Next from "../../src/index.next";
import "../../src/styles/globals.scss";

const tabs = [{ label: "First" }, { label: "Middle" }, { label: "Last" }];

[{ name: "core", components: Core }, { name: "next", components: Next }].forEach(
  ({ name, components: { CircularProgress, PopOver, SegmentedControl, Tabs, Tooltip } }) => {
    describe(`${name} surface regressions`, () => {
      it("keeps state progress text distinct from its background", () => {
        cy.mount(<CircularProgress value={60} state="success" />);
        cy.get('[data-testid="circular-progress"] span').first().should(($text) => {
          const text = $text[0];
          expect(getComputedStyle(text).color).not.to.equal(
            getComputedStyle(text.parentElement!).backgroundColor,
          );
        });
      });

      it("pads the popover surface", () => {
        cy.mount(<PopOver trigger="Open" content="Popover content" />);
        cy.contains("Open").click();
        cy.get('[data-testid="popover-content"]').should(($surface) => {
          expect(parseFloat(getComputedStyle($surface[0]).paddingTop)).to.be.greaterThan(0);
        });
      });

      [false, true].forEach((equalWidth) => {
        it(`preserves option text width with equalWidth=${equalWidth}`, () => {
          cy.mount(
            <div style={{ width: 180 }}>
              <SegmentedControl equalWidth={equalWidth} options={[
                { value: "a", label: "A much longer option" },
                { value: "b", label: "Another lengthy option" },
              ]} />
            </div>,
          );
          cy.get('[role="radio"]').each(($option) => {
            expect($option[0].scrollWidth).to.be.at.most($option[0].clientWidth);
          });
        });
      });

      ["vertical", "container", "viewport"].forEach((layout) => {
        it(`rounds every tab in ${layout} stacking`, () => {
          cy.viewport(layout === "viewport" ? 300 : 800, 600);
          cy.mount(
            <div style={{ width: layout === "container" ? 280 : "100%" }}>
              <Tabs tabs={tabs} {...{ orientation: layout === "vertical" ? "vertical" : "horizontal" }} rounding="large" />
            </div>,
          );
          cy.get('[role="tablist"]').should("have.css", "flex-direction", "column");
          cy.get('[role="tab"]').each(($tab) => {
            const css = getComputedStyle($tab[0]);
            expect(parseFloat(css.borderTopLeftRadius)).to.be.greaterThan(0);
            expect(css.borderTopRightRadius).to.equal(css.borderTopLeftRadius);
            expect(css.borderBottomLeftRadius).to.equal(css.borderTopLeftRadius);
            expect(css.borderBottomRightRadius).to.equal(css.borderTopLeftRadius);
          });
        });
      });

      ["outline", "glassOutline"].forEach((variant) => {
        it(`renders a border for ${variant} tooltips`, () => {
          cy.mount(<Tooltip variant={variant as "outline" | "glassOutline"} content="Details"><button>Details</button></Tooltip>);
          cy.get('[data-testid="tooltip-trigger"]').focus();
          cy.get('[role="tooltip"]').should("have.css", "border-top-style", "solid").and("have.css", "border-top-width", "1px");
        });
      });
    });
  },
);
