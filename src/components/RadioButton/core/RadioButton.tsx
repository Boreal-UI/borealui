import { forwardRef } from "react";
import BaseRadioButton from "../RadioButtonBase";
import "./RadioButton.scss";
import { RadioButtonProps } from "../RadioButton.types";

const classes = {
  wrapper: "radio_wrapper",
  input: "radio_input",
  circle: "radio_circle",
  glass: "radio_glass",
  glassCircle: "radio_glassCircle",
  label: "radio_label",
  disabled: "radio_disabled",

  primary: "radio_primary",
  secondary: "radio_secondary",
  tertiary: "radio_tertiary",
  quaternary: "radio_quaternary",

  success: "radio_success",
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
};

const RadioButton = forwardRef<HTMLInputElement, RadioButtonProps>(
  (props, ref) => <BaseRadioButton {...props} ref={ref} classMap={classes} />
);

RadioButton.displayName = "RadioButton";
export default RadioButton;
