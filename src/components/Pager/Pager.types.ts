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

  /**
   * Enables server side control of the paging.
   *
   * @default false
   */
  serverControlled?: boolean;

  /**
   * Optional extra class name(s) for custom styling.
   *
   * @default ""
   */
  className?: string;

  /**
   * Optional size modifier for pagination buttons.
   * One of: "xs" | "small" | "medium" | "large" | "xl"
   *
   * @default configured default size (fallback: "medium")
   */
  size?: SizeType;

  /**
   * Optional theme to apply for pagination.
   * One of: "primary" | "secondary" | "tertiary" | "quaternary" | "clear"
   *
   * @default configured default theme (fallback: "primary")
   */
  theme?: ThemeType;

  /**
   * Applies a translucent frosted-glass treatment to the pager and nested controls.
   *
   * @default configured default glass setting (fallback: false)
   */
  glass?: boolean;

  /**
   * Optional state of the component for feedback styling.
   * One of: "success" | "error" | "warning" | "disabled" | ""
   *
   * @default ""
   */
  state?: StateType;

  /**
   * Rounding of the controls.
   * One of: "none" | "small" | "medium" | "large" | "full"
   *
   * @default configured default rounding (fallback: "medium")
   */
  rounding?: RoundingType;

  /**
   * Shadow of the controls.
   * One of: "none" | "light" | "medium" | "strong" | "intense"
   *
   * @default configured default shadow (fallback: "light")
   */
  shadow?: ShadowType;

  /**
   * Accessible label for the pagination navigation region.
   *
   * @default "Pagination"
   */
  "aria-label"?: string;

  /** Optional description id for the pagination navigation region. */
  "aria-describedby"?: string;

  /** Optional labelledby id for the pagination navigation region. */
  "aria-labelledby"?: string;

  /**
   * Accessible label for the page list.
   *
   * @default "Page list"
   */
  "page-list-aria-label"?: string;

  /**
   * Accessible label for the previous page button.
   *
   * @default "Go to previous page"
   */
  "previous-button-aria-label"?: string;

  /**
   * Accessible label for the next page button.
   *
   * @default "Go to next page"
   */
  "next-button-aria-label"?: string;

  /**
   * Function used to generate an accessible label for each page button.
   *
   * @default (pageNumber, isActive) => isActive ? `Current page, page ${pageNumber}` : `Go to page ${pageNumber}`
   */
  getPageAriaLabel?: (page: number, isActive: boolean) => string;

  /**
   * Function used to generate the live region status message.
   *
   * @default (activePage, totalPages) => `Page ${activePage} of ${totalPages}`
   */
  getLiveRegionMessage?: (currentPage: number, totalPages: number) => string;

  /**
   * ARIA live politeness setting for the status message.
   *
   * @default "polite"
   */
  liveRegionAriaLive?: "off" | "polite" | "assertive";


  /**
   * Optional test ID for testing frameworks.
   *
   * @default dataTestId ?? "pager"
   */
  testId?: string;

  /** Backward-compatible alias for test ID attributes. */
  "data-testid"?: string;
}

export interface BasePagerProps extends PagerProps {
  /**
   * Button component dependency injected by the wrapper.
   */
  Button: React.ComponentType<ButtonProps>;
  /**
   * Icon Button component dependency injected by the wrapper.
   */
  IconButton: React.ComponentType<IconButtonProps>;
  /**
   * Framework-specific class name map supplied by the core or Next wrapper.
   */
  classMap: Record<string, string>;
}

export type PaginationProps = PagerProps;
