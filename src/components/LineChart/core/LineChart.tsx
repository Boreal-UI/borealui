import { forwardRef } from "react";
import "./LineChart.scss";
import LineChartBase from "../LineChartBase";
import { LineChartProps } from "../LineChart.types";

const classes = {
  root: "lineChart",
  label: "lineChart_label",
  svg: "lineChart_svg",
  line: "lineChart_line",
  point: "lineChart_point",
  gridLine: "lineChart_gridLine",
  axisLabel: "lineChart_axisLabel",
  loader: "lineChart_loader",
  primary: "lineChart_primary",
  secondary: "lineChart_secondary",
  tertiary: "lineChart_tertiary",
  quaternary: "lineChart_quaternary",
  clear: "lineChart_clear",
  success: "lineChart_success",
  info: "lineChart_info",
  warning: "lineChart_warning",
  error: "lineChart_error",
  loading: "lineChart_loading",
};

const LineChart = forwardRef<HTMLDivElement, LineChartProps>((props, ref) => (
  <LineChartBase {...props} ref={ref} classMap={classes} />
));

LineChart.displayName = "LineChart";
export default LineChart;
