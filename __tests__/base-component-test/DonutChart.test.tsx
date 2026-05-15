import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { axe, toHaveNoViolations } from "jest-axe";
import DonutChartBase from "@/components/DonutChart/DonutChartBase";

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
  { label: "Desktop", value: 60 },
  { label: "Mobile", value: 40 },
];

describe("DonutChartBase", () => {
  it("renders donut segments, center content, and legend", () => {
    render(
      <DonutChartBase
        classMap={classMap}
        label="Devices"
        data={data}
        centerLabel="100%"
        showLegend
      />,
    );

    expect(screen.getByTestId("donut-chart-segment-0")).toBeInTheDocument();
    expect(screen.getByTestId("donut-chart-center")).toHaveTextContent("100%");
    expect(screen.getByTestId("donut-chart-legend")).toHaveTextContent(
      "Desktop",
    );
    expect(screen.getByRole("img")).toHaveAccessibleName(/Mobile: 40/);
  });

  it("supports loading", () => {
    render(<DonutChartBase classMap={classMap} data={data} loading />);
    expect(screen.getByTestId("donut-chart-loader")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <DonutChartBase
        classMap={classMap}
        data={data}
        aria-label="Device split"
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
