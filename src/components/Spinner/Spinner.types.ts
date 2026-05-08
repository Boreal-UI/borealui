import { ShadowType, StateType, ThemeType } from "@/types/types";
import React from "react";

/**
 * Props for the Spinner component.
 */
export interface SpinnerProps {
  /**
   * The theme color of the spinner.
   * One of: "primary" | "secondary" | "tertiary" | "quaternary" | "clear"
   */
  theme?: ThemeType;

  /**
   * Applies a translucent frosted-glass surface behind the spinner.
   */
  glass?: boolean;

  /**
   * The state of the spinner.
   * One of: "success" | "error" | "warning" | "disabled" | ""
   */
  state?: StateType;

  /**
   * The size of the spinner (in pixels).
   */
  size?: number;

  /**
   * Shadow style for the spinner.
   * One of: "none" | "light" | "medium" | "strong" | "intense"
   */
  shadow?: ShadowType;

  /**
   * Additional class names for styling customization.
   */
  className?: string;

  /** Optional test ID for testing frameworks. */
  testId?: string;

  /** Backward-compatible alias for test ID attributes. */
  "data-testid"?: string;

  /**
   * Optional visible label for the spinner.
   */
  label?: string;

  /**
   * Accessible label announced by screen readers.
   * Falls back to `label`, then "Loading".
   */
  "aria-label"?: string;

  /**
   * ID of element(s) that label the spinner.
   * Takes precedence over `aria-label` when provided.
   */
  "aria-labelledby"?: string;

  /**
   * ID of element(s) that describe the spinner.
   */
  "aria-describedby"?: string;

  /**
   * ARIA live region politeness.
   * Defaults to "polite".
   */
  "aria-live"?: "off" | "polite" | "assertive";

  /**
   * Whether the related region is busy.
   * Defaults to true.
   */
  "aria-busy"?: boolean;

  /**
   * Optional ARIA role.
   * Defaults to "status".
   */
  role?: React.AriaRole;
}
