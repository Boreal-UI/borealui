"use client";

import { forwardRef } from "react";
import CheckboxBase from "../CheckboxBase";
import styles from "./Checkbox.module.scss";
import { CheckBoxProps } from "../Checkbox.types";

const Checkbox = forwardRef<HTMLInputElement, CheckBoxProps>((props, ref) => (
  <CheckboxBase {...props} classMap={styles} ref={ref} />
));
Checkbox.displayName = "Checkbox";
export default Checkbox;
