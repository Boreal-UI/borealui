"use client";

import { expandClassMap } from "@/utils/propAliases";
import { forwardRef } from "react";
import CheckboxBase from "../CheckboxBase";
import styles from "./Checkbox.module.scss";
import { CheckBoxProps } from "../Checkbox.types";

const Checkbox = forwardRef<HTMLInputElement, CheckBoxProps>((props, ref) => (
  <CheckboxBase {...props} classMap={expandClassMap(styles)} ref={ref} />
));
Checkbox.displayName = "Checkbox";
export default Checkbox;
