import {
  LabelPositionType,
  RoundingType,
  ShadowType,
  StateType,
  ThemeType,
} from "@/types/types";
import {
  ForwardRefExoticComponent,
  InputHTMLAttributes,
  ReactNode,
  RefAttributes,
} from "react";

type NativeNumberInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "size" | "type" | "value" | "defaultValue"
>;

/**
 * Props for the NumberInput component.
 */
export interface NumberInputProps extends NativeNumberInputProps {
  /**
   * Current numeric value for controlled usage.
   */
  value?: number | "";

  /**
   * Initial numeric value for uncontrolled usage.
   */
  defaultValue?: number | "";

  /**
   * Callback fired when the numeric value changes.
   * The first argument is `""` when the input is empty.
   */
  onChange?: (
    value: number | "",
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;

  /**
   * Callback fired with numeric values only.
   * Empty or invalid values are ignored.
   */
  onValueChange?: (value: number) => void;

  /**
   * Visible label content for the input.
   */
  label?: ReactNode;

  /**
   * Position of the label relative to the input.
   *
   * @default "top"
   */
  labelPosition?: LabelPositionType;

  /**
   * Placeholder shown when the input is empty and no label is floating.
   *
   * @default "Enter number"
   */
  placeholder?: string;

  /**
   * Minimum allowed value.
   */
  min?: number;

  /**
   * Maximum allowed value.
   */
  max?: number;

  /**
   * Increment/decrement step.
   *
   * @default 1
   */
  step?: number;

  /**
   * Whether to clamp values to min/max on blur and when using stepper buttons.
   *
   * @default true
   */
  clampOnBlur?: boolean;

  /**
   * Whether to show increment/decrement stepper buttons.
   *
   * @default true
   */
  showControls?: boolean;

  /**
   * Accessible label for the decrement control.
   *
   * @default "Decrease value"
   */
  decrementAriaLabel?: string;

  /**
   * Accessible label for the increment control.
   *
   * @default "Increase value"
   */
  incrementAriaLabel?: string;

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
   * Rounding style for the input.
   *
   * @default configured default rounding (fallback: "medium")
   */
  rounding?: RoundingType;

  /**
   * Shadow style for the input.
   *
   * @default configured default shadow (fallback: "light")
   */
  shadow?: ShadowType;

  /**
   * Additional class name for the component root.
   */
  className?: string;

  /**
   * Additional class name for the outer label/input container.
   */
  containerClassName?: string;

  /**
   * Additional class name for the visible label.
   */
  labelClassName?: string;

  /**
   * Additional class name for the native input.
   */
  inputClassName?: string;

  /**
   * Additional class name for the stepper controls wrapper.
   */
  controlsClassName?: string;

  /**
   * Additional class name for the decrement button.
   */
  decrementButtonClassName?: string;

  /**
   * Additional class name for the increment button.
   */
  incrementButtonClassName?: string;

  /**
   * Optional content rendered for assistive technologies only.
   */
  srOnlyText?: ReactNode;

  /**
   * Additional class name for screen-reader-only content.
   */
  srOnlyClassName?: string;

  /**
   * Optional test ID for testing frameworks.
   *
   * @default dataTestId ?? "number-input"
   */
  testId?: string;

  /**
   * Backward-compatible alias for test ID attributes.
   */
  "data-testid"?: string;
  invalid?: boolean;
  helperText?: import("react").ReactNode;
  errorMessage?: import("react").ReactNode;
  size?: import("@/types/types").SizeType;
}

export interface NumberInputBaseProps extends NumberInputProps {
  /**
   * Framework-specific class name map supplied by the core or Next wrapper.
   */
  classMap: Record<string, string>;
}

export type NumberInputComponent = ForwardRefExoticComponent<
  NumberInputProps & RefAttributes<HTMLInputElement>
>;
