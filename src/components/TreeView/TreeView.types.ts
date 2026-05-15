import {
  ForwardRefExoticComponent,
  HTMLAttributes,
  ReactNode,
  RefAttributes,
} from "react";
import { RoundingType, ShadowType, StateType, ThemeType } from "@/types/types";

type NativeTreeViewProps = Omit<HTMLAttributes<HTMLDivElement>, "children">;

/**
 * Node rendered by the TreeView component.
 */
export interface TreeViewNode {
  /**
   * Stable node identifier.
   */
  id: string;

  /**
   * Visible node label.
   */
  label: ReactNode;

  /**
   * Optional leading icon.
   */
  icon?: ReactNode;

  /**
   * Optional nested child nodes.
   */
  children?: TreeViewNode[];

  /**
   * Whether the node cannot be selected or expanded.
   */
  disabled?: boolean;
}

/**
 * Props for the TreeView component.
 */
export interface TreeViewProps extends NativeTreeViewProps {
  /**
   * Tree nodes to render.
   */
  items?: TreeViewNode[];

  /**
   * Fallback content rendered when items are not provided.
   */
  children?: ReactNode;

  /**
   * Controlled selected node id.
   */
  selectedId?: string;

  /**
   * Initial selected node id for uncontrolled usage.
   */
  defaultSelectedId?: string;

  /**
   * Controlled expanded node ids.
   */
  expandedIds?: string[];

  /**
   * Initial expanded node ids for uncontrolled usage.
   */
  defaultExpandedIds?: string[];

  /**
   * Callback fired when selection changes.
   */
  onSelectionChange?: (id: string, node: TreeViewNode) => void;

  /**
   * Callback fired when expanded nodes change.
   */
  onExpandedChange?: (ids: string[]) => void;

  /**
   * Accessible label for the tree.
   */
  label?: string;

  /**
   * Whether the tree is disabled.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the tree should display a loading state.
   */
  loading?: boolean;

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
   * Additional class name for the root.
   */
  className?: string;

  /**
   * Additional class name for fallback child content.
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

export interface TreeViewBaseProps extends TreeViewProps {
  /**
   * Framework-specific class name map supplied by the core or Next wrapper.
   */
  classMap: Record<string, string>;
}

export type TreeViewComponent = ForwardRefExoticComponent<
  TreeViewProps & RefAttributes<HTMLDivElement>
>;
