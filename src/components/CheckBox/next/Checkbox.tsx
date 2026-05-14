"use client";

import { expandClassMap } from "@/utils/propAliases";
import { forwardRef } from "react";
import CheckBoxBase from "../CheckBoxBase";
import styles from "./CheckBox.module.scss";
import { CheckBoxProps } from "../CheckBox.types";

const CheckBox = forwardRef<HTMLInputElement, CheckBoxProps>((props, ref) => (
  <CheckBoxBase {...props} classMap={expandClassMap(styles)} ref={ref} />
));
CheckBox.displayName = "CheckBox";
export default CheckBox;
