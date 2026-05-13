import { expandClassMap } from "@/utils/propAliases";
import DateRangePickerBase from "../DateRangePickerBase";
import { DateRangePickerProps } from "../DateRangePicker.types";
import "./DateRangePicker.scss";
import DateTimePicker from "@/components/DateTimePicker/core/DateTimePicker";

const classes = {
  dateRangePicker: "date_range_picker",
  legend: "date_range_picker_legend",
  label: "date_range_picker_label",
  group: "date_range_picker_group",
  field: "date_range_picker_field",
  fieldLabel: "date_range_picker_field_label",
  input: "date_range_picker_input",
  separator: "date_range_picker_separator",
  helperText: "date_range_picker_helper_text",

  errorText: "date_range_picker_error_text",
  disabled: "date_range_picker_disabled",
  outline: "date_range_picker_outline",
  glass: "date_range_picker_glass",

  labelTop: "date_range_picker_label_top",
  labelBottom: "date_range_picker_label_bottom",
  labelLeft: "date_range_picker_label_left",
  labelRight: "date_range_picker_label_right",

  primary: "date_range_picker_primary",
  secondary: "date_range_picker_secondary",
  tertiary: "date_range_picker_tertiary",
  quaternary: "date_range_picker_quaternary",
  clear: "date_range_picker_clear",

  success: "date_range_picker_success",
  info: "date_range_picker_info",
  warning: "date_range_picker_warning",
  error: "date_range_picker_error",

  shadowNone: "date_range_picker_shadow-None",
  shadowLight: "date_range_picker_shadow-Light",
  shadowMedium: "date_range_picker_shadow-Medium",
  shadowStrong: "date_range_picker_shadow-Strong",
  shadowIntense: "date_range_picker_shadow-Intense",

  roundNone: "date_range_picker_round-None",
  roundSmall: "date_range_picker_round-Small",
  roundMedium: "date_range_picker_round-Medium",
  roundLarge: "date_range_picker_round-Large",
  roundFull: "date_range_picker_round-Full",
};

export default function DateRangePicker(props: DateRangePickerProps) {
  return (
    <DateRangePickerBase
      {...props}
      classMap={expandClassMap(classes)}
      DatePickerComponent={DateTimePicker}
    />
  );
}
