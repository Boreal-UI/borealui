import { expandClassMap } from "@/utils/propAliases";
import { forwardRef } from "react";
import DateTimePickerBase from "../DateTimePickerBase";
import "./DateTimePicker.scss";
import type { DateTimePickerProps } from "../DateTimePicker.types";

const classes = {
  container: "dateTimePicker_container",
  label: "dateTimePicker_label",
  labelTop: "dateTimePicker_labelTop",
  labelBottom: "dateTimePicker_labelBottom",
  labelLeft: "dateTimePicker_labelLeft",
  labelRight: "dateTimePicker_labelRight",

  root: "dateTimePicker",
  content: "dateTimePicker_content",
  inputWrapper: "dateTimePicker_inputWrapper",
  input: "dateTimePicker_input",
  button: "dateTimePicker_button",
  description: "dateTimePicker_description",
  helperText: "dateTimePicker_helperText",
  errorText: "dateTimePicker_errorText",
  loader: "dateTimePicker_loader",
  srOnly: "sr_only",
  fullWidth: "dateTimePicker_fullWidth",
  readOnly: "dateTimePicker_readOnly",

  primary: "dateTimePicker_primary",
  secondary: "dateTimePicker_secondary",
  tertiary: "dateTimePicker_tertiary",
  quaternary: "dateTimePicker_quaternary",

  success: "dateTimePicker_success",
  info: "dateTimePicker_info",
  warning: "dateTimePicker_warning",
  error: "dateTimePicker_error",

  clear: "dateTimePicker_clear",
  outline: "dateTimePicker_outline",
  glass: "dateTimePicker_glass",
  disabled: "dateTimePicker_disabled",
  loading: "dateTimePicker_loading",

  shadowNone: "dateTimePicker_shadow-None",
  shadowLight: "dateTimePicker_shadow-Light",
  shadowMedium: "dateTimePicker_shadow-Medium",
  shadowStrong: "dateTimePicker_shadow-Strong",
  shadowIntense: "dateTimePicker_shadow-Intense",

  roundNone: "dateTimePicker_round-None",
  roundSmall: "dateTimePicker_round-Small",
  roundMedium: "dateTimePicker_round-Medium",
  roundLarge: "dateTimePicker_round-Large",
  roundFull: "dateTimePicker_round-Full",
};

const DateTimePicker = forwardRef<HTMLDivElement, DateTimePickerProps>(
  (props, ref) => (
    <DateTimePickerBase
      {...props}
      ref={ref}
      classMap={expandClassMap(classes)}
    />
  ),
);
DateTimePicker.displayName = "DateTimePicker";
export default DateTimePicker;
