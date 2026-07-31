"use client";

import { expandClassMap } from "@/utils/propAliases";
import { forwardRef } from "react";
import styles from "./NumberInput.module.scss";
import NumberInputBase from "../NumberInputBase";
import { NumberInputProps } from "../NumberInput.types";

const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (props, ref) => (
    <NumberInputBase {...props} ref={ref} classMap={expandClassMap(styles)} />
  ),
);

NumberInput.displayName = "NumberInput";
export default NumberInput;
