import {
  ForwardRefExoticComponent,
  HTMLAttributes,
  ReactNode,
  RefAttributes,
} from "react";
import { ChartDatum, ChartValueFormatter } from "../../utils/chartUtils";
import { StateType, ThemeType } from "@/types/types";

type NativeBarChartProps = Omit<HTMLAttributes<HTMLDivElement>, "children">;

/**
 * Props for the BarChart component.
 */
export interface BarChartProps extends NativeBarChartProps {
  /**
   * Labelled values rendered as vertical bars.
   */
  data: ChartDatum[];

  /**
   * Visible chart label.
   */
  label?: ReactNode;

  /**
   * Accessible label for the chart graphic.
   */
  "aria-label"?: string;

  /**
   * Width of the SVG viewport.
   *
   * @default 320
   */
  width?: number;

  /**
   * Height of the SVG viewport.
   *
   * @default 180
   */
  height?: number;

  /**
   * Inner SVG padding.
   *
   * @default 24
   */
  padding?: number;

  /**
   * Gap between bars in SVG units.
   *
   * @default 8
   */
  gap?: number;

  /**
   * Whether to render horizontal guide lines.
   *
   * @default true
   */
  showGrid?: boolean;

  /**
   * Whether to render category labels below bars.
   *
   * @default true
   */
  showLabels?: boolean;

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
   * @default "bar-chart"
   */
  testId?: string;

  /**
   * Backward-compatible alias for test ID attributes.
   */
  "data-testid"?: string;
}

export interface BarChartBaseProps extends BarChartProps {
  /**
   * Framework-specific class name map supplied by the core or Next wrapper.
   */
  classMap: Record<string, string>;
}

export type BarChartComponent = ForwardRefExoticComponent<
  BarChartProps & RefAttributes<HTMLDivElement>
>;
