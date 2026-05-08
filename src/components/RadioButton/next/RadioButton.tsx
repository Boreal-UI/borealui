"use client";

import { expandClassMap } from "@/utils/propAliases";
import { forwardRef } from "react";
import BaseRadioButton from "../RadioButtonBase";
import styles from "./RadioButton.module.scss";
import { RadioButtonProps } from "../RadioButton.types";

const RadioButton = forwardRef<HTMLInputElement, RadioButtonProps>(
  (props, ref) => <BaseRadioButton {...props} ref={ref} classMap={expandClassMap(styles)} />
);

RadioButton.displayName = "RadioButton";
export default RadioButton;
