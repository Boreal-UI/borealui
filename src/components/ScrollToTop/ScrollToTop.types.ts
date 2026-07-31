import { RoundingType, ShadowType } from "@/types";

/**
 * Props for the ScrollToTopBase component.
 */
export interface ScrollToTopProps {
  /**
   * Optional rounding style applied to the button.
   *
   * @default configured default rounding (fallback: "medium")
   */
  rounding?: RoundingType;

  /**
   * Optional shadow style for the button.
   *
   * @default configured default shadow (fallback: "light")
   */
  shadow?: ShadowType;

  /**
   * The scroll offset (in pixels) from the top of the page at which the button becomes visible.
   *
   * @default 300
   */
  offset?: number;

  /**
   * Additional custom class names for the root element of the component.
   *
   */
  className?: string;

  /**
   * Accessible label for the scroll-to-top button.
   *
   * @default "Scroll to top"
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

  /**
   * Optional test ID for testing frameworks.
   *
   * @default dataTestId ?? "scroll"
   */
  testId?: string;

  /** Backward-compatible alias for test ID attributes. */
  "data-testid"?: string;
}

export interface ScrollToTopBaseProps extends ScrollToTopProps {
  /**
   * Framework-specific class name map supplied by the core or Next wrapper.
   */
  classMap: Record<string, string>;
  /**
   * Component implementation used to render the icon portion.
   */
  IconComponent: React.ElementType;
}
