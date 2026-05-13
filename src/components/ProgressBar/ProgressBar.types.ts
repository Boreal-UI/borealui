import React from "react";
import {
  LabelPositionType,
  RoundingType,
  ShadowType,
  SizeType,
  StateType,
  ThemeType,
} from "@/types/types";

/**
 * Props for the ProgressBar component.
 */
export interface ProgressBarProps {
  /**
   * Value of progress (0 to 100). Ignored if `indeterminate` is true.
   *
   * @default 0
   */
  value?: number;

  /**
   * Theme for styling the progress bar.
   * One of: "primary" | "secondary" | "tertiary" | "quaternary" | "clear"
   *
   * @default configured default theme (fallback: "primary")
   */
  theme?: ThemeType;

  /**
   * Applies a translucent frosted-glass treatment to the progress track.
   *
   * @default configured default glass setting (fallback: false)
   */
  glass?: boolean;

  /**
   * State of the progress bar.
   * One of: "success" | "error" | "warning" | "disabled" | ""
   *
   * @default ""
   */
  state?: StateType;

  /**
   * Size of the progress bar.
   * One of: "xs" | "small" | "medium" | "large" | "xl"
   *
   * @default configured default size (fallback: "medium")
   */
  size?: SizeType;

  /**
   * Rounding to apply to the progress bar.
   * One of: "none" | "small" | "medium" | "large" | "full"
   *
   * @default configured default rounding (fallback: "medium")
   */
  rounding?: RoundingType;

  /**
   * Shadow to apply to the progress bar.
   * One of: "none" | "light" | "medium" | "strong" | "intense"
   *
   * @default configured default shadow (fallback: "light")
   */
  shadow?: ShadowType;

  /**
   * If true, applies an animated effect to the progress bar.
   *
   * @default true
   */
  animated?: boolean;

  /**
   * Accessible label for the progress bar.
   * Use this when no visible label exists.
   *
   * @default "Progress"
   */
  "aria-label"?: string;

  /**
   * ID of the element that labels the progress bar.
   * Prefer this when there is a visible label in the UI.
   */
  "aria-labelledby"?: string;

  /**
   * ID of the element that describes the progress bar.
   * Useful for extra context or status messaging.
   */
  "aria-describedby"?: string;

  /**
   * Custom accessible text for screen readers.
   * Example: "Uploading 3 of 5 files"
   */
  "aria-valuetext"?: string;

  /**
   * If true, the progress bar shows an indeterminate animation.
   * When true, the value prop is ignored.
   *
   * @default false
   */
  indeterminate?: boolean;

  /**
   * Optional additional class name(s) for custom styling.
   *
   * @default ""
   */
  className?: string;

  /**
   * Optional label describing what the progress represents.
   * Example: "Uploading files", "Build progress"
   */
  label?: React.ReactNode;

  /**
   * Position of the label relative to the progress bar.
   *
   * @default "top"
   */
  labelPosition?: LabelPositionType;

  /**
   * Optional id applied to the visible label container.
   * Useful when connecting the label with aria-labelledby.
   */
  labelId?: string;

  /**
   * Optional description content rendered for assistive technology.
   */
  description?: React.ReactNode;

  /**
   * Optional id applied to the description container.
   * Useful when connecting the description with aria-describedby.
   */
  descriptionId?: string;


  /**
   * Optional test ID for testing frameworks.
   *
   * @default dataTestId ?? "progressbar"
   */
  testId?: string;

  /** Backward-compatible alias for test ID attributes. */
  "data-testid"?: string;
}

export interface BaseProgressBarProps extends ProgressBarProps {
  /**
   * Framework-specific class name map supplied by the core or Next wrapper.
   */
  classMap: Record<string, string>;
}
