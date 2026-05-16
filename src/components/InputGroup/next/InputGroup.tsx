"use client";

import { expandClassMap } from "@/utils/propAliases";
import { forwardRef } from "react";
import styles from "./InputGroup.module.scss";
import InputGroupBase from "../InputGroupBase";
import { InputGroupProps } from "../InputGroup.types";

const InputGroup = forwardRef<HTMLDivElement, InputGroupProps>((props, ref) => (
  <InputGroupBase {...props} ref={ref} classMap={expandClassMap(styles)} />
));

InputGroup.displayName = "InputGroup";
export default InputGroup;
