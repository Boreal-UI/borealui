import React from "react";
import { RoundingType, ShadowType, StateType, ThemeType } from "@/types/types";

/**
 * Props that can be injected into a trigger element when using `asChild`.
 */
export type TriggerElementProps = {
  onClick?: (event: React.MouseEvent) => void;
  className?: string;
  title?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLElement>;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-expanded"?: boolean;
  "aria-controls"?: string;
  "aria-haspopup"?: React.AriaAttributes["aria-haspopup"];
  "data-testid"?: string;
  [key: string]: unknown;
};

/**
 * Props for the Popover component.
 */
export interface PopoverProps {
  /**
   * Trigger content for the popover.
   *
   * When `asChild` is false or omitted, this can be any renderable node and
   * will be wrapped in an internal button element.
   *
   * When `asChild` is true, this should be a single interactive React element
   * such as a button, link, or custom Button component so the popover can
   * attach behavior directly to it without nesting buttons.
   */
  trigger: React.ReactNode | React.ReactElement<TriggerElementProps>;

  /** Content to be displayed inside the popover. */
  content: React.ReactNode;

  /**
   * When true, the popover will clone the provided trigger element and attach
   * popover behavior directly to it instead of wrapping it in an internal button.
   */
  asChild?: boolean;

  /**
   * Placement of the popover relative to the trigger element.
   * One of: "top" | "bottom" | "left" | "right"
   */
  placement?: "top" | "bottom" | "left" | "right";

  /**
   * Theme for the popover styling.
   * One of: "primary" | "secondary" | "tertiary" | "quaternary" | "clear"
   */
  theme?: ThemeType;

  /**
   * Adds translucent glass styling to the floating popover content.
   */
  glass?: boolean;

  /**
   * State of the popover, for feedback styling.
   * One of: "success" | "error" | "warning" | "disabled" | ""
   */
  state?: StateType;

  /**
   * Rounding of the popover content.
   * One of: "none" | "small" | "medium" | "large" | "full"
   */
  rounding?: RoundingType;

  /**
   * Shadow of the popover content.
   * One of: "none" | "light" | "medium" | "strong" | "intense"
   */
  shadow?: ShadowType;

  /** Optional additional class name(s) for custom styling. */
  className?: string;

  /** Optional additional class name(s) for the popover content element. */
  contentClassName?: string;

  /** Optional test ID for testing frameworks. */
  "data-testid"?: string;

  /** Accessible label for the trigger button or trigger element. */
  triggerAriaLabel?: string;

  /** Accessible label for the popover content region. */
  "aria-label"?: string;

  /** Associates the popover content with an external label element ID. */
  "aria-labelledby"?: string;

  /** Associates the popover content with an external description element ID. */
  "aria-describedby"?: string;

  /** Whether the popover should be announced as modal when role is dialog. */
  "aria-modal"?: boolean;

  /** Optional title attribute for the trigger element. */
  triggerTitle?: string;

  /** Disables interaction with the trigger and popover. */
  disabled?: boolean;

  /** Optional ID for the popover content element. */
  id?: string;
}

export interface BasePopoverProps extends PopoverProps {
  classMap: Record<string, string>;

  /**
   * Semantic role applied to the popover container.
   * "tooltip" is best for purely descriptive hover/focus content,
   * "dialog" for interactive floating panels,
   * "menu" for action lists.
   */
  role?: "dialog" | "tooltip" | "menu";
}
