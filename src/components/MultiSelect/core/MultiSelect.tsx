import { expandClassMap } from "@/utils/propAliases";
import { forwardRef } from "react";
import "./MultiSelect.scss";
import MultiSelectBase from "../MultiSelectBase";
import { MultiSelectProps } from "../MultiSelect.types";

const classes = {
  xs: "multiSelect_xs",
  small: "multiSelect_small",
  medium: "multiSelect_medium",
  large: "multiSelect_large",
  xl: "multiSelect_xl",
  container: "multiSelect_container",
  label: "multiSelect_label",
  labelTop: "multiSelect_labelTop",
  labelBottom: "multiSelect_labelBottom",
  labelLeft: "multiSelect_labelLeft",
  labelRight: "multiSelect_labelRight",

  root: "multiSelect",
  trigger: "multiSelect_trigger",
  valueList: "multiSelect_valueList",
  chip: "multiSelect_chip",
  chipLabel: "multiSelect_chipLabel",
  placeholder: "multiSelect_placeholder",
  summary: "multiSelect_summary",
  icon: "multiSelect_icon",
  clearButton: "multiSelect_clearButton",
  popover: "multiSelect_popover",
  searchInput: "multiSelect_searchInput",
  listbox: "multiSelect_listbox",
  option: "multiSelect_option",
  optionText: "multiSelect_optionText",
  description: "multiSelect_description",
  checkbox: "multiSelect_checkbox",
  status: "multiSelect_status",
  selected: "multiSelect_selected",
  active: "multiSelect_active",
  optionDisabled: "multiSelect_optionDisabled",
  loader: "multiSelect_loader",
  nativeRequired: "multiSelect_nativeRequired",
  srOnly: "sr_only",

  primary: "multiSelect_primary",
  secondary: "multiSelect_secondary",
  tertiary: "multiSelect_tertiary",
  quaternary: "multiSelect_quaternary",

  success: "multiSelect_success",
  info: "multiSelect_info",
  warning: "multiSelect_warning",
  error: "multiSelect_error",

  clear: "multiSelect_clear",
  disabled: "multiSelect_disabled",
  loading: "multiSelect_loading",
  open: "multiSelect_open",

  shadowNone: "multiSelect_shadow-None",
  shadowLight: "multiSelect_shadow-Light",
  shadowMedium: "multiSelect_shadow-Medium",
  shadowStrong: "multiSelect_shadow-Strong",
  shadowIntense: "multiSelect_shadow-Intense",

  roundNone: "multiSelect_round-None",
  roundSmall: "multiSelect_round-Small",
  roundMedium: "multiSelect_round-Medium",
  roundLarge: "multiSelect_round-Large",
  roundFull: "multiSelect_round-Full",
  glass: "multiSelect_glass",
  outline: "multiSelect_outline",
};

const MultiSelect = forwardRef<HTMLDivElement, MultiSelectProps>(
  (props, ref) => (
    <MultiSelectBase {...props} ref={ref} classMap={expandClassMap(classes)} />
  ),
);

MultiSelect.displayName = "MultiSelect";
export default MultiSelect;
