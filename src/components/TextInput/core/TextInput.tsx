import { expandClassMap } from "@/utils/propAliases";
import { forwardRef } from "react";
import "./TextInput.scss";
import { TextInputProps } from "../TextInput.types";
import TextInputBase from "../TextInputBase";
import IconButton from "../../IconButton/core/IconButton";

const classes = {
  container: "container",
  label: "label",
  labelTop: "labelTop",
  labelBottom: "labelBottom",
  labelLeft: "labelLeft",
  labelRight: "labelRight",

  textInput: "textInput",
  iconContainer: "textInput_icon_container",
  togglePassword: "textInput_togglePassword",
  inputRow: "textInput_inputRow",
  inputWrapper: "textInput_inputWrapper",

  hasTitle: "textInput_hasTitle",
  title: "textInput_title",
  titleInline: "textInput_titleInline",
  titleOverlay: "textInput_titleOverlay",

  titlePosTop: "textInput_titlePosTop",
  titlePosBottom: "textInput_titlePosBottom",
  titlePosLeft: "textInput_titlePosLeft",
  titlePosRight: "textInput_titlePosRight",
  titlePosOverlay: "textInput_titlePosOverlay",

  primary: "textInput_primary",
  secondary: "textInput_secondary",
  tertiary: "textInput_tertiary",
  quaternary: "textInput_quaternary",

  success: "textInput_success",
  warning: "textInput_warning",
  error: "textInput_error",

  clear: "textInput_clear",

  xs: "textInput_xs",
  xl: "textInput_xl",
  small: "textInput_small",
  medium: "textInput_medium",
  large: "textInput_large",

  outline: "textInput_outline",
  glass: "textInput_glass",
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
