import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { axe, toHaveNoViolations } from "jest-axe";
import SplitPaneBase from "@/components/SplitPane/SplitPaneBase";

expect.extend(toHaveNoViolations);

const classMap = {
  root: "root",
  startPane: "startPane",
  endPane: "endPane",
  separator: "separator",
  horizontal: "horizontal",
  vertical: "vertical",
  static: "static",
  loader: "loader",
  primary: "primary",
  disabled: "disabled",
  loading: "loading",
  shadowLight: "shadowLight",
  roundMedium: "roundMedium",
};

describe("SplitPaneBase", () => {
  it("renders start and end panes from props", () => {
    render(
      <SplitPaneBase
        classMap={classMap}
        startPane="Navigator"
        endPane="Details"
      />,
    );

    expect(screen.getByTestId("split-pane-start-pane")).toHaveTextContent(
      "Navigator",
    );
    expect(screen.getByTestId("split-pane-end-pane")).toHaveTextContent(
      "Details",
    );
    expect(screen.getByRole("separator")).toHaveAttribute(
      "aria-valuenow",
      "50",
    );
  });

  it("supports keyboard resizing", () => {
    const onSizeChange = jest.fn();
    render(
      <SplitPaneBase classMap={classMap} onSizeChange={onSizeChange}>
        <div>Start</div>
        <div>End</div>
      </SplitPaneBase>,
    );

    fireEvent.keyDown(screen.getByRole("separator"), { key: "ArrowRight" });

    expect(onSizeChange).toHaveBeenCalledWith(55);
  });

  it("disables the separator when not resizable", () => {
    render(
      <SplitPaneBase classMap={classMap} resizable={false}>
        <div>Start</div>
        <div>End</div>
      </SplitPaneBase>,
    );

    expect(screen.getByRole("separator")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    expect(screen.getByTestId("split-pane")).toHaveClass("static");
  });

  it("forwards refs to the root", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <SplitPaneBase classMap={classMap} ref={ref}>
        <div>Start</div>
        <div>End</div>
      </SplitPaneBase>,
    );

    expect(ref.current).toBe(screen.getByTestId("split-pane"));
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <SplitPaneBase classMap={classMap} startPane="Start" endPane="End" />,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
