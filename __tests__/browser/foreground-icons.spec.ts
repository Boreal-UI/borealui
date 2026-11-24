import { test, expect } from "@playwright/test";
import { contrastMeasurements } from "./contrast.measurements";

test("MetricBox meaningful icons follow runtime semantic and loading transitions", async ({ page }) => {
  await page.goto("/__tests__/browser/foreground-icons.html");
  for (const light of [false, true]) {
    for (const [semantic, loading] of [[false, false], [true, false], [true, true], [true, false], [false, false]]) {
      await page.evaluate(([semantic, loading, light]) => (window as any).updateMetric(semantic, loading, light), [semantic, loading, light]);
      await page.waitForTimeout(500);
      for (let index = 0; index < 3; index++) {
        const metric = page.getByTestId(`icon-metric-${index}`);
        if (loading) {
          await expect(metric).toHaveAttribute("aria-busy", "true");
          await expect(metric.locator("svg")).toHaveCount(0);
        } else {
          const color = await metric.evaluate(el => getComputedStyle(el).color);
          await expect(metric.locator("svg")).toHaveCSS("color", color);
          await expect(page.getByTestId(`icon-metric-${index}-title`)).toHaveCSS("color", color);
        }
      }
      expect((await contrastMeasurements(page)).filter(m => m.ratio < m.minimum)).toEqual([]);
    }
  }
});
