import React from "react";
import { RoundingType, ShadowType, StateType, ThemeType } from "@/types/types";

/**
 * Column definition for the DataTable.
 */
export interface Column<T> {
  /** Key of the field in the data object. */
  key: keyof T;

  /** Label to display in the table header. */
  label: string;

  /** Whether the column is sortable. */
  sortable?: boolean;

  /** Optional custom render function for the cell. */
  render?: (value: unknown, row: T) => React.ReactNode;

  /**
   * Optional abbreviated label for compact headers.
   * This can be exposed to assistive technology when the visual label is shortened.
   */
  srLabel?: string;

  /**
   * Optional header cell id.
   * Useful when you want to explicitly associate data cells with headers.
   */
  id?: string;

  /**
   * Optional column header scope override.
   * Defaults to "col" in most implementations.
   */
  scope?: "col" | "colgroup";

  /**
   * Whether this column should be treated as the row header for each row.
   * Useful for tables where the first column identifies the row.
   */
  isRowHeader?: boolean;
  /**
   * Optional class name applied to this column's header cell.
   */
  headerClassName?: string;

  /**
   * Optional class name applied to every body cell in this column.
   */
  cellClassName?: string;

  /**
   * Optional class name applied to row header cells when this column uses isRowHeader.
   */
  rowHeaderClassName?: string;

  /**
   * Optional class name applied to the sort button inside a sortable header.
   */
  sortButtonClassName?: string;
  /**
   * Allows this column's cells to wrap onto multiple lines.
   * Useful for descriptions, notes, code summaries, or long labels.
   */
  wrap?: boolean;

  /**
   * Optional max width for this column.
   * Example: "24rem", "320px", "40ch".
   */
  maxWidth?: string;

  /**
   * Optional min width for this column.
   * Example: "10rem", "160px".
   */
  minWidth?: string;

  /**
   * Optional width for this column.
   * Example: "12rem", "20%", "240px".
   */
  width?: string;
}

/**
 * Props for the DataTable component.
 */
export interface DataTableProps<T> {
  /** Array of column definitions. */
  columns: Column<T>[];

  /** Array of row data objects. */
  data: T[];

  /** Optional callback when a row is clicked. */
  onRowClick?: (row: T) => void;

  /**
   * Enables checkbox row selection.
   *
   * @default false
   */
  selectableRows?: boolean;

  /** Controlled selected row keys. */
  selectedRowKeys?: Array<string | number>;

  /** Initial selected row keys for uncontrolled selection. */
  defaultSelectedRowKeys?: Array<string | number>;

  /** Callback fired when row selection changes. */
  onSelectionChange?: (selectedKeys: Array<string | number>, selectedRows: T[]) => void;

  /** Accessible label for the select-all checkbox. */
  selectAllAriaLabel?: string;

  /** Accessible label for a row selection checkbox. */
  getRowSelectAriaLabel?: (row: T, index: number) => string;

  /**
   * Enables the built-in client-side filter input.
   *
   * @default false
   */
  filterable?: boolean;

  /** Controlled filter query. */
  filterValue?: string;

  /** Initial filter query for uncontrolled filtering. */
  defaultFilterValue?: string;

  /** Callback fired when the filter query changes. */
  onFilterChange?: (value: string) => void;

  /** Placeholder for the filter input. */
  filterPlaceholder?: string;

  /** Accessible label for the filter input. */
  filterAriaLabel?: string;

  /** Optional toolbar title shown above the table. */
  toolbarTitle?: React.ReactNode;

  /** Optional actions rendered in the table toolbar. */
  toolbarActions?: React.ReactNode;

  /** Optional class name for the toolbar. */
  toolbarClassName?: string;

  /** Optional class name for the filter input. */
  filterInputClassName?: string;

  /**
   * Optional class name for the table wrapper.
   *
   * @default ""
   */
  className?: string;

  /**
   * Optional class name applied directly to the table element.
   */
  tableClassName?: string;

  /**
   * Optional class name applied to the table head.
   */
  theadClassName?: string;

  /**
   * Optional class name applied to the table body.
   */
  tbodyClassName?: string;

  /**
   * Optional static or dynamic class name for each row.
   */
  rowClassName?: string | ((row: T, index: number) => string | undefined);

  /**
   * Optional dynamic class name for each cell.
   */
  cellClassName?: (
    value: unknown,
    row: T,
    column: Column<T>,
    rowIndex: number,
  ) => string | undefined;

