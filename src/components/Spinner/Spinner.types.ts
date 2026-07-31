import { ShadowType, StateType, ThemeType } from "@/types/types";
import React from "react";

/**
 * Props for the Spinner component.
 */
export interface SpinnerProps {
  /**
   * The theme color of the spinner.
   * One of: "primary" | "secondary" | "tertiary" | "quaternary" | "clear"
   *
   * @default configured default theme (fallback: "primary")
   */
  theme?: ThemeType;
  /**
   * Surface treatment; glassOutline combines glass and outline.
   *
   * @default configured default variant (fallback: "solid")
   */
  variant?: import("@/types/types").VariantType;
  /**
   * The state of the spinner.
   * One of: "success" | "error" | "warning" | "disabled" | ""
   *
   */
  state?: StateType;

  /**
   * The size of the spinner (in pixels).
   *
   * @default 50
   */
  size?: number;

  /**
   * Shadow style for the spinner.
   * One of: "none" | "light" | "medium" | "strong" | "intense"
   *
   * @default configured default shadow (fallback: "light")
   */
  shadow?: ShadowType;

  /**
   * Additional class names for styling customization.
   *
   */
  className?: string;

  /**
   * Optional test ID for testing frameworks.
   *
   * @default dataTestId ?? "spinner"
   */
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
   *
   * @default "polite"
   */
  "aria-live"?: "off" | "polite" | "assertive";

  /**
   * Whether the related region is busy.
   * Defaults to true.
   *
   * @default true
   */
  "aria-busy"?: boolean;

  /**
   * Optional ARIA role.
   * Defaults to "status".
   *
   * @default "status"
   */
  role?: React.AriaRole;
}
