import { expandClassMap } from "@/utils/propAliases";
import { forwardRef } from "react";
import "./InputGroup.scss";
import InputGroupBase from "../InputGroupBase";
import { InputGroupProps } from "../InputGroup.types";

const classes = {
  container: "inputGroup_container",
  label: "inputGroup_label",
  labelTop: "inputGroup_labelTop",
  labelBottom: "inputGroup_labelBottom",
  labelLeft: "inputGroup_labelLeft",
  labelRight: "inputGroup_labelRight",

  root: "inputGroup",
  frame: "inputGroup_frame",
  content: "inputGroup_content",
  description: "inputGroup_description",
  helperText: "inputGroup_helperText",
  errorText: "inputGroup_errorText",
  optional: "inputGroup_optional",
  prefix: "inputGroup_prefix",
  suffix: "inputGroup_suffix",
  addon: "inputGroup_addon",
  startAddon: "inputGroup_startAddon",
  endAddon: "inputGroup_endAddon",
  loadingContainer: "inputGroup_loadingContainer",
  loadingMessage: "inputGroup_loadingMessage",
  loader: "inputGroup_loader",

  fullWidth: "inputGroup_fullWidth",
  withAddons: "inputGroup_withAddons",
  withInlineAddons: "inputGroup_withInlineAddons",

  primary: "inputGroup_primary",
  secondary: "inputGroup_secondary",
  tertiary: "inputGroup_tertiary",
  quaternary: "inputGroup_quaternary",

  success: "inputGroup_success",
  info: "inputGroup_info",
  warning: "inputGroup_warning",
  error: "inputGroup_error",

  clear: "inputGroup_clear",
  disabled: "inputGroup_disabled",
  loading: "inputGroup_loading",

  shadowNone: "inputGroup_shadow-None",
  shadowLight: "inputGroup_shadow-Light",
  shadowMedium: "inputGroup_shadow-Medium",
  shadowStrong: "inputGroup_shadow-Strong",
  shadowIntense: "inputGroup_shadow-Intense",

  roundNone: "inputGroup_round-None",
  roundSmall: "inputGroup_round-Small",
  roundMedium: "inputGroup_round-Medium",
  roundLarge: "inputGroup_round-Large",
  roundFull: "inputGroup_round-Full",
  glass: "inputGroup_glass",
  outline: "inputGroup_outline",
};

const InputGroup = forwardRef<HTMLDivElement, InputGroupProps>((props, ref) => (
  <InputGroupBase {...props} ref={ref} classMap={expandClassMap(classes)} />
));

InputGroup.displayName = "InputGroup";
export default InputGroup;
