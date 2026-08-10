import type { ComponentType, SVGProps } from "react";

/** A framework-neutral SVG icon component accepted by Boreal UI components. */
export type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

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
export type StateType =
  | "success"
  | "error"
  | "warning"
  | "info"
  | "disabled"
  | "";

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
  | "sm"
  | "medium"
  | "md"
  | "strong"
  | "str"
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
  | "lg";

/** Border radius values for controls and surfaces that support pill or circular shapes. */
export type RoundableRoundingType = RoundingType | "full";

/** Common surface treatments, including the composable glass-and-outline treatment. */
export type VariantType = "solid" | "outline" | "glass" | "glassOutline";

/** Common placement values for floating UI and edge-attached surfaces. */
export type PlacementType = "top" | "bottom" | "left" | "right";

/** Direction-aware content alignment. */
export type AlignmentType = "start" | "center" | "end";

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
export type StatusType = "online" | "offline" | "busy" | "away" | "custom";

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
export type AttachmentType = "static" | "st" | "fixed" | "fx" | "sticky" | "sk";

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
