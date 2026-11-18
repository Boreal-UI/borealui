import { test, expect } from "@playwright/test";
import {contrastMeasurements} from "./contrast.measurements";
import { writeFile } from "node:fs/promises";


for (const variant of ["core", "next"]) {
  test(`${variant}: semantic fields retain native values, keyboard focus and consumer overrides`, async ({page, browserName}, testInfo) => {
    await page.goto(`/__tests__/browser/index.html?variant=${variant}`);
    await expect(page.getByRole("heading", {name:"Regression fixtures"})).toBeVisible();
    await page.evaluate(() => {
      const fixture = window as unknown as {themes:string[]; selectTheme:(i:number)=>void};
      fixture.selectTheme(fixture.themes.indexOf("Forest Dusk"));
    });
    await page.waitForTimeout(350);
    for (const state of ["success", "warning"]) {
      const block = page.locator(`[data-state="${state}"] [data-variant="solid"]`);
      const link = block.getByRole("link", {name:"Settings"});
      await link.focus();
      await page.keyboard.press("Tab");
      await expect(block.getByLabel("Amount value")).toBeFocused();
      await page.keyboard.press("Shift+Tab");
      // WebKit's platform default excludes links from sequential Tab navigation.
      if (browserName === "webkit") await link.focus();
      await expect(link).toBeFocused();
      await expect(link).toHaveCSS("outline-style", "solid");
      await link.hover();
      await page.waitForTimeout(350);
      expect((await contrastMeasurements(page)).filter(m => m.ratio < m.minimum)).toEqual([]);
      const input = block.getByLabel("Appointment", {exact:true});
      await expect(input).toHaveValue("2026-11-14T12:30");
      await input.focus();
      await expect(input).toBeFocused();
      await expect(input).toHaveCSS("color-scheme", "normal");
      await expect(block.getByLabel("Read-only appointment")).toHaveAttribute("readonly", "");
      await expect(block.getByLabel("Disabled appointment")).toBeDisabled();
      const screenshot = testInfo.outputPath(`${state}-native-fields.png`);
      await block.screenshot({path:screenshot});
      await testInfo.attach(`${state}-native-fields.png`, {path:screenshot, contentType:"image/png"});
    }
    const measurements = testInfo.outputPath("forest-dusk-native-colors.json");
    await writeFile(measurements, JSON.stringify(await contrastMeasurements(page), null, 2));
    await page.locator("main").evaluate(el => {
      const style = (el as HTMLElement).style;
      style.setProperty("--success-color", "#002200");
      style.setProperty("--success-color-hover", "#003300");
      style.setProperty("--success-text-color", "#ffffff");
    });
    const overridden = page.locator('[data-state="success"] [data-variant="solid"]');
    await expect(overridden.getByLabel("Appointment", {exact:true})).toHaveCSS("color", "rgb(255, 255, 255)");
    await expect(overridden.getByRole("link", {name:"Settings"})).toHaveCSS("color", "rgb(255, 255, 255)");
    await page.waitForTimeout(350);
    expect((await contrastMeasurements(page)).filter(m => m.ratio < m.minimum)).toEqual([]);
  });
  test(`${variant}: horizontal scrolling keeps toolbar visible and columns aligned`, async ({page}) => {
    await page.setViewportSize({width:390,height:800});
    await page.goto(`/__tests__/browser/index.html?variant=${variant}`);
    const region = page.getByTestId("wide-table");
    const toolbar = page.getByTestId("wide-table-toolbar");
    const start = await toolbar.boundingBox();
    await region.evaluate(el => { el.scrollLeft = el.scrollWidth; });
    expect(await region.evaluate(el => el.scrollLeft)).toBeGreaterThan(300);
    const end = await toolbar.boundingBox();
    expect(Math.abs(end!.x - start!.x)).toBeLessThan(1);
    await expect(toolbar.getByText("Publications")).toBeInViewport();
    await expect(toolbar.getByRole("searchbox")).toBeInViewport();
    const header = await region.getByRole("columnheader", {name:"Details"}).boundingBox();
    const cell = await region.getByRole("cell", {name:"Far right content"}).boundingBox();
    expect(Math.abs(header!.x - cell!.x)).toBeLessThan(1);
    await expect(region.getByRole("columnheader", {name:"Details"})).toBeInViewport();
  });
  test(`${variant}: rendered text across built-in themes, states, focus and hover`, async ({ page, browserName }, testInfo) => {
    test.skip(browserName !== "chromium", "Forced pseudo-state measurement requires the Chromium DevTools Protocol.");
    const errors: string[] = [];
    page.on("pageerror", e => errors.push(e.message));
    await page.goto(`/__tests__/browser/index.html?variant=${variant}`);
    await expect(page.getByRole("heading", { name: "Regression fixtures" })).toBeVisible();
    const themes = await page.evaluate(() => (window as unknown as { themes: string[] }).themes);
    const session = await page.context().newCDPSession(page);
    await session.send("DOM.enable"); await session.send("CSS.enable");
    const failures = [];
    const forestMeasurements = [];
    for (let i = 0; i < themes.length; i++) {
      await page.evaluate(i => (window as unknown as { selectTheme: (i: number) => void }).selectTheme(i), i);
      await page.waitForTimeout(30);
      const document = await session.send("DOM.getDocument");
      const { nodeIds } = await session.send("DOM.querySelectorAll", { nodeId: document.root.nodeId, selector: "button, a, input, select, [role=combobox], [data-testid$='wrapper'], [data-testid='input-group-root'], [data-testid='datetime-picker-root']" });
      for (const pseudo of [[], ["hover"], ["focus-visible"]]) {
        await Promise.all(nodeIds.map(nodeId => session.send("CSS.forcePseudoState", { nodeId, forcedPseudoClasses: pseudo })));
        // Wait for the component's actual color transitions to finish.
        await page.waitForTimeout(350);
        const measurements = await contrastMeasurements(page);
        if (themes[i] === "Forest Dusk") forestMeasurements.push({pseudo, measurements});
        const found = measurements.filter(m => m.ratio < m.minimum);
        if (found.length) failures.push({ theme: themes[i], pseudo, failures: found });
      }
    }
    expect(errors).toEqual([]);
    const report = testInfo.outputPath("forest-dusk-contrast.json");
    await writeFile(report, JSON.stringify(forestMeasurements, null, 2));
    await testInfo.attach("forest-dusk-contrast.json", {path:report, contentType:"application/json"});
    expect(failures).toEqual([]);
  });

  test(`${variant}: real keyboard disabled and duplicate Sidebar groups`, async ({ page }) => {
    await page.goto(`/__tests__/browser/index.html?variant=${variant}`);
    const section = page.locator('[data-state="default"]');
    const buttons = section.getByRole("button", { name: "Reports", exact: true });
    await buttons.first().click();
    await expect(buttons.first()).toHaveAttribute("aria-expanded", "true");
    await expect(buttons.nth(1)).toHaveAttribute("aria-expanded", "false");
    const disabled = section.getByRole("button", { name: "Disabled reports" });
    await disabled.focus(); await page.keyboard.press("Enter"); await page.keyboard.press("Space");
    await disabled.dispatchEvent("click");
    await expect(disabled).toHaveAttribute("aria-expanded", "false");
    await expect(disabled).toBeFocused();
    const input = page.getByRole("spinbutton", { name: "Risk" });
    await page.getByRole("button", { name: "Increase value" }).click();
    await expect(input).toHaveValue("11");
    await input.fill("60"); await input.blur(); await expect(input).toHaveValue("50");
  });
}
