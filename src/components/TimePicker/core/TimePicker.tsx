import { expandClassMap } from "@/utils/propAliases";
import { forwardRef } from "react";
import "./TimePicker.scss";
import TimePickerBase from "../TimePickerBase";
import { TimePickerProps } from "../TimePicker.types";

const classes = {
  container: "timePicker_container",
  label: "timePicker_label",
  labelTop: "timePicker_labelTop",
  labelBottom: "timePicker_labelBottom",
  labelLeft: "timePicker_labelLeft",
  labelRight: "timePicker_labelRight",

  root: "timePicker",
  content: "timePicker_content",
  inputWrapper: "timePicker_inputWrapper",
  input: "timePicker_input",
  button: "timePicker_button",
  description: "timePicker_description",
  helperText: "timePicker_helperText",
  errorText: "timePicker_errorText",
  loader: "timePicker_loader",
  srOnly: "sr_only",
  fullWidth: "timePicker_fullWidth",
  readOnly: "timePicker_readOnly",

  primary: "timePicker_primary",
  secondary: "timePicker_secondary",
  tertiary: "timePicker_tertiary",
  quaternary: "timePicker_quaternary",

  success: "timePicker_success",
  info: "timePicker_info",
  warning: "timePicker_warning",
  error: "timePicker_error",

  clear: "timePicker_clear",
  outline: "timePicker_outline",
  glass: "timePicker_glass",
  disabled: "timePicker_disabled",
  loading: "timePicker_loading",

  shadowNone: "timePicker_shadow-None",
  shadowLight: "timePicker_shadow-Light",
  shadowMedium: "timePicker_shadow-Medium",
  shadowStrong: "timePicker_shadow-Strong",
  shadowIntense: "timePicker_shadow-Intense",

  roundNone: "timePicker_round-None",
  roundSmall: "timePicker_round-Small",
  roundMedium: "timePicker_round-Medium",
  roundLarge: "timePicker_round-Large",
  roundFull: "timePicker_round-Full",
};

const TimePicker = forwardRef<HTMLDivElement, TimePickerProps>((props, ref) => (
  <TimePickerBase {...props} ref={ref} classMap={expandClassMap(classes)} />
));

TimePicker.displayName = "TimePicker";
export default TimePicker;