  /**
   * Allows table cells to wrap onto multiple lines.
   * Can be overridden per column with column.wrap.
   *
   * @default false
   */
  wrapCells?: boolean;

  /**
   * Theme used for styling the table
   * ('primary' | 'secondary' | 'tertiary' | 'quaternary' | 'clear').
   *
   * @default configured default theme (fallback: "primary")
   */
  theme?: ThemeType;

  /**
   * If true, applies a translucent glass surface using the selected theme/state.
   * Defaults to `false`.
   *
   * @default configured default glass setting (fallback: false)
   */
  glass?: boolean;

  /**
   * State of the table
   * ('success' | 'error' | 'warning' | 'disabled' | '').
   *
   * @default ""
   */
  state?: StateType;

  /**
   * Rounding style for the table
   * ('none' | 'small' | 'medium' | 'large' | 'full').
   *
   * @default configured default rounding (fallback: "medium")
   */
  rounding?: RoundingType;

  /**
   * Shadow style for the data table
   * ('none' | 'light' | 'medium' | 'strong' | 'intense').
   *
   * @default configured default shadow (fallback: "light")
   */
  shadow?: ShadowType;

  /**
   * Whether to use outline styling.
   *
   * @default configured default outline setting (fallback: false)
   */
  outline?: boolean;

  /**
   * Whether to use striped row styling.
   *
   * @default true
   */
  striped?: boolean;

  /** Default key to sort by on initial render. */
  defaultSortKey?: keyof T;

  /**
   * Default sort order on initial render
   * ('asc' | 'desc').
   *
   * @default "asc"
   */
  defaultSortOrder?: "asc" | "desc";

  /**
   * Accessible label for screen readers.
   * Use this when there is no visible caption or heading tied to the table.
   */
  "aria-label"?: string;

  /**
   * Accessible labelledby reference for the table.
   * Prefer this when a visible heading already labels the table.
   */
  "aria-labelledby"?: string;

  /**
   * Accessible description reference for the table.
   * Useful for tying helper or instructional text to the table.
   */
  "aria-describedby"?: string;

  /**
   * Optional visible or screen-reader-only caption text for the table.
   * A table caption is the preferred built-in table label.
   *
   * @default "Data table"
   */
  caption?: string;

  /**
   * Whether the caption should be visually hidden.
   * Useful when you want semantic labeling without visible UI.
   *
   * @default true
   */
  hideCaption?: boolean;

  /**
   * Accessible label for the sort buttons/controls.
   * Receives the column label and current sort order.
   */
  getSortAriaLabel?: (
    column: Column<T>,
    sortOrder: "asc" | "desc",
    isActive: boolean,
  ) => string;

  /**
   * Live region text announced when sorting changes.
   * Receives the active column and current order.
   */
  getSortAnnouncement?: (
    column: Column<T>,
    sortOrder: "asc" | "desc",
  ) => string;

  /**
   * Whether to enable server-side sorting.
   *
   * @default false
   */
  serverSort?: boolean;

  /** Function to handle server-side sorting. */
  onSortChange?: (key: keyof T, order: "asc" | "desc") => void;

  /** Function to derive a unique key for each row. */
  rowKey?: (row: T) => string | number;

  /**
   * Optional accessible label for interactive rows.
   * Only used when onRowClick is provided.
   */
  getRowAriaLabel?: (row: T, index: number) => string;

  /**
   * Optional row description for screen readers.
   * Only used when rows are interactive.
   */
  getRowAriaDescription?: (row: T, index: number) => string;

  /**
   * Text shown when no rows are available.
   *
   * @default "No data available"
   */
  emptyMessage?: string;

  /**
   * Whether the table is currently loading data.
   *
   * @default false
   */
  loading?: boolean;

  /**
   * Accessible and/or visible loading message.
   *
   * @default "Loading data"
   */
  loadingMessage?: string;

  /**
   * Total column count override.
   * Helpful when rendering dynamic or grouped columns in advanced cases.
   */
  colCount?: number;

  /**
   * Total row count override.
   * Helpful for virtualized or server-paginated tables.
   */
  rowCount?: number;


  /**
   * Optional test ID for testing frameworks.
   *
   * @default dataTestId ?? "data-table"
   */
  testId?: string;

  /** Backward-compatible alias for test ID attributes. */
  "data-testid"?: string;
}

export interface DataTableBaseProps<T> extends DataTableProps<T> {
  classMap: Record<string, string>;
}
