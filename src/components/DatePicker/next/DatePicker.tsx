"use client";

import { expandClassMap } from "@/utils/propAliases";
import { forwardRef } from "react";
import styles from "./DatePicker.module.scss";
import DatePickerBase from "../DatePickerBase";
import { DatePickerProps } from "../DatePicker.types";

const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>((props, ref) => (
  <DatePickerBase {...props} ref={ref} classMap={expandClassMap(styles)} />
));

DatePicker.displayName = "DatePicker";
export default DatePicker;
