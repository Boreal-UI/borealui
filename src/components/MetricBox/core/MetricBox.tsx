import React from "react";
import BaseMetricBox from "../MetricBoxBase";
import "./MetricBox.scss";
import { MetricBoxProps } from "../MetricBox.types";

const classes = {
  wrapper: "metricBox",
  outline: "metricBox_outline",
  glass: "metricBox_glass",

  primary: "metricBox_primary",
  secondary: "metricBox_secondary",
  tertiary: "metricBox_tertiary",
  quaternary: "metricBox_quaternary",

  success: "metricBox_success",
  error: "metricBox_error",
  warning: "metricBox_warning",

  clear: "metricBox_clear",

  xs: "metricBox_xs",
  small: "metricBox_small",
  medium: "metricBox_medium",
  large: "metricBox_large",
  xl: "metricBox_xl",

  left: "metricBox_left",
  center: "metricBox_center",
  right: "metricBox_right",

  shadowNone: "metricBox_shadow-None",
  shadowLight: "metricBox_shadow-Light",
  shadowMedium: "metricBox_shadow-Medium",
  shadowStrong: "metricBox_shadow-Strong",
  shadowIntense: "metricBox_shadow-Intense",

  roundNone: "metricBox_round-None",
  roundSmall: "metricBox_round-Small",
  roundMedium: "metricBox_round-Medium",
  roundLarge: "metricBox_round-Large",

  icon: "metricBox_icon",
  content: "metricBox_content",
  title: "metricBox_title",
  value: "metricBox_value",
  subtext: "metricBox_subtext",
};

const MetricBox: React.FC<MetricBoxProps> = (props) => {
  return <BaseMetricBox {...props} classMap={classes} />;
};
MetricBox.displayName = "MetricBox";
export default MetricBox;
