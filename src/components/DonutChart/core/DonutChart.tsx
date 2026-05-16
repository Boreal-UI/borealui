import { forwardRef } from "react";
import "./DonutChart.scss";
import DonutChartBase from "../DonutChartBase";
import { DonutChartProps } from "../DonutChart.types";

const classes = {
  root: "donutChart",
  label: "donutChart_label",
  chart: "donutChart_chart",
  svg: "donutChart_svg",
  track: "donutChart_track",
  segment: "donutChart_segment",
  center: "donutChart_center",
  legend: "donutChart_legend",
  legendItem: "donutChart_legendItem",
  swatch: "donutChart_swatch",
  value: "donutChart_value",
  loader: "donutChart_loader",
  primary: "donutChart_primary",
  secondary: "donutChart_secondary",
  tertiary: "donutChart_tertiary",
  quaternary: "donutChart_quaternary",
  clear: "donutChart_clear",
  success: "donutChart_success",
  info: "donutChart_info",
  warning: "donutChart_warning",
  error: "donutChart_error",
  loading: "donutChart_loading",
};

const DonutChart = forwardRef<HTMLDivElement, DonutChartProps>((props, ref) => (
  <DonutChartBase {...props} ref={ref} classMap={classes} />
));

DonutChart.displayName = "DonutChart";
export default DonutChart;
