import {
  useEffect,
  useMemo,
  useCallback,
  useState,
  KeyboardEvent,
  CSSProperties,
  Fragment,
} from "react";
import { combineClassNames } from "../../utils/classNames";
import { DataTableBaseProps, Column } from "./DataTable.types";
import { capitalize } from "../../utils/capitalize";
import {
  getDefaultOutline,
  getDefaultGlass,
  getDefaultRounding,
  getDefaultShadow,
  getDefaultTheme,
} from "../../config/boreal-style-config";

const parsePixelWidth = (value: string | undefined, fallback = 160): number => {
  if (!value) return fallback;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

function DataTableBase<T extends object>({
  columns,
  data,
  onRowClick,
  selectableRows = false,
  selectedRowKeys,
  defaultSelectedRowKeys = [],
  onSelectionChange,
  selectAllAriaLabel = "Select all rows",
  getRowSelectAriaLabel,
  filterable = false,
  filterValue,
  defaultFilterValue,
  onFilterChange,
  filterPlaceholder = "Filter table",
  filterAriaLabel = "Filter table rows",
  toolbarTitle,
  toolbarActions,
  bulkActions,
  toolbarClassName,
  filterInputClassName,
  bulkToolbarClassName,
  paginationClassName,
  columnMenuClassName,
  classMap,
  theme = getDefaultTheme(),
  rounding = getDefaultRounding(),
  shadow = getDefaultShadow(),
  state,
  outline = getDefaultOutline(),
  glass = getDefaultGlass(),
  className,
  tableClassName,
  theadClassName,
  tbodyClassName,
  rowClassName,
  cellClassName,
  striped = true,
  wrapCells = false,
  defaultSortKey,
  defaultSortOrder = "asc",
  serverSort = false,
  onSortChange,
  rowKey,
  caption = "Data table",
  hideCaption = true,
  getSortAriaLabel,
  getSortAnnouncement,
  getRowAriaLabel,
  getRowAriaDescription,
  emptyMessage = "No data available",
  loading = false,
  loadingMessage = "Loading data",
  colCount,
  rowCount,
  pagination = false,
  currentPage,
  defaultPage = 1,
  itemsPerPage = 10,
  totalItems,
  serverPagination = false,
  onPageChange,
  columnVisibility = false,
  visibleColumnKeys,
  defaultVisibleColumnKeys,
  onColumnVisibilityChange,
  columnReorder = false,
  columnOrder,
  defaultColumnOrder,
  onColumnOrderChange,
  columnResize = false,
  columnWidths,
  defaultColumnWidths = {},
  onColumnWidthsChange,
  columnPinning = false,
  pinnedColumnKeys,
  defaultPinnedColumnKeys = [],
  onPinnedColumnKeysChange,
  renderExpandedRow,
  expandedRowKeys,
  defaultExpandedRowKeys = [],
  onExpandedRowsChange,
  onCellEdit,
  virtualized = false,
  virtualRowHeight = 48,
  virtualViewportHeight = 360,
  virtualOverscan = 4,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  "data-testid": dataTestId,
  testId = dataTestId ?? "data-table",
}: DataTableBaseProps<T>) {
  const [sortKey, setSortKey] = useState<keyof T | undefined>(defaultSortKey);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(defaultSortOrder);
  const [sortAnnouncement, setSortAnnouncement] = useState("");
  const [internalSelectedKeys, setInternalSelectedKeys] = useState<
    Array<string | number>
  >(defaultSelectedRowKeys);
  const [internalFilter, setInternalFilter] = useState(
    defaultFilterValue ?? "",
  );
  const [internalPage, setInternalPage] = useState(defaultPage);
  const [internalVisibleColumnKeys, setInternalVisibleColumnKeys] = useState<
    Array<keyof T>
  >(defaultVisibleColumnKeys ?? columns.map((column) => column.key));
  const [internalColumnOrder, setInternalColumnOrder] = useState<
    Array<keyof T>
  >(defaultColumnOrder ?? columns.map((column) => column.key));
  const [internalColumnWidths, setInternalColumnWidths] =
    useState<Partial<Record<keyof T, string>>>(defaultColumnWidths);
  const [internalPinnedColumnKeys, setInternalPinnedColumnKeys] = useState<
    Array<keyof T>
  >(defaultPinnedColumnKeys);
  const [internalExpandedRowKeys, setInternalExpandedRowKeys] = useState<
    Array<string | number>
  >(defaultExpandedRowKeys);
  const [editingCell, setEditingCell] = useState<{
    rowKey: string | number;
    columnKey: keyof T;
  } | null>(null);
  const [scrollTop, setScrollTop] = useState(0);

  const captionId = `${testId}-caption`;
  const liveRegionId = `${testId}-live-region`;

  const computedAriaDescribedBy = [
    ariaDescribedBy,
    caption ? captionId : undefined,
    liveRegionId,
  ]
    .filter(Boolean)
    .join(" ");

  const selectedKeys = selectedRowKeys ?? internalSelectedKeys;
  const filterQuery = filterValue ?? internalFilter;
  const page = currentPage ?? internalPage;
  const resolvedVisibleColumnKeys =
    visibleColumnKeys ?? internalVisibleColumnKeys;
  const resolvedColumnOrder = columnOrder ?? internalColumnOrder;
  const resolvedColumnWidths = columnWidths ?? internalColumnWidths;
  const resolvedPinnedColumnKeys = pinnedColumnKeys ?? internalPinnedColumnKeys;
  const resolvedExpandedRowKeys = expandedRowKeys ?? internalExpandedRowKeys;

  const getResolvedRowKey = (row: T, index: number): string | number =>
    rowKey ? rowKey(row) : index;

  const orderedColumns = useMemo(() => {
    const byKey = new Map(columns.map((column) => [column.key, column]));
    const ordered = resolvedColumnOrder
      .map((key) => byKey.get(key))
      .filter((column): column is Column<T> => Boolean(column));
    const missing = columns.filter(
      (column) => !resolvedColumnOrder.includes(column.key),
    );
    const nextColumns = [...ordered, ...missing];

    if (!columnVisibility) return nextColumns;
    return nextColumns.filter((column) =>
      resolvedVisibleColumnKeys.includes(column.key),
    );
  }, [
    columns,
    columnVisibility,
    resolvedColumnOrder,
    resolvedVisibleColumnKeys,
  ]);

  const pinnedColumns = orderedColumns.filter((column) =>
    resolvedPinnedColumnKeys.includes(column.key),
  );
  const visibleColumns = [
    ...pinnedColumns,
    ...orderedColumns.filter(
      (column) => !resolvedPinnedColumnKeys.includes(column.key),
    ),
  ];

  const filteredData = useMemo(() => {
    if (!filterable || !filterQuery.trim()) return data;

    const query = filterQuery.toLowerCase();
    return data.filter((row) =>
      columns.some((column) => {
        const value = row[column.key];
        return String(value ?? "")
          .toLowerCase()
          .includes(query);
      }),
    );
  }, [columns, data, filterable, filterQuery]);

  const sortedData = useMemo(() => {
    if (serverSort || !sortKey) return filteredData;

    return [...filteredData].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];

      if (valA === valB) return 0;
      if (valA == null) return 1;
      if (valB == null) return -1;

      const numA = Number(valA);
      const numB = Number(valB);
      const bothNumeric = !Number.isNaN(numA) && !Number.isNaN(numB);

      if (bothNumeric) {
        return sortOrder === "asc" ? numA - numB : numB - numA;
      }

      const cmp = String(valA).localeCompare(String(valB), undefined, {
        numeric: true,
      });

      return sortOrder === "asc" ? cmp : -cmp;
    });
  }, [filteredData, sortKey, sortOrder, serverSort]);

  const totalRows = totalItems ?? sortedData.length;
  const perPage = Math.max(1, itemsPerPage);
  const pageCount = Math.max(1, Math.ceil(totalRows / perPage));
  const clampedPage = Math.min(Math.max(1, page), pageCount);
  const pageOffset = (clampedPage - 1) * perPage;

  const paginatedData = useMemo(() => {
    if (!pagination || serverPagination) return sortedData;
    return sortedData.slice(pageOffset, pageOffset + perPage);
  }, [pageOffset, pagination, perPage, serverPagination, sortedData]);

  const virtualStartIndex = virtualized
    ? Math.max(0, Math.floor(scrollTop / virtualRowHeight) - virtualOverscan)
    : 0;
  const virtualVisibleCount = virtualized
    ? Math.ceil(virtualViewportHeight / virtualRowHeight) + virtualOverscan * 2
    : paginatedData.length;
  const virtualEndIndex = virtualized
    ? Math.min(paginatedData.length, virtualStartIndex + virtualVisibleCount)
    : paginatedData.length;
  const renderedData = virtualized
    ? paginatedData.slice(virtualStartIndex, virtualEndIndex)
    : paginatedData;
  const virtualTopSpacer = virtualized
    ? virtualStartIndex * virtualRowHeight
    : 0;
  const virtualBottomSpacer = virtualized
    ? Math.max(0, (paginatedData.length - virtualEndIndex) * virtualRowHeight)
    : 0;

  const selectedRows = sortedData.filter((row, index) =>
    selectedKeys.includes(getResolvedRowKey(row, index)),
  );

  const updateSelection = (nextKeys: Array<string | number>) => {
    if (!selectedRowKeys) {
      setInternalSelectedKeys(nextKeys);
    }

    const nextRows = sortedData.filter((row, index) =>
      nextKeys.includes(getResolvedRowKey(row, index)),
    );
    onSelectionChange?.(nextKeys, nextRows);
  };

  const handleFilterChange = (value: string) => {
    if (filterValue === undefined) {
      setInternalFilter(value);
      setInternalPage(1);
    }
    onFilterChange?.(value);
  };

  const goToPage = (nextPage: number) => {
    const next = Math.min(Math.max(1, nextPage), pageCount);
    if (currentPage === undefined) {
      setInternalPage(next);
    }
    onPageChange?.(next, {
      page: next,
      itemsPerPage: perPage,
      offset: (next - 1) * perPage,
      pageCount,
    });
  };

  const allVisibleKeys = selectableRows
    ? renderedData.map((row, index) =>
        getResolvedRowKey(row, virtualStartIndex + index),
      )
    : [];
  const allVisibleSelected =
    allVisibleKeys.length > 0 &&
    allVisibleKeys.every((key) => selectedKeys.includes(key));

  const toggleAllRows = () => {
    if (allVisibleSelected) {
      updateSelection(
        selectedKeys.filter((key) => !allVisibleKeys.includes(key)),
      );
      return;
    }

    updateSelection(Array.from(new Set([...selectedKeys, ...allVisibleKeys])));
  };

  const toggleRow = (row: T, index: number) => {
    const key = getResolvedRowKey(row, index);
    updateSelection(
      selectedKeys.includes(key)
        ? selectedKeys.filter((selectedKey) => selectedKey !== key)
        : [...selectedKeys, key],
    );
  };

  const toggleExpandedRow = (row: T, index: number) => {
    const key = getResolvedRowKey(row, index);
    const nextKeys = resolvedExpandedRowKeys.includes(key)
      ? resolvedExpandedRowKeys.filter((expandedKey) => expandedKey !== key)
      : [...resolvedExpandedRowKeys, key];

    if (!expandedRowKeys) setInternalExpandedRowKeys(nextKeys);
    onExpandedRowsChange?.(
      nextKeys,
      sortedData.filter((candidate, candidateIndex) =>
        nextKeys.includes(getResolvedRowKey(candidate, candidateIndex)),
      ),
    );
  };

  const announceSortChange = useCallback(
    (column: Column<T>, nextOrder: "asc" | "desc"): void => {
      const message = getSortAnnouncement
        ? getSortAnnouncement(column, nextOrder)
        : `${column.label} sorted ${nextOrder === "asc" ? "ascending" : "descending"}`;

      setSortAnnouncement(message);
    },
    [getSortAnnouncement],
  );

  const handleSort = (column: Column<T>): void => {
    const nextOrder =
      column.key === sortKey && sortOrder === "asc" ? "desc" : "asc";

    setSortKey(column.key);
    setSortOrder(nextOrder);
    announceSortChange(column, nextOrder);

    if (serverSort && onSortChange) {
      onSortChange(column.key, nextOrder);
    }
  };

  const handleSortKeyDown =
    (column: Column<T>) =>
    (e: KeyboardEvent<HTMLButtonElement>): void => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleSort(column);
      }
    };

  const handleRowKeyDown =
    (row: T) =>
    (e: KeyboardEvent<HTMLTableRowElement>): void => {
      if (!onRowClick) return;

      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onRowClick(row);
      }
    };

  const updateColumnOrder = (nextOrder: Array<keyof T>) => {
    if (!columnOrder) setInternalColumnOrder(nextOrder);
    onColumnOrderChange?.(nextOrder);
  };

  const moveColumn = (columnKey: keyof T, direction: -1 | 1) => {
    const currentOrder = visibleColumns.map((column) => column.key);
    const index = currentOrder.indexOf(columnKey);
    const nextIndex = index + direction;
    if (index < 0 || nextIndex < 0 || nextIndex >= currentOrder.length) return;

    const nextVisibleOrder = [...currentOrder];
    [nextVisibleOrder[index], nextVisibleOrder[nextIndex]] = [
      nextVisibleOrder[nextIndex],
      nextVisibleOrder[index],
    ];
    const hiddenKeys = columns
      .map((column) => column.key)
      .filter((key) => !nextVisibleOrder.includes(key));

    updateColumnOrder([...nextVisibleOrder, ...hiddenKeys]);
  };

  const updateVisibleColumns = (key: keyof T, checked: boolean) => {
    const nextKeys = checked
      ? [...resolvedVisibleColumnKeys, key]
      : resolvedVisibleColumnKeys.filter((columnKey) => columnKey !== key);

    if (!visibleColumnKeys) setInternalVisibleColumnKeys(nextKeys);
    onColumnVisibilityChange?.(nextKeys);
  };

  const resizeColumn = (column: Column<T>, delta: number) => {
    const currentWidth =
      resolvedColumnWidths[column.key] ?? column.width ?? column.minWidth;
    const nextWidth = `${Math.max(64, parsePixelWidth(currentWidth) + delta)}px`;
    const nextWidths = { ...resolvedColumnWidths, [column.key]: nextWidth };

    if (!columnWidths) setInternalColumnWidths(nextWidths);
    onColumnWidthsChange?.(nextWidths);
  };

  const togglePinnedColumn = (key: keyof T) => {
    const nextKeys = resolvedPinnedColumnKeys.includes(key)
      ? resolvedPinnedColumnKeys.filter((columnKey) => columnKey !== key)
      : [...resolvedPinnedColumnKeys, key];

    if (!pinnedColumnKeys) setInternalPinnedColumnKeys(nextKeys);
    onPinnedColumnKeysChange?.(nextKeys);
  };

  const getColumnStyle = (column: Column<T>, index: number): CSSProperties => {
    const isPinned = resolvedPinnedColumnKeys.includes(column.key);
    const priorPinnedWidth = visibleColumns
      .slice(0, index)
      .filter((candidate) => resolvedPinnedColumnKeys.includes(candidate.key))
      .reduce(
        (width, candidate) =>
          width +
          parsePixelWidth(
            resolvedColumnWidths[candidate.key] ??
              candidate.width ??
              candidate.minWidth,
            160,
          ),
        selectableRows ? 48 : renderExpandedRow ? 48 : 0,
      );

    return {
      width: resolvedColumnWidths[column.key] ?? column.width,
      minWidth: column.minWidth,
      maxWidth: column.maxWidth,
      left: isPinned ? priorPinnedWidth : undefined,
    };
  };

  const getRowClassName = (row: T, index: number): string | undefined => {
    if (typeof rowClassName === "function") {
      return rowClassName(row, index);
    }

    return rowClassName;
  };

  const getCellClassName = (
    value: unknown,
    row: T,
    column: Column<T>,
    rowIndex: number,
  ): string | undefined => {
    return cellClassName?.(value, row, column, rowIndex);
  };

  const getHeaderScope = (column: Column<T>): "col" | "colgroup" =>
    column.scope ?? "col";

  const getHeaderId = (column: Column<T>): string =>
    column.id ?? `${testId}-header-${String(column.key)}`;

  const getColumnAriaLabel = (
    column: Column<T>,
    isActive: boolean,
  ): string | undefined => {
    if (!column.sortable) {
      return column.srLabel;
    }

    if (getSortAriaLabel) {
      return getSortAriaLabel(column, sortOrder, isActive);
    }

    const baseLabel = column.srLabel ?? column.label;

    if (isActive) {
      return `${baseLabel}, sorted ${sortOrder === "asc" ? "ascending" : "descending"}. Activate to sort ${sortOrder === "asc" ? "descending" : "ascending"}.`;
    }

    return `${baseLabel}. Activate to sort ascending.`;
  };

  const renderCellContent = (row: T, column: Column<T>): React.ReactNode => {
    const value = row[column.key];

    if (column.render) {
      return column.render(value, row);
    }

    if (typeof value === "object" && value !== null) {
      return JSON.stringify(value);
    }

    return String(value ?? "");
  };

  const commitCellEdit = (
    row: T,
    rowIndex: number,
    column: Column<T>,
    value: unknown,
  ) => {
    onCellEdit?.(value, {
      row,
      rowIndex,
      column,
      rowKey: getResolvedRowKey(row, rowIndex),
    });
    setEditingCell(null);
  };

  useEffect(() => {
    if (!sortKey) {
      setSortAnnouncement("");
      return;
    }

    const activeColumn = columns.find((column) => column.key === sortKey);
    if (!activeColumn) return;

    announceSortChange(activeColumn, sortOrder);
  }, [announceSortChange, columns, sortKey, sortOrder]);

  useEffect(() => {
    if (page > pageCount && currentPage === undefined) {
      setInternalPage(pageCount);
    }
  }, [currentPage, page, pageCount]);

  const tableClass = useMemo(
    () =>
      combineClassNames(
        classMap.table,
        classMap[theme],
        state && classMap[state],
        outline && classMap.outline,
        glass && classMap.glass,
        tableClassName,
      ),
    [classMap, theme, state, outline, glass, tableClassName],
  );

  const wrapperClass = useMemo(
    () =>
      combineClassNames(
        classMap.wrapper,
        classMap[theme],
        state && classMap[state],
        glass && classMap.glass,
        shadow && classMap[`shadow${capitalize(shadow)}`],
        rounding && classMap[`round${capitalize(rounding)}`],
        striped && classMap.striped,
        virtualized && classMap.virtualized,
        className,
      ),
    [
      classMap,
      theme,
      state,
      glass,
      shadow,
      rounding,
      striped,
      virtualized,
      className,
    ],
  );

  const controlColumnCount =
    (selectableRows ? 1 : 0) + (renderExpandedRow ? 1 : 0);
  const colSpan = visibleColumns.length + controlColumnCount;
  const hasToolbar =
    toolbarTitle ||
    toolbarActions ||
    filterable ||
    columnVisibility ||
    bulkActions;

  const renderPagination = () => {
    if (!pagination) return null;

    return (
      <nav
        className={combineClassNames(classMap.pagination, paginationClassName)}
        aria-label="Table pagination"
        data-testid={`${testId}-pagination`}
      >
        <button
          type="button"
          className={classMap.paginationButton}
          disabled={clampedPage <= 1}
          onClick={() => goToPage(clampedPage - 1)}
          data-testid={`${testId}-pagination-prev`}
        >
          Previous
        </button>
        <span
          className={classMap.paginationStatus}
          aria-live="polite"
          data-testid={`${testId}-pagination-status`}
        >
          Page {clampedPage} of {pageCount}
        </span>
        <button
          type="button"
          className={classMap.paginationButton}
          disabled={clampedPage >= pageCount}
          onClick={() => goToPage(clampedPage + 1)}
          data-testid={`${testId}-pagination-next`}
        >
          Next
        </button>
      </nav>
    );
  };

  return (
    <div
      className={wrapperClass}
      data-testid={testId}
      role="region"
      aria-label="Data table"
    >
      <div className={classMap.scrollArea}>
        {hasToolbar ? (
          <div
            className={combineClassNames(classMap.toolbar, toolbarClassName)}
            data-testid={`${testId}-toolbar`}
          >
            {toolbarTitle ? (
              <div className={classMap.toolbarTitle}>{toolbarTitle}</div>
            ) : null}
            {filterable ? (
              <input
                type="search"
                value={filterQuery}
                placeholder={filterPlaceholder}
                aria-label={filterAriaLabel}
                onChange={(event) => handleFilterChange(event.target.value)}
                className={combineClassNames(
                  classMap.filterInput,
                  filterInputClassName,
                )}
                data-testid={`${testId}-filter`}
              />
            ) : null}
            {columnVisibility ? (
              <details
                className={combineClassNames(
                  classMap.columnMenu,
                  columnMenuClassName,
                )}
                data-testid={`${testId}-column-menu`}
              >
                <summary className={classMap.columnMenuTrigger}>
                  Columns
                </summary>
                <div className={classMap.columnMenuPanel}>
                  {columns.map((column) => {
                    const checked = resolvedVisibleColumnKeys.includes(
                      column.key,
                    );
                    const wouldHideLast =
                      checked && resolvedVisibleColumnKeys.length <= 1;

                    return (
                      <label
                        key={String(column.key)}
                        className={classMap.columnMenuItem}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={wouldHideLast}
                          onChange={(event) =>
                            updateVisibleColumns(
                              column.key,
                              event.target.checked,
                            )
                          }
                          data-testid={`${testId}-toggle-column-${String(
                            column.key,
                          )}`}
                        />
                        <span>{column.label}</span>
                      </label>
                    );
                  })}
                </div>
              </details>
            ) : null}
            {toolbarActions ? (
              <div className={classMap.toolbarActions}>{toolbarActions}</div>
            ) : null}
          </div>
        ) : null}

        {bulkActions && selectedKeys.length > 0 ? (
          <div
            className={combineClassNames(
              classMap.bulkToolbar,
              bulkToolbarClassName,
            )}
            data-testid={`${testId}-bulk-toolbar`}
          >
            <span>{selectedKeys.length} selected</span>
            <div className={classMap.toolbarActions}>
              {bulkActions(selectedKeys, selectedRows)}
            </div>
          </div>
        ) : null}

        <div
          id={liveRegionId}
          className={classMap.srOnly ?? "sr_only"}
          aria-live="polite"
          aria-atomic="true"
        >
          {loading ? loadingMessage : sortAnnouncement}
        </div>

        <div
          className={classMap.viewport}
          style={
            virtualized
              ? { maxHeight: virtualViewportHeight, overflowY: "auto" }
              : undefined
          }
          onScroll={
            virtualized
              ? (event) => setScrollTop(event.currentTarget.scrollTop)
              : undefined
          }
          data-testid={virtualized ? `${testId}-virtual-viewport` : undefined}
        >
          <table
            className={tableClass}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            aria-describedby={computedAriaDescribedBy || undefined}
            aria-colcount={colCount ?? colSpan}
            aria-rowcount={rowCount ?? totalRows}
          >
            {caption ? (
              <caption
                id={captionId}
                className={
                  hideCaption ? (classMap.srOnly ?? "sr_only") : undefined
                }
              >
                {caption}
              </caption>
            ) : null}

            <thead className={theadClassName}>
              <tr>
                {renderExpandedRow ? (
                  <th scope="col" className={classMap.selectionCell}>
                    <span className={classMap.srOnly ?? "sr_only"}>
                      Expand row
                    </span>
                  </th>
                ) : null}
                {selectableRows ? (
                  <th scope="col" className={classMap.selectionCell}>
                    <input
                      type="checkbox"
                      aria-label={selectAllAriaLabel}
                      checked={allVisibleSelected}
                      onChange={toggleAllRows}
                      data-testid={`${testId}-select-all`}
                    />
                  </th>
                ) : null}
                {visibleColumns.map((column, columnIndex) => {
                  const isActive = sortKey === column.key;
                  const isPinned = resolvedPinnedColumnKeys.includes(
                    column.key,
                  );

                  return (
                    <th
                      key={String(column.key)}
                      id={getHeaderId(column)}
                      scope={getHeaderScope(column)}
                      style={getColumnStyle(column, columnIndex)}
                      aria-sort={
                        column.sortable
                          ? isActive
                            ? sortOrder === "asc"
                              ? "ascending"
                              : "descending"
                            : "none"
                          : undefined
                      }
                      className={combineClassNames(
                        column.sortable && classMap.sortable,
                        classMap.headerCell,
                        isPinned && classMap.pinnedCell,
                        (column.wrap ?? wrapCells) && classMap.wrapCell,
                        column.headerClassName,
                      )}
                    >
                      <div className={classMap.headerContent}>
                        {column.sortable ? (
                          <button
                            type="button"
                            className={combineClassNames(
                              classMap.sortButton,
                              column.sortButtonClassName,
                            )}
                            onClick={() => handleSort(column)}
                            onKeyDown={handleSortKeyDown(column)}
                            aria-label={getColumnAriaLabel(column, isActive)}
                            data-testid={`${testId}-sort-${String(column.key)}`}
                          >
                            <span>{column.label}</span>
                            <span
                              className={classMap.sortIcon}
                              aria-hidden="true"
                            >
                              {isActive
                                ? sortOrder === "asc"
                                  ? "▲"
                                  : "▼"
                                : "⇅"}
                            </span>
                          </button>
                        ) : (
                          <span aria-label={column.srLabel}>
                            {column.label}
                          </span>
                        )}
                        {columnReorder || columnResize || columnPinning ? (
                          <span className={classMap.columnControls}>
                            {columnReorder ? (
                              <>
                                <button
                                  type="button"
                                  className={classMap.columnControlButton}
                                  disabled={columnIndex === 0}
                                  onClick={() => moveColumn(column.key, -1)}
                                  aria-label={`Move ${column.label} column left`}
                                  data-testid={`${testId}-move-${String(
                                    column.key,
                                  )}-left`}
                                >
                                  ‹
                                </button>
                                <button
                                  type="button"
                                  className={classMap.columnControlButton}
                                  disabled={
                                    columnIndex === visibleColumns.length - 1
                                  }
                                  onClick={() => moveColumn(column.key, 1)}
                                  aria-label={`Move ${column.label} column right`}
                                  data-testid={`${testId}-move-${String(
                                    column.key,
                                  )}-right`}
                                >
                                  ›
                                </button>
                              </>
                            ) : null}
                            {columnResize ? (
                              <>
                                <button
                                  type="button"
                                  className={classMap.columnControlButton}
                                  onClick={() => resizeColumn(column, -24)}
                                  aria-label={`Resize ${column.label} column narrower`}
                                  data-testid={`${testId}-resize-${String(
                                    column.key,
                                  )}-narrower`}
                                >
                                  −
                                </button>
                                <button
                                  type="button"
                                  className={classMap.columnControlButton}
                                  onClick={() => resizeColumn(column, 24)}
                                  aria-label={`Resize ${column.label} column wider`}
                                  data-testid={`${testId}-resize-${String(
                                    column.key,
                                  )}-wider`}
                                >
                                  +
                                </button>
                              </>
                            ) : null}
                            {columnPinning ? (
                              <button
                                type="button"
                                className={classMap.columnControlButton}
                                aria-pressed={isPinned}
                                onClick={() => togglePinnedColumn(column.key)}
                                aria-label={`${isPinned ? "Unpin" : "Pin"} ${column.label} column`}
                                data-testid={`${testId}-pin-${String(column.key)}`}
                              >
                                ⌖
                              </button>
                            ) : null}
                          </span>
                        ) : null}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody className={tbodyClassName}>
              {loading ? (
                <tr>
                  <td
                    className={classMap.emptyCell}
                    colSpan={colSpan}
                    aria-live="polite"
                  >
                    {loadingMessage}
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td
                    className={classMap.emptyCell}
                    colSpan={colSpan}
                    aria-live="polite"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                <>
                  {virtualTopSpacer > 0 ? (
                    <tr
                      aria-hidden="true"
                      data-testid={`${testId}-virtual-top`}
                    >
                      <td
                        style={{ height: virtualTopSpacer, padding: 0 }}
                        colSpan={colSpan}
                      />
                    </tr>
                  ) : null}
                  {renderedData.map((row, visibleIndex) => {
                    const index = virtualStartIndex + visibleIndex;
                    const absoluteIndex = serverPagination
                      ? index
                      : pageOffset + index;
                    const key = getResolvedRowKey(row, absoluteIndex);
                    const rowAriaLabel = getRowAriaLabel?.(row, absoluteIndex);
                    const rowAriaDescription = getRowAriaDescription?.(
                      row,
                      absoluteIndex,
                    );
                    const expanded = resolvedExpandedRowKeys.includes(key);

                    return (
                      <Fragment key={key}>
                        <tr
                          key={key}
                          className={combineClassNames(
                            onRowClick && classMap.clickable,
                            striped &&
                              absoluteIndex % 2 === 1 &&
                              classMap.striped,
                            getRowClassName(row, absoluteIndex),
                          )}
                          onClick={() => onRowClick?.(row)}
                          onKeyDown={handleRowKeyDown(row)}
                          tabIndex={onRowClick ? 0 : undefined}
                          aria-label={onRowClick ? rowAriaLabel : undefined}
                          aria-description={
                            onRowClick ? rowAriaDescription : undefined
                          }
                          data-testid={`${testId}-row-${key}`}
                        >
                          {renderExpandedRow ? (
                            <td className={classMap.selectionCell}>
                              <button
                                type="button"
                                className={classMap.expandButton}
                                aria-expanded={expanded}
                                aria-label={`${expanded ? "Collapse" : "Expand"} row ${absoluteIndex + 1}`}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  toggleExpandedRow(row, absoluteIndex);
                                }}
                                data-testid={`${testId}-expand-row-${key}`}
                              >
                                {expanded ? "−" : "+"}
                              </button>
                            </td>
                          ) : null}
                          {selectableRows ? (
                            <td className={classMap.selectionCell}>
                              <input
                                type="checkbox"
                                aria-label={
                                  getRowSelectAriaLabel?.(row, absoluteIndex) ??
                                  `Select row ${absoluteIndex + 1}`
                                }
                                checked={selectedKeys.includes(key)}
                                onChange={(event) => {
                                  event.stopPropagation();
                                  toggleRow(row, absoluteIndex);
                                }}
                                onClick={(event) => event.stopPropagation()}
                                data-testid={`${testId}-select-row-${key}`}
                              />
                            </td>
                          ) : null}
                          {visibleColumns.map((column, columnIndex) => {
                            const cellKey = String(column.key);
                            const value = row[column.key];
                            const content = renderCellContent(row, column);
                            const headerId = getHeaderId(column);
                            const shouldWrap = column.wrap ?? wrapCells;
                            const isPinned = resolvedPinnedColumnKeys.includes(
                              column.key,
                            );
                            const isEditing =
                              editingCell?.rowKey === key &&
                              editingCell.columnKey === column.key;

                            const resolvedCellClassName = combineClassNames(
                              classMap.cell,
                              isPinned && classMap.pinnedCell,
                              column.editable && classMap.editableCell,
                              shouldWrap && classMap.wrapCell,
                              column.cellClassName,
                              getCellClassName(
                                value,
                                row,
                                column,
                                absoluteIndex,
                              ),
                            );

                            const cellContent =
                              column.editable && isEditing ? (
                                column.renderEditor ? (
                                  column.renderEditor({
                                    value,
                                    row,
                                    rowIndex: absoluteIndex,
                                    column,
                                    commit: (nextValue) =>
                                      commitCellEdit(
                                        row,
                                        absoluteIndex,
                                        column,
                                        nextValue,
                                      ),
                                    cancel: () => setEditingCell(null),
                                  })
                                ) : (
                                  <input
                                    className={classMap.cellEditor}
                                    defaultValue={String(value ?? "")}
                                    type={column.editInputType ?? "text"}
                                    ref={(input) => input?.focus()}
                                    aria-label={
                                      column.getEditAriaLabel?.(
                                        row,
                                        value,
                                        absoluteIndex,
                                      ) ?? `Edit ${column.label}`
                                    }
                                    onClick={(event) => event.stopPropagation()}
                                    onKeyDown={(event) => {
                                      if (event.key === "Enter") {
                                        commitCellEdit(
                                          row,
                                          absoluteIndex,
                                          column,
                                          event.currentTarget.value,
                                        );
                                      }
                                      if (event.key === "Escape") {
                                        setEditingCell(null);
                                      }
                                    }}
                                    onBlur={(event) =>
                                      commitCellEdit(
                                        row,
                                        absoluteIndex,
                                        column,
                                        event.currentTarget.value,
                                      )
                                    }
                                    data-testid={`${testId}-editor-${key}-${cellKey}`}
                                  />
                                )
                              ) : column.editable ? (
                                <button
                                  type="button"
                                  className={classMap.editButton}
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    setEditingCell({
                                      rowKey: key,
                                      columnKey: column.key,
                                    });
                                  }}
                                  data-testid={`${testId}-edit-${key}-${cellKey}`}
                                >
                                  {content}
                                </button>
                              ) : (
                                content
                              );

                            if (column.isRowHeader) {
                              return (
                                <th
                                  key={cellKey}
                                  scope="row"
                                  headers={headerId}
                                  data-label={column.label}
                                  style={getColumnStyle(column, columnIndex)}
                                  className={combineClassNames(
                                    resolvedCellClassName,
                                    column.rowHeaderClassName,
                                  )}
                                >
                                  {cellContent}
                                </th>
                              );
                            }

                            return (
                              <td
                                key={cellKey}
                                headers={headerId}
                                data-label={column.label}
                                style={getColumnStyle(column, columnIndex)}
                                className={resolvedCellClassName}
                              >
                                {cellContent}
                              </td>
                            );
                          })}
                        </tr>
                        {renderExpandedRow && expanded ? (
                          <tr
                            key={`${key}-expanded`}
                            className={classMap.expandedRow}
                            data-testid={`${testId}-expanded-row-${key}`}
                          >
                            <td
                              className={classMap.expandedCell}
                              colSpan={colSpan}
                            >
                              {renderExpandedRow(row, absoluteIndex)}
                            </td>
                          </tr>
                        ) : null}
                      </Fragment>
                    );
                  })}
                  {virtualBottomSpacer > 0 ? (
                    <tr
                      aria-hidden="true"
                      data-testid={`${testId}-virtual-bottom`}
                    >
                      <td
                        style={{ height: virtualBottomSpacer, padding: 0 }}
                        colSpan={colSpan}
                      />
                    </tr>
                  ) : null}
                </>
              )}
            </tbody>
          </table>
        </div>

        {renderPagination()}
      </div>
    </div>
  );
}

DataTableBase.displayName = "DataTableBase";
export default DataTableBase;
