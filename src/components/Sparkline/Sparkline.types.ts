import {
  ForwardRefExoticComponent,
  HTMLAttributes,
  ReactNode,
  RefAttributes,
} from "react";
import { ChartDatum, ChartValueFormatter } from "../../utils/chartUtils";
import { StateType, ThemeType } from "@/types/types";

type NativeSparklineProps = Omit<HTMLAttributes<HTMLDivElement>, "children">;

/**
 * Props for the Sparkline component.
 */
export interface SparklineProps extends NativeSparklineProps {
  /**
   * Numeric points or labelled values rendered as a compact line chart.
   */
  data: number[] | ChartDatum[];

  /**
   * Visible label rendered above the sparkline.
   */
  label?: ReactNode;

  /**
   * Accessible label for the chart graphic.
   */
  "aria-label"?: string;

  /**
   * Width of the SVG viewport.
   *
   * @default 160
   */
  width?: number;

  /**
   * Height of the SVG viewport.
   *
   * @default 48
   */
  height?: number;

  /**
   * Inner SVG padding used when plotting points.
   *
   * @default 4
   */
  padding?: number;

  /**
   * Stroke color for the line.
   */
  color?: string;

  /**
   * Whether to fill the area below the line.
   *
   * @default false
   */
  showArea?: boolean;

  /**
   * Whether to render the last value next to the chart.
   *
   * @default false
   */
  showValue?: boolean;

  /**
   * Formatter used for visible and accessible values.
   */
  valueFormatter?: ChartValueFormatter;

  /**
   * Optional unit label shown beside formatted values.
   */
  units?: string;

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
   * @default "sparkline"
   */
  testId?: string;

  /**
   * Backward-compatible alias for test ID attributes.
   */
  "data-testid"?: string;
}

export interface SparklineBaseProps extends SparklineProps {
  /**
   * Framework-specific class name map supplied by the core or Next wrapper.
   */
  classMap: Record<string, string>;
}

export type SparklineComponent = ForwardRefExoticComponent<
  SparklineProps & RefAttributes<HTMLDivElement>
>;
