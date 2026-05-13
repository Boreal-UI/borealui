import {
  AttachmentType,
  RoundingType,
  ShadowType,
  SizeType,
  ThemeType,
} from "@/types/types";
import React, { MouseEvent } from "react";
import { AvatarProps } from "../Avatar/Avatar.types";

/**
 * Props for the ToolbarBase component (unstyled, internal implementation).
 * Extends ToolbarProps with internal utility/customization props.
   * @default configured default theme (fallback: "primary")
   */
export interface ToolbarBaseProps extends ToolbarProps {
  /**
   * The Avatar component to use for rendering the toolbar avatar.
   */
  AvatarComponent: React.FC<AvatarProps>;

  /**
   * A mapping of BEM-style class names for the toolbar component parts.
   */
  classMap: Record<string, string>;

  /**
   * Backward-compatible accessible label for the toolbar container.
   * Prefer `aria-label` going forward.
   */
  "aria-label"?: string;

  /**
   * Optional heading level for the toolbar title.
   * Must be an integer from 1 to 6.
   */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
}

/**
 * Props for the `Toolbar` component.
 */
export interface ToolbarProps {
  /**
   * Optional title displayed in the center section.
   */
  title?: string;

  /**
   * Optional id used for the rendered title element.
   * Useful for linking the toolbar with `aria-labelledby`.
   */
  titleId?: string;

  /**
   * Content to render in the left section of the toolbar.
   */
  left?: React.ReactNode;

  /**
   * Content to render in the center section, below the title if present.
   */
  center?: React.ReactNode;

  /**
   * Content to render in the right section of the toolbar, before the avatar.
   */
  right?: React.ReactNode;

  /**
   * Optional avatar settings displayed at the far right.
   */
  avatar?: {
    /**
     * The name or initials to display when no image is provided.
     */
    name?: string;

    /**
     * The image source URL for the avatar.
     */
    src?: string;

    /**
     * Size of the avatar.
     * "xs" | "small" | "medium" | "large" | "xl"
     */
    size?: SizeType;

    /**
     * Shape of the avatar.
     * "circle" | "square" | "rounded"
     */
    shape?: "circle" | "square" | "rounded";

    /**
     * The theme color of the avatar.
     * "primary" | "secondary" | "tertiary" | "quaternary" | "clear"
     */
    theme?: ThemeType;

    /**
     * Whether the avatar has an outline.
     */
    outline?: boolean;

    /**
     * Whether the avatar should use its own glass styling.
     * Defaults to the toolbar glass setting when omitted.
     */
    glass?: boolean;

    /**
     * Optional click handler for the avatar.
     */
    onClick?: (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;

    /**
     * Accessible label for the avatar when it is interactive
     * or when its visual meaning is not otherwise conveyed.
     */
    "aria-label"?: string;
  };

  /**
   * Optional additional class name for the toolbar title element.
   * Useful when consumers need to style the title directly.
   *
   * @default ""
   */
  titleClassName?: string;

  /**
   * The visual theme of the toolbar.
   * "primary" | "secondary" | "tertiary" | "quaternary" | "clear"
   *
   * @default configured default theme (fallback: "primary")
   */
  theme?: ThemeType;

  /**
   * Applies a translucent frosted-glass treatment using the active theme palette.
   *
   * @default configured default glass setting (fallback: false)
   */
  glass?: boolean;

  /**
   * How the toolbar attaches to the viewport or page layout.
   * "static" | "fixed" | "sticky"
   *
   * @default "static"
   */
  attachment?: AttachmentType;

  /**
   * Shadow of the component.
   * "none" | "light" | "medium" | "strong" | "intense"
   *
   * @default configured default shadow (fallback: "light")
   */
  shadow?: ShadowType;

  /**
   * Rounding of the component.
   * "none" | "small" | "medium" | "large" | "full"
   *
   * @default configured default rounding (fallback: "medium")
   */
  rounding?: RoundingType;

  /**
   * Optional additional class names for styling.
   *
   * @default ""
   */
  className?: string;

  /**
   * Accessible name for the toolbar.
   * Prefer this over the legacy `ariaLabel` prop.
   *
   * @default "Toolbar"
   */
  "aria-label"?: string;

  /**
   * References another element that labels the toolbar.
   * Prefer this over `aria-label` when there is visible text available.
   */
  "aria-labelledby"?: string;

  /**
   * References one or more elements that describe the toolbar.
   */
  "aria-describedby"?: string;

  /**
   * Optional accessible label for the left section.
   *
   * @default "Toolbar left section"
   */
  leftAriaLabel?: string;

  /**
   * Optional accessible label for the center section.
   *
   * @default "Toolbar center section"
   */
  centerAriaLabel?: string;

  /**
   * Optional accessible label for the right section.
   *
   * @default "Toolbar right section"
   */
  rightAriaLabel?: string;


  /**
   * Optional test ID for testing frameworks.
   *
   * @default dataTestId ?? "toolbar"
   */
  testId?: string;

  /** Backward-compatible alias for test ID attributes. */
  "data-testid"?: string;
}
