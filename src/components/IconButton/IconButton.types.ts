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
    /** Optional test ID for testing frameworks. */
    testId?: string;

    /** Backward-compatible alias for test ID attributes. */
    "data-testid"?: string;
  }>;

  /**
   * Theme style of the button.
   * One of: "primary" | "secondary" | "tertiary" | "quaternary" | "clear"
   *
   * @default configured default theme (fallback: "primary")
   */
  theme?: ThemeType;

  /**
   * State of the button.
   * One of: "success" | "error" | "warning" | "disabled" | ""
   *
   * @default ""
   */
  state?: StateType;

  /**
   * Rounding style of the button.
   * One of: "none" | "small" | "medium" | "large" | "full"
   *
   * @default configured default rounding (fallback: "medium")
   */
  rounding?: RoundingType;

  /**
   * Shadow style of the button.
   * One of: "none" | "light" | "medium" | "strong" | "intense"
   *
   * @default configured default shadow (fallback: "light")
   */
  shadow?: ShadowType;

  /** Optional href to turn the button into a link. */
  href?: string;

  /**
   * If true, opens the link in a new tab (used with `href`).
   *
   * @default false
   */
  isExternal?: boolean;

  /**
   * Custom class name for the icon.
   *
   * @default ""
   */
  iconClassName?: string;

  /**
   * Custom class name for additional styling.
   *
   * @default ""
   */
  className?: string;

  /** Title attribute (native browser tooltip text). */
  title?: string;

  /**
   * Whether the button should be disabled.
   *
   * @default false
   */
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

  /**
   * Whether to show a loading spinner instead of the icon.
   *
   * @default false
   */
  loading?: boolean;

  /**
   * Whether the button should use an outline style.
   *
   * @default configured default outline setting (fallback: false)
   */
  outline?: boolean;

  /**
   * Applies a translucent frosted-glass treatment using the active theme palette.
   *
   * @default configured default glass setting (fallback: false)
   */
  glass?: boolean;

  /**
   * Size of the button.
   * One of: "xs" | "small" | "medium" | "large" | "xl"
   *
   * @default configured default size (fallback: "medium")
   */
  size?: SizeType;

  /**
   * Tooltip text (not rendered automatically; use `title` for built-in browser tooltip).
   */
  tooltip?: string;

  /**
   * Click event handler for the button.
   */
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;

  /**
   * Native button type.
   * One of: "button" | "reset" | "submit"
   *
   * @default "button"
   */
  type?: "button" | "reset" | "submit";

  /** Optional tab index override. */
  tabIndex?: number;


  /**
   * Optional test ID for testing frameworks.
   *
   * @default dataTestId ?? "icon-button"
   */
  testId?: string;

  /** Backward-compatible alias for test ID attributes. */
  "data-testid"?: string;
}

export interface IconButtonBaseProps extends IconButtonProps {
  classMap: Record<string, string>;
  LinkComponent?: React.ElementType;
}
