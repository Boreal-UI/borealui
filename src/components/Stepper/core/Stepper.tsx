import { expandClassMap } from "@/utils/propAliases";
import React from "react";
import "./Stepper.scss";
import StepperBase from "../StepperBase";
import { StepperProps } from "../Stepper.types";
import IconButton from "../../IconButton/core/IconButton";

const classes = {
  stepper: "stepper",
  horizontal: "stepper_horizontal",
  vertical: "stepper_vertical",
  primary: "stepper_primary",
  secondary: "stepper_secondary",
  tertiary: "stepper_tertiary",
  quaternary: "stepper_quaternary",
  glass: "stepper_glass",
  success: "stepper_success",
  info: "stepper_info",
  warning: "stepper_warning",
  error: "stepper_error",
  clear: "stepper_clear",
  xs: "stepper_xs",
  medium: "stepper_medium",
  small: "stepper_small",
  large: "stepper_large",
  xl: "stepper_xl",
  step: "stepper_step",
  active: "stepper_active",
  completed: "stepper_completed",
  disabled: "stepper_disabled",
  clickable: "stepper_clickable",
  stepButton: "stepper_step_button",
  stepLabel: "stepper_step_label",
  connector: "stepper_connector",
};

const Stepper: React.FC<StepperProps> = (props) => (
  <StepperBase {...props} classMap={expandClassMap(classes)} IconButtonComponent={IconButton} />
);
Stepper.displayName = "Stepper";
export default Stepper;
