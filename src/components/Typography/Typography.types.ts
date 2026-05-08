import { AriaRole, CSSProperties, ElementType, ReactNode } from "react";

/* Font types */
export type TypographyVariant =
  | "display"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "body-lg"
  | "body"
  | "body-sm"
  | "label"
  | "caption"
  | "overline"
  | "code";

/* Font alignment types */
export type TypographyAlign = "left" | "center" | "right" | "inherit";

/* Font weight types */
export type TypographyWeight =
  | "light"
  | "normal"
  | "medium"
  | "bold"
  | "bolder"
  | "inherit";

/* Theme types */
export type TypographyTheme =
  | "primary"
  | "secondary"
  | "tertiary"
  | "quaternary"
  | "clear"
  | "success"
  | "warning"
  | "error"
  | "inherit";

export interface TypographyProps {
  /**
   * The content to render inside the typography component.
   */
  children?: ReactNode;

  /**
   * Predefined typography style variant.
   * Examples may include headings, body text, captions, or labels.
   */
  variant?: TypographyVariant;

  /**
   * The HTML element or custom component to render as.
   * For example: `"p"`, `"span"`, `"h1"`, or a custom React component.
   */
  as?: ElementType;

  /**
   * Horizontal text alignment.
   */
  align?: TypographyAlign;

  /**
   * Font weight of the text.
   */
  weight?: TypographyWeight;

  /**
   * Visual theme style applied to the typography.
   */
  theme?: TypographyTheme;

  /**
   * Applies a compact translucent frosted-glass treatment around the text.
   */
  glass?: boolean;

  /**
   * Whether the text should be displayed in italic style.
   */
  italic?: boolean;

  /**
   * Whether the text should be underlined.
   */
  underline?: boolean;

  /**
   * Whether overflowing text should be truncated, typically with an ellipsis.
   */
  truncate?: boolean;

  /**
   * Whether the text should remain on a single line without wrapping.
   */
  noWrap?: boolean;

  /**
   * Whether the text should be visually hidden but still available to screen readers.
   */
  srOnly?: boolean;

  /**
   * Optional custom CSS class name for the root element.
   */
  className?: string;

  /**
   * Optional inline styles applied to the root element.
   */
  style?: CSSProperties;

  /**
   * Optional unique id for the root element.
   */
  id?: string;

  /**
   * Advisory text for the element, typically shown as a tooltip on hover.
   */
  title?: string;

  /**
   * Optional test id used for testing the component.
   */
  testId?: string;

  /** Backward-compatible alias for test ID attributes. */
  "data-testid"?: string;

  /**
   * Optional ARIA role for the rendered element.
   */
  role?: AriaRole;

  /**
   * Defines an accessible label for the element when a visible label is not sufficient.
   */
  "aria-label"?: string;

  /**
   * References the id of another element that labels this element.
   */
  "aria-labelledby"?: string;

  /**
   * References the id of another element that describes this element.
   */
  "aria-describedby"?: string;

  /**
   * Whether the element should be hidden from assistive technologies.
   */
  "aria-hidden"?: boolean;

  /**
   * Indicates that the element will be updated and describes how updates should be announced.
   */
  "aria-live"?: "off" | "polite" | "assertive";

  /**
   * Whether assistive technologies should present the entire updated region
   * when part of a live region changes.
   */
  "aria-atomic"?: boolean;

  /**
   * Indicates whether the element is currently being updated, such as during loading.
   */
  "aria-busy"?: boolean;
}

export interface TypographyBaseProps extends TypographyProps {
  classMap: Record<string, string>;
  combineClassNames: (
    ...classes: Array<string | false | null | undefined>
  ) => string;
}
