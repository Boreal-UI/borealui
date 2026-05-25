"use client";

import { expandClassMap } from "@/utils/propAliases";
import { forwardRef } from "react";
import DateTimePickerBase from "../DateTimePickerBase";
import styles from "./DateTimePicker.module.scss";
import type { DateTimePickerProps } from "../DateTimePicker.types";

const DateTimePicker = forwardRef<HTMLDivElement, DateTimePickerProps>(
  (props, ref) => (
    <DateTimePickerBase
      {...props}
      ref={ref}
      classMap={expandClassMap(styles)}
    />
  ),
);
DateTimePicker.displayName = "DateTimePicker";
export default DateTimePicker;
