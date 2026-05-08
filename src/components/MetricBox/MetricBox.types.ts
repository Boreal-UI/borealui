import { IconType } from "react-icons";
import {
  RoundingType,
  ShadowType,
  SizeType,
  StateType,
  ThemeType,
} from "@/types/types";

/**
 * Props for the MetricBox component.
 */
export interface MetricBoxProps {
  /** Title of the metric. */
  title: string;

  /** The primary value of the metric, e.g., a number or a string. */
  value: string | number;

  /** Optional icon to visually represent the metric (from react-icons, for example). */
  icon?: IconType;

  /** Optional subtext providing additional context for the metric. */
  subtext?: string;

  /** Optional outline style for the component (default: false). */
  outline?: boolean;

  /**
   * Theme to apply for styling.
   * One of: "primary" | "secondary" | "tertiary" | "quaternary" | "clear"
   */
  theme?: ThemeType;

  /**
   * Applies a translucent frosted-glass treatment using the active theme palette.
   */
  glass?: boolean;

  /**
   * Rounding style for the component.
   * One of: "none" | "small" | "medium" | "large" | "full"
   */
  rounding?: RoundingType;

  /**
   * Shadow style for the component.
   * One of: "none" | "light" | "medium" | "strong" | "intense"
   */
  shadow?: ShadowType;

  /**
   * State of the metric.
   * One of: "success" | "error" | "warning" | "disabled" | ""
   */
  state?: StateType;

  /**
   * Size of the component.
   * One of: "xs" | "small" | "medium" | "large" | "xl"
   */
  size?: SizeType;

  /**
   * Text alignment for content.
   * One of: "left" | "center" | "right"
   */
  align?: "left" | "center" | "right";

  /** Optional additional CSS class names for custom styling. */
  className?: string;

  /** Optional test ID for testing frameworks. */
  "data-testid"?: string;

  /**
   * Accessible role for the wrapper.
   * Defaults to "region" when a title is present.
   */
  role?: React.AriaRole;

  /**
   * Custom accessible label for the whole metric box.
   * Use when the title/value pairing needs a more descriptive spoken label.
   */
  "aria-label"?: string;

  /**
   * Custom accessible label reference for the whole metric box.
   * Overrides the internal title-based labelling when provided.
   */
  "aria-labelledby"?: string;

  /**
   * Custom accessible description reference for the whole metric box.
   * Overrides the internal subtext description when provided.
   */
  "aria-describedby"?: string;

  /**
   * Live region setting for announcing metric value updates.
   * Useful for dynamic dashboards.
   */
  "aria-live"?: "off" | "polite" | "assertive";

  /**
   * Whether assistive tech should present the live region as a whole.
   */
  "aria-atomic"?: boolean;

  /**
   * Whether the icon is decorative.
   * Defaults to true.
   */
  decorativeIcon?: boolean;

  /**
   * Accessible label for the icon when it is not decorative.
   */
  iconAriaLabel?: string;
}

export interface BaseMetricBoxProps extends MetricBoxProps {
  classMap: Record<string, string>;
}
