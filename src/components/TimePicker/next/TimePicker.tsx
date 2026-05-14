"use client";

import { expandClassMap } from "@/utils/propAliases";
import { forwardRef } from "react";
import styles from "./TimePicker.module.scss";
import TimePickerBase from "../TimePickerBase";
import { TimePickerProps } from "../TimePicker.types";

const TimePicker = forwardRef<HTMLDivElement, TimePickerProps>((props, ref) => (
  <TimePickerBase {...props} ref={ref} classMap={expandClassMap(styles)} />
));

TimePicker.displayName = "TimePicker";
export default TimePicker;
