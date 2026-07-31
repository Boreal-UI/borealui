import { StateType, ThemeType } from "@/types/types";
import {
  ForwardRefExoticComponent,
  HTMLAttributes,
  ReactNode,
  RefAttributes,
} from "react";
import { ChartDatum, ChartValueFormatter } from "../../utils/chartUtils";

type NativeLineChartProps = Omit<HTMLAttributes<HTMLDivElement>, "children">;

/**
 * Props for the LineChart component.
 */
export interface LineChartProps extends NativeLineChartProps {
  /**
   * Labelled values rendered as a line chart.
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
   * @default 360
   */
  width?: number;

  /**
   * Height of the SVG viewport.
   *
   * @default 200
   */
  height?: number;

  /**
   * Inner SVG padding.
   *
   * @default 24
   */
  padding?: number;

  /**
   * Whether to render guide lines.
   *
   * @default true
   */
  showGrid?: boolean;

  /**
   * Whether to render point markers.
   *
   * @default true
   */
  showPoints?: boolean;

  /**
   * Stroke color for the line.
   */
  color?: string;

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
   * @default "line-chart"
   */
  testId?: string;

  /**
   * Backward-compatible alias for test ID attributes.
   */
  "data-testid"?: string;
}

export interface LineChartBaseProps extends LineChartProps {
  /**
   * Framework-specific class name map supplied by the core or Next wrapper.
   */
  classMap: Record<string, string>;
}

export type LineChartComponent = ForwardRefExoticComponent<
  LineChartProps & RefAttributes<HTMLDivElement>
>;
