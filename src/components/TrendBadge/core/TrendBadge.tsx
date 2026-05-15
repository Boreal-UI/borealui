import { forwardRef } from "react";
import "./TrendBadge.scss";
import TrendBadgeBase from "../TrendBadgeBase";
import { TrendBadgeProps } from "../TrendBadge.types";

const classes = {
  root: "trendBadge",
  label: "trendBadge_label",
  icon: "trendBadge_icon",
  value: "trendBadge_value",
  up: "trendBadge_up",
  down: "trendBadge_down",
  flat: "trendBadge_flat",
  positive: "trendBadge_positive",
  negative: "trendBadge_negative",
  loader: "trendBadge_loader",
  primary: "trendBadge_primary",
  secondary: "trendBadge_secondary",
  tertiary: "trendBadge_tertiary",
  quaternary: "trendBadge_quaternary",
  clear: "trendBadge_clear",
  success: "trendBadge_success",
  info: "trendBadge_info",
  warning: "trendBadge_warning",
  error: "trendBadge_error",
  loading: "trendBadge_loading",
};

const TrendBadge = forwardRef<HTMLDivElement, TrendBadgeProps>((props, ref) => (
  <TrendBadgeBase {...props} ref={ref} classMap={classes} />
));

TrendBadge.displayName = "TrendBadge";
export default TrendBadge;
