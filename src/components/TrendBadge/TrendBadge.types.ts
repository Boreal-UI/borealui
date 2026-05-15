import {
  ForwardRefExoticComponent,
  HTMLAttributes,
  ReactNode,
  RefAttributes,
} from "react";
import { StateType, ThemeType } from "@/types/types";

type NativeTrendBadgeProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children" | "prefix"
>;

/**
 * Props for the TrendBadge component.
 */
export interface TrendBadgeProps extends NativeTrendBadgeProps {
  /**
   * Current numeric value.
   */
  value: number;

  /**
   * Previous value used to calculate the trend.
   */
  previousValue?: number;

  /**
   * Explicit trend direction. When omitted, direction is inferred from value and previousValue.
   */
  direction?: "up" | "down" | "flat";

  /**
   * Visible metric label.
   */
  label?: ReactNode;

  /**
   * Whether a higher value should be treated as positive.
   *
   * @default true
   */
  positiveIsUp?: boolean;

  /**
   * Whether to show the calculated delta instead of the current value.
   *
   * @default true
   */
  showDelta?: boolean;

  /**
   * Prefix rendered before the numeric value.
   */
  prefix?: ReactNode;

  /**
   * Suffix rendered after the numeric value.
   */
  suffix?: ReactNode;

  /**
   * Formatter for the value or delta.
   */
  valueFormatter?: (value: number) => ReactNode;

  /**
   * Theme class used for styling.
   */
  theme?: ThemeType;

  /**
   * Visual state class used for styling.
   */
  state?: StateType;

  /**
   * Whether the component should display a loading state.
   */
  loading?: boolean;

  /**
   * Additional class name for the root.
   */
  className?: string;

  /**
   * Optional test ID for testing frameworks.
   *
   * @default "trend-badge"
   */
  testId?: string;

  /**
   * Backward-compatible alias for test ID attributes.
   */
  "data-testid"?: string;
}

export interface TrendBadgeBaseProps extends TrendBadgeProps {
  /**
   * Framework-specific class name map supplied by the core or Next wrapper.
   */
  classMap: Record<string, string>;
}

export type TrendBadgeComponent = ForwardRefExoticComponent<
  TrendBadgeProps & RefAttributes<HTMLDivElement>
>;
