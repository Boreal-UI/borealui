"use client";

import { expandClassMap } from "@/utils/propAliases";
import { forwardRef } from "react";
import styles from "./ValidationSummary.module.scss";
import ValidationSummaryBase from "../ValidationSummaryBase";
import { ValidationSummaryProps } from "../ValidationSummary.types";

const ValidationSummary = forwardRef<HTMLDivElement, ValidationSummaryProps>(
  (props, ref) => (
    <ValidationSummaryBase
      {...props}
      ref={ref}
      classMap={expandClassMap(styles)}
    />
  ),
);

ValidationSummary.displayName = "ValidationSummary";
export default ValidationSummary;
