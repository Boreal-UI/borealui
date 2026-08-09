import { RoundingType, ShadowType } from "@/types/types";
import { AriaAttributes, HTMLAttributes, JSX } from "react";

/**
 * Props for the SkeletonLoader component.
 */
export interface SkeletonProps {
  /**
   * Width of the skeleton loader (e.g., "100%", "200px", or a number representing pixels).
   *
   * @default "100%"
   */
  width?: string | number;

  /**
   * Height of the skeleton loader (e.g., "100%", "50px", or a number representing pixels).
   *
   * @default "100%"
   */
  height?: string | number;

  /**
   * Rounding of the skeleton.
   * "none" | "small" | "medium" | "large" | "full"
   *
   * @default configured default rounding (fallback: "medium")
   */
  rounding?: RoundingType;

  /**
   * Shadow style for the skeleton loader.
   * "none" | "light" | "medium" | "strong" | "intense"
   *
   * @default configured default shadow (fallback: "light")
   */
  shadow?: ShadowType;

  /**
   * Additional class name(s) for custom styling.
   *
   */
  className?: string;

  /**
   * Optional test ID for testing frameworks.
   *
   * @default dataTestId ?? "skeleton-loader"
   */
  testId?: string;

  /** Backward-compatible alias for test ID attributes. */
  "data-testid"?: string;

  /**
   * Accessibility label for screen readers.
   * Used as fallback hidden descriptive text when announce is enabled.
   *
   * @default "Loading content..."
   */
  label?: string;

  /**
   * Optional ARIA label for the skeleton.
   * Preferred when you want to directly label the status region.
   */
  "aria-label"?: string;

  /**
   * Optional ID reference to an external label element.
   */
  "aria-labelledby"?: string;

  /**
   * Optional ID reference to additional descriptive content.
   */
  "aria-describedby"?: string;

  /**
   * Overrides the default ARIA live politeness when announce is enabled.
   */
  "aria-live"?: "off" | "polite" | "assertive";

  /**
   * Overrides the default busy state.
   */
  "aria-busy"?: boolean;

  /**
   * Allows explicit control over whether the skeleton should be exposed to assistive technology.
   */
  "aria-hidden"?: boolean;

  /**
   * Optional semantic role override.
   * Defaults to "status" when announce is enabled.
   */
  role?: HTMLAttributes<HTMLElement>["role"];
}

export interface SkeletonBaseProps extends SkeletonProps {
  /**
   * Framework-specific class name map supplied by the core or Next wrapper.
   */
  classMap: Record<string, string>;
}

export type ExtraProps = {
  /**
   * As.
   * @default "div"
   */
  as?: keyof JSX.IntrinsicElements;
  /**
   * Announce.
   * @default true
   */
  announce?: boolean;
  /**
   * Animate.
   * @default true
   */
  animate?: boolean;
} & AriaAttributes;
