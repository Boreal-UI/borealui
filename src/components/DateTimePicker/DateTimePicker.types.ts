import {
  LabelPositionType,
  ShadowType,
  SizeType,
  StateType,
  ThemeType,
} from "@/types/types";
import type {
  ButtonHTMLAttributes,
  ForwardRefExoticComponent,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  RefAttributes,
} from "react";

type NativeDateTimePickerProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children" | "defaultValue" | "onChange" | "title"
>;

/**
 * Props for the DateTimePicker component.
 */
export interface DateTimePickerProps extends NativeDateTimePickerProps {
  /**
   * Current date/time value in YYYY-MM-DDTHH:mm format.
   */
  value?: string;

  /**
   * Initial date/time value in YYYY-MM-DDTHH:mm format for uncontrolled usage.
   */
  defaultValue?: string;

  /**
   * Callback fired when the date/time value changes.
   */
  onChange?: (newValue: string) => void;

  /**
   * Name attribute used for form submission.
   */
  name?: string;

  /**
   * Minimum selectable date/time in YYYY-MM-DDTHH:mm format.
   */
  min?: string;

  /**
   * Maximum selectable date/time in YYYY-MM-DDTHH:mm format.
   */
  max?: string;

  /**
   * Whether the input is required.
   *
   * @default false
   */
  required?: boolean;

  /**
   * Whether the input is read-only.
   *
   * @default false
   */
  readOnly?: boolean;

  /**
   * Optional placeholder text.
   */
  placeholder?: string;

  /**
   * Native input type used by the picker.
   *
   * @default "datetime-local"
   */
  type?: "date" | "time" | "datetime-local";

  /**
   * Optional autocomplete value.
   *
   * @default "off"
   */
  autoComplete?: InputHTMLAttributes<HTMLInputElement>["autoComplete"];

  /**
   * Optional input title.
   */
  title?: string;

  /**
   * Optional visible label for the input.
   */
  label?: ReactNode;

  /**
   * Position of the label relative to the component.
   *
   * @default "top"
   */
  labelPosition?: LabelPositionType;
  /**
   * Helper text connected with aria-describedby.
   */
  helperText?: ReactNode;

  /**
   * Error text connected with aria-errormessage and announced as an alert.
   */
  errorMessage?: ReactNode;

  /**
   * Whether the picker should stretch to the full available width.
   *
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Theme used for styling.
   *
   * @default configured default theme (fallback: "primary")
   */
  theme?: ThemeType;

  /**
   * Visual state for styling.
   */
  state?: StateType;
  /**
   * Surface treatment; glassOutline combines glass and outline.
   *
   * @default configured default variant (fallback: "solid")
   */
  variant?: import("@/types/types").VariantType;
  /**
   * Rounding style for the component.
   *
   * @default configured default rounding (fallback: "medium")
   */
  rounding?: import("@/types/types").RoundableRoundingType;

  /**
   * Shadow style for the component.
   *
   * @default configured default shadow (fallback: "light")
   */
  shadow?: ShadowType;

  /**
   * Legacy size prop retained for compatibility. DateTimePicker follows
   * DatePicker sizing so this prop does not alter layout.
   */
  size?: SizeType;

  /**
   * Whether the component is disabled.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the component should display a loading state.
   *
   * @default false
   */
  loading?: boolean;

  /**
   * Accessible label for the picker trigger button.
   *
   * @default "Open date and time picker"
   */
  pickerButtonAriaLabel?: string;

  /**
   * Accessible label reference for the picker trigger button.
   */
  pickerButtonAriaLabelledBy?: string;

  /**
   * Accessible description reference for the picker trigger button.
   */
  pickerButtonAriaDescribedBy?: string;

  /**
   * Optional title for the picker trigger button.
   */
  pickerButtonTitle?: string;

  /**
   * Additional class name for the component root.
   */
  className?: string;

  /**
   * Additional class name for the outer label/component container.
   */
  containerClassName?: string;

  /**
   * Additional class name for the visible label.
   */
  labelClassName?: string;

  /**
   * Additional class name for the input/button wrapper.
   */
  inputWrapperClassName?: string;

  /**
   * Additional class name for the native input.
   */
  inputClassName?: string;

  /**
   * Additional class name for the picker trigger button.
   */
  buttonClassName?: string;

  /**
   * Additional class name for description text.
   */

  /**
   * Additional class name for helper text.
   */
  helperTextClassName?: string;

  /**
   * Additional class name for error text.
   */
  errorClassName?: string;

  /**
   * Optional content rendered for assistive technologies only.
   */
  srOnlyText?: ReactNode;

  /**
   * Additional class name for screen-reader-only content.
   */
  srOnlyClassName?: string;

  /**
   * Custom label id.
   */
  labelId?: string;

  /**
   * Custom id for description text.
   */
  descriptionId?: string;

  /**
   * Custom id for error text.
   */
  errorId?: string;

  /**
   * Accessible label for the input when no visible label is present or when an override is needed.
   */
  "aria-label"?: string;

  /**
   * Accessible label reference for the input.
   */
  "aria-labelledby"?: string;

  /**
   * Accessible description reference for the input.
   */
  "aria-describedby"?: string;

  /**
   * Accessible error message reference for the input.
   */
  "aria-errormessage"?: string;

  /**
   * Marks the input as invalid. Useful for external validation control.
   */
  "aria-invalid"?: boolean;

  /**
   * Marks the input as required for assistive technologies.
   */
  "aria-required"?: boolean;

  /**
   * Optional props passed to the native input.
   */
  inputProps?: Omit<
    InputHTMLAttributes<HTMLInputElement>,
    | "type"
    | "value"
    | "defaultValue"
    | "onChange"
    | "name"
    | "min"
    | "max"
    | "required"
    | "disabled"
    | "readOnly"
    | "placeholder"
    | "autoComplete"
    | "title"
    | "id"
    | "className"
  >;

  /**
   * Optional props passed to the picker trigger button.
   */
  buttonProps?: Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "type" | "onClick" | "disabled" | "className" | "aria-label" | "title"
  >;

  /**
   * Optional test ID for testing frameworks.
   *
   * @default dataTestId ?? "datetime-picker"
   */
  testId?: string;

  /**
   * Backward-compatible alias for test ID attributes.
   */
  "data-testid"?: string;
  invalid?: boolean;
}

export interface DateTimePickerBaseProps extends DateTimePickerProps {
  /**
   * Framework-specific class name map supplied by the core or Next wrapper.
   */
  classMap: Record<string, string>;
}

export type DateTimePickerComponent = ForwardRefExoticComponent<
  DateTimePickerProps & RefAttributes<HTMLDivElement>
>;
