import {
  LabelPositionType,
  RoundingType,
  ShadowType,
  StateType,
  ThemeType,
} from "@/types/types";
import { ComponentType, InputHTMLAttributes, ReactNode } from "react";
import { IconButtonProps } from "../IconButton/IconButton.types";

/**
 * Native input props that we want to inherit while still controlling
 * certain custom behaviors in this component.
 */
type NativeInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "size"
>;

/**
 * Props for the TextInput component.
 */
export interface TextInputProps extends NativeInputProps {
  /**
   * Called when the input value changes.
   * Returns both the current value and the original change event.
   */
  onChange?: (
    value: string,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;

  /**
   * Optional icon component displayed beside the input.
   */
  icon?: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;

  /**
   * If true, the input behaves as a password field and shows a visibility toggle.
   *
   * @default false
   */
  password?: boolean;

  /**
   * Additional CSS class names for custom styling.
   *
   * @default ""
   */
  className?: string;

  /** Additional class names for the outer layout container. */
  containerClassName?: string;

  /** Additional class names for the visible label. */
  labelClassName?: string;

  /** Additional class names for the icon wrapper. */
  iconClassName?: string;

  /** Additional class names for the native input. */
  inputClassName?: string;

  /** Additional class names for the password toggle button. */
  togglePasswordClassName?: string;

  /** Additional class names for the screen-reader-only text. */
  srOnlyClassName?: string;

  /**
   * If true, the input is rendered in read-only mode.
   *
   * @default false
   */
  readOnly?: boolean;

  /**
   * Optional visible label/title for the input.
   */
  label?: string;

  /**
   * Position of the label.
   * "top" | "left" | "right" | "bottom"
   *
   * @default "top"
   */
  labelPosition?: LabelPositionType;

  /**
   * Theme used for styling.
   * "primary" | "secondary" | "tertiary" | "quaternary" | "clear"
   *
   * @default configured default theme (fallback: "primary")
   */
  theme?: ThemeType;

  /**
   * Adds translucent glass styling to the input wrapper.
   *
   * @default configured default glass setting (fallback: false)
   */
  glass?: boolean;

  /**
   * State of the input.
   * "success" | "error" | "warning" | "disabled" | ""
   *
   * @default ""
   */
  state?: StateType;

  /**
   * Rounding of the component.
   * "none" | "small" | "medium" | "large" | "full"
   *
   * @default configured default rounding (fallback: "medium")
   */
  rounding?: RoundingType;

  /**
   * Shadow of the component.
   * "none" | "light" | "medium" | "strong" | "intense"
   *
   * @default configured default shadow (fallback: "light")
   */
  shadow?: ShadowType;

  /**
   * If true, the input is outlined instead of filled.
   *
   * @default configured default outline setting (fallback: false)
   */
  outline?: boolean;

  /**
   * Controls whether autocomplete is enabled.
   * Pass true for "on" or false for "off".
   *
   * @default false
   */
  autocomplete?: boolean;

  /**
   * Maximum length of the input.
   */
  maxLength?: number;

  /**
   * Explicit accessible label for the outer field region if needed.
   */
  "aria-label"?: string;

  /**
   * References one or more elements that label the input.
   */
  "aria-labelledby"?: string;

  /**
   * References one or more elements that describe the input.
   */
  "aria-describedby"?: string;

  /**
   * Indicates whether the input has an invalid value.
   */
  "aria-invalid"?: boolean | "true" | "false" | "grammar" | "spelling";

  /**
   * Indicates whether user input is required.
   */
  "aria-required"?: boolean;

  /**
   * Indicates whether the input is read-only to assistive technologies.
   */
  "aria-readonly"?: boolean;

  /**
   * Indicates whether the element is disabled to assistive technologies.
   */
  "aria-disabled"?: boolean;

  /**
   * Provides a short hint to assistive technologies.
   */
  "aria-description"?: string;

  /**
   * Identifies the current autocomplete suggestion in custom combobox patterns.
   */
  "aria-activedescendant"?: string;

  /**
   * Indicates whether a popup such as a listbox, grid, or dialog is available.
   */
  "aria-haspopup"?:
    | boolean
    | "false"
    | "true"
    | "menu"
    | "listbox"
    | "tree"
    | "grid"
    | "dialog";

  /**
   * Indicates whether the input controls an expandable popup.
   */
  "aria-expanded"?: boolean;

  /**
   * Identifies the element controlled by this input.
   */
  "aria-controls"?: string;

  /**
   * Declares the role when this input is used in advanced patterns
   * such as searchbox, combobox, or spinbutton.
   */
  role?: React.AriaRole;

  /**
   * Optional content rendered for assistive technologies only.
   * Useful for dynamic status or extra context.
   */
  srOnlyText?: ReactNode;


  /**
   * Optional test ID for testing frameworks.
   *
   * @default dataTestId ?? "text-input"
   */
  testId?: string;

  /** Backward-compatible alias for test ID attributes. */
  "data-testid"?: string;
}

export interface TextInputBaseProps extends TextInputProps {
  classMap: Record<string, string>;
  IconButton: React.FC<IconButtonProps>;
}
