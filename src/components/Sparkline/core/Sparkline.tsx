import { forwardRef } from "react";
import "./Sparkline.scss";
import SparklineBase from "../SparklineBase";
import { SparklineProps } from "../Sparkline.types";

const classes = {
  root: "sparkline",
  label: "sparkline_label",
  chart: "sparkline_chart",
  svg: "sparkline_svg",
  line: "sparkline_line",
  area: "sparkline_area",
  point: "sparkline_point",
  value: "sparkline_value",
  loader: "sparkline_loader",
  primary: "sparkline_primary",
  secondary: "sparkline_secondary",
  tertiary: "sparkline_tertiary",
  quaternary: "sparkline_quaternary",
  clear: "sparkline_clear",
  success: "sparkline_success",
  info: "sparkline_info",
  warning: "sparkline_warning",
  error: "sparkline_error",
  loading: "sparkline_loading",
};

const Sparkline = forwardRef<HTMLDivElement, SparklineProps>((props, ref) => (
  <SparklineBase {...props} ref={ref} classMap={classes} />
));

Sparkline.displayName = "Sparkline";
export default Sparkline;
