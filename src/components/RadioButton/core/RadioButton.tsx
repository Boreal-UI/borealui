import { expandClassMap } from "@/utils/propAliases";
import { forwardRef } from "react";
import BaseRadioButton from "../RadioButtonBase";
import "./RadioButton.scss";
import { RadioButtonProps } from "../RadioButton.types";

export const classes = {
  wrapper: "radio_wrapper",
  labelWrapper: "radio_labelWrapper",
  input: "radio_input",
  circle: "radio_circle",
  group: "radio_group",
  legend: "radio_legend",
  options: "radio_options",
  vertical: "radio_vertical",
  horizontal: "radio_horizontal",
  glassCircle: "radio_glassCircle",
  label: "radio_label",
  description: "radio_description",
  errorMessage: "radio_errorMessage",
  disabled: "radio_disabled",
  invalid: "radio_invalid",

  primary: "radio_primary",
  secondary: "radio_secondary",
  tertiary: "radio_tertiary",
  quaternary: "radio_quaternary",

  success: "radio_success",
  info: "radio_info",
  error: "radio_error",
  warning: "radio_warning",

  clear: "radio_clear",

  shadowNone: "radio_shadow-None",
  shadowLight: "radio_shadow-Light",
  shadowMedium: "radio_shadow-Medium",
  shadowStrong: "radio_shadow-Strong",
  shadowIntense: "radio_shadow-Intense",

  roundNone: "radio_round-None",
  roundSmall: "radio_round-Small",
  roundMedium: "radio_round-Medium",
  roundLarge: "radio_round-Large",
  roundFull: "radio_round-Full",
  glass: "radio_glass",
};

const RadioButton = forwardRef<HTMLInputElement, RadioButtonProps>(
  (props, ref) => (
    <BaseRadioButton {...props} ref={ref} classMap={expandClassMap(classes)} />
  ),
);

RadioButton.displayName = "RadioButton";
export default RadioButton;
