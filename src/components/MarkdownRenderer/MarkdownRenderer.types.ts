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
   *
   * @default configured default rounding (fallback: "medium")
   */
  rounding?: RoundingType;

  /**
   * Optional shadow styling for the rendered container.
   * One of: "none" | "light" | "medium" | "strong" | "intense"
   *
   * @default configured default shadow (fallback: "light")
   */
  shadow?: ShadowType;

  /**
   * Language of the rendered markdown content.
   *
   * @default "en"
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
   *
   * @default "region"
   */
  role?: React.AriaRole;

  /**
   * Optional tab index for keyboard focus management.
   */
  tabIndex?: number;

  /**
   * Allows raw HTML embedded in markdown before sanitization.
   * Leave false for untrusted content.
   *
   * @default false
   */
  allowHtml?: boolean;

  /**
   * Optional test ID for testing frameworks.
   *
   * @default dataTestId ?? "markdown-renderer"
   */
  testId?: string;

  /** Backward-compatible alias for test ID attributes. */
  "data-testid"?: string;
}

export interface BaseMarkdownRendererProps extends MarkdownRendererProps {
  /**
   * Framework-specific class name map supplied by the core or Next wrapper.
   */
  classMap: Record<string, string>;

  /**
   * Optional preprocessor used after markdown is converted to HTML and before
   * Boreal's mandatory raw-HTML sanitizer. It cannot bypass the built-in
   * element and attribute allowlists.
   * When allowHtml is false, raw HTML is escaped before this function runs.
   */
  sanitizeHtml?: (html: string) => string;
}
