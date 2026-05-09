"use client";

import { expandClassMap } from "@/utils/propAliases";
import BaseRadioGroup from "../RadioGroupBase";
import styles from "./RadioButton.module.scss";
import { RadioGroupProps } from "../RadioButton.types";

const RadioGroup = (props: RadioGroupProps) => (
  <BaseRadioGroup {...props} classMap={expandClassMap(styles)} />
);

RadioGroup.displayName = "RadioGroup";
export default RadioGroup;
