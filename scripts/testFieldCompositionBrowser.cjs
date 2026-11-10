// Uses the same standalone Vite/Playwright workflow as testSelectDataTableBrowser.cjs.
// Run: BOREAL_BROWSER_CHANNEL=chrome node scripts/testFieldCompositionBrowser.cjs
const { spawn } = require("node:child_process");
const path = require("node:path");
const fs = require("node:fs/promises");
const { chromium, expect } = require("@playwright/test");

async function verify(page, implementation, outputDir, label) {
  const errors = [];
  page.on("pageerror", (error) => { errors.push(error.message); console.error(error.stack); });
  await page.goto(`http://127.0.0.1:4181/cypress/fixtures/field-composition.html?implementation=${implementation}`);
  await expect(page.getByRole("heading", { name: "Aligned single-line controls" })).toBeVisible();
  await page.mouse.move(-10, -10);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);

  for (const [size, height] of [["xs", 28], ["small", 32], ["medium", 40], ["large", 48], ["xl", 56]]) {
    const toolbar = page.getByTestId(`toolbar-${size}`);
    const bounds = await toolbar.locator(".toolbar-surface").evaluateAll((elements) => elements.map((element) => {
      const rect = element.getBoundingClientRect();
      const css = getComputedStyle(element);
      return { height: rect.height, top: element.closest(".toolbar-item").getBoundingClientRect().top, bottom: rect.bottom, margin: css.margin };
    }));
    expect(bounds).toHaveLength(4);
    for (const rect of bounds) {
      expect(rect.height).toBeCloseTo(height, 0);
      expect(rect.margin).toBe("0px");
    }
    // Wrapped toolbar rows are allowed at narrow widths. Within each row the
    // control surfaces share a baseline; wide toolbars align all four controls.
    for (let index = 1; index < bounds.length; index++) {
      if (Math.abs(bounds[index].top - bounds[index - 1].top) < 2) {
        expect(bounds[index].bottom).toBeCloseTo(bounds[index - 1].bottom, 0);
      }
    }
  }

  const area = page.getByRole("textbox", { name: /Publication notes/ });
  const areaHeight = await area.evaluate((element) => element.getBoundingClientRect().height);
  const lineHeight = await area.evaluate((element) => Number.parseFloat(getComputedStyle(element).lineHeight));
  expect(areaHeight).toBeGreaterThanOrEqual(lineHeight * 4);
  expect(await area.evaluate((element) => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
  expect(await area.getAttribute("aria-describedby")).toContain("editorial-policy");

  const serverForm = page.getByRole("form", { name: "Server validation" });
  const email = serverForm.getByRole("textbox", { name: "Email address" });
  await email.fill("retained@example.com");
  await serverForm.getByRole("button").click();
  const pending = serverForm.getByRole("button", { name: "Saving automation settings and retaining your email address" });
  await expect(pending).toBeDisabled();
  await expect(pending).toHaveAttribute("aria-busy", "true");
  await expect(pending).toBeVisible();
  expect(await pending.evaluate((element) => element.scrollHeight <= element.clientHeight + 1)).toBe(true);
  await expect(serverForm.getByText(/This address is already registered/)).toBeVisible();
  await expect(email).toHaveValue("retained@example.com");
  await expect(email).toHaveAttribute("aria-invalid", "true");
  await expect(email).toHaveAccessibleDescription(/We will send publication notifications here.*This address is already registered/);
  await expect(serverForm.getByText(/This address is already registered/)).not.toHaveAttribute("role");
  for (const field of await page.locator(".composition-field").all()) {
    const layout = await field.evaluate((root) => {
      const parent = root.parentElement.getBoundingClientRect();
      const bounds = root.getBoundingClientRect();
      const control = root.querySelector("input,select,textarea");
      const controlBounds = control.getBoundingClientRect();
      const feedback = (control.getAttribute("aria-describedby") || "").split(" ")
        .map((id) => document.getElementById(id)).filter((element) => element && root.contains(element));
      return {
        rootWidth: bounds.width, parentWidth: parent.width,
        controlInside: controlBounds.right <= bounds.right + 1 && controlBounds.left >= bounds.left - 1,
        labelsFit: [...control.labels].every((element) => element.scrollWidth <= element.clientWidth + 1),
        feedbackFits: feedback.every((element) => element.scrollWidth <= element.clientWidth + 1 && element.getBoundingClientRect().top >= controlBounds.bottom - 1),
      };
    });
    expect(layout.rootWidth).toBeCloseTo(layout.parentWidth, 0);
    expect(layout.controlInside).toBe(true);
    expect(layout.labelsFit).toBe(true);
    expect(layout.feedbackFits).toBe(true);
  }

  const contact = page.getByRole("textbox", { name: "Contact email" });
  await contact.fill("invalid");
  await contact.blur();
  await expect(contact).toHaveAttribute("aria-invalid", "true");
  await contact.fill("corrected@example.com");
  await expect(contact).not.toHaveAttribute("aria-invalid");
  await expect(page.getByText("Enter an email address with an @ sign.")).toHaveCount(0);

  const actions = page.getByRole("region", { name: "Responsive actions" });
  const action = actions.getByRole("button", { name: "Save automation settings and return to the project", exact: true });
  await action.focus();
  await page.keyboard.press("Space");
  await expect(page.getByRole("status", { name: "Action count" })).toHaveText("1");
  await expect(action).toHaveCSS("outline-style", "solid");
  await page.mouse.move(-10, -10);
  for (const button of await actions.getByRole("button").all()) {
    expect(await button.evaluate((element) => element.scrollWidth <= element.clientWidth + 1 && element.scrollHeight <= element.clientHeight + 1)).toBe(true);
    expect(await button.evaluate((element) => {
      const parent = element.parentElement.getBoundingClientRect();
      const rect = element.getBoundingClientRect();
      return rect.width <= parent.width + 1;
    })).toBe(true);
  }
  for (const icon of await actions.locator("svg").all()) {
    const box = await icon.boundingBox();
    expect(box.width).toBeGreaterThan(0);
    expect(box.height).toBeGreaterThan(0);
  }

  const documents = page.getByRole("region", { name: "Documents", exact: true });
  const docTable = documents.getByRole("table");
  await expect(docTable).toHaveCSS("table-layout", "fixed");
  const actionColumnWidth = await docTable.getByRole("columnheader", { name: "Actions", exact: true }).evaluate((element) => element.getBoundingClientRect().width);
  const tableWidth = await docTable.evaluate((element) => element.getBoundingClientRect().width);
  expect(actionColumnWidth / tableWidth).toBeCloseTo(0.38, 1);
  expect(await docTable.evaluate((table) => table.getBoundingClientRect().width <= table.closest('[role="region"]').clientWidth + 1)).toBe(true);
  expect(await documents.getByRole("rowheader").evaluate((element) => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
  // Header/body columns remain native and aligned, including on a 320px viewport.
  const alignment = await docTable.evaluate((table) => {
    const headers = [...table.querySelectorAll("thead tr:first-child > th")];
    const cells = [...table.querySelectorAll("tbody tr:first-child > th, tbody tr:first-child > td")];
    return headers.map((header, index) => Math.abs(header.getBoundingClientRect().left - cells[index].getBoundingClientRect().left));
  });
  alignment.forEach((difference) => expect(difference).toBeLessThan(1));
  const edit = documents.getByRole("button", { name: "Edit document and review publication settings" });
  await expect(edit).toBeVisible();
  await edit.click();
  await expect(page.getByRole("status", { name: "Document action" })).toHaveText("Edit document");
  await documents.getByRole("checkbox").last().check();
  await documents.getByRole("button", { name: /Filename.*sort ascending/ }).click();
  await expect(documents.getByRole("columnheader", { name: /Filename/ })).toHaveAttribute("aria-sort", "ascending");

  const financial = page.getByRole("region", { name: "Financial transactions", exact: true });
  expect(await financial.evaluate((element) => element.scrollWidth >= 960 && element.getBoundingClientRect().width <= innerWidth)).toBe(true);
  await financial.focus();
  await page.keyboard.press("ArrowRight");
  if (await financial.evaluate((element) => element.scrollWidth > element.clientWidth)) {
    await expect.poll(() => financial.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
  }
  await page.mouse.move(-10, -10);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  const screenshotPath = path.join(outputDir, `${implementation}-${label}.png`);
  if (label === "200-percent-zoom") {
    // Browser page zoom changes capture coordinates too. Playwright's CSS-pixel
    // fullPage clip otherwise crops this real-zoom capture to half its surface.
    const cdp = await page.context().newCDPSession(page);
    const { contentSize } = await cdp.send("Page.getLayoutMetrics");
    const screenshot = await cdp.send("Page.captureScreenshot", {
      format: "png", captureBeyondViewport: true,
      clip: { x: 0, y: 0, width: contentSize.width, height: contentSize.height, scale: 1 },
    });
    await fs.writeFile(screenshotPath, Buffer.from(screenshot.data, "base64"));
    await cdp.detach();
  } else {
    await page.screenshot({ path: screenshotPath, fullPage: true });
  }
  expect(errors).toEqual([]);
}

async function main() {
  const root = path.resolve(__dirname, "..");
  const outputDir = path.join(root, "out/field-composition-browser");
  await fs.mkdir(outputDir, { recursive: true });
  const server = spawn(process.execPath, [path.join(root, "node_modules/vite/bin/vite.js"), "--config", "cypress/fixtures/field-composition.vite.ts", "--host", "127.0.0.1", "--port", "4181", "--strictPort"], { cwd: root, windowsHide: true, stdio: "pipe" });
  let serverLog = "";
  server.stdout.on("data", (data) => { serverLog += data; });
  server.stderr.on("data", (data) => { serverLog += data; });
  const launch = { headless: true, channel: process.env.BOREAL_BROWSER_CHANNEL || undefined };
  let browser;
  let zoomContext;
  try {
    for (let attempt = 0; ; attempt++) {
      if (server.exitCode !== null) throw new Error(serverLog);
      try { if ((await fetch("http://127.0.0.1:4181/cypress/fixtures/field-composition.html")).ok) break; } catch { /* Vite startup */ }
      if (attempt === 100) throw new Error(`Vite did not start: ${serverLog}`);
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
    browser = await chromium.launch(launch);
    for (const implementation of ["core", "next"]) {
      const page = await browser.newPage();
      page.setDefaultTimeout(10000);
      for (const width of [320, 768, 1280]) {
        await page.setViewportSize({ width, height: 1000 });
        await verify(page, implementation, outputDir, `${width}px`);
        console.log(`${implementation}: ${width}px layout, validation, actions and tables passed`);
      }
      // Revisit an existing page after resizing, without a reload/remount.
      await page.setViewportSize({ width: 320, height: 1000 });
      await expect(page.getByRole("region", { name: "Documents", exact: true }).getByRole("table")).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      await page.close();
    }
    // Chrome's profile preference sets real page zoom, rather than CSS zoom,
    // pinch zoom or deviceScaleFactor emulation. Assert DPR to confirm it applied.
    const profile = await fs.mkdtemp(path.join(outputDir, "zoom-profile-"));
    await fs.mkdir(path.join(profile, "Default"));
    // The default storage partition is "x" (empty relative path):
    // https://raw.githubusercontent.com/chromium/chromium/main/chrome/browser/ui/zoom/chrome_zoom_level_prefs.cc
    await fs.writeFile(path.join(profile, "Default/Preferences"), JSON.stringify({ partition: { default_zoom_level: { x: Math.log(2) / Math.log(1.2) } } }));
    zoomContext = await chromium.launchPersistentContext(profile, { ...launch, viewport: null, args: ["--window-size=1280,1000"] });
    for (const implementation of ["core", "next"]) {
      const page = await zoomContext.newPage();
      page.setDefaultTimeout(10000);
      await verify(page, implementation, outputDir, "200-percent-zoom");
      expect(await page.evaluate(() => devicePixelRatio)).toBeCloseTo(2, 1);
      console.log(`${implementation}: real 200% browser zoom passed (DPR=${await page.evaluate(() => devicePixelRatio)}, CSS viewport=${await page.evaluate(() => innerWidth)})`);
      await page.close();
    }
  } finally {
    if (zoomContext) await zoomContext.close();
    if (browser) await browser.close();
    server.kill();
  }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
