import { ReactNode } from "react";
import {
  LabelPositionType,
  RoundingType,
  ShadowType,
  StateType,
  ThemeType,
} from "@/types/types";

export interface DateRangeValue {
  /**
   * Start date value.
   */
  start: string;
  /**
   * End date value.
   */
  end: string;
}

export interface DateRangePickerProps {
  /**
   * Current value for the component.
   */
  value: DateRangeValue;
  /**
   * Callback fired when change occurs.
   */
  onChange: (value: DateRangeValue) => void;
  /**
   * Visible label content for the component.
   */
  label?: ReactNode;
  /**
   * Start Label.
   * @default "Start date"
   */
  startLabel?: ReactNode;
  /**
   * End Label.
   * @default "End date"
   */
  endLabel?: ReactNode;
  /**
   * Label Position.
   * @default "top"
   */
  labelPosition?: LabelPositionType;
  /**
   * Min prop for DateRangePicker.
   */
  min?: string;
  /**
   * Max prop for DateRangePicker.
   */
  max?: string;
  /**
   * Disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * Required.
   * @default false
   */
  required?: boolean;
  /**
   * HTML name applied to the relevant form element.
   */
  name?: string;
  /**
   * HTML id applied to the relevant element.
   */
  id?: string;
  /**
   * Helper text displayed with the field.
   */
  helperText?: ReactNode;
  /**
   * Error message or error state displayed with the component.
   */
  error?: ReactNode;
  /**
   * Theme.
   * @default configured default theme (fallback: "primary")
   */
  theme?: ThemeType;
  /**
   * Visual state applied to the component.
   */
  state?: StateType;
  /**
   * Outline.
   * @default configured default outline setting (fallback: false)
   */
  outline?: boolean;
  /**
   * Glass.
   * @default configured default glass setting (fallback: false)
   */
  glass?: boolean;
  /**
   * Rounding.
   * @default configured default rounding (fallback: "medium")
   */
  rounding?: RoundingType;
  /**
   * Shadow.
   * @default configured default shadow (fallback: "light")
   */
  shadow?: ShadowType;
  /**
   * Additional CSS class names for the component root.
   */
  className?: string;
  /**
   * Additional CSS class names for the label section.
   */
  labelClassName?: string;
  /**
   * Additional CSS class names for the group section.
   */
  groupClassName?: string;
  /**
   * Additional CSS class names for the input section.
   */
  inputClassName?: string;
  /**
   * Additional CSS class names for the helper text section.
   */
  helperTextClassName?: string;
  /**
   * Additional CSS class names for the error section.
   */
  errorClassName?: string;
  /**
   * ARIA Label attribute forwarded to the relevant accessible element.
   */
  "aria-label"?: string;
  /**
   * ARIA Labelledby attribute forwarded to the relevant accessible element.
   */
  "aria-labelledby"?: string;
  /**
   * ARIA Describedby attribute forwarded to the relevant accessible element.
   */
  "aria-describedby"?: string;
  /**
   * Test id used to identify the component in tests.
   */
  testId?: string;
  /**
   * Test id used to identify the component in tests.
   */
  "data-testid"?: string;
}

export interface DateRangePickerBaseProps extends DateRangePickerProps {
  /**
   * Framework-specific class name map supplied by the core or Next wrapper.
   */
  classMap: Record<string, string>;
  /**
   * Component implementation used to render the date picker portion.
   */
  DatePickerComponent: React.ElementType;
}
