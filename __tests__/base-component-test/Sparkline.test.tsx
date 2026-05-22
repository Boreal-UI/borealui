import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { axe, toHaveNoViolations } from "jest-axe";
import SparklineBase from "@/components/Sparkline/SparklineBase";

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

describe("SparklineBase", () => {
  it("renders an accessible sparkline path and last value", () => {
    render(
      <SparklineBase
        classMap={classMap}
        label="Revenue"
        data={[4, 8, 6, 12]}
        showValue
      />,
    );

    expect(screen.getByTestId("sparkline-label")).toHaveTextContent("Revenue");
    expect(screen.getByTestId("sparkline-line")).toHaveAttribute(
      "d",
      expect.stringContaining("M"),
    );
    expect(screen.getByRole("img")).toHaveAccessibleName(/Value 1: 4/);
    expect(screen.getByTestId("sparkline-value")).toHaveTextContent("12");
  });

  it("shows units in the visible and accessible values", () => {
    render(
      <SparklineBase
        classMap={classMap}
        data={[4, 8, 6, 12]}
        showValue
        units="kWh"
      />,
    );

    expect(screen.getByRole("img")).toHaveAccessibleName(/Value 1: 4 kWh/);
    expect(screen.getByTestId("sparkline-value")).toHaveTextContent("12 kWh");
  });

  it("supports loading and refs", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<SparklineBase ref={ref} classMap={classMap} data={[1]} loading />);

    expect(ref.current).toBe(screen.getByTestId("sparkline"));
    expect(screen.getByTestId("sparkline-loader")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <SparklineBase classMap={classMap} data={[1, 2, 3]} aria-label="Trend" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
