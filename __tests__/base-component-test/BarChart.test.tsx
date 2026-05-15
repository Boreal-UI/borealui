import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { axe, toHaveNoViolations } from "jest-axe";
import BarChartBase from "@/components/BarChart/BarChartBase";

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

const data = [
  { label: "Jan", value: 12 },
  { label: "Feb", value: 18 },
];

describe("BarChartBase", () => {
  it("renders bars for labelled data", () => {
    render(<BarChartBase classMap={classMap} label="Sales" data={data} />);

    expect(screen.getByTestId("bar-chart-label")).toHaveTextContent("Sales");
    expect(screen.getByTestId("bar-chart-bar-0")).toBeInTheDocument();
    expect(screen.getByTestId("bar-chart-bar-1")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAccessibleName(/Jan: 12/);
  });

  it("supports loading and refs", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<BarChartBase ref={ref} classMap={classMap} data={data} loading />);

    expect(ref.current).toBe(screen.getByTestId("bar-chart"));
    expect(screen.getByTestId("bar-chart-loader")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <BarChartBase
        classMap={classMap}
        data={data}
        aria-label="Monthly sales"
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
