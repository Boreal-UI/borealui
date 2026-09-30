import type { Column } from "./DataTable.types";

export type ResolvedRow<T> = {
  row: T;
  sourceIndex: number;
  key: string | number;
};

export type DataTablePagination = {
  perPage: number;
  pageCount: number;
  clampedPage: number;
  pageOffset: number;
};

export function resolveRows<T>(
  data: readonly T[],
  rowKey?: (row: T) => string | number,
): ResolvedRow<T>[] {
  return data.map((row, sourceIndex) => ({
    row,
    sourceIndex,
    key: rowKey ? rowKey(row) : sourceIndex,
  }));
}

export function findDuplicateRowKeys<T>(
  rows: readonly ResolvedRow<T>[],
): Array<string | number> {
  const seen = new Set<string | number>();
  const duplicates = new Set<string | number>();

  rows.forEach(({ key }) => {
    if (seen.has(key)) duplicates.add(key);
    seen.add(key);
  });

  return Array.from(duplicates);
}

export function filterRows<T extends object>(
  rows: readonly ResolvedRow<T>[],
  columns: readonly Column<T>[],
  filterable: boolean,
  filterQuery: string,
): readonly ResolvedRow<T>[] {
  if (!filterable || !filterQuery.trim()) return rows;

  const query = filterQuery.toLowerCase();
  return rows.filter(({ row }) =>
    columns.some((column) =>
      String(row[column.key] ?? "")
        .toLowerCase()
        .includes(query),
    ),
  );
}

export function sortRows<T extends object>(
  rows: readonly ResolvedRow<T>[],
  sortKey: keyof T | undefined,
  sortOrder: "asc" | "desc",
  serverSort: boolean,
): readonly ResolvedRow<T>[] {
  if (serverSort || !sortKey) return rows;

  return [...rows].sort((a, b) => {
    const valueA = a.row[sortKey];
    const valueB = b.row[sortKey];

    if (valueA === valueB) return a.sourceIndex - b.sourceIndex;
    if (valueA == null) return 1;
    if (valueB == null) return -1;

    const numberA = Number(valueA);
    const numberB = Number(valueB);
    const bothNumeric = !Number.isNaN(numberA) && !Number.isNaN(numberB);
    const comparison = bothNumeric
      ? numberA - numberB
      : String(valueA).localeCompare(String(valueB), undefined, {
          numeric: true,
        });

    if (comparison === 0) return a.sourceIndex - b.sourceIndex;
    return sortOrder === "asc" ? comparison : -comparison;
  });
}

export function resolvePagination(
  totalRows: number,
  itemsPerPage: number,
  page: number,
): DataTablePagination {
  const perPage = Math.max(1, itemsPerPage);
  const pageCount = Math.max(1, Math.ceil(totalRows / perPage));
  const clampedPage = Math.min(Math.max(1, page), pageCount);

  return {
    perPage,
    pageCount,
    clampedPage,
    pageOffset: (clampedPage - 1) * perPage,
  };
}

export function paginateRows<T>(
  rows: readonly ResolvedRow<T>[],
  pagination: boolean,
  serverPagination: boolean,
  pageOffset: number,
  perPage: number,
): readonly ResolvedRow<T>[] {
  if (!pagination || serverPagination) return rows;
  return rows.slice(pageOffset, pageOffset + perPage);
}
