import { RoundingType, ShadowType } from "@/types/types";

/**
 * Props for the MarkdownRenderer component.
 */
export interface MarkdownRendererProps {
  /**
   * Raw markdown content to be rendered as HTML.
   */
  content: string;

  /**
   * Optional additional class name for styling.
   */
  className?: string;

  /**
   * Optional rounding style for the rendered container.
   * One of: "none" | "small" | "medium" | "large" | "full"
   */
  rounding?: RoundingType;

  /**
   * Optional shadow styling for the rendered container.
   * One of: "none" | "light" | "medium" | "strong" | "intense"
   */
  shadow?: ShadowType;

  /**
   * Language of the rendered markdown content.
   */
  language?: string;

  /**
   * Accessible label for the markdown region.
   * Use this when there is no visible heading associated with the content.
   */
  "aria-label"?: string;

  /**
   * ID of an element that labels the markdown region.
   * Prefer this when a visible heading already exists.
   */
  "aria-labelledby"?: string;

  /**
   * ID of an element that describes the markdown region.
   */
  "aria-describedby"?: string;

  /**
   * Optional ARIA role for the wrapper element.
   * Defaults to "region".
   */
  role?: React.AriaRole;

  /**
   * Optional tab index for keyboard focus management.
   */
  tabIndex?: number;

  /** Optional test ID for testing frameworks. */
  testId?: string;

  /** Backward-compatible alias for test ID attributes. */
  "data-testid"?: string;
}

export interface BaseMarkdownRendererProps extends MarkdownRendererProps {
  classMap: Record<string, string>;
  sanitizeHtml?: (html: string) => string;
}
