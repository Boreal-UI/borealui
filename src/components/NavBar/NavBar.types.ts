import { RoundingType, ShadowType, ThemeType } from "@/types/types";
import { AnchorHTMLAttributes, JSX } from "react";

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
  /** Optional target attribute for the nav link. */
  target?: AnchorHTMLAttributes<HTMLAnchorElement>["target"];
  /** Optional rel attribute for the nav link. */
  rel?: AnchorHTMLAttributes<HTMLAnchorElement>["rel"];
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
   *
   * @default configured default theme (fallback: "primary")
   */
  theme?: ThemeType;

  /**
   * Adds translucent glass styling to nav items.
   *
   * @default configured default glass setting (fallback: false)
   */
  glass?: boolean;

  /**
   * Optional rounding to apply to the NavBar.
   * One of: "none" | "small" | "medium" | "large" | "full"
   *
   * @default configured default rounding (fallback: "medium")
   */
  rounding?: RoundingType;

  /**
   * Optional shadow to apply to the NavBar.
   * One of: "none" | "light" | "medium" | "strong" | "intense"
   *
   * @default configured default shadow (fallback: "light")
   */
  shadow?: ShadowType;

  /**
   * Optional extra class name(s) for custom styling.
   *
   * @default ""
   */
  className?: string;

  /** Additional class names for the navigation list. */
  listClassName?: string;

  /** Additional class names for each list item. */
  listItemClassName?: string;

  /** Additional class names for each nav link. */
  itemClassName?: string;

  /** Additional class names for each link content wrapper. */
  linkContentClassName?: string;

  /** Additional class names for each icon wrapper. */
  iconClassName?: string;

  /** Additional class names for each label. */
  labelClassName?: string;


  /**
   * Optional test ID for testing frameworks.
   *
   * @default dataTestId ?? "nav-bar"
   */
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
   *
   * @default "Main navigation"
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
   *
   * @default "Main navigation items"
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
    target?: AnchorHTMLAttributes<HTMLAnchorElement>["target"];
    rel?: AnchorHTMLAttributes<HTMLAnchorElement>["rel"];
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
