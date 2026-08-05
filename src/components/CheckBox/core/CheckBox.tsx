import { expandClassMap } from "@/utils/propAliases";
import { forwardRef } from "react";
import CheckBoxBase from "../CheckBoxBase";
import "./CheckBox.scss";
import { CheckBoxProps } from "../CheckBox.types";

const classes = {
  checkbox: "checkbox",

  primary: "checkbox_primary",
  secondary: "checkbox_secondary",
  tertiary: "checkbox_tertiary",
  quaternary: "checkbox_quaternary",

  success: "checkbox_success",
  info: "checkbox_info",
  error: "checkbox_error",
  warning: "checkbox_warning",

  clear: "checkbox_clear",

  disabled: "checkbox_disabled",
  indeterminate: "checkbox_indeterminate",

  left: "checkbox_left",
  right: "checkbox_right",

  xs: "checkbox_xs",
  small: "checkbox_small",
  medium: "checkbox_medium",
  large: "checkbox_large",
  xl: "checkbox_xl",

  shadowNone: "checkbox_shadow-None",
  shadowLight: "checkbox_shadow-Light",
  shadowMedium: "checkbox_shadow-Medium",
  shadowStrong: "checkbox_shadow-Strong",
  shadowIntense: "checkbox_shadow-Intense",

  roundNone: "checkbox_round-None",
  roundSmall: "checkbox_round-Small",
  roundMedium: "checkbox_round-Medium",
  roundLarge: "checkbox_round-Large",

  labelWrapper: "checkbox_label-wrapper",
  label: "checkbox_label",
  input: "checkbox_input",
  box: "checkbox_box",
  invalid: "checkbox_invalid",
  description: "checkbox_description",
  errorMessage: "checkbox_errorMessage",
  glass: "checkbox_glass",
};

const CheckBox = forwardRef<HTMLInputElement, CheckBoxProps>((props, ref) => (
  <CheckBoxBase {...props} classMap={expandClassMap(classes)} ref={ref} />
));
CheckBox.displayName = "CheckBox";
export default CheckBox;
