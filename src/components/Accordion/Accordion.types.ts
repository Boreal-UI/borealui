import type { HTMLAttributes, ReactNode } from "react";
import {
  RoundingType,
  ShadowType,
  SizeType,
  StateType,
  ThemeType,
} from "../../types/types";

/**
 * Props for the Accordion component.
 */
export interface AccordionProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "title" | "children" | "onToggle"
> {
  /**
   * The title text displayed in the accordion header.
   */
  title?: string;

  /**
   * Optional custom ID for the accordion content section.
   * If not provided, a unique ID will be generated.
   */
  id?: string;

  /**
   * The content to display when the accordion is expanded.
   */
  children?: ReactNode;

  /**
   * The theme color of the accordion.
   */
  theme?: ThemeType;

  /**
   * The state of the accordion ('success' | 'error' | 'warning').
   */
  state?: StateType;

  /**
   * Controls the shadow of the accordion.
   */
  shadow?: ShadowType;

  /**
   * Controls the rounding of the accordion.
   */
  rounding?: RoundingType;

  /**
   * The size of the accordion.
   */
  size?: SizeType;

  /**
   * If true, the accordion is initially expanded (uncontrolled mode).
   */
  initiallyExpanded?: boolean;

  /**
   * If true, applies an outline style to the accordion.
   */
  outline?: boolean;

  /**
   * Applies a translucent frosted-glass treatment using the active theme palette.
   */
  glass?: boolean;

  /**
   * If true, disables user interaction and styles the accordion as disabled.
   */
  disabled?: boolean;

  /**
   * Additional custom class names for the wrapper element.
   */
  className?: string;

  /**
   * If set, enables controlled mode. Determines whether the accordion is expanded.
   */
  expanded?: boolean;

  /**
   * Callback triggered when the accordion header is toggled.
   * Receives the new expanded state.
   */
  onToggle?: (expanded: boolean) => void;

  /**
   * If true, the accordion content is loaded asynchronously.
   */
  asyncContent?: boolean;

  /**
   * If true, the accordion can be toggled open or closed.
   * If false, the accordion is always expanded.
   */
  isToggleable?: boolean;

  /**
   * Custom icon to display when the accordion is expanded.
   */
  customExpandedIcon?: ReactNode;

  /**
   * Position of accordion toggle icon.
   */
  iconPosition?: "left" | "right";

  /**
   * Custom icon to display when the accordion is collapsed.
   */
  customCollapsedIcon?: ReactNode;

  /**
   * Accessible description.
   * This can be announced to assistive technologies via aria-describedby.
   */
  description?: string;

  /**
   * If true, the accordion content will be loaded lazily.
   */
  lazyLoad?: boolean;

  /**
   * Accessible label for the accordion toggle button.
   * Useful when the visible title is not descriptive enough.
   */
  "aria-label"?: string;

  /**
   * ID reference for labeling the accordion toggle button.
   * Prefer this when an external visible label already exists.
   */
  "aria-labelledby"?: string;

  /**
   * ID reference for describing the accordion toggle button.
   * This can supplement or replace the generated description ID.
   */
  "aria-describedby"?: string;

  /**
   * Accessible label for the expanded content region.
   * Usually not needed if ariaLabelledBy/aria-labelledby is already sufficient.
   */
  regionAriaLabel?: string;

  /**
   * ID reference for labeling the content region.
   * Overrides the default button-based relationship when needed.
   */
  regionAriaLabelledBy?: string;

  /**
   * ID reference for describing the content region.
   */
  regionAriaDescribedBy?: string;

  /**
   * Announces loading state for assistive technologies when async content is enabled.
   */
  loadingAriaLabel?: string;

  /**
   * Optional role override for the outer wrapper.
   * Leave undefined in most cases.
   */
  role?: HTMLAttributes<HTMLDivElement>["role"];

  /**
   * Optional test ID for testing frameworks.
   */
  "data-testid"?: string;
}
