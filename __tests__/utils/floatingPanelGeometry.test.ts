import {
  clampFloatingPanelCoordinates,
  getFloatingPanelHorizontalOverflow,
  getFloatingPanelSizeLimits,
  readFloatingPanelViewport,
  resolveNestedPanelLayout,
  type FloatingPanelRect,
} from "@/utils/floatingPanelGeometry";

const rect = (
  left: number,
  top: number,
  width: number,
  height: number,
): FloatingPanelRect => ({
  left,
  top,
  width,
  height,
  right: left + width,
  bottom: top + height,
});

describe("floatingPanelGeometry", () => {
  it("reads viewport dimensions with document fallbacks", () => {
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: 0,
    });
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 0,
    });
    Object.defineProperty(document.documentElement, "clientWidth", {
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(document.documentElement, "clientHeight", {
      configurable: true,
      value: 768,
    });

    expect(readFloatingPanelViewport()).toEqual({ width: 1024, height: 768 });
  });

  it("calculates viewport-constrained maximum panel dimensions", () => {
    expect(
      getFloatingPanelSizeLimits({ width: 320, height: 240 }, 8),
    ).toEqual({ maxWidth: 304, maxHeight: 224 });
    expect(getFloatingPanelSizeLimits({ width: 100, height: 80 }, 8)).toEqual(
      { maxWidth: 160, maxHeight: 120 },
    );
  });

  it.each([
    ["normal", { x: 40, y: 30 }, { x: 40, y: 30 }],
    ["top-left", { x: -20, y: -10 }, { x: 8, y: 8 }],
    ["bottom-right", { x: 310, y: 230 }, { x: 132, y: 112 }],
  ])("clamps %s coordinates", (_name, requested, expected) => {
    expect(
      clampFloatingPanelCoordinates({
        requested,
        panelWidth: 180,
        panelHeight: 120,
        viewport: { width: 320, height: 240 },
        padding: 8,
      }),
    ).toEqual(expected);
  });

  it("reports horizontal overflow at both viewport edges", () => {
    expect(
      getFloatingPanelHorizontalOverflow(rect(-4, 20, 180, 120), 320, 8),
    ).toEqual({ overflowLeft: true, overflowRight: false });
    expect(
      getFloatingPanelHorizontalOverflow(rect(200, 20, 180, 120), 320, 8),
    ).toEqual({ overflowLeft: false, overflowRight: true });
  });

  it("keeps a nested panel on the right when space is available", () => {
    expect(
      resolveNestedPanelLayout({
        anchorRect: rect(40, 40, 40, 32),
        panelRect: rect(80, 40, 160, 120),
        panelWidth: 160,
        viewport: { width: 640, height: 480 },
        padding: 8,
      }),
    ).toEqual({ placement: "right", offsetY: 0 });
  });

  it("flips left and offsets upward at the bottom-right corner", () => {
    expect(
      resolveNestedPanelLayout({
        anchorRect: rect(260, 180, 48, 40),
        panelRect: rect(308, 180, 180, 160),
        panelWidth: 180,
        viewport: { width: 320, height: 240 },
        padding: 8,
      }),
    ).toEqual({ placement: "left", offsetY: -108 });
  });

  it("clamps an oversized nested panel to the top padding", () => {
    expect(
      resolveNestedPanelLayout({
        anchorRect: rect(120, 4, 40, 32),
        panelRect: rect(160, -40, 180, 320),
        panelWidth: 180,
        viewport: { width: 320, height: 240 },
        padding: 8,
      }),
    ).toEqual({ placement: "right", offsetY: 48 });
  });
});
