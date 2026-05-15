import { forwardRef } from "react";
import "./Legend.scss";
import LegendBase from "../LegendBase";
import { LegendProps } from "../Legend.types";

const classes = {
  root: "legend",
  label: "legend_label",
  list: "legend_list",
  item: "legend_item",
  swatch: "legend_swatch",
  text: "legend_text",
  value: "legend_value",
  horizontal: "legend_horizontal",
  vertical: "legend_vertical",
  loader: "legend_loader",
  primary: "legend_primary",
  secondary: "legend_secondary",
  tertiary: "legend_tertiary",
  quaternary: "legend_quaternary",
  clear: "legend_clear",
  success: "legend_success",
  info: "legend_info",
  warning: "legend_warning",
  error: "legend_error",
  loading: "legend_loading",
};

const Legend = forwardRef<HTMLDivElement, LegendProps>((props, ref) => (
  <LegendBase {...props} ref={ref} classMap={classes} />
));

Legend.displayName = "Legend";
export default Legend;
