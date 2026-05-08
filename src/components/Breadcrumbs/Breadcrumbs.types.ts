import type { ElementType, HTMLAttributes, ReactNode } from "react";
import {
  RoundingType,
  ShadowType,
  SizeType,
  StateType,
  ThemeType,
} from "@/types/types";

/**
 * A breadcrumb item used to define a single step in the navigation path.
 */
export interface Breadcrumb {
  /**
   * The display label for the breadcrumb.
   */
  label: string;

  /**
   * Optional URL the breadcrumb should link to.
   * If not provided, it is rendered as plain text.
   */
  href?: string;

  /**
   * Optional accessible label override for this breadcrumb item.
   * Useful when the visible label is abbreviated.
   */
  "aria-label"?: string;

  /**
   * Optional custom title/tooltip for the breadcrumb item.
   */
  title?: string;

  /**
   * Marks the breadcrumb as disabled.
   * When true, it should not be interactive.
   */
  disabled?: boolean;
}

/**
 * Props for the Breadcrumbs component.
 */
export interface BreadcrumbsProps extends Omit<
  HTMLAttributes<HTMLElement>,
  "children" | "aria-label"
> {
  /**
   * An array of breadcrumb items.
   */
  items: Breadcrumb[];

  /**
   * Accessible label for the breadcrumb navigation.
   * Defaults to "Breadcrumbs".
   */
  "aria-label"?: string;

  /**
   * Optional ID of another element that labels this breadcrumb navigation.
   * Prefer this when a visible heading already exists.
   */
  "aria-labelledby"?: string;

  /**
   * Optional ID of another element that describes this breadcrumb navigation.
   */
  "aria-describedby"?: string;

  /**
   * Disables interaction and styles as disabled.
   */
  disabled?: boolean;

  /**
   * Optional custom separator node between breadcrumb items.
   * Defaults to a right chevron icon.
   */
  separator?: ReactNode;

  /**
   * Theme style to apply to the breadcrumbs
   * ('primary' | 'secondary' | 'tertiary' | 'quaternary' | 'clear').
   */
  theme?: ThemeType;

  /**
   * Rounding style to apply to the breadcrumbs
   * ('none' | 'small' | 'medium' | 'large' | 'full').
   */
  rounding?: RoundingType;

  /**
   * Shadow style to apply to the breadcrumbs
   * ('none' | 'light' | 'medium' | 'strong' | 'intense').
   */
  shadow?: ShadowType;

  /**
   * State of the breadcrumbs
   * ('success' | 'error' | 'warning' | 'disabled' | '').
   * Used for visual feedback.
   */
  state?: StateType;

  /**
   * Size of the breadcrumbs
   * ('xs' | 'small' | 'medium' | 'large' | 'xl').
   */
  size?: SizeType;

  /**
   * Additional class name for custom styling.
   */
  className?: string;

  /**
   * Whether to use the outline style.
   */
  outline?: boolean;

  /**
   * Applies a translucent frosted-glass treatment using the active theme palette.
   */
  glass?: boolean;

  /**
   * Maximum number of visible items before collapsing into an ellipsis.
   */
  maxVisible?: number;

  /**
   * Optional test ID for testing frameworks.
   */
  "data-testid"?: string;
}

export interface BreadcrumbsBaseProps extends BreadcrumbsProps {
  classMap: Record<string, string>;
  LinkComponent?: ElementType;
  ButtonComponent: ElementType;
}
