import {
  ForwardRefExoticComponent,
  HTMLAttributes,
  ReactNode,
  RefAttributes,
} from "react";
import { ChartDatum, ChartValueFormatter } from "../../utils/chartUtils";
import { StateType, ThemeType } from "@/types/types";

type NativeDonutChartProps = Omit<HTMLAttributes<HTMLDivElement>, "children">;

/**
 * Props for the DonutChart component.
 */
export interface DonutChartProps extends NativeDonutChartProps {
  /**
   * Labelled values rendered as donut segments.
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
   * Width and height of the SVG viewport.
   *
   * @default 180
   */
  size?: number;

  /**
   * Donut segment thickness.
   *
   * @default 28
   */
  thickness?: number;

  /**
   * Content rendered in the center of the donut.
   */
  centerLabel?: ReactNode;

  /**
   * Whether to show a generated legend below the chart.
   *
   * @default false
   */
  showLegend?: boolean;

  /**
   * Formatter used for visible and accessible values.
   */
  valueFormatter?: ChartValueFormatter;

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
   * @default "donut-chart"
   */
  testId?: string;

  /**
   * Backward-compatible alias for test ID attributes.
   */
  "data-testid"?: string;
}

export interface DonutChartBaseProps extends DonutChartProps {
  /**
   * Framework-specific class name map supplied by the core or Next wrapper.
   */
  classMap: Record<string, string>;
}

export type DonutChartComponent = ForwardRefExoticComponent<
  DonutChartProps & RefAttributes<HTMLDivElement>
>;
