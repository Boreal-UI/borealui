import { expandClassMap } from "@/utils/propAliases";
import React from "react";
import BaseRating from "../RatingBase";
import "./Rating.scss";
import { RatingProps } from "../Rating.types";

const classes = {
  container: "rating_container",
  wrapper: "rating",
  label: "rating_label",
  star: "rating_star",
  active: "rating_active",

  primary: "rating_primary",
  secondary: "rating_secondary",
  tertiary: "rating_tertiary",
  quaternary: "rating_quaternary",

  success: "rating_success",
  error: "rating_error",
  warning: "rating_warning",

  clear: "rating_clear",
  glass: "rating_glass",

  xs: "rating_xs",
  small: "rating_small",
  medium: "rating_medium",
  large: "rating_large",
  xl: "rating_xl",

  shadowNone: "rating_shadow-None",
  shadowLight: "rating_shadow-Light",
  shadowMedium: "rating_shadow-Medium",
  shadowStrong: "rating_shadow-Strong",
  shadowIntense: "rating_shadow-Intense",

  roundNone: "rating_round-None",
  roundSmall: "rating_round-Small",
  roundMedium: "rating_round-Medium",
  roundLarge: "rating_round-Large",

  interactive: "rating_interactive",
};

const Rating: React.FC<RatingProps> = (props) => {
  return <BaseRating {...props} classMap={expandClassMap(classes)} />;
};
Rating.displayName = "Rating";
export default Rating;
