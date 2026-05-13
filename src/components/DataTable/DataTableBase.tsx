import { useEffect, useMemo, useState, KeyboardEvent } from "react";
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
  defaultFilterValue = "",
  onFilterChange,
  filterPlaceholder = "Filter table",
  filterAriaLabel = "Filter table rows",
  toolbarTitle,
  toolbarActions,
  toolbarClassName,
  filterInputClassName,
  classMap,
  theme = getDefaultTheme(),
  rounding = getDefaultRounding(),
  shadow = getDefaultShadow(),
  state = "",
  outline = getDefaultOutline(),
  glass = getDefaultGlass(),
  className = "",
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
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  "data-testid": dataTestId,
  testId = dataTestId ?? "data-table",
}: DataTableBaseProps<T>) {
  const [sortKey, setSortKey] = useState<keyof T | undefined>(defaultSortKey);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(defaultSortOrder);
  const [sortAnnouncement, setSortAnnouncement] = useState("");
  const [internalSelectedKeys, setInternalSelectedKeys] = useState<Array<string | number>>(
    defaultSelectedRowKeys,
  );
  const [internalFilter, setInternalFilter] = useState(defaultFilterValue);

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

  const getResolvedRowKey = (row: T, index: number): string | number =>
    rowKey ? rowKey(row) : index;

  const filteredData = useMemo(() => {
    if (!filterable || !filterQuery.trim()) return data;

    const query = filterQuery.toLowerCase();
    return data.filter((row) =>
      columns.some((column) => {
        const value = row[column.key];
        return String(value ?? "").toLowerCase().includes(query);
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
    }
    onFilterChange?.(value);
  };

  const allVisibleKeys = selectableRows
    ? sortedData.map((row, index) => getResolvedRowKey(row, index))
    : [];
  const allVisibleSelected =
    allVisibleKeys.length > 0 &&
    allVisibleKeys.every((key) => selectedKeys.includes(key));

  const toggleAllRows = () => {
    if (allVisibleSelected) {
      updateSelection(selectedKeys.filter((key) => !allVisibleKeys.includes(key)));
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

  const announceSortChange = (
    column: Column<T>,
    nextOrder: "asc" | "desc",
  ): void => {
    const message = getSortAnnouncement
      ? getSortAnnouncement(column, nextOrder)
      : `${column.label} sorted ${nextOrder === "asc" ? "ascending" : "descending"}`;

    setSortAnnouncement(message);
  };

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

  const getColumnStyle = (column: Column<T>): React.CSSProperties => ({
    width: column.width,
    minWidth: column.minWidth,
    maxWidth: column.maxWidth,
  });

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

  useEffect(() => {
    if (!sortKey) {
      setSortAnnouncement("");
      return;
    }

    const activeColumn = columns.find((column) => column.key === sortKey);
    if (!activeColumn) return;

    announceSortChange(activeColumn, sortOrder);
  }, []);

  const tableClass = useMemo(
    () =>
      combineClassNames(
        classMap.table,
        classMap[theme],
        classMap[state],
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
        classMap[state],
        glass && classMap.glass,
        shadow && classMap[`shadow${capitalize(shadow)}`],
        rounding && classMap[`round${capitalize(rounding)}`],
        striped && classMap.striped,
        className,
      ),
    [classMap, theme, state, glass, shadow, rounding, striped, className],
  );

  return (
    <div className={wrapperClass} data-testid={testId} tabIndex={0}>
      {toolbarTitle || toolbarActions || filterable ? (
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
          {toolbarActions ? (
            <div className={classMap.toolbarActions}>{toolbarActions}</div>
          ) : null}
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

      <table
        className={tableClass}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={computedAriaDescribedBy || undefined}
        aria-colcount={colCount}
        aria-rowcount={rowCount}
      >
        {caption ? (
          <caption
            id={captionId}
            className={hideCaption ? (classMap.srOnly ?? "sr_only") : undefined}
          >
            {caption}
          </caption>
        ) : null}

        <thead className={theadClassName}>
          <tr>
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
            {columns.map((column) => {
              const isActive = sortKey === column.key;

              return (
                <th
                  key={String(column.key)}
                  id={getHeaderId(column)}
                  scope={getHeaderScope(column)}
                  style={getColumnStyle(column)}
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
                    (column.wrap ?? wrapCells) && classMap.wrapCell,
                    column.headerClassName,
                  )}
                >
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
                      <span className={classMap.sortIcon} aria-hidden="true">
                        {isActive ? (sortOrder === "asc" ? "▲" : "▼") : "⇅"}
                      </span>
                    </button>
                  ) : (
                    <span aria-label={column.srLabel}>{column.label}</span>
                  )}
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
                colSpan={columns.length + (selectableRows ? 1 : 0)}
                aria-live="polite"
              >
                {loadingMessage}
              </td>
            </tr>
          ) : sortedData.length === 0 ? (
            <tr>
              <td
                className={classMap.emptyCell}
                colSpan={columns.length + (selectableRows ? 1 : 0)}
                aria-live="polite"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sortedData.map((row, index) => {
              const key = getResolvedRowKey(row, index);
              const rowAriaLabel = getRowAriaLabel?.(row, index);
              const rowAriaDescription = getRowAriaDescription?.(row, index);

              return (
                <tr
                  key={key}
                  className={combineClassNames(
                    onRowClick && classMap.clickable,
                    striped && index % 2 === 1 && classMap.striped,
                    getRowClassName(row, index),
                  )}
                  onClick={() => onRowClick?.(row)}
                  onKeyDown={handleRowKeyDown(row)}
                  tabIndex={onRowClick ? 0 : undefined}
                  aria-label={onRowClick ? rowAriaLabel : undefined}
                  aria-description={onRowClick ? rowAriaDescription : undefined}
                  data-testid={`${testId}-row-${key}`}
                >
                  {selectableRows ? (
                    <td className={classMap.selectionCell}>
                      <input
                        type="checkbox"
                        aria-label={
                          getRowSelectAriaLabel?.(row, index) ??
                          `Select row ${index + 1}`
                        }
                        checked={selectedKeys.includes(key)}
                        onChange={(event) => {
                          event.stopPropagation();
                          toggleRow(row, index);
                        }}
                        onClick={(event) => event.stopPropagation()}
                        data-testid={`${testId}-select-row-${key}`}
                      />
                    </td>
                  ) : null}
                  {columns.map((column) => {
                    const cellKey = String(column.key);
                    const value = row[column.key];
                    const content = renderCellContent(row, column);
                    const headerId = getHeaderId(column);
                    const shouldWrap = column.wrap ?? wrapCells;

                    const resolvedCellClassName = combineClassNames(
                      classMap.cell,
                      shouldWrap && classMap.wrapCell,
                      column.cellClassName,
                      getCellClassName(value, row, column, index),
                    );

                    if (column.isRowHeader) {
                      return (
                        <th
                          key={cellKey}
                          scope="row"
                          headers={headerId}
                          data-label={column.label}
                          style={getColumnStyle(column)}
                          className={combineClassNames(
                            resolvedCellClassName,
                            column.rowHeaderClassName,
                          )}
                        >
                          {content}
                        </th>
                      );
                    }

                    return (
                      <td
                        key={cellKey}
                        headers={headerId}
                        data-label={column.label}
                        style={getColumnStyle(column)}
                        className={resolvedCellClassName}
                      >
                        {content}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

DataTableBase.displayName = "DataTableBase";
export default DataTableBase;
