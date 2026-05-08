"use client";

import BaseRadioGroup from "../RadioGroupBase";
import styles from "./RadioButton.module.scss";
import { RadioGroupProps } from "../RadioButton.types";

const RadioGroup = (props: RadioGroupProps) => (
  <BaseRadioGroup {...props} classMap={styles} />
);

RadioGroup.displayName = "RadioGroup";
export default RadioGroup;
