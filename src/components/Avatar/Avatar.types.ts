import type {
  AnchorHTMLAttributes,
  AriaRole,
  ButtonHTMLAttributes,
  ElementType,
} from "react";
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
   *
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
   *
   * @default configured default size (fallback: "medium")
   */
  size?: SizeType;

  /**
   * Shape of the avatar border ('circle' | 'square' | 'rounded').
   *
   * @default "circle"
   */
  shape?: ShapeType;

  /**
   * Shadow of the avatar ('none' | 'light' | 'medium' | 'strong' | 'intense').
   *
   * @default configured default shadow (fallback: "light")
   */
  shadow?: ShadowType;

  /**
   * Visual theme of the avatar ('primary', 'secondary', 'tertiary', 'quaternary', 'clear').
   *
   * @default configured default theme (fallback: "primary")
   */
  theme?: ThemeType;

  /**
   * State of the avatar ('success' | 'error' | 'warning').
   *
   */
  state?: StateType;

  /**
   * Disables interaction and styles as disabled.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Optional status indicator for user availability and activity.
   * ( "online" | "offline" | "away" | "busy")
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
   *
   * @default "bottomRight"
   */
  statusPosition?: StatusPositionType;

  /**
   * Custom class names for the avatar container.
   *
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
   * Surface treatment; glassOutline combines glass and outline.
   *
   * @default configured default variant (fallback: "solid")
   */
  variant?: import("@/types/types").VariantType;
  /**
   * If provided, avatar becomes a link (internal or external).
   */
  href?: string;

  /** Optional target attribute when the avatar renders as a link. */
  target?: AnchorHTMLAttributes<HTMLAnchorElement>["target"];

  /** Optional rel attribute when the avatar renders as a link. */
  rel?: AnchorHTMLAttributes<HTMLAnchorElement>["rel"];

  /**
   * If true, the image loads with higher priority.
   *
   * @default false
   */
  priority?: boolean;

  /**
   * If true, passes a `fill` prop to a custom image component such as Next.js Image.
   * Plain img rendering should leave this false.
   *
   * @default false
   */
  imageFill?: boolean;

  /**
   * Click handler (used only when not a link).
   */
  onClick?: (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;

  /**
   * Optional test ID for testing frameworks.
   *
   * @default dataTestId ?? "avatar"
   */
  testId?: string;

  /** Backward-compatible alias for test ID attributes. */
  "data-testid"?: string;
}
