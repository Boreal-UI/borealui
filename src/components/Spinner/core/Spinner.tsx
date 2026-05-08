import { expandClassMap } from "@/utils/propAliases";
import React from "react";
import "./Spinner.scss";
import SpinnerBase from "../SpinnerBase";
import { SpinnerProps } from "../Spinner.types";

const classes = {
  wrapper: "spinner_wrapper",
  spinner: "spinner",
  glass: "spinner_glass",
  label: "spinner_label",

  primary: "spinner_primary",
  secondary: "spinner_secondary",
  tertiary: "spinner_tertiary",
  quaternary: "spinner_quaternary",

  success: "spinner_success",
  warning: "spinner_warning",
  error: "spinner_error",

  clear: "spinner_clear",

  shadowElement: "spinner_shadowElement",

  shadowNone: "spinner_shadow-None",
  shadowLight: "spinner_shadow-Light",
  shadowMedium: "spinner_shadow-Medium",
  shadowStrong: "spinner_shadow-Strong",
  shadowIntense: "spinner_shadow-Intense",
};

const Spinner: React.FC<SpinnerProps> = (props) => {
  return (
    <SpinnerBase {...props} className={props.className} classMap={expandClassMap(classes)} />
  );
};
Spinner.displayName = "Spinner";
export default Spinner;
