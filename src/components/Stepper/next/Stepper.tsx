"use client";

import { expandClassMap } from "@/utils/propAliases";
import React from "react";
import styles from "./Stepper.module.scss";
import StepperBase from "../StepperBase";
import { StepperProps } from "../Stepper.types";
import IconButton from "../../IconButton/next/IconButton";

const Stepper: React.FC<StepperProps> = (props) => (
  <StepperBase
    {...props}
    classMap={expandClassMap(styles)}
    IconButtonComponent={IconButton}
  />
);
Stepper.displayName = "Stepper";
export default Stepper;
