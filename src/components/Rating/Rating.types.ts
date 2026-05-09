import { SizeType, StateType, ThemeType } from "@/types/types";

/**
 * Props for the Rating component.
 */
export interface RatingProps {
  /**
   * Optional unique id for the rating group.
   */
  id?: string;

  /**
   * The current rating value.
   */
  value: number;

  /**
   * Callback function invoked when the rating changes.
   * Receives the new rating (1-indexed) as its argument.
   */
  onChange?: (rating: number) => void;

  /**
   * The maximum number of stars available for the rating.
   *
   * @default 5
   */
  max?: number;

  /**
   * Visible label for the rating component.
   */
  label?: string;

  /**
   * Accessible label for the rating group.
   * Prefer `label` when a visible label is needed.
   */
  "aria-label"?: string;

  /**
   * References the id of an element that labels the rating group.
   */
  "aria-labelledby"?: string;

  /**
   * References the id of an element that describes the rating group.
   */
  "aria-describedby"?: string;

  /**
   * Optional aria-label prefix for each star.
   * Example: "Rating star" -> "Rating star 1 of 5"
   *
   * @default "Rate"
   */
  starAriaLabelPrefix?: string;

  /**
   * If true, marks the field as required.
   *
   * @default false
   */
  required?: boolean;

  /**
   * If true, the rating is read-only and cannot be changed.
   *
   * @default false
   */
  readOnly?: boolean;

  /**
   * The size of the rating component.
   * One of: "xs" | "small" | "medium" | "large" | "xl"
   *
   * @default configured default size (fallback: "medium")
   */
  size?: SizeType;

  /**
   * If true, the user can interact with the rating (hover, click, keyboard navigation).
   *
   * @default true
   */
  interactive?: boolean;

  /**
   * The theme to use for styling.
   * One of: "primary" | "secondary" | "tertiary" | "quaternary" | "clear"
   *
   * @default configured default theme (fallback: "primary")
   */
  theme?: ThemeType;

  /**
   * Adds a translucent glass surface behind the rating stars.
   *
   * @default configured default glass setting (fallback: false)
   */
  glass?: boolean;

  /**
   * State of the rating.
   * One of: "success" | "error" | "warning" | "disabled" | ""
   *
   * @default ""
   */
  state?: StateType;

  /**
   * Optional additional CSS class names for custom styling.
   *
   * @default ""
   */
  className?: string;


  /**
   * Optional test ID for testing frameworks.
   *
   * @default dataTestId ?? "rating"
   */
  testId?: string;

  /** Backward-compatible alias for test ID attributes. */
  "data-testid"?: string;
}

export interface BaseRatingProps extends RatingProps {
  classMap: Record<string, string>;
}
