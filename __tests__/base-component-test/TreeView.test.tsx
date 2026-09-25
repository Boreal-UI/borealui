import React from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import "@testing-library/jest-dom";
import { axe, toHaveNoViolations } from "jest-axe";
import TreeViewBase from "@/components/TreeView/TreeViewBase";

expect.extend(toHaveNoViolations);

const classMap = {
  root: "root",
  list: "list",
  group: "group",
  item: "item",
  node: "node",
  selected: "selected",
  nodeDisabled: "nodeDisabled",
  disclosure: "disclosure",
  icon: "icon",
  label: "label",
  loader: "loader",
  primary: "primary",
  shadowLight: "shadowLight",
  roundMedium: "roundMedium",
};

const items = [
  {
    id: "components",
    label: "Components",
    children: [{ id: "button", label: "Button" }],
  },
  { id: "tokens", label: "Tokens" },
];

const projectItems = [
  {
    id: "projects",
    label: "Projects",
    children: [
      {
        id: "active",
        label: "Active",
        children: [
          { id: "boreal", label: "Boreal UI" },
          { id: "cedarweave", label: "Cedarweave" },
        ],
      },
      { id: "archived", label: "Archived" },
    ],
  },
];

describe("TreeViewBase", () => {
  it("renders tree items and expands nested nodes", () => {
    render(<TreeViewBase classMap={classMap} items={items} />);

    expect(screen.getByRole("tree", { name: "Tree" })).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("tree-view-node-components"));
    expect(screen.getByTestId("tree-view-node-button")).toBeInTheDocument();
  });

  it("fires selection and expansion callbacks", () => {
    const onSelectionChange = jest.fn();
    const onExpandedChange = jest.fn();
    render(
      <TreeViewBase
        classMap={classMap}
        items={items}
        onSelectionChange={onSelectionChange}
        onExpandedChange={onExpandedChange}
      />,
    );

    fireEvent.click(screen.getByTestId("tree-view-node-components"));

    expect(onSelectionChange).toHaveBeenCalledWith("components", items[0]);
    expect(onExpandedChange).toHaveBeenCalledWith(["components"]);
  });

  it("runs consumer blur capture first and honors cancellation", async () => {
    const onBlurCapture = jest.fn(
      (event: React.FocusEvent<HTMLDivElement>) => event.preventDefault(),
    );
    const view = (expandedIds: string[]) => (
      <>
        <button type="button" data-testid="outside-tree">
          Outside
        </button>
        <TreeViewBase
          classMap={classMap}
          items={items}
          expandedIds={expandedIds}
          onBlurCapture={onBlurCapture}
        />
      </>
    );
    const { rerender } = render(view(["components"]));
    const child = screen.getByTestId("tree-view-node-button");
    const outside = screen.getByTestId("outside-tree");

    act(() => child.focus());
    fireEvent.blur(screen.getByTestId("tree-view"), {
      relatedTarget: outside,
    });
    act(() => outside.focus());
    rerender(view([]));

    expect(onBlurCapture).toHaveBeenCalled();
    await waitFor(() =>
      expect(screen.getByTestId("tree-view-node-components")).toHaveFocus(),
    );
  });

  it("supports keyboard expansion and selection", () => {
    const onSelectionChange = jest.fn();
    render(
      <TreeViewBase
        classMap={classMap}
        items={items}
        onSelectionChange={onSelectionChange}
      />,
    );

    const node = screen.getByTestId("tree-view-node-components");
    fireEvent.keyDown(node, { key: "ArrowRight" });
    fireEvent.keyDown(node, { key: "Enter" });

    expect(screen.getByTestId("tree-view-node-button")).toBeInTheDocument();
    expect(onSelectionChange).toHaveBeenCalledWith("components", items[0]);
  });

  it("renders one roving tab stop and skips disabled nodes", () => {
    render(
      <TreeViewBase
        classMap={classMap}
        items={[
          { id: "disabled", label: "Disabled", disabled: true },
          ...items,
        ]}
      />,
    );

    const nodes = screen.getAllByRole("treeitem");
    expect(nodes.filter((node) => node.tabIndex === 0)).toHaveLength(1);
    expect(screen.getByRole("treeitem", { name: "Components" })).toHaveAttribute(
      "tabindex",
      "0",
    );
    expect(screen.getByRole("treeitem", { name: "Disabled" })).toHaveAttribute(
      "tabindex",
      "-1",
    );
    expect(screen.getByRole("treeitem", { name: "Tokens" })).toHaveAttribute(
      "tabindex",
      "-1",
    );
  });

  it("renders deterministic roving tabindex during SSR", () => {
    const markup = renderToStaticMarkup(
      <TreeViewBase
        classMap={classMap}
        items={projectItems}
        defaultExpandedIds={["projects"]}
        defaultSelectedId="active"
      />,
    );

    expect(markup.match(/tabindex="0"/g)).toHaveLength(1);
    expect(markup.match(/tabindex="-1"/g)).toHaveLength(2);
    expect(markup).not.toContain("Boreal UI");
  });

  it("leaves all nodes outside the tab sequence when none are focusable", () => {
    render(<TreeViewBase classMap={classMap} items={items} disabled />);

    expect(screen.getAllByRole("treeitem")).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ tabIndex: -1 }),
        expect.objectContaining({ tabIndex: -1 }),
      ]),
    );
  });

  it("moves with ArrowDown and ArrowUp through visible nodes without wrapping", () => {
    render(
      <TreeViewBase
        classMap={classMap}
        items={projectItems}
        defaultExpandedIds={["projects", "active"]}
      />,
    );

    const projects = screen.getByRole("treeitem", { name: "Projects" });
    const active = screen.getByRole("treeitem", { name: "Active" });
    const boreal = screen.getByRole("treeitem", { name: "Boreal UI" });
    act(() => projects.focus());

    fireEvent.keyDown(projects, { key: "ArrowDown" });
    expect(active).toHaveFocus();
    fireEvent.keyDown(active, { key: "ArrowDown" });
    expect(boreal).toHaveFocus();
    fireEvent.keyDown(boreal, { key: "ArrowUp" });
    expect(active).toHaveFocus();
    fireEvent.keyDown(active, { key: "ArrowUp" });
    expect(projects).toHaveFocus();
  });

  it("excludes collapsed descendants from visible navigation", () => {
    render(<TreeViewBase classMap={classMap} items={projectItems} />);

    const projects = screen.getByRole("treeitem", { name: "Projects" });
    act(() => projects.focus());
    fireEvent.keyDown(projects, { key: "ArrowDown" });

    expect(projects).toHaveFocus();
    expect(screen.queryByRole("treeitem", { name: "Active" })).toBeNull();
  });

  it("expands a collapsed parent with ArrowRight then enters its first child", () => {
    render(<TreeViewBase classMap={classMap} items={projectItems} />);

    const projects = screen.getByRole("treeitem", { name: "Projects" });
    act(() => projects.focus());
    fireEvent.keyDown(projects, { key: "ArrowRight" });
    expect(projects).toHaveAttribute("aria-expanded", "true");

    const active = screen.getByRole("treeitem", { name: "Active" });
    fireEvent.keyDown(projects, { key: "ArrowRight" });
    expect(active).toHaveFocus();
  });

  it("collapses an expanded parent with ArrowLeft and moves a child to its parent", () => {
    render(
      <TreeViewBase
        classMap={classMap}
        items={projectItems}
        defaultExpandedIds={["projects", "active"]}
      />,
    );

    const projects = screen.getByRole("treeitem", { name: "Projects" });
    const active = screen.getByRole("treeitem", { name: "Active" });
    const boreal = screen.getByRole("treeitem", { name: "Boreal UI" });

    act(() => boreal.focus());
    fireEvent.keyDown(boreal, { key: "ArrowLeft" });
    expect(active).toHaveFocus();
    fireEvent.keyDown(active, { key: "ArrowLeft" });
    expect(active).toHaveAttribute("aria-expanded", "false");
    expect(projects).not.toHaveFocus();
  });

  it("moves Home and End across the current visible tree", () => {
    render(
      <TreeViewBase
        classMap={classMap}
        items={projectItems}
        defaultExpandedIds={["projects", "active"]}
      />,
    );

    const projects = screen.getByRole("treeitem", { name: "Projects" });
    const archived = screen.getByRole("treeitem", { name: "Archived" });
    act(() => projects.focus());
    fireEvent.keyDown(projects, { key: "End" });
    expect(archived).toHaveFocus();
    fireEvent.keyDown(archived, { key: "Home" });
    expect(projects).toHaveFocus();
  });

  it("keeps arrow focus separate from Enter and Space selection", () => {
    const onSelectionChange = jest.fn();
    render(
      <TreeViewBase
        classMap={classMap}
        items={items}
        onSelectionChange={onSelectionChange}
      />,
    );

    const components = screen.getByRole("treeitem", { name: "Components" });
    const tokens = screen.getByRole("treeitem", { name: "Tokens" });
    act(() => components.focus());
    fireEvent.keyDown(components, { key: "ArrowDown" });
    expect(tokens).toHaveFocus();
    expect(onSelectionChange).not.toHaveBeenCalled();
    fireEvent.keyDown(tokens, { key: "Enter" });
    fireEvent.keyDown(tokens, { key: " " });
    expect(onSelectionChange).toHaveBeenCalledTimes(2);
    expect(onSelectionChange).toHaveBeenLastCalledWith("tokens", items[1]);
  });

  it("requests controlled expansion without pretending props changed", () => {
    const onExpandedChange = jest.fn();
    const { rerender } = render(
      <TreeViewBase
        classMap={classMap}
        items={items}
        expandedIds={[]}
        onExpandedChange={onExpandedChange}
      />,
    );

    const components = screen.getByRole("treeitem", { name: "Components" });
    fireEvent.keyDown(components, { key: "ArrowRight" });
    expect(onExpandedChange).toHaveBeenCalledWith(["components"]);
    expect(components).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("treeitem", { name: "Button" })).toBeNull();

    rerender(
      <TreeViewBase
        classMap={classMap}
        items={items}
        expandedIds={["components"]}
        onExpandedChange={onExpandedChange}
      />,
    );
    fireEvent.keyDown(components, { key: "ArrowRight" });
    expect(screen.getByRole("treeitem", { name: "Button" })).toHaveFocus();
  });

  it("recovers to a visible ancestor when collapse hides the active node", async () => {
    const { rerender } = render(
      <TreeViewBase
        classMap={classMap}
        items={projectItems}
        expandedIds={["projects", "active"]}
      />,
    );

    act(() => screen.getByRole("treeitem", { name: "Boreal UI" }).focus());
    rerender(
      <TreeViewBase
        classMap={classMap}
        items={projectItems}
        expandedIds={[]}
      />,
    );

    const projects = screen.getByRole("treeitem", { name: "Projects" });
    await waitFor(() => expect(projects).toHaveFocus());
    expect(projects).toHaveAttribute("tabindex", "0");
  });

  it("recovers when the active node is removed and preserves identity on reorder", async () => {
    const { rerender } = render(
      <TreeViewBase classMap={classMap} items={items} />,
    );
    const tokens = screen.getByRole("treeitem", { name: "Tokens" });
    act(() => tokens.focus());

    rerender(
      <TreeViewBase classMap={classMap} items={[items[1], items[0]]} />,
    );
    expect(screen.getByRole("treeitem", { name: "Tokens" })).toHaveFocus();
    expect(screen.getByRole("treeitem", { name: "Tokens" })).toHaveAttribute(
      "tabindex",
      "0",
    );

    rerender(<TreeViewBase classMap={classMap} items={[items[0]]} />);
    const components = screen.getByRole("treeitem", { name: "Components" });
    await waitFor(() => expect(components).toHaveFocus());
    expect(components).toHaveAttribute("tabindex", "0");
  });

  it("includes newly inserted visible children and handles an empty replacement", () => {
    const initial = [{ id: "root", label: "Root", children: [] }];
    const { rerender } = render(
      <TreeViewBase
        classMap={classMap}
        items={initial}
        expandedIds={["root"]}
      />,
    );
    const root = screen.getByRole("treeitem", { name: "Root" });

    rerender(
      <TreeViewBase
        classMap={classMap}
        items={[
          {
            id: "root",
            label: "Root",
            children: [{ id: "new-child", label: "New child" }],
          },
        ]}
        expandedIds={["root"]}
      />,
    );
    fireEvent.keyDown(root, { key: "End" });
    expect(screen.getByRole("treeitem", { name: "New child" })).toHaveFocus();

    rerender(<TreeViewBase classMap={classMap} items={[]} />);
    expect(screen.queryByRole("tree")).toBeNull();
    expect(screen.queryByRole("treeitem")).toBeNull();
  });

  it("navigates arbitrary special-character IDs without selector parsing", () => {
    const specialItems = [
      {
        id: "root",
        label: "Root",
        children: [
          { id: 'node"quoted', label: "Quoted" },
          { id: "node\\backslash", label: "Backslash" },
          { id: "node[bracket]", label: "Bracket" },
          { id: "node with spaces", label: "Spaces" },
          { id: "节点-一", label: "Unicode" },
        ],
      },
    ];
    render(
      <TreeViewBase
        classMap={classMap}
        items={specialItems}
        defaultExpandedIds={["root"]}
      />,
    );

    const nodes = screen.getAllByRole("treeitem");
    act(() => nodes[0].focus());
    for (const nextNode of nodes.slice(1)) {
      expect(() =>
        fireEvent.keyDown(document.activeElement as Element, {
          key: "ArrowDown",
        }),
      ).not.toThrow();
      expect(nextNode).toHaveFocus();
    }
  });

  it("forwards refs to the root", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<TreeViewBase classMap={classMap} items={items} ref={ref} />);

    expect(ref.current).toBe(screen.getByTestId("tree-view"));
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <TreeViewBase
        classMap={classMap}
        items={items}
        defaultExpandedIds={["components"]}
      />,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
