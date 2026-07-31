import { RoundingType, ShadowType, StateType, ThemeType } from "@/types/types";
import React from "react";

/**
 * Props that can be injected into a trigger element when using `asChild`.
 * @default dataTestId ?? "popover"
 */
export type TriggerElementProps = {
  /**
   * Callback fired when click occurs.
   */
  onClick?: (event: React.MouseEvent) => void;
  /**
   * Additional CSS class names for the component root.
   */
  className?: string;
  /**
   * Title content rendered by the component.
   */
  title?: string;
  /**
   * Whether the component is disabled.
   */
  disabled?: boolean;
  /**
   * Content rendered inside the component.
   */
  children?: React.ReactNode;
  /**
   * Ref forwarded to the underlying element.
   */
  ref?: React.Ref<HTMLElement>;
  /**
   * ARIA Label attribute forwarded to the relevant accessible element.
   */
  "aria-label"?: string;
  /**
   * ARIA Describedby attribute forwarded to the relevant accessible element.
   */
  "aria-describedby"?: string;
  /**
   * ARIA Expanded attribute forwarded to the relevant accessible element.
   */
  "aria-expanded"?: boolean;
  /**
   * ARIA Controls attribute forwarded to the relevant accessible element.
   */
  "aria-controls"?: string;
  /**
   * ARIA Haspopup attribute forwarded to the relevant accessible element.
   */
  "aria-haspopup"?: React.AriaAttributes["aria-haspopup"];
  /** Optional test ID for testing frameworks. */
  testId?: string;

  /** Backward-compatible alias for test ID attributes. */
  "data-testid"?: string;
  /**
   * Additional custom attributes supported by this prop bag.
   */
  [key: string]: unknown;
};

/**
 * Props for the PopOver component.
 */
export interface PopOverProps {
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
   *
   * @default false
   */
  asChild?: boolean;

  /**
   * Placement of the popover relative to the trigger element.
   * One of: "top" | "bottom" | "left" | "right"
   *
   * @default "bottom"
   */
  placement?: "top" | "bottom" | "left" | "right";

  /**
   * Theme for the popover styling.
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
   * State of the popover, for feedback styling.
   * One of: "success" | "error" | "warning" | "disabled" | ""
   *
   */
  state?: StateType;

  /**
   * Rounding of the popover content.
   * One of: "none" | "small" | "medium" | "large" | "full"
   *
   * @default configured default rounding (fallback: "medium")
   */
  rounding?: RoundingType;

  /**
   * Shadow of the popover content.
   * One of: "none" | "light" | "medium" | "strong" | "intense"
   *
   * @default configured default shadow (fallback: "light")
   */
  shadow?: ShadowType;

  /**
   * Optional additional class name(s) for custom styling.
   *
   */
  className?: string;

  /**
   * Optional additional class name(s) for the popover content element.
   *
   */
  contentClassName?: string;

  /**
   * Optional test ID for testing frameworks.
   *
   * @default dataTestId ?? "popover"
   */
  testId?: string;

  /** Backward-compatible alias for test ID attributes. */
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

  /**
   * Disables interaction with the trigger and popover.
   *
   * @default false
   */
  disabled?: boolean;

  /** Optional ID for the popover content element. */
  id?: string;
}

export interface BasePopOverProps extends PopOverProps {
  /**
   * Framework-specific class name map supplied by the core or Next wrapper.
   */
  classMap: Record<string, string>;

  /**
   * Semantic role applied to the popover container.
   * "tooltip" is best for purely descriptive hover/focus content,
   * "dialog" for interactive floating panels,
   * "menu" for action lists.
   */
  role?: "dialog" | "tooltip" | "menu";
}
