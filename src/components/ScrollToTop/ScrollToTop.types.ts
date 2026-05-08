import { RoundingType, ShadowType } from "@/types";

/**
 * Props for the ScrollToTopBase component.
 */
export interface ScrollToTopProps {
  /**
   * Optional rounding style applied to the button.
   */
  rounding?: RoundingType;

  /**
   * Optional shadow style for the button.
   */
  shadow?: ShadowType;

  /**
   * The scroll offset (in pixels) from the top of the page at which the button becomes visible.
   */
  offset?: number;

  /**
   * Additional custom class names for the root element of the component.
   */
  className?: string;

  /**
   * Accessible label for the scroll-to-top button.
   */
  "aria-label"?: string;

  /**
   * Optional accessible description id applied to the button.
   */
  "aria-describedby"?: string;

  /**
   * Optional id of an external label element applied to the button.
   * When provided, this takes precedence over "aria-label" for accessible naming.
   */
  "aria-labelledby"?: string;

  /**
   * Optional title attribute for the button.
   * Defaults to the same value as "aria-label" when not provided.
   */
  title?: string;

  /**
   * Optional role for the outer wrapper if semantic grouping is needed.
   */
  role?: React.AriaRole;

  /**
   * Optional accessible label for the wrapper when a semantic role is used.
   */
  wrapperAriaLabel?: string;

  /**
   * Optional id for the root element.
   */
  id?: string;

  /** Optional test ID for testing frameworks. */
  testId?: string;

  /** Backward-compatible alias for test ID attributes. */
  "data-testid"?: string;
}

export interface ScrollToTopBaseProps extends ScrollToTopProps {
  classMap: Record<string, string>;
  IconComponent: React.ElementType;
}
