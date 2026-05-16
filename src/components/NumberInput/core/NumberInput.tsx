import { expandClassMap } from "@/utils/propAliases";
import { forwardRef } from "react";
import "./NumberInput.scss";
import NumberInputBase from "../NumberInputBase";
import { NumberInputProps } from "../NumberInput.types";

const classes = {
  container: "numberInput_container",
  label: "numberInput_label",
  labelTop: "numberInput_labelTop",
  labelBottom: "numberInput_labelBottom",
  labelLeft: "numberInput_labelLeft",
  labelRight: "numberInput_labelRight",

  numberInput: "numberInput",
  input: "numberInput_input",
  controls: "numberInput_controls",
  controlButton: "numberInput_controlButton",
  srOnly: "sr_only",

  primary: "numberInput_primary",
  secondary: "numberInput_secondary",
  tertiary: "numberInput_tertiary",
  quaternary: "numberInput_quaternary",

  success: "numberInput_success",
  info: "numberInput_info",
  warning: "numberInput_warning",
  error: "numberInput_error",

  clear: "numberInput_clear",
  outline: "numberInput_outline",
  glass: "numberInput_glass",
  disabled: "numberInput_disabled",

  shadowNone: "numberInput_shadow-None",
  shadowLight: "numberInput_shadow-Light",
  shadowMedium: "numberInput_shadow-Medium",
  shadowStrong: "numberInput_shadow-Strong",
  shadowIntense: "numberInput_shadow-Intense",

  roundNone: "numberInput_round-None",
  roundSmall: "numberInput_round-Small",
  roundMedium: "numberInput_round-Medium",
  roundLarge: "numberInput_round-Large",
};

const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (props, ref) => (
    <NumberInputBase
      {...props}
      ref={ref}
      classMap={expandClassMap(classes)}
    />
  ),
);

NumberInput.displayName = "NumberInput";
export default NumberInput;
