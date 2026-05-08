/**
 * Represents a named color scheme used for theming components.
 */
export interface ColorScheme {
  /** The unique name of the color scheme. */
  name: string;
  /** The primary brand or accent color. */
  primaryColor: string;
  /** The secondary brand or accent color. */
  secondaryColor: string;
  /** A tertiary accent color. */
  tertiaryColor: string;
  /** A quaternary accent or background support color. */
  quaternaryColor: string;
  /** The base background color for surfaces using this scheme. */
  backgroundColor: string;
  /** Optional override for text color to ensure contrast (e.g., force white text on dark themes). */
  forceTextColor?: string;
}

/**
 * Visual theme options used to style components.
 */
export type ThemeType =
  | "primary"
  | "p"
  | "secondary"
  | "s"
  | "tertiary"
  | "t"
  | "quaternary"
  | "q"
  | "clear"
  | "c";

/**
 * UI state indicators typically used for validation or status feedback.
 */
export type StateType = "success" | "error" | "warning" | "disabled" | "";

/**
 * Types of notifications that determine visual appearance or icon.
 */
export type NotificationType =
  | "general"
  | "success"
  | "error"
  | "warning"
  | "info";

/**
 * Predefined sizing scale for components.
 */
export type SizeType =
  | "xs"
  | "small"
  | "sm"
  | "medium"
  | "md"
  | "large"
  | "lg"
  | "xl";

/**
 * Orientation of components or layout elements.
 */
export type OrientationType = "horizontal" | "h" | "vertical" | "v";

/**
 * Shadow depth for component elevation and emphasis.
 */
export type ShadowType =
  | "none"
  | "light"
  | "lt"
  | "small"
  | "sm"
  | "medium"
  | "md"
  | "strong"
  | "str"
  | "large"
  | "lg"
  | "intense"
  | "xl";

/**
 * Border radius values used for rounding component corners.
 */
export type RoundingType =
  | "none"
  | "small"
  | "sm"
  | "medium"
  | "md"
  | "large"
  | "lg"
  | "full";

/**
 * Border width values used for component borders.
 */
export type BorderType =
  | "none"
  | "xs"
  | "small"
  | "sm"
  | "medium"
  | "md"
  | "large"
  | "lg"
  | "xl";

/**
 * Anchor position typically used for tooltips, badges, or floating elements.
 */
export type PositionType =
  | "topLeft"
  | "tl"
  | "topCenter"
  | "tc"
  | "topRight"
  | "tr"
  | "bottomLeft"
  | "bl"
  | "bottomCenter"
  | "bc"
  | "bottomRight"
  | "br";

/**
 * Shape type used for avatars, buttons, badges, etc.
 */
export type ShapeType = "circle" | "rounded" | "square";

/**
 * Status type used to represent presence or activity.
 */
export type StatusType =
  | "online"
  | "idle"
  | "offline"
  | "busy"
  | "in-a-meeting"
  | "on-vacation"
  | "streaming"
  | "recording"
  | "typing"
  | "speaking"
  | "viewing"
  | "custom";

/**
 * Position of the status indicator relative to the parent element (e.g., avatar).
 */
export type StatusPositionType =
  | "topLeft"
  | "tl"
  | "topRight"
  | "tr"
  | "bottomLeft"
  | "bl"
  | "bottomRight"
  | "br";

/**
 * How a component should attach to the viewport or page layout.
 */
export type AttachmentType =
  | "static"
  | "st"
  | "fixed"
  | "fx"
  | "sticky"
  | "sk";

export type TitlePositionType =
  | "top"
  | "t"
  | "bottom"
  | "b"
  | "left"
  | "l"
  | "right"
  | "r"
  | "overlay";
export type LabelPositionType =
  | "top"
  | "t"
  | "bottom"
  | "b"
  | "left"
  | "l"
  | "right"
  | "r";

/**
 * Props for interactive components that require user input or actions.
 */
export type InteractiveProps = {
  onClick?: React.MouseEventHandler;
  onKeyDown?: React.KeyboardEventHandler;
  onKeyUp?: React.KeyboardEventHandler;
  tabIndex?: number;
  role?: string;
};
