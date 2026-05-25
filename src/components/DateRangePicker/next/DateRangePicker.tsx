"use client";

import { expandClassMap } from "@/utils/propAliases";
import DateRangePickerBase from "../DateRangePickerBase";
import { DateRangePickerProps } from "../DateRangePicker.types";
import styles from "./DateRangePicker.module.scss";
import DatePicker from "../../DatePicker/next/DatePicker";

export default function DateRangePicker(props: DateRangePickerProps) {
  return (
    <DateRangePickerBase
      {...props}
      classMap={expandClassMap(styles)}
      DatePickerComponent={DatePicker}
    />
  );
}
