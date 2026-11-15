import type {Page} from "@playwright/test";

export async function contrastMeasurements(page: Page) {
  return page.evaluate(() => {
    type Color = number[];
    const canvas = document.createElement("canvas"); canvas.width = canvas.height = 1;
    const context = canvas.getContext("2d")!;
    // Canvas resolves rgb(), color(srgb ...), and other browser color syntax.
    const rgba = (css: string): Color => {
      context.clearRect(0, 0, 1, 1); context.fillStyle = css;
      context.fillRect(0, 0, 1, 1);
      const [r, g, b, a] = context.getImageData(0, 0, 1, 1).data;
      return [r, g, b, a / 255];
    };
    const blend = (fg: Color, bg: Color): Color => {
      const alpha = fg[3] + bg[3] * (1 - fg[3]);
      if (!alpha) return [0, 0, 0, 0];
      return [0, 1, 2].map(i => (fg[i] * fg[3] + bg[i] * bg[3] * (1 - fg[3])) / alpha).concat(alpha);
    };
    const paintedColor = (element: Element, text: boolean): Color => {
      const style = getComputedStyle(element);
      let color = rgba(style.backgroundColor);
      if (text) color = blend(rgba(style.color), color);
      for (let node: Element | null = element; node; node = node.parentElement) {
        color[3] *= Number(getComputedStyle(node).opacity);
        if (node.parentElement) color = blend(color, rgba(getComputedStyle(node.parentElement).backgroundColor));
      }
      return blend(color, [255, 255, 255, 1]);
    };
    const luminance = (c: Color) => c.slice(0, 3).map(v => v / 255).map(v => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4).reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
    return Array.from(document.querySelectorAll("main *")).flatMap(element => {
      const style = getComputedStyle(element);
      const hasVisibleValue = element instanceof HTMLInputElement && !["checkbox", "radio", "hidden", "file", "color", "range"].includes(element.type);
      const displayValue = element instanceof HTMLSelectElement
        ? element.selectedOptions[0]?.text ?? ""
        : hasVisibleValue ? (element as HTMLInputElement).value : "";
      const text = Array.from(element.childNodes).filter(n => n.nodeType === Node.TEXT_NODE).map(n => n.textContent).join("").trim() || displayValue;
      if (!text || !element.getClientRects().length || style.visibility === "hidden" || element.closest('[disabled], [aria-disabled="true"], [aria-hidden="true"], [hidden]')) return [];
      // Visually hidden descriptions are tested by semantic assertions, not color.
      if (element.getBoundingClientRect().width <= 1) return [];
      const bg = paintedColor(element, false);
      const fg = paintedColor(element, true);
      const a = luminance(fg), b = luminance(bg);
      const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      const size = parseFloat(style.fontSize);
      const minimum = size >= 24 || (size >= 18.6667 && Number(style.fontWeight) >= 700) ? 3 : 4.5;
      return [{ text, className: element.className, variant: element.closest("[data-variant]")?.getAttribute("data-variant"), testId: element.getAttribute("data-testid"), state: element.closest("[data-state]")?.getAttribute("data-state"), ratio, minimum, foreground: style.color, background: bg }];
    });
  });
}
