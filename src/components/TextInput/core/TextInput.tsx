import { expandClassMap } from "@/utils/propAliases";
import { forwardRef } from "react";
import "./TextInput.scss";
import { TextInputProps } from "../TextInput.types";
import TextInputBase from "../TextInputBase";
import IconButton from "../../IconButton/core/IconButton";

const classes = {
  container: "textInput_container",
  label: "textInput_label",
  labelTop: "textInput_labelTop",
  labelBottom: "textInput_labelBottom",
  labelLeft: "textInput_labelLeft",
  labelRight: "textInput_labelRight",
  fullWidth: "textInput_fullWidth",

  textInput: "textInput",
  input: "textInput_input",
  iconContainer: "textInput_icon_container",
  togglePassword: "textInput_togglePassword",
  helperText: "textInput_helperText",
  errorMessage: "textInput_errorMessage",

  primary: "textInput_primary",
  secondary: "textInput_secondary",
  tertiary: "textInput_tertiary",
  quaternary: "textInput_quaternary",

  success: "textInput_success",
  info: "textInput_info",
  warning: "textInput_warning",
  error: "textInput_error",

  clear: "textInput_clear",

  xs: "textInput_xs",
  xl: "textInput_xl",
  small: "textInput_small",
  medium: "textInput_medium",
  large: "textInput_large",
  disabled: "textInput_disabled",

  shadowNone: "textInput_shadow-None",
  shadowLight: "textInput_shadow-Light",
  shadowMedium: "textInput_shadow-Medium",
  shadowStrong: "textInput_shadow-Strong",
  shadowIntense: "textInput_shadow-Intense",

  roundNone: "textInput_round-None",
  roundSmall: "textInput_round-Small",
  roundMedium: "textInput_round-Medium",
  roundLarge: "textInput_round-Large",
  glass: "textInput_glass",
  outline: "textInput_outline",
};

const TextInput = forwardRef<HTMLInputElement, TextInputProps>((props, ref) => {
  return (
    <TextInputBase
      {...props}
      IconButton={IconButton}
      ref={ref}
      classMap={expandClassMap(classes)}
    />
  );
});

TextInput.displayName = "TextInput";
export default TextInput;
