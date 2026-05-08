import { MouseEvent, ReactNode } from "react";
import {
  ShadowType,
  ShapeType,
  SizeType,
  StateType,
  StatusPositionType,
  StatusType,
  ThemeType,
} from "../../types/types";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ElementType,
  AriaRole,
} from "react";

export type AnchorInteractiveProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "children" | "className" | "onClick"
>;

export type ButtonInteractiveProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "type" | "children" | "className" | "onClick"
>;

type AvatarBaseCommon = {
  ImageComponent?: ElementType;
  LinkComponent?: ElementType;
  classMap: Record<string, string>;
};

export type AvatarBaseProps =
  | (AvatarProps & { href: string } & AnchorInteractiveProps & AvatarBaseCommon)
  | (AvatarProps & { href?: undefined } & ButtonInteractiveProps &
      AvatarBaseCommon);

/**
 * Props for the Avatar component.
 */
export interface AvatarProps {
  /**
   * Optional image URL for avatar display.
   */
  src?: string;

  /**
   * Alternative text for the avatar image.
   * Used as the image alt text and may also contribute to the accessible name.
   */
  alt?: string;

  /**
   * Full name used to generate initials when no image is available.
   */
  name?: string;

  /**
   * Visible or semantic label for the avatar.
   * Used as a fallback accessible name when aria-label / aria-labelledby are not provided.
   */
  label?: string;

  /**
   * Explicit accessible name for the interactive avatar element.
   * Overrides inferred labels such as label, alt, or name.
   */
  "aria-label"?: string;

  /**
   * References the element(s) that label the avatar.
   * Should take precedence over aria-label when provided.
   */
  "aria-labelledby"?: string;

  /**
   * References the element(s) that describe the avatar with additional context.
   * Useful for status, activity, or profile details.
   */
  "aria-describedby"?: string;

  /**
   * Indicates the current state or item within a set when the avatar acts as a link.
   * Example: page, step, location, date, time, true.
   */
  "aria-current"?: boolean | "page" | "step" | "location" | "date" | "time";

  /**
   * Optional role override for custom avatar rendering patterns.
   * In most cases this should be left undefined so the native button/link role is preserved.
   */
  role?: AriaRole;

  /**
   * Size of the avatar ('xs' | 'small' | 'medium' | 'large' | 'xl').
   */
  size?: SizeType;

  /**
   * Shape of the avatar border ('circle' | 'square' | 'rounded').
   */
  shape?: ShapeType;

  /**
   * Shadow of the avatar ('none' | 'light' | 'medium' | 'strong' | 'intense').
   */
  shadow?: ShadowType;

  /**
   * Visual theme of the avatar ('primary', 'secondary', 'tertiary', 'quaternary', 'clear').
   */
  theme?: ThemeType;

  /**
   * State of the avatar ('success' | 'error' | 'warning').
   */
  state?: StateType;

  /**
   * Disables interaction and styles as disabled.
   */
  disabled?: boolean;

  /**
   * Optional status indicator for user availability and activity.
   * Useful for chat apps, collaboration tools, or profile displays.
   */
  status?: StatusType;

  /**
   * Optional accessible label for the status indicator.
   * Example: "Online", "Busy", or "In a meeting".
   * Helpful when the status conveys important information not otherwise described nearby.
   */
  statusLabel?: string;

  /**
   * Custom icon to replace the default status dot.
   */
  statusIcon?: ReactNode;

  /**
   * Position of the status indicator dot/icon
   * ('topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight').
   */
  statusPosition?: StatusPositionType;

  /**
   * Custom class names for the avatar container.
   */
  className?: string;

  /**
   * Custom fallback content (overrides initials).
   */
  fallback?: ReactNode;

  /**
   * Custom child elements (replaces avatar content entirely).
   */
  children?: ReactNode;

  /**
   * Whether to apply an outline style.
   */
  outline?: boolean;

  /**
   * Applies a translucent frosted-glass treatment using the active theme palette.
   */
  glass?: boolean;

  /**
   * If provided, avatar becomes a link (internal or external).
   */
  href?: string;

  /**
   * If true, the image loads with higher priority.
   */
  priority?: boolean;

  /**
   * Click handler (used only when not a link).
   */
  onClick?: (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;

  /**
   * Optional test ID for testing frameworks.
   */
  "data-testid"?: string;
}
