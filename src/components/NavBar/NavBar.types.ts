import { RoundingType, ShadowType, ThemeType } from "@/types/types";
import { JSX } from "react";

/**
 * Describes a single navigation item for the NavBar component.
 */
export interface NavItem {
  /** Icon component or element to be displayed for the nav item. */
  icon: React.ReactNode;
  /** Text label for the nav item. */
  label: string;
  /** URL path where the nav item links. */
  path: string;
}

/**
 * Props for the reusable NavBar component.
 */
export interface NavBarProps {
  /**
   * Array of navigation items to render in the NavBar.
   */
  items: NavItem[];

  /**
   * Optional theme class names to apply to the NavBar.
   * One of: "primary" | "secondary" | "tertiary" | "quaternary" | "clear"
   */
  theme?: ThemeType;

  /**
   * Adds translucent glass styling to nav items.
   */
  glass?: boolean;

  /**
   * Optional rounding to apply to the NavBar.
   * One of: "none" | "small" | "medium" | "large" | "full"
   */
  rounding?: RoundingType;

  /**
   * Optional shadow to apply to the NavBar.
   * One of: "none" | "light" | "medium" | "strong" | "intense"
   */
  shadow?: ShadowType;

  /** Optional extra class name(s) for custom styling. */
  className?: string;

  /** Optional test ID for testing frameworks. */
  testId?: string;

  /** Backward-compatible alias for test ID attributes. */
  "data-testid"?: string;

  /**
   * Optional callback used to determine whether a nav item should be styled as active.
   */
  isItemActive?: (item: NavItem) => boolean;

  /**
   * Accessible label for the navigation landmark.
   * Defaults to "Main navigation".
   */
  "aria-label"?: string;

  /**
   * Optional ID of an external element that labels this navigation landmark.
   * Prefer this when the nav is visually labelled by a heading.
   */
  "aria-labelledby"?: string;

  /**
   * Optional ID of an element that describes this navigation landmark.
   */
  "aria-describedby"?: string;

  /**
   * Optional accessible label for the internal navigation list.
   * Usually not required, but useful in complex layouts.
   */
  "list-aria-label"?: string;

  /**
   * Optional callback to provide a custom accessible label for each nav item.
   * Falls back to the item label when not provided.
   */
  getItemAriaLabel?: (item: NavItem) => string;
}

export interface BaseNavBarProps extends NavBarProps {
  LinkWrapper: (props: {
    href: string;
    children: React.ReactNode;
    className: string;
    isActive: boolean;
    /** Optional test ID for testing frameworks. */
    testId?: string;

    /** Backward-compatible alias for test ID attributes. */
    "data-testid"?: string;
    "aria-current"?: "page";
    "aria-label"?: string;
  }) => JSX.Element;

  classMap: Record<string, string>;
}
