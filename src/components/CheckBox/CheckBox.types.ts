import { RoundingType, ShadowType, StateType, ThemeType } from "@/types/types";
import { InputHTMLAttributes, ReactNode } from "react";

/**
 * Props for the CheckBox component.
 */
export interface CheckBoxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "size" | "children"
> {
  /**
   * Label text displayed beside the checkbox.
   */
  label?: ReactNode;

  /** Checked state of the checkbox. */
  checked: boolean;

  /** Callback when the checkbox value changes. */
  onChange: (checked: boolean) => void;

  /**
   * Whether the checkbox is in an indeterminate (mixed) state.
   *
   * @default false
   */
  indeterminate?: boolean;

  /**
   * Optional theme to style the checkbox
   * ('primary' | 'secondary' | 'tertiary' | 'quaternary' | 'clear').
   *
   * @default configured default theme (fallback: "primary")
   */
  theme?: ThemeType;

  /**
   * State of the checkbox
   * ('success' | 'error' | 'warning' | 'info' | 'disabled' | '').
   */
  state?: StateType;

  /**
   * Controls the rounding of the checkbox
   * ('none' | 'small' | 'medium' | 'large' | 'full').
   *
   * @default configured default rounding (fallback: "medium")
   */
  rounding?: RoundingType;
  /**
   * Controls the shadow of the checkbox
   * ('none' | 'light' | 'medium' | 'strong' | 'intense').
   *
   * @default configured default shadow (fallback: "light")
   */
  shadow?: ShadowType;
  /**
   * Surface treatment; glassOutline combines glass and outline.
   *
   * @default configured default variant (fallback: "solid")
   */
  variant?: import("@/types/types").VariantType;
  /**
   * Whether the checkbox is disabled.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the checkbox is required.
   *
   * @default false
   */
  required?: boolean;

  /**
   * Marks the checkbox as invalid.
   * Useful when validation fails.
   *
   * @default false
   */
  invalid?: boolean;
  /**
   * Visible error message rendered for invalid state.
   * This can also be referenced by assistive technologies.
   */
  errorMessage?: ReactNode;

  /**
   * Custom class name for additional styling.
   */
  className?: string;

  /** Additional class names for the label/input wrapper. */
  labelWrapperClassName?: string;

  /** Additional class names for the native input. */
  inputClassName?: string;

  /** Additional class names for the visual checkbox box. */
  boxClassName?: string;

  /** Additional class names for the label text. */
  labelClassName?: string;

  /** Additional class names for the helper description. */
  descriptionClassName?: string;

  /** Additional class names for the error message. */
  errorMessageClassName?: string;

  /**
   * Position of the label relative to the checkbox
   * ('left' | 'right').
   *
   * @default "right"
   */
  labelPosition?: "left" | "right";

  /**
   * Accessible label for the checkbox when no visible label is present
   * or when a more descriptive label is needed.
   */
  "aria-label"?: string;

  /**
   * ID reference(s) to element(s) that label the checkbox.
   * If provided, this takes precedence over the internal label association.
   */
  "aria-labelledby"?: string;

  /**
   * ID reference(s) to element(s) that describe the checkbox.
   * This may include helper text, error text, or external descriptions.
   */
  "aria-describedby"?: string;

  /**
   * ID reference to the element containing the error message.
   * Typically used together with aria-invalid.
   */
  "aria-errormessage"?: string;

  /** Optional role override, though checkbox is the default semantic role. */
  role?: "checkbox";

  /**
   * Optional test ID for testing frameworks.
   *
   * @default dataTestId ?? "checkbox"
   */
  testId?: string;

  /** Backward-compatible alias for test ID attributes. */
  "data-testid"?: string;
  helperText?: import("react").ReactNode;
  size?: import("@/types/types").SizeType;
}

export interface CheckBoxBaseProps extends CheckBoxProps {
  /**
   * Framework-specific class name map supplied by the core or Next wrapper.
   */
  classMap: Record<string, string>;
}
