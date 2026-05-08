import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  MouseEvent,
  ReactNode,
  AriaRole,
} from "react";
import type { IconType } from "react-icons";
import type {
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
   */
  theme?: ThemeType;

  /**
   * The badge state
   * ('success' | 'error' | 'warning' | 'disabled' | '').
   */
  state?: StateType;

  /**
   * Optional tooltip shown on hover.
   */
  title?: string;

  /**
   * Badge size
   * ('xs' | 'small' | 'medium' | 'large' | 'xl').
   */
  size?: SizeType;

  /**
   * Rounding of the badge
   * ('none' | 'small' | 'medium' | 'large' | 'full').
   */
  rounding?: RoundingType;

  /**
   * Shadow of the badge
   * ('none' | 'light' | 'medium' | 'strong' | 'intense').
   */
  shadow?: ShadowType;

  /**
   * Whether to use the outline style.
   */
  outline?: boolean;

  /**
   * Applies a translucent frosted-glass treatment using the active theme palette.
   */
  glass?: boolean;

  /**
   * Optional icon to render inside the badge.
   */
  icon?: IconType;

  /**
   * Additional custom class names.
   */
  className?: string;

  /**
   * If true, disables user interaction and styles as disabled.
   */
  disabled?: boolean;

  /**
   * Click handler for the badge.
   */
  onClick?: (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;

  /**
   * Optional test ID for testing frameworks.
   */
  "data-testid"?: string;
}

type AnchorExtras = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "children" | "className" | "onClick" | "title" | "role" | "tabIndex"
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
