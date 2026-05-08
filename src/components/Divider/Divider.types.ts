import React from "react";
import { ThemeType, OrientationType, StateType } from "@/types/types";

/**
 * Props for the Divider component.
 */
export interface DividerProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  "role" | "children" | "aria-label" | "aria-labelledby"
> {
  /**
   * Orientation of the divider
   * ('horizontal' | 'vertical'). Default is 'horizontal'.
   */
  orientation?: OrientationType;

  /** Thickness of the divider (e.g., "1px", "4px"). */
  thickness?: string;

  /** Length of the divider (e.g., "100%", "60px"). */
  length?: string;

  /** Whether the divider should be dashed instead of solid. */
  dashed?: boolean;

  /**
   * Theme style to apply to the divider
   * ('primary' | 'secondary' | 'tertiary' | 'quaternary' | 'clear').
   */
  theme?: ThemeType;

  /**
   * Applies a translucent frosted-glass treatment using the active theme palette.
   */
  glass?: boolean;

  /**
   * State of the divider
   * ('success' | 'error' | 'warning' | 'disabled' | '').
   */
  state?: StateType;

  /**
   * HTML tag to render
   * ('div' | 'hr' | 'span').
   */
  as?: "div" | "hr" | "span";

  /**
   * Whether the divider is purely decorative.
   * When true, it is hidden from assistive technology.
   *
   * Default: true
   */
  decorative?: boolean;

  /**
   * Accessible label for a meaningful separator.
   * Only used when decorative is false.
   */
  label?: string;

  /**
   * ID of an element that labels this separator.
   * Only used when decorative is false.
   */
  labelledBy?: string;

  /** Optional test ID for testing frameworks. */
  testId?: string;

  /** Backward-compatible alias for test ID attributes. */
  "data-testid"?: string;
}

export interface DividerBaseProps extends DividerProps {
  classMap: Record<string, string>;
}
