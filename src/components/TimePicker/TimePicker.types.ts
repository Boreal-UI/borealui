import {
  LabelPositionType,
  ShadowType,
  StateType,
  ThemeType,
} from "@/types/types";
import {
  ButtonHTMLAttributes,
  ForwardRefExoticComponent,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  RefAttributes,
} from "react";

type NativeTimePickerProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children" | "defaultValue" | "onChange" | "title"
>;

/**
 * Props for the TimePicker component.
 */
export interface TimePickerProps extends NativeTimePickerProps {
  /**
   * Current time value in HH:mm or HH:mm:ss format.
   */
  value?: string;

  /**
   * Initial time value in HH:mm or HH:mm:ss format for uncontrolled usage.
   */
  defaultValue?: string;

  /**
   * Callback fired when the time value changes.
   */
  onChange?: (value: string) => void;

  /**
   * Name attribute used for form submission.
   */
  name?: string;

  /**
   * Minimum selectable time.
   */
  min?: string;

  /**
   * Maximum selectable time.
   */
  max?: string;

  /**
   * Time step in seconds.
   */
  step?: number;

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
   * @default "Open time picker"
   */
  pickerButtonAriaLabel?: string;

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
    | "step"
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
   * @default dataTestId ?? "time-picker"
   */
  testId?: string;

  /**
   * Backward-compatible alias for test ID attributes.
   */
  "data-testid"?: string;
  invalid?: boolean;
  size?: import("@/types/types").SizeType;
}

export interface TimePickerBaseProps extends TimePickerProps {
  /**
   * Framework-specific class name map supplied by the core or Next wrapper.
   */
  classMap: Record<string, string>;
}

export type TimePickerComponent = ForwardRefExoticComponent<
  TimePickerProps & RefAttributes<HTMLDivElement>
>;
