import {
  OrientationType,
  RoundingType,
  ShadowType,
  SizeType,
  StateType,
  ThemeType,
} from "@/types/types";
import React from "react";
import { IconButtonProps } from "../IconButton/IconButton.types";

/**
 * Represents a step in the Stepper.
 */
interface Step {
  /** The label for the step. */
  label: string;
  /** An optional icon component for the step. */
  icon?: React.ComponentType;
}

/**
 * Props for the Stepper component.
 */
export interface StepperProps {
  /** An array of steps, each with a label and optional icon. */
  steps: Step[];
  /** The index of the currently active step. */
  activeStep: number;
  /** Optional callback when a step is clicked. */
  onStepClick?: (stepIndex: number) => void;
  /**
   * If true, disables backward navigation (users cannot go to previous steps).
   *
   * @default false
   */
  disableBackNavigation?: boolean;

  /**
   * Orientation of the stepper.
   * "horizontal" | "vertical"
   *
   * @default "horizontal"
   */
  orientation?: OrientationType;

  /**
   * Theme style for the stepper.
   * "primary" | "secondary" | "tertiary" | "quaternary" | "clear"
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
   * State of the stepper.
   * "success" | "error" | "warning" | "disabled" | ""
   *
   */
  state?: StateType;

  /**
   * Shadow style for the stepper buttons.
   * "none" | "light" | "medium" | "strong" | "intense"
   *
   * @default configured default shadow (fallback: "light")
   */
  shadow?: ShadowType;

  /**
   * Rounding of the stepper buttons.
   * "none" | "small" | "medium" | "large" | "full"
   *
   * @default configured default rounding (fallback: "medium")
   */
  rounding?: RoundingType;

  /**
   * Size of the stepper icons.
   * "xs" | "small" | "medium" | "large" | "xl"
   *
   * @default configured default size (fallback: "medium")
   */
  size?: SizeType;

  /** Optional test ID for testing purposes. */

  /**
   * Optional test ID for testing frameworks.
   *
   * @default dataTestId ?? "stepper"
   */
  testId?: string;

  /** Backward-compatible alias for test ID attributes. */
  "data-testid"?: string;

  /**
   * Additional class names for styling customization.
   */
  className?: string;

  /**
   * Accessible label for the stepper container.
   * Use this when there is no visible external label.
   */
  "aria-label"?: string;

  /**
   * ID of an element that labels the stepper container.
   * Takes precedence over aria-label when provided.
   */
  "aria-labelledby"?: string;

  /**
   * ID of an element that describes the stepper container.
   */
  "aria-describedby"?: string;

  /**
   * Fallback hidden label text when no aria-label or aria-labelledby is provided.
   * Defaults to "Progress Stepper".
   *
   * @default "Progress Stepper"
   */
  groupLabel?: string;

  /**
   * Optional custom accessible label generator for each step button.
   */
  getStepAriaLabel?: (
    step: Step,
    index: number,
    stepCount: number,
    isActive: boolean,
    isCompleted: boolean,
  ) => string;
}

export interface StepperBaseProps extends StepperProps {
  /**
   * Framework-specific class name map supplied by the core or Next wrapper.
   */
  classMap: Record<string, string>;
  /**
   * Component implementation used to render the icon button portion.
   */
  IconButtonComponent: React.FC<IconButtonProps>;
}
