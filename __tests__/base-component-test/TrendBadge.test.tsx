import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { axe, toHaveNoViolations } from "jest-axe";
import TrendBadgeBase from "@/components/TrendBadge/TrendBadgeBase";

expect.extend(toHaveNoViolations);

const classMap = {
  root: "root",
  label: "label",
  chart: "chart",
  svg: "svg",
  line: "line",
  area: "area",
  point: "point",
  value: "value",
  loader: "loader",
  bar: "bar",
  gridLine: "gridLine",
  axisLabel: "axisLabel",
  track: "track",
  segment: "segment",
  center: "center",
  legend: "legend",
  legendItem: "legendItem",
  swatch: "swatch",
  list: "list",
  item: "item",
  text: "text",
  horizontal: "horizontal",
  vertical: "vertical",
  icon: "icon",
  up: "up",
  down: "down",
  flat: "flat",
  positive: "positive",
  negative: "negative",
  primary: "primary",
  secondary: "secondary",
  success: "success",
  error: "error",
  loading: "loading",
};

describe("TrendBadgeBase", () => {
  it("calculates upward deltas", () => {
    render(
      <TrendBadgeBase
        classMap={classMap}
        label="Revenue"
        value={120}
        previousValue={100}
        suffix="%"
      />,
    );

    expect(screen.getByTestId("trend-badge")).toHaveClass("up");
    expect(screen.getByTestId("trend-badge-value")).toHaveTextContent("20%");
    expect(screen.getByTestId("trend-badge")).toHaveAccessibleName(/up trend/);
  });

  it("supports explicit downward direction and current value display", () => {
    render(
      <TrendBadgeBase
        classMap={classMap}
        value={8}
        direction="down"
        showDelta={false}
      />,
    );

    expect(screen.getByTestId("trend-badge")).toHaveClass("down");
    expect(screen.getByTestId("trend-badge-value")).toHaveTextContent("8");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <TrendBadgeBase classMap={classMap} value={1} previousValue={1} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
