"use client";

import { expandClassMap } from "@/utils/propAliases";
import { forwardRef } from "react";
import styles from "./FieldSet.module.scss";
import FieldSetBase from "../FieldSetBase";
import { FieldSetProps } from "../FieldSet.types";

const FieldSet = forwardRef<HTMLFieldSetElement, FieldSetProps>(
  (props, ref) => (
    <FieldSetBase {...props} ref={ref} classMap={expandClassMap(styles)} />
  ),
);

FieldSet.displayName = "FieldSet";
export default FieldSet;
