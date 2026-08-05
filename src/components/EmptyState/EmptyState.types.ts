import {
  IconComponent,
  RoundingType,
  ShadowType,
  SizeType,
  StateType,
  ThemeType,
} from "@/types/types";
import type { AriaRole, ComponentType, HTMLAttributes, ReactNode } from "react";
import { ButtonProps } from "../Button/Button.types";

/**
 * Props for the EmptyState component.
 */
export interface EmptyStateProps extends Omit<
  HTMLAttributes<HTMLElement>,
  "title" | "children"
> {
  /**
   * Additional CSS class names for the empty state root.
   */
  className?: string;

  /** Optional SVG icon component. */
  icon?: IconComponent;

  /**
   * Title text displayed prominently.
   *
   * @default "Nothing Here Yet"
   */
  title?: ReactNode;

  /**
   * Optional supporting message below the title.
   *
   * @default "There’s no content to display."
   */
  message?: ReactNode;

  /**
   * Theming option for styling
   * ('primary' | 'secondary' | 'tertiary' | 'quaternary' | 'clear').
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
   * The EmptyState state
   * ('success' | 'error' | 'warning' | 'disabled' | '').
   */
  state?: StateType;

  /**
   * Size modifier
   * ('xs' | 'small' | 'medium' | 'large' | 'xl').
   *
   * @default configured default size (fallback: "medium")
   */
  size?: SizeType;

  /**
   * Controls the rounding of the component
   * ('none' | 'small' | 'medium' | 'large' | 'full').
   *
   * @default configured default rounding (fallback: "medium")
   */
  rounding?: RoundingType;

  /**
   * Controls the shadow of the component
   * ('none' | 'light' | 'medium' | 'strong' | 'intense').
   *
   * @default configured default shadow (fallback: "light")
   */
  shadow?: ShadowType;
  /** Optional label for an action button. */
  actionLabel?: ReactNode;

  /** Optional click handler for the action button. */
  onActionClick?: () => void;

  /** Additional class names for the icon wrapper. */
  iconClassName?: string;

  /** Additional class names for the title element. */
  titleClassName?: string;

  /** Additional class names for the message element. */
  messageClassName?: string;

  /** Additional class names for the action button. */
  actionButtonClassName?: string;

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
   *
   * @default true
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

  /**
   * Optional test ID for testing frameworks.
   *
   * @default dataTestId ?? "empty-state"
   */
  testId?: string;

  /** Backward-compatible alias for test ID attributes. */
  "data-testid"?: string;
}

export interface BaseEmptyStateProps extends EmptyStateProps {
  /**
   * Button component dependency injected by the wrapper.
   */
  Button: ComponentType<ButtonProps>;
  /**
   * Framework-specific class name map supplied by the core or Next wrapper.
   */
  classMap: Record<string, string>;
}
