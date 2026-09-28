import type { Column } from "@/components/DataTable/DataTable.types";
import {
  filterRows,
  findDuplicateRowKeys,
  paginateRows,
  resolvePagination,
  resolveRows,
  sortRows,
} from "@/components/DataTable/dataTableRows";
import { resolveVirtualWindow } from "@/components/DataTable/dataTableVirtualization";

type Row = {
  id: string;
  name: string;
  score: number | null;
  status?: string;
};

const columns: Column<Row>[] = [
  { key: "name", label: "Name" },
  { key: "score", label: "Score" },
  { key: "status", label: "Status" },
];

const rows: Row[] = [
  { id: "charlie", name: "Charlie", score: 20, status: "Ready" },
  { id: "alice", name: "Alice", score: 10 },
  { id: "bob", name: "Bob", score: 20, status: "Draft" },
];

describe("DataTable pure row pipeline", () => {
  it("resolves empty input without metadata", () => {
    expect(resolveRows([])).toEqual([]);
  });

  it("preserves source references, source indices, and fallback identity", () => {
    expect(resolveRows(rows)).toEqual([
      { row: rows[0], sourceIndex: 0, key: 0 },
      { row: rows[1], sourceIndex: 1, key: 1 },
      { row: rows[2], sourceIndex: 2, key: 2 },
    ]);
  });

  it("keeps explicit row keys authoritative", () => {
    expect(resolveRows(rows, (row) => row.id).map(({ key }) => key)).toEqual([
      "charlie",
      "alice",
      "bob",
    ]);
  });

  it("reports duplicate explicit keys without rewriting them", () => {
    const resolved = resolveRows(rows, () => "duplicate");

    expect(findDuplicateRowKeys(resolved)).toEqual(["duplicate"]);
    expect(resolved.map(({ key }) => key)).toEqual([
      "duplicate",
      "duplicate",
      "duplicate",
    ]);
  });

  it("returns the original row collection when filtering is inactive or empty", () => {
    const resolved = resolveRows(rows);

    expect(filterRows(resolved, columns, false, "Alice")).toBe(resolved);
    expect(filterRows(resolved, columns, true, "   ")).toBe(resolved);
  });

  it("filters case-insensitively across columns and treats nullish values as empty", () => {
    const resolved = resolveRows([
      ...rows,
      { id: "null", name: "Null", score: null },
    ]);

    expect(
      filterRows(resolved, columns, true, "READY").map(({ row }) => row.id),
    ).toEqual(["charlie"]);
    expect(filterRows(resolved, columns, true, "null")).toHaveLength(1);
  });

  it("returns the input collection when sorting is inactive or server-owned", () => {
    const resolved = resolveRows(rows);

    expect(sortRows(resolved, undefined, "asc", false)).toBe(resolved);
    expect(sortRows(resolved, "name", "asc", true)).toBe(resolved);
  });

  it("sorts numeric values and keeps equal values in source order", () => {
    const sorted = sortRows(resolveRows(rows), "score", "asc", false);

    expect(sorted.map(({ row }) => row.id)).toEqual([
      "alice",
      "charlie",
      "bob",
    ]);
  });

  it("keeps null values last in both sort directions", () => {
    const resolved = resolveRows([
      ...rows,
      { id: "null", name: "Null", score: null },
    ]);

    expect(sortRows(resolved, "score", "asc", false).at(-1)?.row.id).toBe(
      "null",
    );
    expect(sortRows(resolved, "score", "desc", false).at(-1)?.row.id).toBe(
      "null",
    );
  });

  it("composes filter and sort without changing logical identity", () => {
    const resolved = resolveRows(rows, (row) => row.id);
    const filtered = filterRows(resolved, columns, true, "li");
    const sorted = sortRows(filtered, "name", "asc", false);

    expect(sorted.map(({ key }) => key)).toEqual(["alice", "charlie"]);
    expect(sorted.map(({ sourceIndex }) => sourceIndex)).toEqual([1, 0]);
  });

  it.each([
    [0, 10, 4, { perPage: 10, pageCount: 1, clampedPage: 1, pageOffset: 0 }],
    [21, 10, 9, { perPage: 10, pageCount: 3, clampedPage: 3, pageOffset: 20 }],
    [2, 0, 0, { perPage: 1, pageCount: 2, clampedPage: 1, pageOffset: 0 }],
  ])(
    "resolves pagination bounds for total=%s size=%s page=%s",
    (total, pageSize, page, expected) => {
      expect(resolvePagination(total, pageSize, page)).toEqual(expected);
    },
  );

  it("slices client pages but leaves server-provided rows intact", () => {
    const resolved = resolveRows(rows);

    expect(paginateRows(resolved, true, false, 1, 1)).toEqual([resolved[1]]);
    expect(paginateRows(resolved, true, true, 1, 1)).toBe(resolved);
    expect(paginateRows(resolved, false, false, 1, 1)).toBe(resolved);
  });
});

describe("DataTable pure virtualization math", () => {
  it("uses the complete range when virtualization is disabled", () => {
    expect(resolveVirtualWindow(100, false, 400, 40, 120, 2)).toEqual({
      startIndex: 0,
      endIndex: 100,
      topSpacer: 0,
      bottomSpacer: 0,
    });
  });

  it("calculates an overscanned window and spacers", () => {
    expect(resolveVirtualWindow(100, true, 400, 40, 120, 1)).toEqual({
      startIndex: 9,
      endIndex: 14,
      topSpacer: 360,
      bottomSpacer: 3440,
    });
  });

  it("clamps the ending window to the available row count", () => {
    expect(resolveVirtualWindow(3, true, 400, 40, 120, 1)).toEqual({
      startIndex: 9,
      endIndex: 3,
      topSpacer: 360,
      bottomSpacer: 0,
    });
  });
});
