import { ShadowType, StateType, ThemeType } from "@/types/types";
import {
  ComponentType,
  ForwardRefExoticComponent,
  HTMLAttributes,
  ReactNode,
  RefAttributes,
} from "react";
import { Breadcrumb, BreadcrumbsProps } from "../Breadcrumbs/Breadcrumbs.types";

type NativeBreadCrumbPageHeaderProps = Omit<
  HTMLAttributes<HTMLElement>,
  "title"
>;

export type BreadCrumbPageHeaderBreadcrumbProps = Omit<
  BreadcrumbsProps,
  "items"
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
   * Props forwarded to the framework-specific Breadcrumbs component.
   *
   * Example:
   * breadcrumbProps={{
   *   separator: "/",
   *   ariaLabel: "Page path",
   *   maxVisibleItems: 4
   * }}
   */
  breadcrumbProps?: BreadCrumbPageHeaderBreadcrumbProps;

  /**
   * Theme used for styling.
   */
  theme?: ThemeType;

  /**
   * Visual state for styling.
   */
  state?: StateType;
  /**
   * Surface treatment; glassOutline combines glass and outline.
   *
   * @default configured default variant (fallback: "solid")
   */
  variant?: import("@/types/types").VariantType;
  /**
   * Rounding style for the component.
   */
  rounding?: import("@/types/types").RoundableRoundingType;

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
  /**
   * Custom component for rendering breadcrumbs.
   */
  BreadCrumbsComponent: ComponentType<BreadcrumbsProps>;
}

export type BreadCrumbPageHeaderComponent = ForwardRefExoticComponent<
  BreadCrumbPageHeaderProps & RefAttributes<HTMLElement>
>;
