import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { axe, toHaveNoViolations } from "jest-axe";
import LineChartBase from "@/components/LineChart/LineChartBase";

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
  { label: "Mon", value: 4 },
  { label: "Tue", value: 9 },
  { label: "Wed", value: 7 },
];

describe("LineChartBase", () => {
  it("renders a line and point markers", () => {
    render(<LineChartBase classMap={classMap} label="Traffic" data={data} />);

    expect(screen.getByTestId("line-chart-line")).toHaveAttribute(
      "d",
      expect.stringContaining("L"),
    );
    expect(screen.getByTestId("line-chart-point-2")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAccessibleName(/Tue: 9/);
  });

  it("shows units in axis and accessible value text", () => {
    render(<LineChartBase classMap={classMap} data={data} units="visits" />);

    expect(screen.getByRole("img")).toHaveAccessibleName(/Tue: 9 visits/);
    expect(screen.getByText("9 visits")).toBeInTheDocument();
    expect(screen.getByText("0 visits")).toBeInTheDocument();
  });

  it("can hide point markers", () => {
    render(
      <LineChartBase classMap={classMap} data={data} showPoints={false} />,
    );
    expect(screen.queryByTestId("line-chart-point-0")).not.toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <LineChartBase
        classMap={classMap}
        data={data}
        aria-label="Traffic trend"
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
