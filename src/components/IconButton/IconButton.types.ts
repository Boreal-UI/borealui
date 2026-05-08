import React from "react";
import {
  InteractiveProps,
  RoundingType,
  ShadowType,
  SizeType,
  StateType,
  ThemeType,
} from "@/types/types";

/**
 * Props for the IconButton component.
 */
export interface IconButtonProps extends InteractiveProps {
  /** Optional id for the root button or link element. */
  id?: string;

  /** Optional rel attribute for link mode. */
  rel?: React.AnchorHTMLAttributes<HTMLAnchorElement>["rel"];

  /** Optional target attribute for link mode. */
  target?: React.AnchorHTMLAttributes<HTMLAnchorElement>["target"];

  /**
   * Icon component to render inside the button.
   * Should be a React component, e.g., from `react-icons`.
   */
  icon?: React.ComponentType<{
    className?: string;
    "aria-hidden"?: boolean;
    focusable?: boolean;
    "data-testid"?: string;
  }>;

  /**
   * Theme style of the button.
   * One of: "primary" | "secondary" | "tertiary" | "quaternary" | "clear"
   */
  theme?: ThemeType;

  /**
   * State of the button.
   * One of: "success" | "error" | "warning" | "disabled" | ""
   */
  state?: StateType;

  /**
   * Rounding style of the button.
   * One of: "none" | "small" | "medium" | "large" | "full"
   */
  rounding?: RoundingType;

  /**
   * Shadow style of the button.
   * One of: "none" | "light" | "medium" | "strong" | "intense"
   */
  shadow?: ShadowType;

  /** Optional href to turn the button into a link. */
  href?: string;

  /** If true, opens the link in a new tab (used with `href`). */
  isExternal?: boolean;

  /** Custom class name for the icon. */
  iconClassName?: string;

  /** Custom class name for additional styling. */
  className?: string;

  /** Title attribute (native browser tooltip text). */
  title?: string;

  /** Whether the button should be disabled. */
  disabled?: boolean;

  /** Accessible label for screen readers. Required for icon-only usage unless title is provided. */
  "aria-label"?: string;

  /** Optional ID reference to one or more elements that label this control. */
  "aria-labelledby"?: string;

  /** Optional ID reference to one or more elements that describe this control. */
  "aria-describedby"?: string;

  /** Optional ID reference to an error message element for this control. */
  "aria-errormessage"?: string;

  /** Indicates whether the control is currently invalid. */
  "aria-invalid"?: boolean;

  /** Indicates whether activating the control opens a popup element such as a menu or dialog. */
  "aria-haspopup"?: boolean | "menu" | "listbox" | "tree" | "grid" | "dialog";

  /** Indicates whether the associated popup element is currently expanded. */
  "aria-expanded"?: boolean;

  /** Identifies the element whose contents or presence are controlled by this button. */
  "aria-controls"?: string;

  /** Indicates the current pressed state for toggle-style icon buttons. */
  "aria-pressed"?: boolean | "mixed";

  /** Indicates the current selected state when used in selectable patterns. */
  "aria-selected"?: boolean;

  /** Indicates the current checked state when the icon button behaves like a checkable control. */
  "aria-checked"?: boolean | "mixed";

  /** Indicates the current active item within a related set, when applicable. */
  "aria-current"?: boolean | "page" | "step" | "location" | "date" | "time";

  /** Indicates whether the button is busy, such as while loading. */
  "aria-busy"?: boolean;

  /** Indicates whether the element should be announced as live region content. */
  "aria-live"?: "off" | "polite" | "assertive";

  /** Indicates whether screen readers should present all of a live region at once. */
  "aria-atomic"?: boolean;

  /** Optional role override for advanced accessible interaction patterns. */
  role?: React.AriaRole;

  /** Whether to show a loading spinner instead of the icon. */
  loading?: boolean;

  /** Whether the button should use an outline style. */
  outline?: boolean;

  /**
   * Applies a translucent frosted-glass treatment using the active theme palette.
   */
  glass?: boolean;

  /**
   * Size of the button.
   * One of: "xs" | "small" | "medium" | "large" | "xl"
   */
  size?: SizeType;

  /**
   * Tooltip text (not rendered automatically—use `title` for built-in browser tooltip).
   */
  tooltip?: string;

  /**
   * Click event handler for the button.
   */
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;

  /**
   * Native button type.
   * One of: "button" | "reset" | "submit"
   */
  type?: "button" | "reset" | "submit";

  /** Optional tab index override. */
  tabIndex?: number;

  /** Optional test ID for testing frameworks. */
  "data-testid"?: string;
}

export interface IconButtonBaseProps extends IconButtonProps {
  classMap: Record<string, string>;
  LinkComponent?: React.ElementType;
}
