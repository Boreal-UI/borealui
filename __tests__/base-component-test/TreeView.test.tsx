import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
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
