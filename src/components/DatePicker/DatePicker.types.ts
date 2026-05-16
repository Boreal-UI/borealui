import {
  ButtonHTMLAttributes,
  ForwardRefExoticComponent,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  RefAttributes,
} from "react";
import {
  LabelPositionType,
  RoundingType,
  ShadowType,
  StateType,
  ThemeType,
} from "@/types/types";

type NativeDatePickerProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children" | "defaultValue" | "onChange" | "title"
>;

/**
 * Props for the DatePicker component.
 */
export interface DatePickerProps extends NativeDatePickerProps {
  /**
   * Current date value in YYYY-MM-DD format.
   */
  value?: string;

  /**
   * Initial date value in YYYY-MM-DD format for uncontrolled usage.
   */
  defaultValue?: string;

  /**
   * Callback fired when the date value changes.
   */
  onChange?: (value: string) => void;

  /**
   * Name attribute used for form submission.
   */
  name?: string;

  /**
   * Minimum selectable date in YYYY-MM-DD format.
   */
  min?: string;

  /**
   * Maximum selectable date in YYYY-MM-DD format.
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
   * Supporting description connected with aria-describedby.
   */
  description?: ReactNode;

  /**
   * Helper text connected with aria-describedby.
   */
  helperText?: ReactNode;

  /**
   * Error text connected with aria-errormessage and announced as an alert.
   */
  error?: ReactNode;

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
   * Whether to render outlined styling.
   *
   * @default configured default outline setting (fallback: false)
   */
  outline?: boolean;

  /**
   * Whether to render glass styling.
   *
   * @default configured default glass setting (fallback: false)
   */
  glass?: boolean;

  /**
   * Rounding style for the component.
   *
   * @default configured default rounding (fallback: "medium")
   */
  rounding?: RoundingType;

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
   * @default "Open date picker"
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
  descriptionClassName?: string;

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
   * @default dataTestId ?? "date-picker"
   */
  testId?: string;

  /**
   * Backward-compatible alias for test ID attributes.
   */
  "data-testid"?: string;
}

export interface DatePickerBaseProps extends DatePickerProps {
  /**
   * Framework-specific class name map supplied by the core or Next wrapper.
   */
  classMap: Record<string, string>;
}

export type DatePickerComponent = ForwardRefExoticComponent<
  DatePickerProps & RefAttributes<HTMLDivElement>
>;
