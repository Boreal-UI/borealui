/// <reference types="cypress" />

import { useState } from "react";
import * as Core from "../../src/index.core";
import * as Next from "../../src/index.next";
import type { Tab } from "../../src/components/Tabs/Tabs.types";

type TabsComponent = typeof Core.Tabs;

const keyboardTabs: Tab[] = [
  { id: "overview-tab", label: "Overview", panelId: "overview-panel" },
  { id: "disabled-tab", label: "Disabled", disabled: true },
  { id: "usage-tab", label: "Usage", panelId: "usage-panel" },
  { id: "settings-tab", label: "Settings", panelId: "settings-panel" },
];

const ControlledTabsHarness = ({ Tabs }: { Tabs: TabsComponent }) => {
  const [value, setValue] = useState(0);
  const [tabs, setTabs] = useState(keyboardTabs);

  return (
    <>
      <button type="button" onClick={() => setValue(2)}>
        Select usage
      </button>
      <button
        type="button"
        onClick={() =>
          setTabs((currentTabs) =>
            currentTabs.map((tab) =>
              tab.id === "usage-tab" ? { ...tab, disabled: true } : tab,
            ),
          )
        }
      >
        Disable usage
      </button>
      <Tabs
        tabs={tabs}
        value={value}
        onValueChange={setValue}
        data-testid="controlled-tabs"
      />
    </>
  );
};

const runTabsTests = (
  flavor: "core" | "next",
  Tabs: TabsComponent,
) => {
  describe(`${flavor} Tabs roving focus`, () => {
    beforeEach(() => {
      cy.viewport(800, 520);
    });

    it("uses one sequential tab stop and moves focus with navigation keys", () => {
      cy.mount(
        <div style={{ padding: 24 }}>
          <button type="button" data-testid="before-tabs">
            Before tabs
          </button>
          <Tabs tabs={keyboardTabs} data-testid="tabs" />
          <button type="button" data-testid="after-tabs">
            After tabs
          </button>
        </div>,
      );

      cy.get('[data-testid="tabs-tab-0"]')
        .should("have.attr", "aria-controls", "overview-panel")
        .and("have.attr", "tabindex", "0");
      cy.get('[data-testid="tabs-tab-1"]')
        .should("have.attr", "aria-disabled", "true")
        .and("have.attr", "tabindex", "-1");
      cy.get('[data-testid="tabs-tab-2"]').should(
        "have.attr",
        "tabindex",
        "-1",
      );

      cy.get('[data-testid="before-tabs"]').focus();
      cy.press(Cypress.Keyboard.Keys.TAB);
      cy.get('[data-testid="tabs-tab-0"]').should("be.focused");

      cy.press(Cypress.Keyboard.Keys.RIGHT);
      cy.get('[data-testid="tabs-tab-2"]')
        .should("be.focused")
        .and("have.attr", "aria-selected", "true")
        .and("have.attr", "tabindex", "0");

      cy.press(Cypress.Keyboard.Keys.END);
      cy.get('[data-testid="tabs-tab-3"]').should("be.focused");

      cy.press(Cypress.Keyboard.Keys.HOME);
      cy.get('[data-testid="tabs-tab-0"]').should("be.focused");

      cy.press(Cypress.Keyboard.Keys.RIGHT);
      cy.get('[data-testid="tabs-tab-2"]').should("be.focused");
      cy.press(Cypress.Keyboard.Keys.TAB);
      cy.get('[data-testid="after-tabs"]').should("be.focused");
    });

    it("keeps the roving target valid across controlled and disabled updates", () => {
      cy.mount(<ControlledTabsHarness Tabs={Tabs} />);

      cy.contains("Select usage").click();
      cy.get('[data-testid="controlled-tabs-tab-2"]')
        .should("have.attr", "aria-selected", "true")
        .and("have.attr", "tabindex", "0");

      cy.contains("Disable usage").click();
      cy.get('[data-testid="controlled-tabs-tab-2"]')
        .should("have.attr", "aria-disabled", "true")
        .and("have.attr", "tabindex", "-1");
      cy.get('[data-testid="controlled-tabs-tab-0"]').should(
        "have.attr",
        "tabindex",
        "0",
      );
    });
  });
};

runTabsTests("core", Core.Tabs);
runTabsTests("next", Next.Tabs);
