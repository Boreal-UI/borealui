"use client";

import { expandClassMap } from "@/utils/propAliases";
import { forwardRef } from "react";
import styles from "./MultiSelect.module.scss";
import MultiSelectBase from "../MultiSelectBase";
import { MultiSelectProps } from "../MultiSelect.types";

const MultiSelect = forwardRef<HTMLDivElement, MultiSelectProps>(
  (props, ref) => (
    <MultiSelectBase {...props} ref={ref} classMap={expandClassMap(styles)} />
  ),
);

MultiSelect.displayName = "MultiSelect";
export default MultiSelect;
