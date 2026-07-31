import { RoundingType, ShadowType, StateType, ThemeType } from "@/types";
import type { AnchorHTMLAttributes } from "react";

export interface SidebarLink {
  /**
   * Display label for the link.
   * @default "Sidebar navigation"
   */
  label: string;

  /**
   * Navigation path or URL for the link.
   * If omitted, the link may be used as a non-clickable parent for submenu items.
   */
  href?: string;

  /** Optional target attribute for the link. */
  target?: AnchorHTMLAttributes<HTMLAnchorElement>["target"];

  /** Optional rel attribute for the link. */
  rel?: AnchorHTMLAttributes<HTMLAnchorElement>["rel"];

  /**
   * Optional child links to render as a collapsible submenu.
   */
  children?: SidebarLink[];

  /**
   * Optional icon to display next to the label.
   */
  icon?: React.ReactNode;

  /**
   * Optional accessible label override for this specific link.
   * Useful when the visible label is abbreviated or unclear.
   */
  "aria-label"?: string;

  /**
   * Optional accessible description for this specific link.
   * Can be used to provide extra context for screen reader users.
   */
  "aria-description"?: string;

  /**
   * Whether this item should be announced as disabled.
   * Useful for non-interactive or temporarily unavailable items.
   */
  "aria-disabled"?: boolean;
}

export interface SidebarFooterLink {
  /**
   * Display label for the footer link.
   */
  label: string;

  /**
   * Navigation path or URL for the footer link.
   */
  href: string;

  /** Optional target attribute for the footer link. */
  target?: AnchorHTMLAttributes<HTMLAnchorElement>["target"];

  /** Optional rel attribute for the footer link. */
  rel?: AnchorHTMLAttributes<HTMLAnchorElement>["rel"];

  /**
   * Optional icon to display next to the label.
   */
  icon?: React.ReactNode;

  /**
   * Optional accessible label override for this footer link.
   */
  "aria-label"?: string;

  /**
   * Optional accessible description for this footer link.
   */
  "aria-description"?: string;

  /**
   * Whether this footer link should be announced as disabled.
   */
  "aria-disabled"?: boolean;
}

export interface SidebarProps {
  /**
   * Array of navigation links to render in the sidebar.
   * Each link may optionally include a nested submenu.
   */
  links: SidebarLink[];

  /**
   * Whether to display a footer section at the bottom of the sidebar.
   * Defaults to `false`.
   *
   * @default false
   */
  showFooter?: boolean;

  /**
   * Array of footer links to render when `showFooter` is `true`.
   */
  footerLinks?: SidebarFooterLink[];

  /**
   * Optional version string displayed in the sidebar footer.
   * Example: "v1.2.3"
   */
  footerVersion?: string;

  /**
   * Theme for styling.
   * Determines the base color scheme for the sidebar.
   * - "primary" | "secondary" | "tertiary" | "quaternary" | "clear"
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
   * State variant for styling.
   * Typically used to apply semantic states to the component.
   * - "success" | "error" | "warning" | "disabled" | ""
   *
   */
  state?: StateType;
  /**
   * Rounding style for the sidebar container.
   * - "none" | "small" | "medium" | "large" | "full"
   *
   * @default configured default rounding (fallback: "medium")
   */
  rounding?: RoundingType;

  /**
   * Shadow style for the sidebar container.
   * - "none" | "light" | "medium" | "strong" | "intense"
   *
   * @default configured default shadow (fallback: "light")
   */
  shadow?: ShadowType;

  /**
   * Additional class name(s) for applying custom styles.
   *
   */
  className?: string;

  /**
   * Additional class name for the inner navigation wrapper.
   */
  navClassName?: string;

  /**
   * Additional class name for all sidebar lists.
   */
  listClassName?: string;

  /**
   * Additional class name for nested child lists.
   */
  childListClassName?: string;

  /**
   * Additional class name for each list item.
   */
  itemClassName?: string;

  /**
   * Additional class name for link-style items.
   */
  linkClassName?: string;

  /**
   * Additional class name for child link-style items.
   */
  childLinkClassName?: string;

  /**
   * Additional class name applied when a link/item is active.
   */
  activeClassName?: string;

  /**
   * Additional class name for expandable parent buttons.
   */
  expandButtonClassName?: string;

  /**
   * Additional class name for item icons.
   */
  iconClassName?: string;

  /**
   * Additional class name for expandable item labels.
   */
  expandLabelClassName?: string;

  /**
   * Additional class name for chevron icons.
   */
  chevronClassName?: string;

  /**
   * Additional class name applied when the chevron is open.
   */
  chevronOpenClassName?: string;

  /**
   * Additional class name for submenu containers.
   */
  submenuClassName?: string;

  /**
   * Additional class name applied when a submenu is open.
   */
  submenuOpenClassName?: string;

  /**
   * Additional class name for the footer wrapper.
   */
  footerClassName?: string;

  /**
   * Additional class name for footer links.
   */
  footerLinkClassName?: string;

  /**
   * Additional class name for the footer version text.
   */
  footerVersionClassName?: string;

  /**
   * Optional test ID for testing frameworks.
   *
   * @default dataTestId ?? "sidebar"
   */
  testId?: string;

  /** Backward-compatible alias for test ID attributes. */
  "data-testid"?: string;

  /**
   * Accessible label for the navigation landmark.
   * Prefer the kebab-case ARIA prop for consistency with other React ARIA props.
   *
   * @default "Sidebar navigation"
   */
  "aria-label"?: string;

  /**
   * ID reference to one or more elements that label the sidebar navigation landmark.
   * Takes precedence over aria-label when both are provided.
   */
  "aria-labelledby"?: string;

  /**
   * ID reference to one or more elements that describe the sidebar navigation landmark.
   */
  "aria-describedby"?: string;

  /**
   * Optional label for the footer landmark when footer content is rendered.
   * Example: "Sidebar footer links"
   *
   * @default "Sidebar footer"
   */
  footerAriaLabel?: string;

  /**
   * Optional ID reference to label the footer landmark.
   */
  footerAriaLabelledBy?: string;

  /**
   * Optional accessible label generator for expandable parent items.
   * Useful when you want screen readers to hear something more descriptive
   * than the visible text alone.
   */
  getExpandButtonAriaLabel?: (link: SidebarLink, isOpen: boolean) => string;

  /**
   * Optional accessible description generator for expandable parent items.
   */
  getExpandButtonAriaDescription?: (
    link: SidebarLink,
    isOpen: boolean,
  ) => string;

  /**
   * Optional callback used to determine whether a link should be styled as active.
   */
  isLinkActive?: (link: SidebarLink) => boolean;

  /**
   * Optional callback used to determine whether a link contains an active child.
   */
  hasActiveChild?: (link: SidebarLink) => boolean;
}

export interface BaseSidebarProps extends SidebarProps {
  /**
   * Framework-specific class name map supplied by the core or Next wrapper.
   */
  classMap: Record<string, string>;
  /**
   * Component implementation used to render the link portion.
   */
  LinkComponent?: React.ElementType;
}
