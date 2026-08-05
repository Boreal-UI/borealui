import { expandClassMap } from "@/utils/propAliases";
import { forwardRef } from "react";
import "./DatePicker.scss";
import DatePickerBase from "../DatePickerBase";
import { DatePickerProps } from "../DatePicker.types";

const classes = {
  xs: "datePicker_xs",
  small: "datePicker_small",
  medium: "datePicker_medium",
  large: "datePicker_large",
  xl: "datePicker_xl",
  container: "datePicker_container",
  label: "datePicker_label",
  labelTop: "datePicker_labelTop",
  labelBottom: "datePicker_labelBottom",
  labelLeft: "datePicker_labelLeft",
  labelRight: "datePicker_labelRight",

  root: "datePicker",
  content: "datePicker_content",
  inputWrapper: "datePicker_inputWrapper",
  input: "datePicker_input",
  button: "datePicker_button",
  calendarIcon: "datePicker_calendarIcon",
  description: "datePicker_description",
  helperText: "datePicker_helperText",
  errorText: "datePicker_errorText",
  loader: "datePicker_loader",
  fullWidth: "datePicker_fullWidth",
  readOnly: "datePicker_readOnly",

  primary: "datePicker_primary",
  secondary: "datePicker_secondary",
  tertiary: "datePicker_tertiary",
  quaternary: "datePicker_quaternary",

  success: "datePicker_success",
  info: "datePicker_info",
  warning: "datePicker_warning",
  error: "datePicker_error",

  clear: "datePicker_clear",
  disabled: "datePicker_disabled",
  loading: "datePicker_loading",

  shadowNone: "datePicker_shadow-None",
  shadowLight: "datePicker_shadow-Light",
  shadowMedium: "datePicker_shadow-Medium",
  shadowStrong: "datePicker_shadow-Strong",
  shadowIntense: "datePicker_shadow-Intense",

  roundNone: "datePicker_round-None",
  roundSmall: "datePicker_round-Small",
  roundMedium: "datePicker_round-Medium",
  roundLarge: "datePicker_round-Large",
  roundFull: "datePicker_round-Full",
  glass: "datePicker_glass",
  outline: "datePicker_outline",
};

const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>((props, ref) => (
  <DatePickerBase {...props} ref={ref} classMap={expandClassMap(classes)} />
));

DatePicker.displayName = "DatePicker";
export default DatePicker;
