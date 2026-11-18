export type DataTableVirtualWindow = {
  startIndex: number;
  endIndex: number;
  topSpacer: number;
  bottomSpacer: number;
};

export function clampVirtualScrollTop(rowCount: number, scrollTop: number, rowHeight: number, viewportHeight: number): number {
  const count = Number.isFinite(rowCount) ? Math.max(0, Math.floor(rowCount)) : 0;
  const height = Number.isFinite(rowHeight) && rowHeight > 0 ? rowHeight : 48;
  const viewport = Number.isFinite(viewportHeight) && viewportHeight > 0 ? viewportHeight : 360;
  const offset = Number.isFinite(scrollTop) ? Math.max(0, scrollTop) : 0;
  return Math.min(offset, Math.max(0, count * height - viewport));
}

export function resolveVirtualWindow(
  rowCount: number,
  virtualized: boolean,
  scrollTop: number,
  rowHeight: number,
  viewportHeight: number,
  overscan: number,
): DataTableVirtualWindow {
  if (!virtualized) {
    return {
      startIndex: 0,
      endIndex: rowCount,
      topSpacer: 0,
      bottomSpacer: 0,
    };
  }

  rowCount = Number.isFinite(rowCount) ? Math.max(0, Math.floor(rowCount)) : 0;
  rowHeight = Number.isFinite(rowHeight) && rowHeight > 0 ? rowHeight : 48;
  viewportHeight = Number.isFinite(viewportHeight) && viewportHeight > 0 ? viewportHeight : 360;
  overscan = Number.isFinite(overscan) ? Math.max(0, Math.floor(overscan)) : 0;
  scrollTop = clampVirtualScrollTop(rowCount, scrollTop, rowHeight, viewportHeight);

  const startIndex = Math.max(
    0,
    Math.floor(scrollTop / rowHeight) - overscan,
  );
  const visibleCount = Math.ceil(viewportHeight / rowHeight) + overscan * 2;
  const endIndex = Math.min(rowCount, startIndex + visibleCount);

  return {
    startIndex,
    endIndex,
    topSpacer: startIndex * rowHeight,
    bottomSpacer: Math.max(0, (rowCount - endIndex) * rowHeight),
  };
}
