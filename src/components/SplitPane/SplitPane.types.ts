import {
  ForwardRefExoticComponent,
  HTMLAttributes,
  ReactNode,
  RefAttributes,
} from "react";
import { RoundingType, ShadowType, StateType, ThemeType } from "@/types/types";

type NativeSplitPaneProps = Omit<HTMLAttributes<HTMLDivElement>, "children">;

/**
 * Props for the SplitPane component.
 */
export interface SplitPaneProps extends NativeSplitPaneProps {
  /**
   * Content rendered in the first pane.
   */
  startPane?: ReactNode;

  /**
   * Content rendered in the second pane.
   */
  endPane?: ReactNode;

  /**
   * Fallback children. When two children are supplied, they are used as start/end panes.
   */
  children?: ReactNode;

  /**
   * Split orientation.
   *
   * @default "horizontal"
   */
  orientation?: "horizontal" | "vertical";

  /**
   * Controlled size of the start pane as a percentage.
   */
  size?: number;

  /**
   * Initial size of the start pane as a percentage.
   *
   * @default 50
   */
  defaultSize?: number;

  /**
   * Minimum start pane size as a percentage.
   *
   * @default 10
   */
  minSize?: number;

  /**
   * Maximum start pane size as a percentage.
   *
   * @default 90
   */
  maxSize?: number;

  /**
   * Whether the divider can be resized.
   *
   * @default true
   */
  resizable?: boolean;

  /**
   * Callback fired when the pane size changes.
   */
  onSizeChange?: (size: number) => void;

  /**
   * Accessible label for the resize separator.
   *
   * @default "Resize panes"
   */
  separatorAriaLabel?: string;

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
   * Whether the split pane is disabled.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the split pane should display a loading state.
   *
   * @default false
   */
  loading?: boolean;

  /**
   * Additional class name for the root.
   */
  className?: string;

  /**
   * Additional class name for the start pane.
   */
  startPaneClassName?: string;

  /**
   * Additional class name for the end pane.
   */
  endPaneClassName?: string;

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

export interface SplitPaneBaseProps extends SplitPaneProps {
  /**
   * Framework-specific class name map supplied by the core or Next wrapper.
   */
  classMap: Record<string, string>;
}

export type SplitPaneComponent = ForwardRefExoticComponent<
  SplitPaneProps & RefAttributes<HTMLDivElement>
>;
