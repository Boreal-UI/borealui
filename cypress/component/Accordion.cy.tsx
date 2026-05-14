/// <reference types="cypress" />

import React, { useState } from "react";
import * as Core from "../../src/index.core";
import * as Next from "../../src/index.next";

type AccordionComponent = typeof Core.Accordion;

const TestExpandedIcon = () => (
  <span data-testid="custom-expanded-icon" aria-hidden="true">
    Opened
  </span>
);

const TestCollapsedIcon = () => (
  <span data-testid="custom-collapsed-icon" aria-hidden="true">
    Closed
  </span>
);

const mountAccordion = (
  Accordion: AccordionComponent,
  props: Partial<React.ComponentProps<AccordionComponent>> = {},
  wrapperStyle: React.CSSProperties = {},
) => {
  cy.mount(
    <div
      data-cy="accordion-test-root"
      style={{
        minHeight: 360,
        padding: 24,
        ...wrapperStyle,
      }}
    >
      <Accordion title="Accordion title" data-testid="accordion" {...props}>
        <p data-testid="accordion-child">Accordion content</p>
      </Accordion>
    </div>,
  );
};

const getToggle = (testId = "accordion") =>
  cy.get(`[data-testid="${testId}-accordion-toggle"]`);

const getContent = (testId = "accordion") =>
  cy.get(`[data-testid="${testId}-content"]`);

const getIcon = (testId = "accordion") =>
  cy.get(`[data-testid="${testId}-icon"]`);

const getTitle = (testId = "accordion") =>
  cy.get(`[data-testid="${testId}-title"]`);

