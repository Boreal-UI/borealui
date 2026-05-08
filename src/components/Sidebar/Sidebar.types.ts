import { RoundingType, ShadowType, StateType, ThemeType } from "@/types";

export interface SidebarLink {
  /**
   * Display label for the link.
   */
  label: string;

  /**
   * Navigation path or URL for the link.
   * If omitted, the link may be used as a non-clickable parent for submenu items.
   */
  href?: string;

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
   */
  theme?: ThemeType;

  /**
   * If true, applies a translucent glass surface using the selected theme/state.
   * Defaults to `false`.
   */
  glass?: boolean;

  /**
   * State variant for styling.
   * Typically used to apply semantic states to the component.
   * - "success" | "error" | "warning" | "disabled" | ""
   */
  state?: StateType;

  /**
   * If true, the sidebar is styled with an outline variant.
   * Defaults to `false`.
   */
  outline?: boolean;

  /**
   * Rounding style for the sidebar container.
   * - "none" | "small" | "medium" | "large" | "full"
   */
  rounding?: RoundingType;

  /**
   * Shadow style for the sidebar container.
   * - "none" | "light" | "medium" | "strong" | "intense"
   */
  shadow?: ShadowType;

  /**
   * Additional class name(s) for applying custom styles.
   */
  className?: string;

  /** Optional test ID for testing frameworks. */
  testId?: string;

  /** Backward-compatible alias for test ID attributes. */
  "data-testid"?: string;

  /**
   * Accessible label for the navigation landmark.
   * Prefer the kebab-case ARIA prop for consistency with other React ARIA props.
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
  classMap: Record<string, string>;
  LinkComponent?: React.ElementType;
}
