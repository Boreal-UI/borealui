import { forwardRef } from "react";
import "./BarChart.scss";
import BarChartBase from "../BarChartBase";
import { BarChartProps } from "../BarChart.types";

const classes = {
  root: "barChart",
  label: "barChart_label",
  svg: "barChart_svg",
  bar: "barChart_bar",
  gridLine: "barChart_gridLine",
  axisLabel: "barChart_axisLabel",
  loader: "barChart_loader",
  primary: "barChart_primary",
  secondary: "barChart_secondary",
  tertiary: "barChart_tertiary",
  quaternary: "barChart_quaternary",
  clear: "barChart_clear",
  success: "barChart_success",
  info: "barChart_info",
  warning: "barChart_warning",
  error: "barChart_error",
  loading: "barChart_loading",
};

const BarChart = forwardRef<HTMLDivElement, BarChartProps>((props, ref) => (
  <BarChartBase {...props} ref={ref} classMap={classes} />
));

BarChart.displayName = "BarChart";
export default BarChart;
