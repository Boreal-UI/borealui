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
   *
   * @default configured default theme (fallback: "primary")
   */
  theme?: ThemeType;

  /**
   * Applies a translucent frosted-glass treatment to the toggle track.
   *
   * @default configured default glass setting (fallback: false)
   */
  glass?: boolean;

  /**
   * State of the toggle.
   * "" | "success" | "error" | "warning" | "disabled"
   *
   * @default ""
   */
  state?: StateType;

  /**
   * Rounding applied to the toggle.
   * "none" | "small" | "medium" | "large" | "full"
   *
   * @default configured default rounding (fallback: "medium")
   */
  rounding?: RoundingType;

  /**
   * Shadow style applied to the toggle.
   * "none" | "light" | "medium" | "strong" | "intense"
   *
   * @default configured default shadow (fallback: "light")
   */
  shadow?: ShadowType;

  /**
   * Size variant for the toggle.
   * "xs" | "small" | "medium" | "large" | "xl"
   *
   * @default configured default size (fallback: "medium")
   */
  size?: SizeType;

  /**
   * If true, disables user interaction with the toggle.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Additional CSS class names for custom styling.
   */
  className?: string;


  /**
   * Optional test ID for testing frameworks.
   *
   * @default dataTestId ?? "toggle"
   */
  testId?: string;

  /** Backward-compatible alias for test ID attributes. */
  "data-testid"?: string;
}

export interface ToggleBaseProps extends ToggleProps {
  /**
   * Framework-specific class name map supplied by the core or Next wrapper.
   */
  classMap: Record<string, string>;
}
