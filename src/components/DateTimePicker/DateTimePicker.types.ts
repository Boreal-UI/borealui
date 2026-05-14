import type { InputHTMLAttributes, ButtonHTMLAttributes } from "react";
import {
  LabelPositionType,
  RoundingType,
  ShadowType,
  SizeType,
  StateType,
  ThemeType,
} from "@/types/types";

/**
 * Props for the DateTimePicker component.
 */
export interface DateTimePickerProps {
  /** Optional visible label displayed above the input. */
  label?: string;

  /**
   * Position of the label relative to the input.
   *
   * @default "top"
   */
  labelPosition?: LabelPositionType;

  /**
   * Whether the input should take the full width of its container.
   *
   * @default false
   */
  fullWidth?: boolean;

  /** Current value in ISO 8601 format (e.g., "2025-04-10T12:00"). */
  value?: string;

  /** Callback triggered when the date/time value changes. */
  onChange?: (newValue: string) => void;

  /** Minimum allowed date/time (ISO 8601 format). */
  min?: string;

  /** Maximum allowed date/time (ISO 8601 format). */
  max?: string;

  /** Name attribute for form submission. */
  name?: string;

  /**
   * The type of input element.
   * ('date' | 'time' | 'datetime-local').
   *
   * @default "datetime-local"
   */
  type?: "date" | "time" | "datetime-local";

  /**
   * Additional class name for custom styling.
   */
  className?: string;

  /**
   * Whether the input is required for form validation.
   *
   * @default false
   */
  required?: boolean;

  /**
   * Whether the input is disabled.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Thematic style of the input
   * ('primary' | 'secondary' | 'tertiary' | 'quaternary' | 'clear').
   *
   * @default configured default theme (fallback: "primary")
   */
  theme?: ThemeType;

  /**
   * Adds translucent glass styling to the input surface.
   *
   * @default configured default glass setting (fallback: false)
   */
  glass?: boolean;

  /**
   * State of the input
   * ('success' | 'error' | 'warning' | 'disabled' | '').
   */
  state?: StateType;

  /**
   * Controls the rounding of the input
   * ('none' | 'small' | 'medium' | 'large' | 'full').
   *
   * @default configured default rounding (fallback: "medium")
   */
  rounding?: RoundingType;

  /**
   * Controls the shadow of the input
   * ('none' | 'light' | 'medium' | 'strong' | 'intense').
   *
   * @default configured default shadow (fallback: "light")
   */
  shadow?: ShadowType;

  /**
   * Size of the component
   * ('xs' | 'small' | 'medium' | 'large' | 'xl').
   *
   * @default configured default size (fallback: "medium")
   */
  size?: SizeType;

  /** Whether to use outlined styling. */
  outline?: boolean;

  /**
   * Optional test ID for testing frameworks.
   *
   * @default dataTestId ?? "datetime-picker"
   */
  testId?: string;

  /** Backward-compatible alias for test ID attributes. */
  "data-testid"?: string;

  /** Custom input id. */
  id?: string;

  /** Custom label id. */
  labelId?: string;

  /** Custom id for helper/description text. */
  descriptionId?: string;

  /** Custom id for error text. */
  errorId?: string;

  /** Accessible label for the input when no visible label is present or when an override is needed. */
  "aria-label"?: string;

  /** Accessible label reference for the input. */
  "aria-labelledby"?: string;

  /** Accessible description reference for the input. */
  "aria-describedby"?: string;

  /** Accessible error message reference for the input. */
  "aria-errormessage"?: string;

  /** Marks the input as invalid. Useful for external validation control. */
  "aria-invalid"?: boolean;

  /** Marks the input as required for assistive technologies. */
  "aria-required"?: boolean;

  /**
   * Whether the input should be read-only.
   *
   * @default false
   */
  readOnly?: boolean;

  /** Optional placeholder text. */
  placeholder?: string;

  /**
   * Optional autocomplete value.
   *
   * @default "off"
   */
  autoComplete?: InputHTMLAttributes<HTMLInputElement>["autoComplete"];

  /** Optional title/tooltip for the input. */
  title?: string;

  /** Accessible label for the calendar trigger button. */
  pickerButtonAriaLabel?: string;

  /** Accessible label reference for the calendar trigger button. */
  pickerButtonAriaLabelledBy?: string;

  /** Accessible description reference for the calendar trigger button. */
  pickerButtonAriaDescribedBy?: string;

  /** Optional title/tooltip for the picker trigger button. */
  pickerButtonTitle?: string;

  /** Optional props passed to the native input element. */
  inputProps?: Omit<
    InputHTMLAttributes<HTMLInputElement>,
    | "type"
    | "value"
    | "defaultValue"
    | "onChange"
    | "min"
    | "max"
    | "name"
    | "required"
    | "disabled"
    | "readOnly"
    | "id"
    | "className"
    | "size"
    | "aria-label"
    | "aria-labelledby"
    | "aria-describedby"
    | "aria-errormessage"
    | "aria-invalid"
    | "aria-required"
  >;

  /** Optional props passed to the picker trigger button. */
  buttonProps?: Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    | "type"
    | "onClick"
    | "disabled"
    | "className"
    | "aria-label"
    | "aria-labelledby"
    | "aria-describedby"
    | "title"
  >;
}

export interface DateTimePickerBaseProps extends DateTimePickerProps {
  /**
   * Framework-specific class name map supplied by the core or Next wrapper.
   */
  classMap: Record<string, string>;
  /**
   * Error message or error state displayed with the component.
   */
  error?: string;
  /**
   * Descriptive content rendered by the component.
   */
  description?: string;
}
