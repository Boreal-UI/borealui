import { expandClassMap } from "@/utils/propAliases";
import React from "react";
import "./Slider.scss"; // Non-module SCSS
import { SliderProps } from "../Slider.types";
import SliderBase from "../SliderBase";
import { combineClassNames } from "../../../utils/classNames";

const coreStyles = {
  container: "slider_container",
  label: "slider_label",
  meta: "slider_meta",
  metaValueOnly: "slider_meta_valueOnly",
  wrapper: "slider_wrapper",
  slider: "slider",
  glass: "slider_glass",
  value: "slider_value",

  labelTop: "slider_label_top",
  labelBottom: "slider_label_bottom",
  labelLeft: "slider_label_left",
  labelRight: "slider_label_right",

  xs: "slider_xs",
  small: "slider_small",
  medium: "slider_medium",
  large: "slider_large",
  xl: "slider_xl",

  primary: "slider_primary",
  secondary: "slider_secondary",
  tertiary: "slider_tertiary",
  quaternary: "slider_quaternary",

  success: "slider_success",
  info: "slider_info",
  error: "slider_error",
  warning: "slider_warning",

  clear: "slider_clear",

  shadowNone: "slider_shadow-None",
  shadowLight: "slider_shadow-Light",
  shadowMedium: "slider_shadow-Medium",
  shadowStrong: "slider_shadow-Strong",
  shadowIntense: "slider_shadow-Intense",

  roundNone: "slider_round-None",
  roundSmall: "slider_round-Small",
  roundMedium: "slider_round-Medium",
  roundLarge: "slider_round-Large",
};

const Slider: React.FC<SliderProps> = (props) => {
  return (
    <SliderBase
      {...props}
      className={combineClassNames(props.className)}
      classMap={expandClassMap(coreStyles)}
    />
  );
};
Slider.displayName = "Slider";
export default Slider;
