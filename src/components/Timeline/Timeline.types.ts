import {
  OrientationType,
  RoundingType,
  ShadowType,
  ThemeType,
} from "@/types/types";
import React from "react";

/**
 * Represents a single item within the timeline.
 */
export interface TimelineItem {
  /** Title of the timeline event. */
  title: string;

  /** Optional description of the event. */
  description?: string;

  /** Optional date string for the event. */
  date?: string;

  /** Optional icon component to visually represent the event. */
  icon?: React.ComponentType<
    React.SVGProps<SVGSVGElement> | { "aria-hidden"?: boolean }
  >;
}

/**
 * Props for the Timeline component.
 */
export interface TimelineProps extends Omit<
  React.HTMLAttributes<HTMLUListElement>,
  "title"
> {
  /**
   * Array of timeline items to display.
   */
  items: TimelineItem[];

  /**
   * Whether timeline item content should display skeleton placeholders.
   * Markers and connector bars remain visible.
   *
   * @default false
   */
  loading?: boolean;

  /**
   * Accessible label for the timeline.
   * Defaults to "Timeline".
   *
   * @default "Timeline"
   */
  "aria-label"?: string;

  /**
   * Optional aria-labelledby for the timeline root.
   * When provided, this should take precedence over "aria-label".
   */
  "aria-labelledby"?: string;

  /**
   * Optional aria-describedby for the timeline root.
   */
  "aria-describedby"?: string;

  /**
   * Optional role override for the root element.
   * Defaults to "list" when not provided.
   *
   * @default "list"
   */
  role?: React.AriaRole;

  /**
   * Orientation of the timeline.
   * "vertical" | "horizontal"
   *
   * @default "vertical"
   */
  orientation?: OrientationType;

  /**
   * Theme to apply for styling.
   * "primary" | "secondary" | "tertiary" | "quaternary" | "clear"
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
   * Rounding of the component.
   * "none" | "small" | "medium" | "large" | "full"
   *
   * @default configured default rounding (fallback: "medium")
   */
  rounding?: RoundingType;

  /**
   * Shadow style of the component.
   * "none" | "light" | "medium" | "strong" | "intense"
   *
   * @default configured default shadow (fallback: "light")
   */
  shadow?: ShadowType;

  /**
   * Optional test ID for testing frameworks.
   *
   * @default dataTestId ?? "timeline"
   */
  testId?: string;

  /** Backward-compatible alias for test ID attributes. */
  "data-testid"?: string;

  /**
   * Additional CSS class names for custom styling.
   */
  className?: string;
}

export interface TimelineBaseProps extends TimelineProps {
  /**
   * Framework-specific class name map supplied by the core or Next wrapper.
   */
  classMap: Record<string, string>;

  /**
   * Component implementation used to render loading skeletons.
   */
  SkeletonComponent?: React.FC<{
    width: string;
    height: string;
    className?: string;
    ["data-testid"]?: string;
    "aria-hidden"?: boolean;
  }>;
}
