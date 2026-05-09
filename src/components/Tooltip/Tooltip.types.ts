import { RoundingType, ShadowType, StateType, ThemeType } from "@/types/types";
import { ReactNode, HTMLAttributes } from "react";

/**
 * Props for the Tooltip component.
 */
export interface TooltipProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * The content text displayed inside the tooltip.
   */
  content: string;

  /**
   * The position of the tooltip relative to the target element.
   * "top" | "bottom" | "left" | "right"
   *
   * @default "top"
   */
  position?: "top" | "bottom" | "left" | "right";

  /**
   * Theme style of the tooltip.
   * "primary" | "secondary" | "tertiary" | "quaternary" | "clear"
   *
   * @default configured default theme (fallback: "primary")
   */
  theme?: ThemeType;

  /**
   * Applies a translucent frosted-glass treatment using the active theme palette.
   *
   * @default configured default glass setting (fallback: false)
   */
  glass?: boolean;

  /**
   * State of the tooltip for visual feedback.
   * "success" | "error" | "warning" | "disabled" | ""
   *
   * @default ""
   */
  state?: StateType;

  /**
   * Rounding style of the tooltip.
   * "none" | "small" | "medium" | "large" | "full"
   *
   * @default configured default rounding (fallback: "medium")
   */
  rounding?: RoundingType;

  /**
   * Shadow style of the tooltip.
   * "none" | "light" | "medium" | "strong" | "intense"
   *
   * @default configured default shadow (fallback: "light")
   */
  shadow?: ShadowType;

  /**
   * The element that triggers the tooltip.
   */
  children: ReactNode;

  /**
   * Optional custom id for the tooltip element.
   * If omitted, a stable generated id is used.
   */
  id?: string;

  /**
   * Optional id for the trigger element.
   */
  triggerId?: string;

  /**
   * Accessible label applied to the tooltip itself.
   * Use when the tooltip needs an explicit accessible name.
   */
  "aria-label"?: string;

  /**
   * Accessible labelling reference for the tooltip itself.
   */
  "aria-labelledby"?: string;

  /**
   * Accessible label applied to the trigger element.
   * Helpful when the trigger has no visible text or icon-only content.
   */
  triggerAriaLabel?: string;

  /**
   * Accessible labelledby reference applied to the trigger element.
   */
  triggerAriaLabelledBy?: string;

  /**
   * Additional describedby ids to keep on the trigger element
   * alongside the tooltip id when visible.
   */
  triggerAriaDescribedBy?: string;

  /**
   * Whether the tooltip should remain in the accessibility tree
   * when hidden. Defaults to false behavior via aria-hidden.
   *
   * @default true
   */
  keepMountedWhenHidden?: boolean;


  /**
   * Optional test ID for testing frameworks.
   *
   * @default dataTestId ?? "tooltip"
   */
  testId?: string;

  /** Backward-compatible alias for test ID attributes. */
  "data-testid"?: string;
}

export type TriggerElementProps = React.HTMLAttributes<HTMLElement> & {
  tabIndex?: number;
  id?: string;
  "aria-describedby"?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  onMouseEnter?: React.MouseEventHandler<HTMLElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLElement>;
  onFocus?: React.FocusEventHandler<HTMLElement>;
  onBlur?: React.FocusEventHandler<HTMLElement>;
  /** Optional test ID for testing frameworks. */
  testId?: string;

  /** Backward-compatible alias for test ID attributes. */
  "data-testid"?: string;
};
