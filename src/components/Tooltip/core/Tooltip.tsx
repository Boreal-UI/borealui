import { expandClassMap } from "@/utils/propAliases";
import { forwardRef } from "react";
import "./Tooltip.scss";
import TooltipBase from "../TooltipBase";
import { TooltipProps } from "../Tooltip.types";

const classes = {
  container: "tooltip_container",
  triggerWrapper: "tooltip_triggerWrapper",
  tooltip: "tooltip",
  glass: "tooltip_glass",

  top: "tooltip_top",
  bottom: "tooltip_bottom",
  left: "tooltip_left",
  right: "tooltip_right",

  primary: "tooltip_primary",
  secondary: "tooltip_secondary",
  tertiary: "tooltip_tertiary",
  quaternary: "tooltip_quaternary",

  success: "tooltip_success",
  error: "tooltip_error",
  warning: "tooltip_warning",

  clear: "tooltip_clear",

  shadowNone: "tooltip_shadow-None",
  shadowLight: "tooltip_shadow-Light",
  shadowMedium: "tooltip_shadow-Medium",
  shadowStrong: "tooltip_shadow-Strong",
  shadowIntense: "tooltip_shadow-Intense",

  roundNone: "tooltip_round-None",
  roundSmall: "tooltip_round-Small",
  roundMedium: "tooltip_round-Medium",
  roundLarge: "tooltip_round-Large",
};

const Tooltip = forwardRef<HTMLDivElement, TooltipProps>((props, ref) => (
  <TooltipBase {...props} ref={ref} classMap={expandClassMap(classes)} />
));

Tooltip.displayName = "Tooltip";

export default Tooltip;
