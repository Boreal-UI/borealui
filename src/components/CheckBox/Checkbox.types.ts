import {
  RoundingType,
  ShadowType,
  SizeType,
  StateType,
  ThemeType,
} from "@/types/types";
import { InputHTMLAttributes, ReactNode } from "react";

/**
 * Props for the Checkbox component.
 */
export interface CheckBoxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "size" | "children"
> {
  /** Label text displayed beside the checkbox. */
  label?: ReactNode;

  /** Checked state of the checkbox. */
  checked: boolean;

  /** Callback when the checkbox value changes. */
  onChange: (checked: boolean) => void;

  /** Whether the checkbox is in an indeterminate (mixed) state. */
  indeterminate?: boolean;

  /**
   * Optional theme to style the checkbox
   * ('primary' | 'secondary' | 'tertiary' | 'quaternary' | 'clear').
   */
  theme?: ThemeType;

  /**
   * State of the checkbox
   * ('success' | 'error' | 'warning' | 'disabled' | '').
   */
  state?: StateType;

  /**
   * Controls the rounding of the checkbox
   * ('none' | 'small' | 'medium' | 'large' | 'full').
   */
  rounding?: RoundingType;

  /**
   * Size of the checkbox
   * ('xs' | 'small' | 'medium' | 'large' | 'xl').
   */
  size?: SizeType;

  /**
   * Controls the shadow of the checkbox
   * ('none' | 'light' | 'medium' | 'strong' | 'intense').
   */
  shadow?: ShadowType;

  /**
   * Applies a translucent frosted-glass treatment using the active theme palette.
   */
  glass?: boolean;

  /** Whether the checkbox is disabled. */
  disabled?: boolean;

  /** Whether the checkbox is required. */
  required?: boolean;

  /**
   * Marks the checkbox as invalid.
   * Useful when validation fails.
   */
  invalid?: boolean;

  /**
   * Visible helper text rendered below or beside the checkbox.
   * Should provide extra guidance for the user.
   */
  description?: ReactNode;

  /**
   * Visible error message rendered for invalid state.
   * This can also be referenced by assistive technologies.
   */
  errorMessage?: ReactNode;

  /** Custom class name for additional styling. */
  className?: string;

  /**
   * Position of the label relative to the checkbox
   * ('left' | 'right').
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

  /** Optional test ID for testing frameworks. */
  "data-testid"?: string;
}

export interface CheckboxBaseProps extends CheckBoxProps {
  classMap: Record<string, string>;
}
