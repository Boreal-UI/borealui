import { expandClassMap } from "@/utils/propAliases";
import { forwardRef } from "react";
import "./FieldSet.scss";
import FieldSetBase from "../FieldSetBase";
import { FieldSetProps } from "../FieldSet.types";

const classes = {
  container: "fieldSet_container",
  label: "fieldSet_label",
  labelTop: "fieldSet_labelTop",
  labelBottom: "fieldSet_labelBottom",
  labelLeft: "fieldSet_labelLeft",
  labelRight: "fieldSet_labelRight",

  root: "fieldSet",
  legend: "fieldSet_legend",
  legendText: "fieldSet_legendText",
  legendHidden: "fieldSet_legendHidden",
  required: "fieldSet_required",
  optional: "fieldSet_optional",
  description: "fieldSet_description",
  content: "fieldSet_content",
  helperText: "fieldSet_helperText",
  errorText: "fieldSet_errorText",
  actions: "fieldSet_actions",
  footer: "fieldSet_footer",
  loadingRow: "fieldSet_loadingRow",
  loadingMessage: "fieldSet_loadingMessage",
  loader: "fieldSet_loader",
  srOnly: "sr_only",

  layoutStack: "fieldSet_layoutStack",
  layoutGrid: "fieldSet_layoutGrid",
  layoutInline: "fieldSet_layoutInline",

  spacingNone: "fieldSet_spacingNone",
  spacingXs: "fieldSet_spacingXs",
  spacingSm: "fieldSet_spacingSm",
  spacingMd: "fieldSet_spacingMd",
  spacingLg: "fieldSet_spacingLg",

  primary: "fieldSet_primary",
  secondary: "fieldSet_secondary",
  tertiary: "fieldSet_tertiary",
  quaternary: "fieldSet_quaternary",

  success: "fieldSet_success",
  info: "fieldSet_info",
  warning: "fieldSet_warning",
  error: "fieldSet_error",

  clear: "fieldSet_clear",
  outline: "fieldSet_outline",
  glass: "fieldSet_glass",
  disabled: "fieldSet_disabled",
  loading: "fieldSet_loading",

  shadowNone: "fieldSet_shadow-None",
  shadowLight: "fieldSet_shadow-Light",
  shadowMedium: "fieldSet_shadow-Medium",
  shadowStrong: "fieldSet_shadow-Strong",
  shadowIntense: "fieldSet_shadow-Intense",

  roundNone: "fieldSet_round-None",
  roundSmall: "fieldSet_round-Small",
  roundMedium: "fieldSet_round-Medium",
  roundLarge: "fieldSet_round-Large",
  roundFull: "fieldSet_round-Full",
};

const FieldSet = forwardRef<HTMLFieldSetElement, FieldSetProps>(
  (props, ref) => (
    <FieldSetBase {...props} ref={ref} classMap={expandClassMap(classes)} />
  ),
);

FieldSet.displayName = "FieldSet";
export default FieldSet;
