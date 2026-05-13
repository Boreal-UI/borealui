import { ReactNode } from "react";
import {
  LabelPositionType,
  RoundingType,
  ShadowType,
  StateType,
  ThemeType,
} from "@/types/types";

export interface DateRangeValue {
  start: string;
  end: string;
}

export interface DateRangePickerProps {
  value: DateRangeValue;
  onChange: (value: DateRangeValue) => void;
  label?: ReactNode;
  startLabel?: ReactNode;
  endLabel?: ReactNode;
  labelPosition?: LabelPositionType;
  min?: string;
  max?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  helperText?: ReactNode;
  error?: ReactNode;
  theme?: ThemeType;
  state?: StateType;
  outline?: boolean;
  glass?: boolean;
  rounding?: RoundingType;
  shadow?: ShadowType;
  className?: string;
  labelClassName?: string;
  groupClassName?: string;
  inputClassName?: string;
  helperTextClassName?: string;
  errorClassName?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  testId?: string;
  "data-testid"?: string;
}

export interface DateRangePickerBaseProps extends DateRangePickerProps {
  classMap: Record<string, string>;
  DatePickerComponent: React.ElementType;
}
