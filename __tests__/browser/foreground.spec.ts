import { test, expect } from "@playwright/test";
import { createRequire } from "node:module";
import { contrastMeasurements } from "./contrast.measurements";
const require = createRequire(import.meta.url);

async function settle(page: import("@playwright/test").Page) {
  await page.waitForTimeout(400);
  await page.evaluate(async () => {
    // Inherited color can start a child transition after the parent's change.
    for (let pass = 0; pass < 5; pass++) {
      const animations = document.getAnimations().filter(a => a.effect?.getComputedTiming().iterations !== Infinity);
      if (!animations.length) break;
      await Promise.all(animations.map(a => a.finished.catch(() => undefined)));
      await new Promise(requestAnimationFrame);
    }
  });
}

for (const entry of ["core", "next", "server"]) {
  test(`${entry}: foreground inheritance and composited semantic matrix`, async ({ page }, testInfo) => {
    test.setTimeout(600000);
    await page.goto(`/__tests__/browser/foreground.html?variant=${entry}`);
    await expect(page.getByRole("heading", { name: "Foreground fixtures" })).toBeVisible();
    await expect(page.getByTestId("inherited")).toHaveCSS("color", "rgb(18, 52, 86)");
    await expect(page.getByTestId("inherited-link")).toHaveCSS("color", "rgb(18, 52, 86)");
    await expect(page.getByTestId("explicit")).toHaveCSS("color", "rgb(255, 153, 0)");
    await expect(page.getByTestId("inherited").getByTestId("typography")).toHaveCSS("color", "rgb(18, 52, 86)");
    await page.evaluate(() => (window as any).semantic());
    await settle(page);
    await expect(page.getByTestId("changing-title")).toHaveCSS("color", "rgb(0, 0, 0)");
    await page.evaluate(() => (window as any).setLoading(true));
    await expect(page.getByTestId("changing")).toHaveAttribute("aria-busy", "true");
    await page.evaluate(() => (window as any).setLoading(false));
    await expect(page.getByTestId("changing-subtext")).toHaveCSS("color", "rgb(0, 0, 0)");
    const themes: string[] = await page.evaluate(() => (window as any).themes);
    const failures = [];
    await page.addScriptTag({ path: require.resolve("axe-core/axe.min.js") });
    for (let index = 0; index < themes.length; index++) {
      await page.evaluate(i => (window as any).selectTheme(i), index);
      await settle(page);
      const measurements = await contrastMeasurements(page, 'main section *, [data-testid="foreground-examples"] *, [data-testid="changing"] *');
      const bad = measurements.filter(m => m.ratio < m.minimum);
      if (bad.length) failures.push({ theme: themes[index], failures: bad.slice(0, 15) });
      const axe = await page.evaluate(async () => (window as any).axe.run(document.querySelector("main section"), { runOnly: ["color-contrast"] }));
      expect.soft(axe.violations, themes[index]).toEqual([]);
      if (themes[index] === "Forest Dusk") {
        await testInfo.attach("production-compositions.png", { body: await page.getByTestId("foreground-examples").screenshot(), contentType: "image/png" });
        const glass = page.locator('[data-surface="background-color"] [data-theme="tertiary"] [data-state="success"] [data-variant="glass"]').getByTestId("metric-box");
        await glass.hover();
        await settle(page);
        expect((await contrastMeasurements(page, '[data-surface="background-color"] [data-theme="tertiary"] [data-state="success"] [data-variant="glass"] *')).filter(m => m.ratio < m.minimum)).toEqual([]);
        await page.mouse.move(0, 0);
      }
      console.log(`${entry}: measured ${themes[index]}`);
    }
    await testInfo.attach("executed-matrix.json", { body: JSON.stringify({ entry, themes, surfaces: 6, themesPerScheme: 5, states: 5, alertVariants: 5, metricVariants: 4, failures }, null, 2), contentType: "application/json" });
    expect(failures).toEqual([]);
  });
}
