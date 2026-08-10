import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { axe, toHaveNoViolations } from "jest-axe";
import LegendBase from "@/components/Legend/LegendBase";

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

const items = [
  { label: "Desktop", color: "red", value: "60%" },
  { label: "Mobile", color: "blue", value: "40%" },
];

describe("LegendBase", () => {
  it("renders legend items", () => {
    render(<LegendBase classMap={classMap} label="Devices" items={items} />);

    expect(screen.getByTestId("legend-label")).toHaveTextContent("Devices");
    expect(screen.getByTestId("legend-item-0")).toHaveTextContent("Desktop");
    expect(screen.getByTestId("legend-item-1")).toHaveTextContent("40%");
  });

  it("applies vertical orientation", () => {
    render(
      <LegendBase classMap={classMap} items={items} orientation="vertical" />,
    );
    expect(screen.getByTestId("legend")).toHaveClass("vertical");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <LegendBase classMap={classMap} items={items} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
