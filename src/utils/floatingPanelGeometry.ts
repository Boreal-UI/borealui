export type FloatingPanelRect = Pick<
  DOMRect,
  "top" | "right" | "bottom" | "left" | "width" | "height"
>;

export type FloatingPanelViewport = {
  width: number;
  height: number;
};

export type FloatingPanelCoordinates = {
  x: number;
  y: number;
};

export type NestedPanelLayout = {
  placement: "left" | "right";
  offsetY: number;
};

export const readFloatingPanelViewport = (): FloatingPanelViewport => {
  if (typeof window === "undefined") return { width: 0, height: 0 };

  return {
    width:
      window.innerWidth ||
      (typeof document === "undefined"
        ? 0
        : document.documentElement.clientWidth) ||
      0,
    height:
      window.innerHeight ||
      (typeof document === "undefined"
        ? 0
        : document.documentElement.clientHeight) ||
      0,
  };
};

export const getFloatingPanelSizeLimits = (
  viewport: FloatingPanelViewport,
  padding: number,
  minimumWidth = 160,
  minimumHeight = 120,
) => ({
  maxWidth: Math.max(minimumWidth, viewport.width - padding * 2),
  maxHeight: Math.max(minimumHeight, viewport.height - padding * 2),
});

export const clampFloatingPanelCoordinates = ({
  requested,
  panelWidth,
  panelHeight,
  viewport,
  padding,
}: {
  requested: FloatingPanelCoordinates;
  panelWidth: number;
  panelHeight: number;
  viewport: FloatingPanelViewport;
  padding: number;
}): FloatingPanelCoordinates => ({
  x: Math.min(
    Math.max(padding, requested.x),
    Math.max(padding, viewport.width - panelWidth - padding),
  ),
  y: Math.min(
    Math.max(padding, requested.y),
    Math.max(padding, viewport.height - panelHeight - padding),
  ),
});

export const getFloatingPanelHorizontalOverflow = (
  rect: FloatingPanelRect,
  viewportWidth: number,
  padding: number,
) => ({
  overflowLeft: rect.left < padding,
  overflowRight: rect.right > viewportWidth - padding,
});

export const resolveNestedPanelLayout = ({
  panelRect,
  anchorRect,
  panelWidth,
  viewport,
  padding,
}: {
  panelRect: FloatingPanelRect;
  anchorRect?: FloatingPanelRect;
  panelWidth: number;
  viewport: FloatingPanelViewport;
  padding: number;
}): NestedPanelLayout => {
  const rightSpace = anchorRect
    ? viewport.width - anchorRect.right - padding
    : viewport.width - panelRect.right - padding;
  const leftSpace = anchorRect
    ? anchorRect.left - padding
    : panelRect.left - padding;
  const placement =
    rightSpace >= panelWidth || rightSpace >= leftSpace ? "right" : "left";
  let offsetY = 0;

  if (panelRect.bottom > viewport.height - padding) {
    offsetY -= panelRect.bottom - (viewport.height - padding);
  }

  if (panelRect.top + offsetY < padding) {
    offsetY += padding - (panelRect.top + offsetY);
  }

  return { placement, offsetY };
};
