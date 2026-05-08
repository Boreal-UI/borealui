import type { HTMLAttributes } from "react";
import { ShadowType, SizeType, StateType, ThemeType } from "@/types/types";

/**
 * Props for the CircularProgress component.
 */
export interface CircularProgressProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> {
  /** Current value to be visualized (e.g., 75). */
  value: number;

  /** Minimum value for the range (default: 0). */
  min?: number;

  /** Maximum value for the range (default: 100). */
  max?: number;

  /**
   * Visible label fallback and default accessible name.
   * Used only when no aria-label or aria-labelledby is provided.
   */
  label?: string;

  /** Whether to show raw value (e.g., "75/100") instead of percent. */
  showRaw?: boolean;

  /**
   * Custom accessible value text for assistive technologies.
   * Example: "75 percent complete"
   */
  ariaValueText?: string;

  /**
   * Accessible label for the progressbar.
   * Takes priority over `label`.
   */
  "aria-label"?: string;

  /**
   * ID reference to one or more elements that label the progressbar.
   * Takes priority over `aria-label` and `label`.
   */
  "aria-labelledby"?: string;

  /**
   * ID reference to one or more elements that describe the progressbar.
   */
  "aria-describedby"?: string;

  /**
   * Marks the component as decorative.
   * When true, the progressbar will be hidden from assistive technology.
   */
  decorative?: boolean;

  /**
   * Whether the visible value text inside the circle should be announced
   * by assistive technologies.
   *
   * Default: false, because the progressbar itself already exposes value via ARIA.
   */
  announceInnerValue?: boolean;

  /**
   * Size of the component
   * ('xs' | 'small' | 'medium' | 'large' | 'xl').
   */
  size?: SizeType;

  /**
   * Optional theme for the component
   * ('primary' | 'secondary' | 'tertiary' | 'quaternary' | 'clear').
   */
  theme?: ThemeType;

  /**
   * Optional shadow style for the component
   * ('none' | 'light' | 'medium' | 'strong' | 'intense').
   */
  shadow?: ShadowType;

  /**
   * State of progress
   * ('success' | 'error' | 'warning' | 'disabled' | '').
   */
  state?: StateType;

  /**
   * Applies a translucent frosted-glass treatment using the active theme palette.
   */
  glass?: boolean;

  /** Optional class name for custom styling. */
  className?: string;

  /** Optional test ID for testing frameworks. */
  "data-testid"?: string;
}

export interface CircularProgressBaseProps extends CircularProgressProps {
  classMap: Record<string, string>;
}
