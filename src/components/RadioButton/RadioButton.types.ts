import { RoundingType, ShadowType, StateType, ThemeType } from "@/types/types";
import { FieldsetHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";

export type RadioButtonOption = {
  /** Label displayed beside the radio button. */
  label: ReactNode;

  /** Value selected when this option is chosen. */
  value: string;

  /** Whether this specific option is disabled. */
  disabled?: boolean;

  /** Optional accessible label for icon-only or custom visual labels. */
  "aria-label"?: string;

  /** Optional test ID for this option. */
  /** Optional test ID for testing frameworks. */
  testId?: string;

  /** Backward-compatible alias for test ID attributes. */
  "data-testid"?: string;
};

/**
 * Props for the RadioButton component.
 */
export interface RadioButtonProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "children" | "onChange" | "size"
> {
  /**
   * The label text displayed next to the radio button.
   */
  label?: ReactNode;

  /** Position of the label relative to the radio button. */
  labelPosition?: "left" | "right";

  /**
   * The value associated with this radio button.
   */
  value: string;

  /**
   * Whether this radio button is currently checked.
   */
  checked: boolean;

  /**
   * Callback triggered when the radio button's value changes.
   */
  onChange: (value: string) => void;

  /**
   * Theme applied for styling.
   * One of: "primary" | "secondary" | "tertiary" | "quaternary" | "clear"
   */
  theme?: ThemeType;

  /**
   * Applies a translucent frosted-glass treatment to the visible radio control.
   */
  glass?: boolean;

  /**
   * State of the radio button.
   * One of: "success" | "error" | "warning" | "disabled" | ""
   */
  state?: StateType;

  /**
   * Rounding of the radio button.
   * One of: "none" | "small" | "medium" | "large" | "full"
   */
  rounding?: RoundingType;

  /**
   * Shadow style of the radio button.
   * One of: "none" | "light" | "medium" | "strong" | "intense"
   */
  shadow?: ShadowType;

  /**
   * Whether the radio button is disabled.
   */
  disabled?: boolean;

  /**
   * Marks the radio button as invalid for accessibility.
   */
  "aria-invalid"?: boolean | "true" | "false";

  /**
   * Identifies the element (or elements) that label this radio button.
   * Usually not needed when using the built-in `label` prop, but available for advanced cases.
   */
  "aria-labelledby"?: string;

  /**
   * Identifies the element (or elements) that describe this radio button.
   */
  "aria-describedby"?: string;

  /**
   * Provides an accessible label when no visible label is present.
   */
  "aria-label"?: string;

  /**
   * Indicates whether this radio button is required as part of a group.
   */
  "aria-required"?: boolean | "true" | "false";

  /**
   * Additional CSS class names for custom styling.
   */
  className?: string;

  /** Optional test ID for testing frameworks. */
  testId?: string;

  /** Backward-compatible alias for test ID attributes. */
  "data-testid"?: string;
}

export interface BaseRadioButtonProps extends RadioButtonProps {
  classMap: Record<string, string>;
}

export interface RadioGroupProps extends Omit<
  FieldsetHTMLAttributes<HTMLFieldSetElement>,
  "children" | "disabled" | "onChange"
> {
  /** Accessible group label displayed as a legend. */
  legend?: ReactNode;

  /** Name shared by all radio buttons in the group. */
  name: string;

  /** Available radio options. */
  options: RadioButtonOption[];

  /** Currently selected option value. */
  value: string;

  /** Callback triggered with the selected option value. */
  onChange: (value: string) => void;

  /** Layout direction for the radio options. */
  orientation?: "vertical" | "horizontal";

  /** Theme applied for styling. */
  theme?: ThemeType;

  /** Applies a translucent frosted-glass treatment to each radio option. */
  glass?: boolean;

  /** State of the radio group. */
  state?: StateType;

  /** Rounding of each radio control. */
  rounding?: RoundingType;

  /** Shadow style of each radio control. */
  shadow?: ShadowType;

  /** Whether every option in the group is disabled. */
  disabled?: boolean;

  /** Whether selection is required. */
  required?: boolean;

  /** Marks the radio group as invalid. */
  invalid?: boolean;

  /** Visible helper text for the radio group. */
  description?: ReactNode;

  /** Visible error message for invalid state. */
  errorMessage?: ReactNode;

  /** Custom class name for the root fieldset. */
  className?: string;

  /** Custom class name for the options wrapper. */
  optionsClassName?: string;

  /** Optional test ID for testing frameworks. */
  testId?: string;

  /** Backward-compatible alias for test ID attributes. */
  "data-testid"?: string;
}

export interface BaseRadioGroupProps extends RadioGroupProps {
  classMap: Record<string, string>;
}
