import React from "react";
import BasePopover from "../PopOverBase";
import "./PopOver.scss";
import { PopoverProps } from "../PopOver.types";

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

const Popover: React.FC<PopoverProps> = (props) => {
  return <BasePopover {...props} classMap={classes} />;
};
Popover.displayName = "Popover";
export default Popover;
