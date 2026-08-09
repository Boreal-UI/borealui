import { expandClassMap } from "@/utils/propAliases";
import ComboBoxBase from "../ComboBoxBase";
import { ComboBoxProps } from "../ComboBox.types";
import "./ComboBox.scss";

const classes = {
  xs: "combobox_xs",
  small: "combobox_small",
  medium: "combobox_medium",
  large: "combobox_large",
  xl: "combobox_xl",
  layout: "combobox_layout",
  comboBox: "combobox",
  label: "combobox_label",
  input: "combobox_input",
  toggle: "combobox_toggle",
  listbox: "combobox_listbox",
  option: "combobox_option",
  active: "combobox_active",
  selected: "combobox_selected",
  description: "combobox_description",
  status: "combobox_status",
  helperText: "combobox_helper_text",
  errorMessage: "combobox_error_text",
  disabled: "combobox_disabled",
  labelTop: "combobox_label_top",
  labelBottom: "combobox_label_bottom",
  labelLeft: "combobox_label_left",
  labelRight: "combobox_label_right",
  primary: "combobox_primary",
  secondary: "combobox_secondary",
  tertiary: "combobox_tertiary",
  quaternary: "combobox_quaternary",
  clear: "combobox_clear",
  success: "combobox_success",
  info: "combobox_info",
  warning: "combobox_warning",
  error: "combobox_error",
  shadowNone: "combobox_shadow-None",
  shadowLight: "combobox_shadow-Light",
  shadowMedium: "combobox_shadow-Medium",
  shadowStrong: "combobox_shadow-Strong",
  shadowIntense: "combobox_shadow-Intense",
  roundNone: "combobox_round-None",
  roundSmall: "combobox_round-Small",
  roundMedium: "combobox_round-Medium",
  roundLarge: "combobox_round-Large",
  roundFull: "combobox_round-Full",
  glass: "combobox_glass",
  outline: "combobox_outline",
};

export default function ComboBox(props: ComboBoxProps) {
  return <ComboBoxBase {...props} classMap={expandClassMap(classes)} />;
}
