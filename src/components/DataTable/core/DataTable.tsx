import { expandClassMap } from "@/utils/propAliases";
import "./DataTable.scss";
import DataTableBase from "../DataTableBase";
import { DataTableProps } from "../DataTable.types";

const classes = {
  wrapper: "data_table_wrapper",
  scrollArea: "data_table_scroll_area",
  table: "data_table",
  toolbar: "data_table_toolbar",
  toolbarTitle: "data_table_toolbar_title",
  toolbarActions: "data_table_toolbar_actions",
  filterInput: "data_table_filter_input",
  bulkToolbar: "data_table_bulk_toolbar",
  pagination: "data_table_pagination",
  paginationButton: "data_table_pagination_button",
  paginationStatus: "data_table_pagination_status",
  columnMenu: "data_table_column_menu",
  columnMenuTrigger: "data_table_column_menu_trigger",
  columnMenuPanel: "data_table_column_menu_panel",
  columnMenuItem: "data_table_column_menu_item",
  viewport: "data_table_viewport",

  headerCell: "data_table_header_cell",
  headerContent: "data_table_header_content",
  selectionCell: "data_table_selection_cell",
  sortable: "data_table_header_sortable",
  sortButton: "data_table_sort_button",
  sortIcon: "data_table_sort_icon",
  columnControls: "data_table_column_controls",
  columnControlButton: "data_table_column_control_button",
  pinnedCell: "data_table_cell_pinned",

  clickable: "data_table_row_clickable",
  striped: "data_table_row_striped",
  expandedRow: "data_table_expanded_row",
  expandedCell: "data_table_expanded_cell",
  expandButton: "data_table_expand_button",
  virtualized: "data_table_virtualized",

  cell: "data_table_cell",
  wrapCell: "data_table_cell_wrap",
  editableCell: "data_table_cell_editable",
  editButton: "data_table_edit_button",
  cellEditor: "data_table_cell_editor",
  emptyCell: "data_table_empty_cell",
  srOnly: "sr_only",

  primary: "data_table_primary",
  secondary: "data_table_secondary",
  tertiary: "data_table_tertiary",
  quaternary: "data_table_quaternary",

  success: "data_table_success",
  info: "data_table_info",
  error: "data_table_error",
  warning: "data_table_warning",

  clear: "data_table_clear",

  shadowNone: "data_table_shadow-None",
  shadowLight: "data_table_shadow-Light",
  shadowMedium: "data_table_shadow-Medium",
  shadowStrong: "data_table_shadow-Strong",
  shadowIntense: "data_table_shadow-Intense",

  roundNone: "data_table_round-None",
  roundSmall: "data_table_round-Small",
  roundMedium: "data_table_round-Medium",
  roundLarge: "data_table_round-Large",
  glass: "data_table_glass",
  outline: "data_table_outline",
};

function DataTable<T extends object>(props: DataTableProps<T>) {
  return <DataTableBase {...props} classMap={expandClassMap(classes)} />;
}

DataTable.displayName = "DataTable";

export default DataTable;
