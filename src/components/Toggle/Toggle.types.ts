import {
  RoundingType,
  ShadowType,
  SizeType,
  StateType,
  ThemeType,
} from "@/types/types";

/**
 * Props for the Toggle component.
 */
export interface ToggleProps {
  /**
   * Indicates whether the toggle is in the "on" (`true`) or "off" (`false`) state.
   */
  checked: boolean;

  /**
   * Callback that is invoked when the toggle's state changes.
   * Receives the new boolean state as an argument.
   */
  onChange: (checked: boolean) => void;

  /**
   * Optional label to be displayed next to the toggle switch.
   */
  label?: string;

  /**
   * Optional id for the toggle button.
   * If not provided, one will be generated automatically.
   */
  id?: string;

  /**
   * Accessible label for screen readers.
   * Best used when no visible label is rendered.
   */
  "aria-label"?: string;

  /**
   * References the id of an element that labels the toggle.
   * Takes precedence over aria-label when provided.
   */
  "aria-labelledby"?: string;

  /**
   * References the id of an element that describes the toggle,
   * such as hint text or supporting content.
   */
  "aria-describedby"?: string;

  /**
   * Indicates whether the current value is invalid.
   */
  "aria-invalid"?: boolean;

  /**
   * References the id of an element containing an error message.
   */
  "aria-errormessage"?: string;

  /**
   * Explicitly communicates disabled state to assistive technologies.
   * Normally inferred from `disabled`, but exposed for flexibility.
   */
  "aria-disabled"?: boolean;

  /**
   * Optional tab index for focus management.
   */
  tabIndex?: number;

  /**
   * Theme used for styling the toggle.
   * "primary" | "secondary" | "tertiary" | "quaternary" | "clear"
   */
  theme?: ThemeType;

  /**
   * Applies a translucent frosted-glass treatment to the toggle track.
   */
  glass?: boolean;

  /**
   * State of the toggle.
   *   "" | "success" | "error" | "warning" | "disabled"
   */
  state?: StateType;

  /**
   * Rounding applied to the toggle.
   * "none" | "small" | "medium" | "large" | "full"
   */
  rounding?: RoundingType;

  /**
   * Shadow style applied to the toggle.
   * "none" | "light" | "medium" | "strong" | "intense"
   */
  shadow?: ShadowType;

  /**
   * Size variant for the toggle.
   * "xs" | "small" | "medium" | "large" | "xl"
   */
  size?: SizeType;

  /**
   * If true, disables user interaction with the toggle.
   */
  disabled?: boolean;

  /**
   * Additional CSS class names for custom styling.
   */
  className?: string;

  /**
   * Optional test ID for testing frameworks.
   */
  "data-testid"?: string;
}

export interface ToggleBaseProps extends ToggleProps {
  classMap: Record<string, string>;
}