const runAccordionTests = (
  flavor: "core" | "next",
  Accordion: AccordionComponent,
) => {
  describe(`${flavor} Accordion behavior`, () => {
    beforeEach(() => {
      cy.viewport(900, 620);
    });

    it("renders the title, toggle button, icon, and content region", () => {
      mountAccordion(Accordion);

      getToggle()
        .should("exist")
        .and("have.attr", "type", "button")
        .and("have.attr", "aria-expanded", "false")
        .and("have.attr", "aria-controls");

      getTitle().should("have.text", "Accordion title");

      getIcon()
        .should("exist")
        .and("have.attr", "aria-hidden", "true")
        .and("have.text", "+");

      getContent()
        .should("exist")
        .and("have.attr", "role", "region")
        .and("have.attr", "data-state", "collapsed");

      cy.get('[data-testid="accordion-child"]').should("exist");
    });

    it("toggles open and closed when clicked and calls onToggle with the next expanded state", () => {
      const onToggle = cy.stub().as("onToggle");

      mountAccordion(Accordion, {
        onToggle,
      });

      getToggle().should("have.attr", "aria-expanded", "false");
      getContent().should("have.attr", "data-state", "collapsed");
      getIcon().should("have.text", "+");

      getToggle().click();

      getToggle().should("have.attr", "aria-expanded", "true");
      getContent().should("have.attr", "data-state", "open");
      getIcon().should("have.text", "−");
      cy.get("@onToggle").should("have.been.calledOnceWith", true);

      getToggle().click();

      getToggle().should("have.attr", "aria-expanded", "false");
      getContent().should("have.attr", "data-state", "collapsed");
      getIcon().should("have.text", "+");
      cy.get("@onToggle").should("have.been.calledTwice");
      cy.get("@onToggle").should("have.been.calledWith", false);
    });

    it("supports keyboard toggling with Enter and Space and calls onToggle", () => {
      const onToggle = cy.stub().as("onToggle");

      mountAccordion(Accordion, {
        onToggle,
      });

      getToggle().focus().trigger("keydown", { key: "Enter" });

      getToggle().should("have.attr", "aria-expanded", "true");
      getContent().should("have.attr", "data-state", "open");
      cy.get("@onToggle").should("have.been.calledOnceWith", true);

      getToggle().trigger("keydown", { key: " " });

      getToggle().should("have.attr", "aria-expanded", "false");
      getContent().should("have.attr", "data-state", "collapsed");
      cy.get("@onToggle").should("have.been.calledTwice");
      cy.get("@onToggle").should("have.been.calledWith", false);
    });

    it("ignores unsupported keyboard input", () => {
      mountAccordion(Accordion, {
        onToggle: cy.stub().as("onToggle"),
      });

      getToggle().focus().trigger("keydown", { key: "Escape" });

      getToggle().should("have.attr", "aria-expanded", "false");
      getContent().should("have.attr", "data-state", "collapsed");
      cy.get("@onToggle").should("not.have.been.called");
    });

    it("supports initiallyExpanded in uncontrolled mode", () => {
      mountAccordion(Accordion, {
        initiallyExpanded: true,
      });

      getToggle().should("have.attr", "aria-expanded", "true");
      getContent().should("have.attr", "data-state", "open");
      getIcon().should("have.text", "−");
    });

    it("supports controlled expanded state", () => {
      const onToggle = cy.stub().as("onToggle");

      interface ControlledAccordionState {
        expanded: boolean;
      }

      interface OnToggleHandler {
        (nextExpanded: boolean): void;
      }

      const ControlledAccordion = (): React.ReactElement => {
        const [expanded, setExpanded] = useState<boolean>(false);

        const handleToggle: OnToggleHandler = (nextExpanded: boolean): void => {
          onToggle(nextExpanded);
          setExpanded(nextExpanded);
        };

        return (
          <div data-cy="accordion-test-root">
            <button
              type="button"
              data-testid="external-open"
              onClick={(): void => setExpanded(true)}
            >
              Open externally
            </button>

            <button
              type="button"
              data-testid="external-close"
              onClick={(): void => setExpanded(false)}
            >
              Close externally
            </button>

            <Accordion
              title="Controlled accordion"
              data-testid="accordion"
              expanded={expanded}
              onToggle={handleToggle}
            >
              <p data-testid="accordion-child">Controlled content</p>
            </Accordion>
          </div>
        );
      };

      cy.mount(<ControlledAccordion />);

      getToggle().should("have.attr", "aria-expanded", "false");
      getContent().should("have.attr", "data-state", "collapsed");

      getToggle().click();

      cy.get("@onToggle").should("have.been.calledOnceWith", true);
      getToggle().should("have.attr", "aria-expanded", "true");
      getContent().should("have.attr", "data-state", "open");

      cy.get('[data-testid="external-close"]').click();

      getToggle().should("have.attr", "aria-expanded", "false");
      getContent().should("have.attr", "data-state", "collapsed");

      cy.get('[data-testid="external-open"]').click();

      getToggle().should("have.attr", "aria-expanded", "true");
      getContent().should("have.attr", "data-state", "open");
    });

    it("calls onToggle in controlled mode without changing visual state unless parent updates expanded", () => {
      mountAccordion(Accordion, {
        expanded: false,
        onToggle: cy.stub().as("onToggle"),
      });

      getToggle().click();

      cy.get("@onToggle").should("have.been.calledOnceWith", true);
      getToggle().should("have.attr", "aria-expanded", "false");
      getContent().should("have.attr", "data-state", "collapsed");
    });

    it("allows opening but prevents collapsing when no-collapse is true", () => {
      mountAccordion(Accordion, {
        "no-collapse": true,
        onToggle: cy.stub().as("onToggle"),
      });

      getToggle().should("have.attr", "aria-expanded", "false");
      getContent().should("have.attr", "data-state", "collapsed");
      getIcon().should("have.text", "+");

      getToggle().click();

      getToggle().should("have.attr", "aria-expanded", "true");
      getContent().should("have.attr", "data-state", "open");
      cy.get("@onToggle").should("have.been.calledOnceWith", true);

      getToggle().click();

      getToggle().should("have.attr", "aria-expanded", "true");
      getContent().should("have.attr", "data-state", "open");

      cy.get("@onToggle").should("have.been.calledOnce");
    });

    it("does not toggle when disabled", () => {
      mountAccordion(Accordion, {
        disabled: true,
        onToggle: cy.stub().as("onToggle"),
      });

      getToggle()
        .should("be.disabled")
        .and("have.attr", "aria-disabled", "true")
        .and("have.attr", "tabindex", "-1");

      getToggle().click({ force: true });

      getToggle().should("have.attr", "aria-expanded", "false");
      getContent().should("have.attr", "data-state", "collapsed");
      cy.get("@onToggle").should("not.have.been.called");
    });

    it("supports custom expanded and collapsed icons", () => {
      mountAccordion(Accordion, {
        customCollapsedIcon: <TestCollapsedIcon />,
        customExpandedIcon: <TestExpandedIcon />,
      });

      cy.get('[data-testid="custom-collapsed-icon"]').should("exist");
      cy.get('[data-testid="custom-expanded-icon"]').should("not.exist");

      getToggle().click();

      cy.get('[data-testid="custom-collapsed-icon"]').should("not.exist");
      cy.get('[data-testid="custom-expanded-icon"]').should("exist");
    });

    it("places the icon on the left when iconPosition is left", () => {
      mountAccordion(Accordion, {
        iconPosition: "left",
      });

      getToggle().within(() => {
        cy.get('[data-testid="accordion-icon"]').then(($icon) => {
          cy.get('[data-testid="accordion-title"]').then(($title) => {
            const children = Array.from($icon.parent().children());

            expect(children.indexOf($icon[0])).to.be.lessThan(
              children.indexOf($title[0]),
            );
          });
        });
      });
    });

    it("places the icon on the right by default", () => {
      mountAccordion(Accordion);

      getToggle().within(() => {
        cy.get('[data-testid="accordion-title"]').then(($title) => {
          cy.get('[data-testid="accordion-icon"]').then(($icon) => {
            const children = Array.from($title.parent().children());

            expect(children.indexOf($title[0])).to.be.lessThan(
              children.indexOf($icon[0]),
            );
          });
        });
      });
    });

    it("renders children while collapsed when lazyLoad is false", () => {
      mountAccordion(Accordion, {
        lazyLoad: false,
      });

      getContent().should("have.attr", "data-state", "collapsed");
      cy.get('[data-testid="accordion-child"]').should("exist");
    });

    it("supports lazyLoad by delaying child render until expanded", () => {
      mountAccordion(Accordion, {
        lazyLoad: true,
      });

      cy.get('[data-testid="accordion-child"]').should("not.exist");

      getToggle().click();

      cy.get('[data-testid="accordion-child"]').should("exist");
      getContent().should("have.attr", "data-state", "open");
    });

    it("keeps lazy-loaded content mounted after first expansion", () => {
      mountAccordion(Accordion, {
        lazyLoad: true,
      });

      cy.get('[data-testid="accordion-child"]').should("not.exist");

      getToggle().click();
      cy.get('[data-testid="accordion-child"]').should("exist");

      getToggle().click();

      getContent().should("have.attr", "data-state", "collapsed");
      cy.get('[data-testid="accordion-child"]').should("exist");
    });

    it("renders async loading state before showing content when initially expanded", () => {
      cy.clock();

      mountAccordion(Accordion, {
        initiallyExpanded: true,
        asyncContent: true,
        loadingAriaLabel: "Loading accordion details",
      });

      getContent()
        .should("have.attr", "data-state", "open")
        .and("have.attr", "aria-busy", "true");

      cy.get('[data-testid="accordion-loading"]')
        .should("exist")
        .and("have.attr", "aria-live", "polite")
        .and("have.attr", "aria-atomic", "true")
        .and("have.text", "Loading accordion details");

      cy.get('[data-testid="accordion-child"]').should("not.exist");

      cy.tick(1000);

      cy.get('[data-testid="accordion-loading"]').should("not.exist");
      getContent().should("not.have.attr", "aria-busy");
      cy.get('[data-testid="accordion-child"]').should("exist");
    });

    it("starts async loading when opened by the user", () => {
      cy.clock();

      mountAccordion(Accordion, {
        asyncContent: true,
      });

      getToggle().click();

      getContent()
        .should("have.attr", "data-state", "open")
        .and("have.attr", "aria-busy", "true");

      cy.get('[data-testid="accordion-loading"]')
        .should("exist")
        .and("have.text", "Loading content");

      cy.get('[data-testid="accordion-child"]').should("not.exist");

      cy.tick(1000);

      cy.get('[data-testid="accordion-loading"]').should("not.exist");
      cy.get('[data-testid="accordion-child"]').should("exist");
    });

    it("uses id for accessible button and content relationships", () => {
      mountAccordion(Accordion, {
        id: "faq-shipping",
      });

      getToggle()
        .should("have.attr", "id", "faq-shipping-button")
        .and("have.attr", "aria-controls", "faq-shipping-content");

      getContent()
        .should("have.attr", "id", "faq-shipping-content")
        .and("have.attr", "aria-labelledby", "faq-shipping-button");
    });

    it("generates unique ids for multiple accordions", () => {
      cy.mount(
        <div data-cy="accordion-test-root">
          <Accordion title="First accordion" data-testid="first">
            First content
          </Accordion>

          <Accordion title="Second accordion" data-testid="second">
            Second content
          </Accordion>
        </div>,
      );

      cy.get('[data-testid="first-accordion-toggle"]')
        .invoke("attr", "id")
        .then((firstButtonId) => {
          cy.get('[data-testid="second-accordion-toggle"]')
            .invoke("attr", "id")
            .should("not.equal", firstButtonId);
        });

      cy.get('[data-testid="first-content"]')
        .invoke("attr", "id")
        .then((firstContentId) => {
          cy.get('[data-testid="second-content"]')
            .invoke("attr", "id")
            .should("not.equal", firstContentId);
        });
    });

    it("supports testId prop for test id generation", () => {
      cy.mount(
        <div data-cy="accordion-test-root">
          <Accordion title="Custom test id" testId="custom-accordion">
            Custom content
          </Accordion>
        </div>,
      );

      cy.get('[data-testid="custom-accordion-accordion-toggle"]').should(
        "exist",
      );
      cy.get('[data-testid="custom-accordion-title"]').should("exist");
      cy.get('[data-testid="custom-accordion-icon"]').should("exist");
      cy.get('[data-testid="custom-accordion-content"]').should("exist");
    });

    it("supports data-testid as a backward-compatible test id alias", () => {
      mountAccordion(Accordion, {
        "data-testid": "data-accordion",
      });

      cy.get('[data-testid="data-accordion-accordion-toggle"]').should("exist");
      cy.get('[data-testid="data-accordion-title"]').should("exist");
      cy.get('[data-testid="data-accordion-icon"]').should("exist");
      cy.get('[data-testid="data-accordion-content"]').should("exist");
    });

    it("supports aria-label on the toggle button", () => {
      mountAccordion(Accordion, {
        "aria-label": "Toggle shipping details",
      });

      getToggle().should("have.attr", "aria-label", "Toggle shipping details");
    });

    it("supports aria-labelledby and aria-describedby on the toggle button", () => {
      cy.mount(
        <div data-cy="accordion-test-root">
          <span id="external-label">External label</span>
          <span id="external-description">External description</span>

          <Accordion
            title="Visible title"
            data-testid="accordion"
            aria-labelledby="external-label"
            aria-describedby="external-description"
          >
            Accordion content
          </Accordion>
        </div>,
      );

      getToggle()
        .should("have.attr", "aria-labelledby", "external-label")
        .and("have.attr", "aria-describedby", "external-description");
    });

    it("adds description id to aria-describedby when description is provided", () => {
      mountAccordion(Accordion, {
        id: "details",
        description: "Screen reader description",
        "aria-describedby": "external-help",
      });

      cy.get('[data-testid="accordion-description"]')
        .should("exist")
        .and("have.attr", "id", "details-desc")
        .and("have.text", "Screen reader description");

      getToggle().should(
        "have.attr",
        "aria-describedby",
        "details-desc external-help",
      );
    });

    it("supports custom region aria-label", () => {
      mountAccordion(Accordion, {
        regionAriaLabel: "Accordion answer",
      });

      getContent()
        .should("have.attr", "aria-label", "Accordion answer")
        .and("not.have.attr", "aria-labelledby");
    });

    it("supports custom region aria-labelledby and aria-describedby", () => {
      cy.mount(
        <div data-cy="accordion-test-root">
          <span id="region-label">Region label</span>
          <span id="region-description">Region description</span>

          <Accordion
            title="Accordion title"
            data-testid="accordion"
            regionAriaLabelledBy="region-label"
            regionAriaDescribedBy="region-description"
          >
            Accordion content
          </Accordion>
        </div>,
      );

      getContent()
        .should("have.attr", "aria-labelledby", "region-label")
        .and("have.attr", "aria-describedby", "region-description");
    });

    it("forwards wrapper-level role and className", () => {
      mountAccordion(Accordion, {
        role: "group",
        className: "custom-wrapper",
      });

      cy.get(".custom-wrapper")
        .should("exist")
        .and("have.attr", "role", "group");
    });

    it("uses id for accordion internals, not as a root wrapper id", () => {
      mountAccordion(Accordion, {
        id: "content-id",
      });

      cy.get("#content-id").should("not.exist");

      getToggle().should("have.attr", "id", "content-id-button");
      getContent().should("have.attr", "id", "content-id-content");
    });

    it("does not set aria-disabled when enabled", () => {
      mountAccordion(Accordion);

      getToggle().should("not.have.attr", "aria-disabled");
    });

    it("does not set aria-busy when asyncContent is false", () => {
      mountAccordion(Accordion, {
        initiallyExpanded: true,
      });

      getContent().should("not.have.attr", "aria-busy");
    });

    it("applies visual variant props without breaking behavior", () => {
      mountAccordion(Accordion, {
        theme: "secondary",
        state: "success",
        size: "large",
        shadow: "strong",
        rounding: "large",
        outline: true,
        glass: true,
      });

      getToggle().click();

      getToggle().should("have.attr", "aria-expanded", "true");
      getContent().should("have.attr", "data-state", "open");
      cy.get('[data-testid="accordion-child"]').should("exist");
    });

    it("does not render loading content unless async loading is active", () => {
      mountAccordion(Accordion, {
        initiallyExpanded: true,
        asyncContent: false,
      });

      cy.get('[data-testid="accordion-loading"]').should("not.exist");
      cy.get('[data-testid="accordion-child"]').should("exist");
    });
  });
};

runAccordionTests("core", Core.Accordion);
runAccordionTests("next", Next.Accordion);
