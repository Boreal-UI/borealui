import type {
  AnchorHTMLAttributes,
  AriaRole,
  ButtonHTMLAttributes,
  MouseEvent,
  ReactNode,
} from "react";
import type {
  IconComponent,
  RoundingType,
  ShadowType,
  SizeType,
  StateType,
  ThemeType,
} from "../../types/types";

/**
 * Shared accessibility props for the Badge component.
 */
export interface BadgeAccessibilityProps {
  /**
   * Accessible label for the badge.
   * Useful when the badge content is icon-only or not descriptive enough.
   */
  "aria-label"?: string;

  /**
   * References another element that labels this badge.
   */
  "aria-labelledby"?: string;

  /**
   * References another element that describes this badge.
   */
  "aria-describedby"?: string;

  /**
   * Announces dynamic badge updates to assistive technologies.
   */
  "aria-live"?: "off" | "polite" | "assertive";

  /**
   * Indicates whether the badge content is atomic when announced by screen readers.
   */
  "aria-atomic"?: boolean;

  /**
   * Optional semantic role for the badge.
   * Examples: "status", "note", "button", "link".
   */
  role?: AriaRole;

  /**
   * Removes the badge from the tab order when needed.
   */
  tabIndex?: number;
}

/**
 * Props for the Badge component.
 */
export interface BadgeProps extends BadgeAccessibilityProps {
  /**
   * Optional custom badge content.
   */
  children?: ReactNode;

  /**
   * Theme color for the badge
   * ('primary' | 'secondary' | 'tertiary' | 'quaternary' | 'clear').
   *
   * @default configured default theme (fallback: "primary")
   */
  theme?: ThemeType;

  /**
   * The badge state
   * ('success' | 'error' | 'warning' | 'disabled' | '').
   *
   */
  state?: StateType;

  /**
   * Optional tooltip shown on hover.
   */
  title?: string;

  /**
   * Badge size
   * ('xs' | 'small' | 'medium' | 'large' | 'xl').
   *
   * @default configured default size (fallback: "medium")
   */
  size?: SizeType;

  /**
   * Rounding of the badge
   * ('none' | 'small' | 'medium' | 'large' | 'full').
   *
   * @default configured default rounding (fallback: "medium")
   */
  rounding?: RoundingType;

  /**
   * Shadow of the badge
   * ('none' | 'light' | 'medium' | 'strong' | 'intense').
   *
   * @default configured default shadow (fallback: "light")
   */
  shadow?: ShadowType;
  /**
   * Surface treatment; glassOutline combines glass and outline.
   *
   * @default configured default variant (fallback: "solid")
   */
  variant?: import("@/types/types").VariantType;
  /**
   * Optional icon to render inside the badge.
   */
  icon?: IconComponent;

  /**
   * Additional custom class names.
   *
   */
  className?: string;

  /**
   * If true, disables user interaction and styles as disabled.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Click handler for the badge.
   */
  onClick?: (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;

  /** Optional target attribute when the badge renders as a link. */
  target?: AnchorHTMLAttributes<HTMLAnchorElement>["target"];

  /** Optional rel attribute when the badge renders as a link. */
  rel?: AnchorHTMLAttributes<HTMLAnchorElement>["rel"];

  /** Optional href. When provided, the badge renders as an anchor link. */
  href?: AnchorHTMLAttributes<HTMLAnchorElement>["href"];

  /**
   * Optional test ID for testing frameworks.
   *
   * @default dataTestId ?? "badge"
   */
  testId?: string;

  /** Backward-compatible alias for test ID attributes. */
  "data-testid"?: string;
}

type AnchorExtras = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  | "href"
  | "children"
  | "className"
  | "onClick"
  | "title"
  | "role"
  | "tabIndex"
  | keyof BadgeProps
>;

type ButtonExtras = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "type" | "children" | "className" | "onClick" | "title" | "role" | "tabIndex"
>;

type BadgeBaseCommon = {
  classMap: Record<string, string>;
};

export type BadgeBaseProps =
  | (BadgeProps & BadgeBaseCommon & { href: string } & AnchorExtras)
  | (BadgeProps & BadgeBaseCommon & { href?: undefined } & ButtonExtras);
