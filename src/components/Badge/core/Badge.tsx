import { expandClassMap } from "@/utils/propAliases";
import React from "react";
import "./Badge.scss";
import { BadgeBase } from "../BadgeBase";
import { BadgeProps } from "../Badge.types";

const classes = {
  badge: "badge",

  primary: "badge_primary",
  secondary: "badge_secondary",
  tertiary: "badge_tertiary",
  quaternary: "badge_quaternary",
  clear: "badge_clear",

  success: "badge_success",
  info: "badge_info",
  error: "badge_error",
  warning: "badge_warning",

  xs: "badge_xs",
  small: "badge_small",
  medium: "badge_medium",
  large: "badge_large",
  xl: "badge_xl",

  shadowNone: "badge_shadow-None",
  shadowLight: "badge_shadow-Light",
  shadowMedium: "badge_shadow-Medium",
  shadowStrong: "badge_shadow-Strong",
  shadowIntense: "badge_shadow-Intense",

  roundNone: "badge_round-None",
  roundSmall: "badge_round-Small",
  roundMedium: "badge_round-Medium",
  roundLarge: "badge_round-Large",
  disabled: "badge_disabled",
  icon: "badge_icon",
  badge_icon: "badge_icon",
  clickable: "badge_clickable",
  glass: "badge_glass",
  outline: "badge_outline",
};

const Badge: React.FC<BadgeProps> = (props) => {
  return <BadgeBase {...props} classMap={expandClassMap(classes)} />;
};
Badge.displayName = "Badge";
export default Badge;
