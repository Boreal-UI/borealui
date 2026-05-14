"use client";

import { expandClassMap } from "@/utils/propAliases";
import DateRangePickerBase from "../DateRangePickerBase";
import { DateRangePickerProps } from "../DateRangePicker.types";
import styles from "./DateRangePicker.module.scss";
import DateTimePicker from "../../DateTimePicker/next/DateTimePicker";

export default function DateRangePicker(props: DateRangePickerProps) {
  return (
    <DateRangePickerBase
      {...props}
      classMap={expandClassMap(styles)}
      DatePickerComponent={DateTimePicker}
    />
  );
}
