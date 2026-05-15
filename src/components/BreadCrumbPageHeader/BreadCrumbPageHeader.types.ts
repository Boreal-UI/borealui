import {
  ForwardRefExoticComponent,
  HTMLAttributes,
  ReactNode,
  RefAttributes,
} from "react";
import { Breadcrumb } from "../Breadcrumbs/Breadcrumbs.types";
import { RoundingType, ShadowType, StateType, ThemeType } from "@/types/types";

type NativeBreadCrumbPageHeaderProps = Omit<
  HTMLAttributes<HTMLElement>,
  "title"
>;

/**
 * Props for the BreadCrumbPageHeader component.
 */
export interface BreadCrumbPageHeaderProps extends NativeBreadCrumbPageHeaderProps {
  /**
   * Breadcrumb items rendered before the page header title.
   */
  breadcrumbs?: Breadcrumb[];

  /**
   * Main page title.
   */
  title?: ReactNode;

  /**
   * Legacy alias for title retained for scaffold compatibility.
   */
  label?: ReactNode;

  /**
   * Legacy label position retained for scaffold compatibility.
   */
  labelPosition?: string;

  /**
   * Supporting subtitle or description.
   */
  subtitle?: ReactNode;

  /**
   * Primary action area rendered at the end of the header.
   */
  actions?: ReactNode;

  /**
   * Additional content rendered below the title row.
   */
  children?: ReactNode;

  /**
   * Separator rendered between breadcrumb items.
   */
  separator?: ReactNode;

  /**
   * Maximum visible breadcrumbs before collapsing the middle.
   */
  maxVisibleBreadcrumbs?: number;

  /**
   * Theme used for styling.
   */
  theme?: ThemeType;

  /**
   * Visual state for styling.
   */
  state?: StateType;

  /**
   * Whether to render outlined styling.
   */
  outline?: boolean;

  /**
   * Whether to render glass styling.
   */
  glass?: boolean;

  /**
   * Rounding style for the component.
   */
  rounding?: RoundingType;

  /**
   * Shadow style for the component.
   */
  shadow?: ShadowType;

  /**
   * Whether the component is visually disabled.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the component should display a loading state.
   *
   * @default false
   */
  loading?: boolean;

  /**
   * Additional class name for the root.
   */
  className?: string;

  /**
   * Legacy class name for the outer container.
   */
  containerClassName?: string;

  /**
   * Legacy class name for the visible label.
   */
  labelClassName?: string;

  /**
   * Additional class name for the content area.
   */
  contentClassName?: string;

  /**
   * Optional content rendered for assistive technologies only.
   */
  srOnlyText?: ReactNode;

  /**
   * Additional class name for screen-reader-only content.
   */
  srOnlyClassName?: string;

  /**
   * Optional test ID for testing frameworks.
   */
  testId?: string;

  /**
   * Backward-compatible alias for test ID attributes.
   */
  "data-testid"?: string;
}

export interface BreadCrumbPageHeaderBaseProps extends BreadCrumbPageHeaderProps {
  /**
   * Framework-specific class name map supplied by the core or Next wrapper.
   */
  classMap: Record<string, string>;
}

export type BreadCrumbPageHeaderComponent = ForwardRefExoticComponent<
  BreadCrumbPageHeaderProps & RefAttributes<HTMLElement>
>;
