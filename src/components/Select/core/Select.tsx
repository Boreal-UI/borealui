import { expandClassMap } from "@/utils/propAliases";
import { forwardRef } from "react";
import BaseSelect from "../SelectBase";
import "./Select.scss";
import { SelectProps } from "../Select.types";

const classes = {
  wrapper: "select_wrapper",
  select: "select",
  outline: "select_outline",

  layout: "select_layout",
  label: "select_label",
  labelTop: "select_label_top",
  labelBottom: "select_label_bottom",
  labelLeft: "select_label_left",
  labelRight: "select_label_right",

  primary: "select_primary",
  secondary: "select_secondary",
  tertiary: "select_tertiary",
  quaternary: "select_quaternary",

  success: "select_success",
  error: "select_error",
  warning: "select_warning",

  clear: "select_clear",
  glass: "select_glass",

  icon: "select_icon",
  disabled: "select_disabled",

  shadowNone: "select_shadow-None",
  shadowLight: "select_shadow-Light",
  shadowMedium: "select_shadow-Medium",
  shadowStrong: "select_shadow-Strong",
  shadowIntense: "select_shadow-Intense",

  roundNone: "select_round-None",
  roundSmall: "select_round-Small",
  roundMedium: "select_round-Medium",
  roundLarge: "select_round-Large",
};

const Select = forwardRef<HTMLSelectElement, SelectProps>((props, ref) => {
  return <BaseSelect {...props} ref={ref} classMap={expandClassMap(classes)} />;
});

Select.displayName = "Select";
export default Select;
