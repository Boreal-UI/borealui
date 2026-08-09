import { StateType, ThemeType } from "@/types/types";
import {
  ForwardRefExoticComponent,
  HTMLAttributes,
  ReactNode,
  RefAttributes,
} from "react";

type NativeLegendProps = Omit<HTMLAttributes<HTMLDivElement>, "children">;

/**
 * Item rendered by the Legend component.
 */
export interface LegendItem {
  /**
   * Visible item label.
   */
  label: ReactNode;

  /**
   * Marker color.
   */
  color: string;

  /**
   * Optional value rendered after the label.
   */
  value?: ReactNode;
}

/**
 * Props for the Legend component.
 */
export interface LegendProps extends NativeLegendProps {
  /**
   * Items rendered in the legend.
   */
  items: LegendItem[];

  /**
   * Visible legend label.
   */
  label?: ReactNode;

  /**
   * Legend orientation.
   *
   * @default "horizontal"
   */
  orientation?: "horizontal" | "vertical";

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
   * @default "legend"
   */
  testId?: string;

  /**
   * Backward-compatible alias for test ID attributes.
   */
  "data-testid"?: string;
}

export interface LegendBaseProps extends LegendProps {
  /**
   * Framework-specific class name map supplied by the core or Next wrapper.
   */
  classMap: Record<string, string>;
}

export type LegendComponent = ForwardRefExoticComponent<
  LegendProps & RefAttributes<HTMLDivElement>
>;
