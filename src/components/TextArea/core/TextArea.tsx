import { expandClassMap } from "@/utils/propAliases";
import { forwardRef } from "react";
import TextAreaBase from "../TextAreaBase";
import type { TextAreaProps } from "../TextArea.types";
import "./TextArea.scss";

const classes = {
  container: "container",
  textArea: "textArea",
  textInput: "textArea_text_input",
  icon: "textArea_icon",

  label: "label",
  labelTop: "labelTop",
  labelBottom: "labelBottom",
  labelLeft: "labelLeft",
  labelRight: "labelRight",

  primary: "textArea_primary",
  secondary: "textArea_secondary",
  tertiary: "textArea_tertiary",
  quaternary: "textArea_quaternary",

  success: "textArea_success",
  error: "textArea_error",
  warning: "textArea_warning",

  clear: "textArea_clear",

  outline: "textArea_outline",
  glass: "textArea_glass",

  disabled: "textArea_disabled",

  errorMessage: "textArea_errorMessage",
  iconContainer: "textArea_iconContainer",
  errorMessageContainer: "textArea_errorMessageContainer",

  shadowNone: "textArea_shadow-None",
  shadowLight: "textArea_shadow-Light",
  shadowMedium: "textArea_shadow-Medium",
  shadowStrong: "textArea_shadow-Strong",
  shadowIntense: "textArea_shadow-Intense",

  roundNone: "textArea_round-None",
  roundSmall: "textArea_round-Small",
  roundMedium: "textArea_round-Medium",
  roundLarge: "textArea_round-Large",
};

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (props, ref) => {
    return <TextAreaBase {...props} ref={ref} classMap={expandClassMap(classes)} />;
  },
);

TextArea.displayName = "TextArea";

export default TextArea;
