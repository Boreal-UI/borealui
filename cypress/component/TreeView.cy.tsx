/// <reference types="cypress" />

import { useState } from "react";
import * as Core from "../../src/index.core";
import * as Next from "../../src/index.next";
import type { TreeViewNode } from "../../src/components/TreeView/TreeView.types";

type TreeViewComponent = typeof Core.TreeView;

const treeItems: TreeViewNode[] = [
  {
    id: "projects",
    label: "Projects",
    children: [
      {
        id: "active",
        label: "Active",
        children: [
          { id: 'node"quoted', label: "Quoted" },
          { id: "node\\backslash", label: "Backslash" },
          { id: "node[bracket]", label: "Bracket" },
          { id: "node with spaces", label: "Spaces" },
          { id: "节点-一", label: "Unicode" },
        ],
      },
      { id: "disabled", label: "Disabled", disabled: true },
      { id: "archived", label: "Archived" },
    ],
  },
];

const DynamicCollapseHarness = ({
  TreeView,
}: {
  TreeView: TreeViewComponent;
}) => {
  const [expandedIds, setExpandedIds] = useState(["projects", "active"]);

  return (
    <>
      <button
        type="button"
        data-testid="collapse-tree"
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => setExpandedIds([])}
      >
        Collapse tree
      </button>
      <TreeView
        items={treeItems}
        expandedIds={expandedIds}
        onExpandedChange={setExpandedIds}
        data-testid="tree"
      />
    </>
  );
};

const treeItem = (name: string) => cy.contains('[role="treeitem"]', name);

const runTreeViewTests = (
  flavor: "core" | "next",
  TreeView: TreeViewComponent,
) => {
  describe(`${flavor} TreeView keyboard navigation`, () => {
    beforeEach(() => {
      cy.viewport(800, 600);
    });

    it("uses one sequential tab stop and navigates only visible nodes", () => {
      cy.mount(
        <div style={{ padding: 24 }}>
          <button type="button" data-testid="before-tree">
            Before tree
          </button>
          <TreeView
            items={treeItems}
            defaultExpandedIds={["projects"]}
            data-testid="tree"
          />
          <button type="button" data-testid="after-tree">
            After tree
          </button>
        </div>,
      );

      cy.get('[role="treeitem"][tabindex="0"]').should("have.length", 1);
      cy.get('[role="treeitem"][tabindex="-1"]').should("have.length", 3);
      treeItem("Disabled").should("be.disabled");

      cy.get('[data-testid="before-tree"]').focus();
      cy.press(Cypress.Keyboard.Keys.TAB);
      treeItem("Projects").should("be.focused");

      cy.press(Cypress.Keyboard.Keys.DOWN);
      treeItem("Active").should("be.focused");
      cy.press(Cypress.Keyboard.Keys.DOWN);
      treeItem("Archived").should("be.focused");
      cy.press(Cypress.Keyboard.Keys.UP);
      treeItem("Active").should("be.focused");

      cy.press(Cypress.Keyboard.Keys.END);
      treeItem("Archived").should("be.focused");
      cy.press(Cypress.Keyboard.Keys.HOME);
      treeItem("Projects").should("be.focused");

      cy.press(Cypress.Keyboard.Keys.TAB);
      cy.get('[data-testid="after-tree"]').should("be.focused");
    });

    it("implements hierarchical arrows with arbitrary node IDs", () => {
      const onSelectionChange = cy.stub().as("treeSelection");
      cy.mount(
        <TreeView
          items={treeItems}
          onSelectionChange={onSelectionChange}
          data-testid="tree"
        />,
      );

      treeItem("Projects").focus();
      cy.press(Cypress.Keyboard.Keys.RIGHT);
      treeItem("Projects").should("have.attr", "aria-expanded", "true");
      cy.press(Cypress.Keyboard.Keys.RIGHT);
      treeItem("Active").should("be.focused");
      cy.press(Cypress.Keyboard.Keys.RIGHT);
      treeItem("Active").should("have.attr", "aria-expanded", "true");
      cy.press(Cypress.Keyboard.Keys.RIGHT);
      treeItem("Quoted").should("be.focused");

      ["Backslash", "Bracket", "Spaces", "Unicode"].forEach((label) => {
        cy.press(Cypress.Keyboard.Keys.DOWN);
        treeItem(label).should("be.focused");
      });

      cy.press(Cypress.Keyboard.Keys.LEFT);
      treeItem("Active").should("be.focused");
      cy.press(Cypress.Keyboard.Keys.LEFT);
      treeItem("Active").should("have.attr", "aria-expanded", "false");

      cy.press(Cypress.Keyboard.Keys.SPACE);
      cy.get("@treeSelection").should("have.been.calledWith", "active");
    });

    it("recovers focus when controlled collapse hides the active descendant", () => {
      cy.mount(<DynamicCollapseHarness TreeView={TreeView} />);

      treeItem("Quoted").focus().should("be.focused");
      cy.get('[data-testid="collapse-tree"]').click();
      treeItem("Projects")
        .should("be.focused")
        .and("have.attr", "tabindex", "0");
      treeItem("Quoted").should("not.exist");
    });
  });
};

runTreeViewTests("core", Core.TreeView);
runTreeViewTests("next", Next.TreeView);
