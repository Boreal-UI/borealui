/// <reference types="cypress" />

import React from "react";
import {
  AppShell as CoreAppShell,
  BreadCrumbPageHeader as CoreBreadCrumbPageHeader,
  PageHeader as CorePageHeader,
  Portal as CorePortal,
  SplitPane as CoreSplitPane,
  TreeView as CoreTreeView,
} from "../../src/index.core";
import {
  AppShell as NextAppShell,
  BreadCrumbPageHeader as NextBreadCrumbPageHeader,
  PageHeader as NextPageHeader,
  Portal as NextPortal,
  SplitPane as NextSplitPane,
  TreeView as NextTreeView,
} from "../../src/index.next";

const implementations = [
  {
    name: "core",
    AppShell: CoreAppShell,
    BreadCrumbPageHeader: CoreBreadCrumbPageHeader,
    PageHeader: CorePageHeader,
    Portal: CorePortal,
    SplitPane: CoreSplitPane,
    TreeView: CoreTreeView,
  },
  {
    name: "next",
    AppShell: NextAppShell,
    BreadCrumbPageHeader: NextBreadCrumbPageHeader,
    PageHeader: NextPageHeader,
    Portal: NextPortal,
    SplitPane: NextSplitPane,
    TreeView: NextTreeView,
  },
];

const treeItems = [
  {
    id: "components",
    label: "Components",
    children: [{ id: "button", label: "Button" }],
  },
  { id: "tokens", label: "Tokens" },
];

implementations.forEach(
  ({
    name,
    AppShell,
    BreadCrumbPageHeader,
    PageHeader,
    Portal,
    SplitPane,
    TreeView,
  }) => {
    describe(`${name} layout primitives`, () => {
      it("renders page and shell composition", () => {
        cy.mount(
          <AppShell
            header={
              <PageHeader title="Dashboard" actions={<button>New</button>} />
            }
            sidebar="Navigation"
            aside="Inspector"
            footer="Footer"
            data-testid="shell"
          >
            <BreadCrumbPageHeader
              breadcrumbs={[
                { label: "Home", href: "/" },
                { label: "Dashboard" },
              ]}
              title="Dashboard"
              subtitle="Operational overview"
              data-testid="crumb-header"
            />
          </AppShell>,
        );

        cy.get('[data-testid="shell-header"]').contains("Dashboard");
        cy.get('[data-testid="shell-sidebar"]').contains("Navigation");
        cy.get('[data-testid="shell-aside"]').contains("Inspector");
        cy.get('[data-testid="crumb-header-breadcrumbs"]').contains("Home");
      });

      it("mounts portal content and supports split-pane keyboard resizing", () => {
        const onSizeChange = cy.stub().as("sizeChange");

        cy.mount(
          <div>
            <Portal data-testid="portal">Portaled content</Portal>
            <SplitPane onSizeChange={onSizeChange} data-testid="split">
              <div>Start pane</div>
              <div>End pane</div>
            </SplitPane>
          </div>,
        );

        cy.get('[data-testid="portal"]').contains("Portaled content");
        cy.get('[data-testid="split-separator"]').focus().type("{rightarrow}");
        cy.get("@sizeChange").should("have.been.calledWith", 55);
      });

      it("expands and selects tree nodes", () => {
        const onSelectionChange = cy.stub().as("treeSelect");
        const onExpandedChange = cy.stub().as("treeExpand");

        cy.mount(
          <TreeView
            items={treeItems}
            onSelectionChange={onSelectionChange}
            onExpandedChange={onExpandedChange}
            data-testid="tree"
          />,
        );

        cy.get('[data-testid="tree-node-components"]').click();
        cy.get('[data-testid="tree-node-button"]').should("exist");
        cy.get("@treeSelect").should("have.been.calledWith", "components");
        cy.get("@treeExpand").should("have.been.calledWith", ["components"]);
      });
    });
  },
);
