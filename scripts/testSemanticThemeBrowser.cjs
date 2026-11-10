// Actual Next SSR + hydration and native Chrome zoom, following the P0/P1 runners.
const { spawn } = require("node:child_process");
const path = require("node:path");
const fs = require("node:fs/promises");
const { chromium, expect } = require("@playwright/test");
const base = "http://127.0.0.1:4191";

function contrast(a, b) {
  const luminance = (color) => {
    const channels = color.match(/[\d.]+/g).slice(0, 3).map((value) => {
      const c = Number(value) / 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  };
  const x = luminance(a), y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

async function recipe(page, width, label, output) {
  if (width) await page.setViewportSize({ width, height: 900 });
  const hydrationErrors = [];
  page.on("console", (message) => { if (message.type() === "error" && /hydration|did not match/i.test(message.text())) hydrationErrors.push(message.text()); });
  page.on("pageerror", (error) => hydrationErrors.push(error.message));
  await page.goto(base);
  await expect(page.locator("html")).toHaveAttribute("data-boreal-theme", "Workspace");
  await expect(page.locator(".recipe-card-body")).toHaveCSS("padding", "0px");
  await expect(page.locator(".recipe-card-body")).toHaveCSS("display", "block");
  await page.getByRole("textbox", { name: "Notification email" }).fill("retained@example.com");
  await page.getByRole("textbox", { name: "Editorial reference", exact: true }).fill("Retained reference");
  await page.getByRole("button", { name: "Save publication preferences", exact: true }).click();
  await expect(page.getByRole("button", { name: "Saving publication preferences, please wait" })).toBeDisabled();
  await expect(page.getByText(/The server could not save/)).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Notification email" })).toHaveValue("retained@example.com");
  await expect(page.getByRole("textbox", { name: "Editorial reference", exact: true })).toHaveValue("Retained reference");
  await page.getByRole("button", { name: "Save successfully in this demo" }).click();
  await expect(page.getByText("Preferences saved.")).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Notification email" })).not.toHaveAttribute("aria-invalid");
  const filter = page.getByRole("combobox", { name: "Filter publication status" });
  await page.getByRole("textbox", { name: "View name (uncontrolled)" }).fill("Temporary view");
  await filter.selectOption("draft");
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(filter).toHaveValue("");
  await expect(page.getByRole("textbox", { name: "View name (uncontrolled)" })).toHaveValue("All publications");
  const table = page.getByRole("region", { name: "Publication documents", exact: true });
  expect(await table.evaluate((node) => node.scrollWidth >= node.clientWidth)).toBe(true);
  const firstRow = table.locator("tbody tr").first();
  await firstRow.hover();
  const hoverColor = await firstRow.evaluate((node) => getComputedStyle(node).getPropertyValue("--hover-background").trim());
  const hex = hoverColor.replace("#", "");
  await expect(firstRow).toHaveCSS("background-color", `rgb(${[0, 2, 4].map((index) => parseInt(hex.slice(index, index + 2), 16)).join(", ")})`);
  await table.getByRole("checkbox").last().check();
  const selected = table.locator('[data-selected="true"]');
  const selectedColors = await selected.evaluate((node) => ({ bg: getComputedStyle(node).backgroundColor, fg: getComputedStyle(node).color }));
  expect(contrast(selectedColors.bg, selectedColors.fg)).toBeGreaterThanOrEqual(4.5);
  await table.getByRole("button", { name: "Edit publication and review delivery settings" }).click();
  await expect(page.getByRole("status", { name: "Document action" })).toHaveText("Edit publication");
  const disabled = page.getByRole("button", { name: "Unavailable action", exact: true });
  const disabledColors = await disabled.evaluate((node) => ({ bg: getComputedStyle(node).backgroundColor, fg: getComputedStyle(node).color }));
  expect(contrast(disabledColors.bg, disabledColors.fg)).toBeGreaterThanOrEqual(4.5);
  await expect(disabled).toHaveCSS("border-top-style", "dashed");
  const open = page.getByRole("button", { name: "Open publication dialog" });
  await open.click();
  const dialog = page.getByRole("dialog", { name: "Publication preferences", exact: true });
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveCSS("background-color", "rgb(32, 56, 42)");
  await expect(page.locator("html")).toHaveAttribute("data-boreal-theme", "Workspace");
  const explicit = page.getByTestId("explicit-scope");
  expect(await explicit.evaluate((node) => getComputedStyle(node.parentElement).getPropertyValue("--background-color-surface").trim())).toBe("#20382a");
  const independent = page.getByTestId("independent-portal");
  expect(await independent.evaluate((node) => node.parentElement.dataset.borealTheme)).toBe("Workspace");
  expect(await dialog.evaluate((node) => node.contains(document.activeElement))).toBe(true);
  const switcher = dialog.getByRole("button", { name: "Switch dialog theme" });
  await switcher.click();
  await expect(dialog).not.toHaveCSS("background-color", "rgb(32, 56, 42)");
  await expect(switcher).toBeFocused();
  await switcher.click();
  await expect(dialog).toHaveCSS("background-color", "rgb(32, 56, 42)");
  await dialog.getByRole("button", { name: "Open nested confirmation" }).click();
  const nested = page.getByRole("dialog", { name: "Confirm publication", exact: true });
  await expect(nested).toBeVisible();
  await expect(nested).toHaveCSS("background-color", "rgb(32, 56, 42)");
  await page.keyboard.press("Escape");
  await expect(nested).toHaveCount(0);
  await expect(dialog.getByRole("button", { name: "Open nested confirmation" })).toBeFocused();
  const body = page.getByTestId("modal-body");
  expect(await body.evaluate((node) => node.scrollHeight > node.clientHeight)).toBe(true);
  await switcher.focus();
  await page.keyboard.press("PageDown");
  await expect.poll(() => body.evaluate((node) => node.scrollTop)).toBeGreaterThan(0);
  const action = dialog.getByRole("button", { name: "Save preferences and return to the document list" });
  await action.focus();
  const bounds = await action.boundingBox();
  expect(bounds.y + bounds.height).toBeLessThanOrEqual(await page.evaluate(() => innerHeight));
  await page.keyboard.press("Tab");
  expect(await dialog.evaluate((node) => node.contains(document.activeElement))).toBe(true);
  await page.mouse.move(-10, -10);
  const cdp = await page.context().newCDPSession(page);
  const { contentSize } = await cdp.send("Page.getLayoutMetrics");
  const image = await cdp.send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true, clip: { x: 0, y: 0, width: contentSize.width, height: contentSize.height, scale: 1 } });
  await fs.writeFile(path.join(output, `dialog-${label}.png`), Buffer.from(image.data, "base64"));
  await cdp.detach();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(open).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  expect(hydrationErrors).toEqual([]);
}

async function main() {
  const root = path.resolve(__dirname, "..");
  const output = path.join(root, "out/semantic-theme-browser");
  await fs.mkdir(output, { recursive: true });
  const server = spawn(process.execPath, [path.join(root, "node_modules/next/dist/bin/next"), "dev", "examples/theme-app", "--webpack", "--hostname", "127.0.0.1", "--port", "4191"], { cwd: root, windowsHide: true, stdio: "pipe" });
  let log = ""; server.stdout.on("data", (data) => { log += data; }); server.stderr.on("data", (data) => { log += data; });
  const launch = { headless: true, channel: process.env.BOREAL_BROWSER_CHANNEL || undefined };
  let browser, zoom;
  try {
    for (let attempt = 0; ; attempt++) {
      if (server.exitCode !== null) throw new Error(log);
      try { if ((await fetch(base)).ok) break; } catch { /* startup */ }
      if (attempt === 100) throw new Error(log);
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
    browser = await chromium.launch(launch);
    for (const [preference, expected] of [[null, "Workspace"], ["removed-theme", "Workspace"], ["Evening", "Evening"]]) {
      const context = await browser.newContext({ javaScriptEnabled: false });
      if (preference) await context.addCookies([{ name: "boreal-theme", value: preference, url: base }]);
      const page = await context.newPage(); await page.goto(base);
      await expect(page.locator("html")).toHaveAttribute("data-boreal-theme", expected);
      const colors = await page.locator("main").evaluate((node) => ({ bg: getComputedStyle(node).backgroundColor, fg: getComputedStyle(node).color }));
      expect(contrast(colors.bg, colors.fg)).toBeGreaterThanOrEqual(4.5);
      await context.close();
    }
    const savedContext = await browser.newContext();
    await savedContext.addCookies([{ name: "boreal-theme", value: "Evening", url: base }]);
    await savedContext.addInitScript(() => localStorage.setItem("boreal:selectedSchemeName", "Workspace"));
    const savedPage = await savedContext.newPage();
    const savedErrors = [];
    savedPage.on("console", (message) => { if (message.type() === "error" && /hydration|did not match/i.test(message.text())) savedErrors.push(message.text()); });
    await savedPage.goto(base);
    await expect(savedPage.getByTestId("independent-portal")).toBeVisible();
    await expect(savedPage.locator("html")).toHaveAttribute("data-boreal-theme", "Evening");
    expect(savedErrors).toEqual([]);
    await savedContext.close();
    const builtins = await browser.newPage(); await builtins.goto(`${base}/builtins`);
    const samples = await builtins.locator("[data-role]").evaluateAll((nodes) => nodes.map((node) => ({ bg: getComputedStyle(node).backgroundColor, fg: getComputedStyle(node).color, muted: getComputedStyle(node.querySelector("[data-muted]")).color, focus: getComputedStyle(node.querySelector("button")).outlineColor })));
    expect(samples.length).toBeGreaterThan(20);
    for (const sample of samples) {
      expect(contrast(sample.bg, sample.fg)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(sample.bg, sample.muted)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(sample.bg, sample.focus)).toBeGreaterThanOrEqual(3);
    }
    for (const field of await builtins.locator(".invalid-surface").all()) {
      const colors = await field.evaluate((node) => ({ bg: getComputedStyle(node).backgroundColor, fg: getComputedStyle(node).color }));
      expect(contrast(colors.bg, colors.fg)).toBeGreaterThanOrEqual(4.5);
    }
    for (const field of await builtins.locator(".disabled-surface").all()) {
      await field.hover();
      const colors = await field.evaluate((node) => ({ bg: getComputedStyle(node).backgroundColor, fg: getComputedStyle(node.querySelector("select")).color }));
      expect(contrast(colors.bg, colors.fg)).toBeGreaterThanOrEqual(4.5);
      await expect(field.locator("select")).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    }
    for (const field of await builtins.locator(".disabled-field").all()) {
      const control = field.locator("input,textarea");
      const wrapper = field.locator(".disabled-control");
      const checkDisabled = async () => {
        const colors = await control.evaluate((node) => ({ bg: getComputedStyle(node.parentElement).backgroundColor, fg: getComputedStyle(node).color, icon: node.parentElement.querySelector("svg") ? getComputedStyle(node.parentElement.querySelector("svg")).color : null }));
        expect(contrast(colors.bg, colors.fg)).toBeGreaterThanOrEqual(4.5);
        if (colors.icon) expect(contrast(colors.bg, colors.icon)).toBeGreaterThanOrEqual(3);
        await expect(field).toHaveCSS("opacity", "1");
        await expect(wrapper).toHaveCSS("opacity", "1");
        await expect(wrapper).toHaveCSS("border-top-style", "dashed");
      };
      await checkDisabled();
      await wrapper.hover();
      await checkDisabled();
    }
    for (const wrapper of await builtins.locator(".placeholder-control").all()) {
      const colors = await wrapper.locator("input,textarea").evaluate((node) => ({ bg: getComputedStyle(node.parentElement).backgroundColor, fg: getComputedStyle(node, "::placeholder").color }));
      expect(contrast(colors.bg, colors.fg)).toBeGreaterThanOrEqual(4.5);
    }
    const buttons = await builtins.locator(".disabled-button").evaluateAll((nodes) => nodes.map((node) => ({
      bg: getComputedStyle(node).backgroundColor, fg: getComputedStyle(node).color,
      border: getComputedStyle(node).borderTopStyle, opacity: getComputedStyle(node).opacity,
    })));
    expect(buttons.length).toBeGreaterThan(100);
    for (const button of buttons) {
      expect(contrast(button.bg, button.fg)).toBeGreaterThanOrEqual(4.5);
      expect(button.border).toBe("dashed"); expect(button.opacity).toBe("1");
    }
    await builtins.close();
    const serverFields = await browser.newPage();
    const fieldErrors = [];
    serverFields.on("pageerror", (error) => fieldErrors.push(error.message));
    serverFields.on("console", (message) => { if (message.type() === "error" && /hydration|did not match/i.test(message.text())) fieldErrors.push(message.text()); });
    await serverFields.goto(`${base}/server-fields`);
    const fieldIds = await serverFields.locator("input,textarea,select").evaluateAll((nodes) => nodes.map((node) => {
      for (const id of node.getAttribute("aria-describedby").split(" ")) {
        if (!document.getElementById(id)) throw new Error(`Missing description: ${id}`);
      }
      if (!node.labels.length) throw new Error("Missing native field label");
      return node.id;
    }));
    expect(fieldIds).toHaveLength(6);
    expect(new Set(fieldIds).size).toBe(6);
    expect(fieldErrors).toEqual([]);
    await serverFields.close();
    const family = await browser.newPage(); await family.goto(`${base}/overlay-family`);
    const checkOrigin = async (locator) => {
      await expect(locator).toBeVisible();
      expect(await locator.evaluate((node) => getComputedStyle(node).getPropertyValue("--background-color-surface").trim())).toBe("#20382a");
      await expect(family.locator("html")).toHaveAttribute("data-boreal-theme", "Workspace");
    };
    for (const [opener, name] of [["Open drawer sample", "Scoped drawer"], ["Open command sample", "Scoped commands"], ["Open message sample", "Scoped message"]]) {
      await family.getByRole("button", { name: opener, exact: true }).click();
      const dialog = family.getByRole("dialog", { name, exact: true });
      await checkOrigin(dialog);
      if (name !== "Scoped drawer") await expect(dialog).toHaveCSS("background-color", "rgb(32, 56, 42)");
      await family.keyboard.press("Escape");
      await expect(dialog).not.toBeVisible();
    }
    await family.getByRole("button", { name: "Open menu sample", exact: true }).click();
    await checkOrigin(family.getByRole("button", { name: "Scoped menu item" }));
    await family.keyboard.press("Escape");
    await family.getByRole("button", { name: "Open popover sample", exact: true }).click();
    await checkOrigin(family.getByRole("dialog", { name: "Scoped popover" }));
    await family.keyboard.press("Escape");
    await family.getByRole("button", { name: "Tooltip sample", exact: true }).hover();
    await checkOrigin(family.getByRole("tooltip", { name: "Scoped tooltip" }));
    await family.mouse.move(-10, -10);
    await family.getByRole("button", { name: "Open chip sample", exact: true }).click();
    await checkOrigin(family.getByText("Scoped notification", { exact: true }));
    await family.keyboard.press("Escape");
    await family.close();
    console.log("Overlay family: Drawer, Dropdown, PopOver, Tooltip, CommandPalette, MessagePopup and Chip inherited the local scope");
    for (const width of [320, 768, 1280]) {
      const page = await browser.newPage(); await recipe(page, width, `${width}px`, output); await page.close();
      console.log(`${width}px: SSR/hydration, form results, semantic states, nested overlays, focus and scrolling passed`);
    }
    const profile = await fs.mkdtemp(path.join(output, "zoom-profile-")); await fs.mkdir(path.join(profile, "Default"));
    await fs.writeFile(path.join(profile, "Default/Preferences"), JSON.stringify({ partition: { default_zoom_level: { x: Math.log(2) / Math.log(1.2) } } }));
    zoom = await chromium.launchPersistentContext(profile, { ...launch, viewport: null, args: ["--window-size=1280,1000"] });
    const page = await zoom.newPage(); await recipe(page, null, "200-percent", output);
    expect(await page.evaluate(() => devicePixelRatio)).toBeCloseTo(2, 1);
    console.log("200% native zoom: inherited dialog theme, scrolling body and reachable actions passed");
  } catch (error) {
    console.error(log.slice(-10000));
    throw error;
  } finally {
    if (zoom) await zoom.close(); if (browser) await browser.close(); server.kill();
  }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
