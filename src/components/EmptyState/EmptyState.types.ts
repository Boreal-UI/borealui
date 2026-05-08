import type { AriaRole, HTMLAttributes, ReactNode, ComponentType } from "react";
import { IconType } from "react-icons";
import {
  ThemeType,
  SizeType,
  StateType,
  RoundingType,
  ShadowType,
} from "@/types/types";
import { ButtonProps } from "../Button/Button.types";

/**
 * Props for the EmptyState component.
 */
export interface EmptyStateProps extends Omit<
  HTMLAttributes<HTMLElement>,
  "title" | "children"
> {
  /** Optional icon component (e.g., from react-icons). */
  icon?: IconType;

  /** Title text displayed prominently. */
  title?: ReactNode;

  /** Optional supporting message below the title. */
  message?: ReactNode;

  /**
   * Theming option for styling
   * ('primary' | 'secondary' | 'tertiary' | 'quaternary' | 'clear').
   */
  theme?: ThemeType;

  /**
   * Applies a translucent frosted-glass treatment using the active theme palette.
   */
  glass?: boolean;

  /**
   * The EmptyState state
   * ('success' | 'error' | 'warning' | 'disabled' | '').
   */
  state?: StateType;

  /**
   * Size modifier
   * ('xs' | 'small' | 'medium' | 'large' | 'xl').
   */
  size?: SizeType;

  /**
   * Controls the rounding of the component
   * ('none' | 'small' | 'medium' | 'large' | 'full').
   */
  rounding?: RoundingType;

  /**
   * Controls the shadow of the component
   * ('none' | 'light' | 'medium' | 'strong' | 'intense').
   */
  shadow?: ShadowType;

  /** Whether the component uses outline styles. */
  outline?: boolean;

  /** Optional label for an action button. */
  actionLabel?: ReactNode;

  /** Optional click handler for the action button. */
  onActionClick?: () => void;

  /**
   * Optional custom accessible label for the entire empty state region.
   * Useful when the title is visual but not sufficient as a landmark label.
   */
  "aria-label"?: string;

  /**
   * Optional custom accessible label reference for the entire empty state region.
   * If provided, overrides the generated title association.
   */
  "aria-labelledby"?: string;

  /**
   * Optional custom accessible description reference for the empty state region.
   * If provided, overrides the generated message association.
   */
  "aria-describedby"?: string;

  /**
   * Optional role override.
   * Defaults to "region" when a title exists, otherwise no role is applied.
   */
  role?: AriaRole;

  /**
   * Whether the icon should be announced to assistive technology.
   * Defaults to false.
   */
  iconDecorative?: boolean;

  /**
   * Accessible label for the icon when it is not decorative.
   */
  iconAriaLabel?: string;

  /**
   * Optional accessible label for the action button.
   * Helpful when the visible action text is ambiguous.
   */
  actionAriaLabel?: string;

  /**
   * Optional ID for the root empty state container.
   * Useful for external aria-labelledby / aria-describedby wiring.
   */
  id?: string;

  /** Optional test ID for testing frameworks. */
  testId?: string;

  /** Backward-compatible alias for test ID attributes. */
  "data-testid"?: string;
}

export interface BaseEmptyStateProps extends EmptyStateProps {
  Button: ComponentType<ButtonProps>;
  classMap: Record<string, string>;
}
