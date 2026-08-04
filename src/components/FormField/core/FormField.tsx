import { expandClassMap } from "@/utils/propAliases";
import FormFieldBase from "../FormFieldBase";
import { FormFieldProps } from "../FormField.types";
import "./FormField.scss";

const classes = {
  formField: "form_field",
  label: "form_field_label",
  optional: "form_field_optional",
  control: "form_field_control",
  helperText: "form_field_helper_text",
  errorText: "form_field_error_text",
  labelTop: "form_field_label_top",
  labelBottom: "form_field_label_bottom",
  labelLeft: "form_field_label_left",
  labelRight: "form_field_label_right",
  success: "form_field_success",
  info: "form_field_info",
  warning: "form_field_warning",
  error: "form_field_error",
  disabled: "form_field_disabled",
};

export default function FormField(props: FormFieldProps) {
  return <FormFieldBase {...props} classMap={expandClassMap(classes)} />;
}
