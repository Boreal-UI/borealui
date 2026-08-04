import { expandClassMap } from "@/utils/propAliases";
import React from "react";
import BaseFormGroup from "../FormGroupBase";
import "./FormGroup.scss";
import { FormGroupProps } from "../FormGroup.types";

const classes = {
  wrapper: "form_group",
  label: "form_group_label",
  required: "form_group_required",
  inputWrapper: "form_group_input_wrapper",
  inputField: "form_group_input_field",
  controller: "form_group_controller",
  helperText: "form_group_helper_text",
  errorText: "form_group_error_text",
  vertical: "form_group_vertical",
  horizontal: "form_group_horizontal",
  primary: "form_group_primary",
  secondary: "form_group_secondary",
  error: "form_group_error",
  success: "form_group_success",
  info: "form_group_info",
  warning: "form_group_warning",
  clear: "form_group_clear",
  xs: "form_group_xs",
  small: "form_group_small",
  medium: "form_group_medium",
  large: "form_group_large",
  xl: "form_group_xl",
};

const FormGroup: React.FC<FormGroupProps> = (props) => {
  return <BaseFormGroup {...props} classMap={expandClassMap(classes)} />;
};
FormGroup.displayName = "FormGroup";
export default FormGroup;
