import React from "react";
import {
  RoundingType,
  ShadowType,
  SizeType,
  StateType,
  ThemeType,
} from "@/types/types";

/**
 * Props for the Slider component.
 */
export interface SliderProps {
  /** The current numeric value of the slider. */
  value: number;

  /**
   * Callback invoked when the slider value changes.
   * Receives the change event from the input element.
   */
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  /**
   * Callback invoked when the slider value changes.
   */
  onValueChange?: (value: number) => void;

  /** Optional id for the slider input. */
  id?: string;

  /** Optional form field name. */
  name?: string;

  /** The minimum value of the slider. */
  min?: number;

  /** The maximum value of the slider. */
  max?: number;

  /** Increment step for the slider. */
  step?: number;

  /** Optional label displayed above or beside the slider. */
  label?: string;

  /** If true, the current slider value is displayed alongside the slider. */
  showValue?: boolean;

  /**
   * Size variant for the slider.
   * One of: "xs" | "small" | "medium" | "large" | "xl"
   */
  size?: SizeType;

  /**
   * Theme variant for styling.
   * One of: "primary" | "secondary" | "tertiary" | "quaternary" | "clear"
   */
  theme?: ThemeType;

  /**
   * Applies a translucent frosted-glass treatment to the slider track.
   */
  glass?: boolean;

  /**
   * State of the slider.
   * One of: "success" | "error" | "warning" | "disabled" | ""
   */
  state?: StateType;

  /**
   * Controls the rounding of the component.
   * One of: "none" | "small" | "medium" | "large" | "full"
   */
  rounding?: RoundingType;

  /**
   * If true, the slider is disabled and cannot be interacted with.
   */
  disabled?: boolean;

  /** If true, the slider is required in form contexts. */
  required?: boolean;

  /**
   * Controls the shadow of the component.
   * One of: "none" | "light" | "medium" | "strong" | "intense"
   */
  shadow?: ShadowType;

  /** Additional CSS class names for custom styling. */
  className?: string;

  /** Accessible label for the slider if no visible label is provided. */
  "aria-label"?: string;

  /** Id of external element(s) that label the slider. */
  "aria-labelledby"?: string;

  /** Id of external element(s) that describe the slider. */
  "aria-describedby"?: string;

  /** Human-friendly text alternative for the current value. */
  "aria-valuetext"?: string;

  /** Explicit minimum value for assistive technology. */
  "aria-valuemin"?: number;

  /** Explicit maximum value for assistive technology. */
  "aria-valuemax"?: number;

  /** Explicit current numeric value for assistive technology. */
  "aria-valuenow"?: number;

  /** Marks the slider as invalid. */
  "aria-invalid"?: boolean | "true" | "false";

  /** Marks the slider as required for assistive technology. */
  "aria-required"?: boolean | "true" | "false";

  /** Orientation of the slider. */
  "aria-orientation"?: "horizontal" | "vertical";

  /** Optional test ID for testing frameworks. */
  "data-testid"?: string;
}
