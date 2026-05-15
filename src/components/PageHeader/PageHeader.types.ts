import {
  ForwardRefExoticComponent,
  HTMLAttributes,
  ReactNode,
  RefAttributes,
} from "react";
import { RoundingType, ShadowType, StateType, ThemeType } from "@/types/types";

type NativePageHeaderProps = Omit<HTMLAttributes<HTMLElement>, "title">;

/**
 * Props for the PageHeader component.
 */
export interface PageHeaderProps extends NativePageHeaderProps {
  /**
   * Main page title.
   */
  title?: ReactNode;

  /**
   * Legacy alias for title retained for scaffold compatibility.
   */
  label?: ReactNode;

  /**
   * Supporting subtitle or description.
   */
  subtitle?: ReactNode;

  /**
   * Small text rendered above the title.
   */
  eyebrow?: ReactNode;

  /**
   * Optional leading visual or icon.
   */
  icon?: ReactNode;

  /**
   * Supplemental metadata rendered near the title.
   */
  meta?: ReactNode;

  /**
   * Primary action area rendered at the end of the header.
   */
  actions?: ReactNode;

  /**
   * Optional content rendered before the title block.
   */
  before?: ReactNode;

  /**
   * Optional content rendered after the main row.
   */
  footer?: ReactNode;

  /**
   * Additional header content.
   */
  children?: ReactNode;

  /**
   * Semantic element used for the root.
   *
   * @default "header"
   */
  as?: "header" | "section" | "div";

  /**
   * Whether title/actions should stack more tightly.
   *
   * @default false
   */
  compact?: boolean;

  /**
   * Whether the header should stretch to full width.
   *
   * @default true
   */
  fullWidth?: boolean;

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
   * Whether the header is visually disabled.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the header should display a loading indicator.
   *
   * @default false
   */
  loading?: boolean;

  /**
   * Additional class name for the root.
   */
  className?: string;

  /**
   * Additional class name for the title.
   */
  titleClassName?: string;

  /**
   * Additional class name for the subtitle.
   */
  subtitleClassName?: string;

  /**
   * Additional class name for the actions area.
   */
  actionsClassName?: string;

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

export interface PageHeaderBaseProps extends PageHeaderProps {
  /**
   * Framework-specific class name map supplied by the core or Next wrapper.
   */
  classMap: Record<string, string>;
}

export type PageHeaderComponent = ForwardRefExoticComponent<
  PageHeaderProps & RefAttributes<HTMLElement>
>;
