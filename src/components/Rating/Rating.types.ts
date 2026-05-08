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
   */
  starAriaLabelPrefix?: string;

  /**
   * If true, marks the field as required.
   */
  required?: boolean;

  /**
   * If true, the rating is read-only and cannot be changed.
   */
  readOnly?: boolean;

  /**
   * The size of the rating component.
   * One of: "xs" | "small" | "medium" | "large" | "xl"
   */
  size?: SizeType;

  /**
   * If true, the user can interact with the rating (hover, click, keyboard navigation).
   */
  interactive?: boolean;

  /**
   * The theme to use for styling.
   * One of: "primary" | "secondary" | "tertiary" | "quaternary" | "clear"
   */
  theme?: ThemeType;

  /**
   * Adds a translucent glass surface behind the rating stars.
   */
  glass?: boolean;

  /**
   * State of the rating.
   * One of: "success" | "error" | "warning" | "disabled" | ""
   */
  state?: StateType;

  /**
   * Optional additional CSS class names for custom styling.
   */
  className?: string;

  /**
   * Optional test ID for testing frameworks.
   */
  "data-testid"?: string;
}

export interface BaseRatingProps extends RatingProps {
  classMap: Record<string, string>;
}
