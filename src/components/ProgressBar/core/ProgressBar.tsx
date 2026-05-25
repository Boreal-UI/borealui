import { expandClassMap } from "@/utils/propAliases";
import React from "react";
import BaseProgressBar from "../ProgressBarBase";
import "./ProgressBar.scss";
import { ProgressBarProps } from "../ProgressBar.types";

const classes = {
  layout: "progress_layout",
  label: "progress_label",
  meta: "progress_meta",
  metaValueOnly: "progress_meta_valueOnly",
  value: "progress_value",

  labelTop: "progress_label_top",
  labelBottom: "progress_label_bottom",
  labelLeft: "progress_label_left",
  labelRight: "progress_label_right",
  labelOverlay: "progress_label_overlay",
  container: "progress_container",
  bar: "progress_bar",
  glass: "progress_glass",
  glassBar: "progress_bar_glass",

  primary: "progress_primary",
  secondary: "progress_secondary",
  tertiary: "progress_tertiary",
  quaternary: "progress_quaternary",

  success: "progress_success",
  info: "progress_info",
  error: "progress_error",
  warning: "progress_warning",

  clear: "progress_clear",

  xs: "progress_xs",
  xl: "progress_xl",
  small: "progress_small",
  medium: "progress_medium",
  large: "progress_large",

  shadowNone: "progress_shadow-None",
  shadowLight: "progress_shadow-Light",
  shadowMedium: "progress_shadow-Medium",
  shadowStrong: "progress_shadow-Strong",
  shadowIntense: "progress_shadow-Intense",

  roundNone: "progress_round-None",
  roundSmall: "progress_round-Small",
  roundMedium: "progress_round-Medium",
  roundLarge: "progress_round-Large",
  roundFull: "progress_round-Full",

  animated: "progress_animated",
  indeterminate: "progress_indeterminate",
};

const ProgressBar: React.FC<ProgressBarProps> = (props) => {
  return <BaseProgressBar {...props} classMap={expandClassMap(classes)} />;
};
ProgressBar.displayName = "ProgressBar";
export default ProgressBar;
