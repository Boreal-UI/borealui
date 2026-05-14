import { expandClassMap } from "@/utils/propAliases";
import { forwardRef } from "react";
import "./ValidationSummary.scss";
import ValidationSummaryBase from "../ValidationSummaryBase";
import { ValidationSummaryProps } from "../ValidationSummary.types";

const classes = {
  container: "validationSummary_container",
  label: "validationSummary_label",
  labelTop: "validationSummary_labelTop",
  labelBottom: "validationSummary_labelBottom",
  labelLeft: "validationSummary_labelLeft",
  labelRight: "validationSummary_labelRight",

  root: "validationSummary",
  title: "validationSummary_title",
  description: "validationSummary_description",
  list: "validationSummary_list",
  item: "validationSummary_item",
  link: "validationSummary_link",
  button: "validationSummary_button",
  content: "validationSummary_content",
  empty: "validationSummary_empty",
  emptyMessage: "validationSummary_emptyMessage",
  loadingRow: "validationSummary_loadingRow",
  loadingMessage: "validationSummary_loadingMessage",
  loader: "validationSummary_loader",
  srOnly: "sr_only",

  primary: "validationSummary_primary",
  secondary: "validationSummary_secondary",
  tertiary: "validationSummary_tertiary",
  quaternary: "validationSummary_quaternary",

  success: "validationSummary_success",
  info: "validationSummary_info",
  warning: "validationSummary_warning",
  error: "validationSummary_error",

  clear: "validationSummary_clear",
  outline: "validationSummary_outline",
  glass: "validationSummary_glass",
  disabled: "validationSummary_disabled",
  loading: "validationSummary_loading",

  shadowNone: "validationSummary_shadow-None",
  shadowLight: "validationSummary_shadow-Light",
  shadowMedium: "validationSummary_shadow-Medium",
  shadowStrong: "validationSummary_shadow-Strong",
  shadowIntense: "validationSummary_shadow-Intense",

  roundNone: "validationSummary_round-None",
  roundSmall: "validationSummary_round-Small",
  roundMedium: "validationSummary_round-Medium",
  roundLarge: "validationSummary_round-Large",
  roundFull: "validationSummary_round-Full",
};

const ValidationSummary = forwardRef<HTMLDivElement, ValidationSummaryProps>(
  (props, ref) => (
    <ValidationSummaryBase
      {...props}
      ref={ref}
      classMap={expandClassMap(classes)}
    />
  ),
);

ValidationSummary.displayName = "ValidationSummary";
export default ValidationSummary;
