export type DataTableVirtualWindow = {
  startIndex: number;
  endIndex: number;
  topSpacer: number;
  bottomSpacer: number;
};

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
