import { test, expect } from "@playwright/test";
import { contrastMeasurements } from "./contrast.measurements";

for (const entry of ["core", "next", "server"]) {
  for (const component of ["Typography", "Alert", "MetricBox"]) {
    test(`${entry}: ${component} production foreground contract`, async ({ page }) => {
      await page.goto(`/__tests__/browser/foreground.html?variant=${entry}`);
      await page.getByTestId("foreground-examples").waitFor();
      await page.evaluate(() => {
        const fixture = window as unknown as { themes: string[]; selectTheme: (index: number) => void };
        fixture.selectTheme(fixture.themes.indexOf("Forest Dusk"));
      });
      await page.waitForTimeout(1500);
      if (component === "Typography") {
        await expect(page.getByTestId("inherited")).toHaveCSS("color", "rgb(18, 52, 86)");
        await expect(page.getByTestId("foreground-examples").getByText("Essential")).toHaveCSS("color", "rgb(0, 0, 0)");
      } else {
        const id = component === "MetricBox" ? "metric-box" : "alert";
        const readings = await contrastMeasurements(page, `[data-testid="foreground-examples"] [data-testid="${id}"] *`);
        expect(readings.length).toBeGreaterThanOrEqual(2);
        expect(readings.filter(m => m.ratio < m.minimum)).toEqual([]);
      }
    });
  }
}
