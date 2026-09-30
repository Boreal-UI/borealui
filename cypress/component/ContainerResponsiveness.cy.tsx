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
    it(`${name} intrinsic controls remain contained in a 240px parent`, () => {
      const {
        DateTimePicker,
        EmptyState,
        MarkdownRenderer,
        MultiSelect,
        TimePicker,
      } = library;

      cy.mount(
        <div style={{ display: "grid", gap: 16 }}>
          <div data-testid="date-time-host" style={{ width: 240 }}>
            <DateTimePicker
              label="Starts"
              value="2026-05-12T10:00"
              onChange={cy.stub()}
              data-testid="responsive-date-time"
            />
          </div>
          <div data-testid="empty-state-host" style={{ width: 240 }}>
            <EmptyState
              title="No matching records"
              message="abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz"
              data-testid="responsive-empty-state"
            />
          </div>
          <div data-testid="markdown-host" style={{ width: 240 }}>
            <MarkdownRenderer
              content={
                "```text\nabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz\n```"
              }
              data-testid="responsive-markdown"
            />
          </div>
          <div data-testid="multi-select-host" style={{ width: 240 }}>
            <MultiSelect
              label="Frameworks"
              options={[
                { value: "react", label: "React with a very long label" },
                { value: "next", label: "Next.js" },
              ]}
              value={["react"]}
              onChange={cy.stub()}
              data-testid="responsive-multi-select"
            />
          </div>
          <div data-testid="time-host" style={{ width: 240 }}>
            <TimePicker
              label="Starts at"
              value="10:30"
              onChange={cy.stub()}
              data-testid="responsive-time"
            />
          </div>
        </div>,
      );

      [
        "date-time-host",
        "empty-state-host",
        "markdown-host",
        "multi-select-host",
        "time-host",
      ].forEach((testId) => {
        cy.get(`[data-testid="${testId}"]`).should(expectContained);
      });

      cy.get('[data-testid="responsive-markdown"] pre').then(($pre) => {
        expect($pre[0].scrollWidth).to.be.greaterThan($pre[0].clientWidth);
      });
      cy.document().then((documentRef) => {
        expect(documentRef.documentElement.scrollWidth).to.be.at.most(
          documentRef.documentElement.clientWidth,
        );
      });
    });

    it(`${name} adaptive layouts respond around component thresholds`, () => {
      const { Footer, Stepper, Tabs, Toolbar } = library;

      cy.mount(
        <div style={{ display: "grid", gap: 20 }}>
          <div data-testid="footer-below" style={{ width: 760 }}>
            <Footer links={[{ label: "Docs", href: "/docs" }]} data-testid="footer-narrow" />
          </div>
          <div data-testid="footer-above" style={{ width: 780 }}>
            <Footer links={[{ label: "Docs", href: "/docs" }]} data-testid="footer-wide" />
          </div>
          <div data-testid="stepper-below" style={{ width: 500 }}>
            <Stepper
              steps={[{ label: "Account details" }, { label: "Confirmation" }]}
              activeStep={0}
              data-testid="stepper-narrow"
            />
          </div>
          <div data-testid="stepper-above" style={{ width: 520 }}>
            <Stepper
              steps={[{ label: "Account details" }, { label: "Confirmation" }]}
              activeStep={0}
              data-testid="stepper-wide"
            />
          </div>
          <div data-testid="tabs-below" style={{ width: 370 }}>
            <Tabs tabs={[{ label: "Overview" }, { label: "Usage" }]} data-testid="tabs-narrow" />
          </div>
          <div data-testid="tabs-above" style={{ width: 390 }}>
            <Tabs tabs={[{ label: "Overview" }, { label: "Usage" }]} data-testid="tabs-wide" />
          </div>
          <div data-testid="toolbar-below" style={{ width: 560 }}>
            <Toolbar title="Editor" right={<button type="button">Action</button>} data-testid="toolbar-narrow" />
          </div>
          <div data-testid="toolbar-above" style={{ width: 590 }}>
            <Toolbar title="Editor" right={<button type="button">Action</button>} data-testid="toolbar-wide" />
          </div>
        </div>,
      );

      cy.get('[data-testid="footer-narrow"] > div').should("have.css", "flex-direction", "column");
      cy.get('[data-testid="footer-wide"] > div').should("have.css", "flex-direction", "row");
      cy.get('[data-testid="stepper-narrow-step-0"]').should("have.css", "width", "496px");
      cy.get('[data-testid="stepper-wide-step-0"]').should("not.have.css", "width", "512px");
      cy.get('[data-testid="tabs-narrow"] [role="tablist"]').should("have.css", "flex-direction", "column");
      cy.get('[data-testid="tabs-wide"] [role="tablist"]').should("have.css", "flex-direction", "row");
      cy.get('[data-testid="toolbar-narrow"] > div').first().should("have.css", "flex-basis", "100%");
      cy.get('[data-testid="toolbar-wide"] > div').first().should("not.have.css", "flex-basis", "100%");

      ["footer-below", "footer-above", "stepper-below", "stepper-above", "tabs-below", "tabs-above", "toolbar-below", "toolbar-above"].forEach((testId) => {
        cy.get(`[data-testid="${testId}"]`).should(expectContained);
      });
    });

    it(`${name} constrained navigation scrolls locally without page overflow`, () => {
      const { BreadCrumbPageHeader, SegmentedControl } = library;

      cy.mount(
        <div style={{ display: "grid", gap: 20 }}>
          <div data-testid="breadcrumb-host" style={{ width: 240 }}>
            <BreadCrumbPageHeader
              breadcrumbs={[
                { label: "Home", href: "#home" },
                { label: "Organization administration", href: "#organization" },
                { label: "Engineering platform", href: "#engineering" },
                { label: "Current destination" },
              ]}
              title="Platform settings"
              subtitle="Manage the current team"
              actions={<button type="button">Invite member</button>}
              data-testid="responsive-breadcrumb-header"
            />
          </div>
          <div data-testid="segmented-host" style={{ width: 240 }}>
            <SegmentedControl
              label="Reporting range"
              options={[
                { value: "day", label: "Previous twenty-four hours" },
                { value: "week", label: "Previous seven days" },
                { value: "month", label: "Previous thirty days" },
              ]}
              defaultValue="day"
              data-testid="responsive-segmented"
            />
          </div>
        </div>,
      );

      cy.get('[data-testid="responsive-breadcrumb-header-breadcrumbs"]').then(($breadcrumbs) => {
        expect($breadcrumbs[0].scrollWidth).to.be.greaterThan($breadcrumbs[0].clientWidth);
      });
      cy.get('[data-testid="responsive-breadcrumb-header-actions"] button').should("be.visible");
      cy.get('[data-testid="responsive-segmented-content"]').then(($content) => {
        expect($content[0].scrollWidth).to.be.greaterThan($content[0].clientWidth);
      });
      cy.get('[data-testid="responsive-segmented-option-day"]').focus().type("{end}");
      cy.get('[data-testid="responsive-segmented-option-month"]').should("be.focused");
      cy.get('[data-testid="responsive-segmented-content"]').its("0.scrollLeft").should("be.greaterThan", 0);

      cy.get('[data-testid="breadcrumb-host"]').should(expectContained);
      cy.get('[data-testid="segmented-host"]').should(expectContained);
      cy.document().then((documentRef) => {
        expect(documentRef.documentElement.scrollWidth).to.be.at.most(documentRef.documentElement.clientWidth);
      });
    });

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
