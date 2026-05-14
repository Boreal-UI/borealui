import { expandClassMap } from "@/utils/propAliases";
import React from "react";
import BasePopOver from "../PopOverBase";
import "./PopOver.scss";
import { PopOverProps } from "../PopOver.types";

const classes = {
  container: "popover_container",
  trigger: "popover_trigger",
  popover: "popover",

  top: "popover_top",
  bottom: "popover_bottom",
  left: "popover_left",
  right: "popover_right",

  primary: "popover_primary",
  secondary: "popover_secondary",
  tertiary: "popover_tertiary",
  quaternary: "popover_quaternary",

  success: "popover_success",
  info: "popover_info",
  error: "popover_error",
  warning: "popover_warning",

  clear: "popover_clear",
  glass: "popover_glass",

  shadowNone: "popover_shadow-None",
  shadowLight: "popover_shadow-Light",
  shadowMedium: "popover_shadow-Medium",
  shadowStrong: "popover_shadow-Strong",
  shadowIntense: "popover_shadow-Intense",

  roundNone: "popover_round-None",
  roundSmall: "popover_round-Small",
  roundMedium: "popover_round-Medium",
  roundLarge: "popover_round-Large",
};

const PopOver: React.FC<PopOverProps> = (props) => {
  return <BasePopOver {...props} classMap={expandClassMap(classes)} />;
};
PopOver.displayName = "PopOver";
export default PopOver;
