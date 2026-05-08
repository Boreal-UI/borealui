import {
  RoundingType,
  ShadowType,
  SizeType,
  StateType,
  ThemeType,
} from "@/types/types";
import { ButtonProps } from "../Button/Button.types";
import { IconButtonProps } from "../IconButton/IconButton.types";

/**
 * Props for the Pager (pagination) component.
 */
export interface PagerProps {
  /** Total number of items to paginate through. */
  totalItems: number;

  /** Number of items to display per page. */
  itemsPerPage: number;

  /** The currently active page (1-indexed). */
  currentPage: number;

  /** Callback function invoked when a page change occurs. */
  onPageChange: (page: number) => void;

  /** Enables server side control of the paging. */
  serverControlled?: boolean;

  /** Optional extra class name(s) for custom styling. */
  className?: string;

  /**
   * Optional size modifier for pagination buttons.
   * One of: "xs" | "small" | "medium" | "large" | "xl"
   */
  size?: SizeType;

  /**
   * Optional theme to apply for pagination.
   * One of: "primary" | "secondary" | "tertiary" | "quaternary" | "clear"
   */
  theme?: ThemeType;

  /**
   * Applies a translucent frosted-glass treatment to the pager and nested controls.
   */
  glass?: boolean;

  /**
   * Optional state of the component for feedback styling.
   * One of: "success" | "error" | "warning" | "disabled" | ""
   */
  state?: StateType;

  /**
   * Rounding of the controls.
   * One of: "none" | "small" | "medium" | "large" | "full"
   */
  rounding?: RoundingType;

  /**
   * Shadow of the controls.
   * One of: "none" | "light" | "medium" | "strong" | "intense"
   */
  shadow?: ShadowType;

  /** Accessible label for the pagination navigation region. */
  "aria-label"?: string;

  /** Optional description id for the pagination navigation region. */
  "aria-describedby"?: string;

  /** Optional labelledby id for the pagination navigation region. */
  "aria-labelledby"?: string;

  /** Accessible label for the page list. */
  "page-list-aria-label"?: string;

  /** Accessible label for the previous page button. */
  "previous-button-aria-label"?: string;

  /** Accessible label for the next page button. */
  "next-button-aria-label"?: string;

  /** Function used to generate an accessible label for each page button. */
  getPageAriaLabel?: (page: number, isActive: boolean) => string;

  /** Function used to generate the live region status message. */
  getLiveRegionMessage?: (currentPage: number, totalPages: number) => string;

  /** ARIA live politeness setting for the status message. */
  liveRegionAriaLive?: "off" | "polite" | "assertive";

  /** Optional test ID for testing frameworks. */
  testId?: string;

  /** Backward-compatible alias for test ID attributes. */
  "data-testid"?: string;
}

export interface BasePagerProps extends PagerProps {
  Button: React.ComponentType<ButtonProps>;
  IconButton: React.ComponentType<IconButtonProps>;
  classMap: Record<string, string>;
}

export type PaginationProps = PagerProps;
