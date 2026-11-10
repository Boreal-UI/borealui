// Standalone browser defaults cannot be established by DOM events in an iframe.
// Run: node scripts/testSelectDataTableBrowser.cjs
const { spawn } = require("node:child_process");
const path = require("node:path");
const fs = require("node:fs/promises");
const { chromium, expect } = require("@playwright/test");

async function main() {
  const root = path.resolve(__dirname, "..");
  const base = "http://127.0.0.1:4179";
  const server = spawn(process.execPath, [path.join(root, "node_modules/vite/bin/vite.js"), "--host", "127.0.0.1", "--port", "4179", "--strictPort"], { cwd: root, windowsHide: true, stdio: "pipe" });
  let serverLog = "";
  server.stdout.on("data", (data) => { serverLog += data; });
  server.stderr.on("data", (data) => { serverLog += data; });
  let browser;
  try {
    for (let attempt = 0; ; attempt++) {
      if (server.exitCode !== null) throw new Error(serverLog);
      try {
        if ((await fetch(`${base}/cypress/fixtures/select-datatable-native.html`)).ok) break;
      } catch { /* wait for Vite */ }
      if (attempt === 100) throw new Error(`Vite did not start: ${serverLog}`);
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
    browser = await chromium.launch({ headless: true, channel: process.env.BOREAL_BROWSER_CHANNEL || undefined });
    const outputDir = path.join(root, "out/select-datatable-browser");
    await fs.mkdir(outputDir, { recursive: true });
    for (const implementation of ["core", "next"]) {
      const page = await browser.newPage({ viewport: { width: 1100, height: 1000 } });
      page.setDefaultTimeout(10000);
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      const url = `${base}/cypress/fixtures/select-datatable-native.html?implementation=${implementation}`;
      await page.goto(url);
      await page.getByRole("button", { name: "Before table" }).focus();
      await page.keyboard.press("Tab");
      const region = page.getByRole("region", { name: "Publications", exact: true });
      await expect(region).toBeFocused();
      expect(await region.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
      expect(await region.evaluate((element) => element.matches(":focus-visible"))).toBe(true);
      await expect(region).toHaveCSS("outline-style", "solid");
      await expect(region).toHaveCSS("outline-width", "2px");
      await page.screenshot({ path: path.join(outputDir, `${implementation}-focus.png`) });
      await page.keyboard.press("ArrowRight");
      await expect.poll(() => region.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
      const small = page.getByRole("region", { name: "Small table", exact: true });
      await expect(small).toHaveAttribute("tabindex", "0");
      expect(await small.evaluate((element) => element.scrollWidth === element.clientWidth)).toBe(true);

      // Native modified link click opens another tab without row activation.
      const popupPromise = page.context().waitForEvent("page");
      await page.getByRole("link", { name: "Member details" }).click({ modifiers: [process.platform === "darwin" ? "Meta" : "Control"] });
      const popup = await popupPromise;
      await popup.waitForURL(/[?]destination=member$/);
      await popup.close();
      await expect(page.getByRole("status", { name: "Row activations" })).toHaveText("0");
      await page.getByRole("button", { name: "Edit", exact: true }).click();
      await expect(page.getByRole("status", { name: "Row activations" })).toHaveText("0");
      await page.getByText("Row content", { exact: true }).click();
      await expect(page.getByRole("status", { name: "Row activations" })).toHaveText("1");
      await region.locator("tbody tr").focus();
      await page.keyboard.press("Enter");
      await page.keyboard.press("Space");
      await expect(page.getByRole("status", { name: "Row activations" })).toHaveText("3");

      const format = page.getByRole("combobox", { name: "Publication format", exact: true });
      await format.selectOption("digital");
      // A native keyboard move cannot land on the disabled last option.
      await format.focus();
      await page.keyboard.press("End");
      await expect(format).toHaveValue("digital");
      await page.getByRole("button", { name: "Publish", exact: true }).click();
      await expect(page.getByRole("status", { name: "Submitted formats" })).toHaveText("digital");
      await expect(format).toHaveValue("digital");
      await page.getByRole("button", { name: "Publish", exact: true }).click();
      await expect(page.getByRole("status", { name: "Submitted formats" })).toHaveText("digital,digital");
      await page.getByRole("button", { name: "Reset controlled", exact: true }).click();
      await expect(format).toHaveValue("digital");
      await page.getByRole("button", { name: "Use print", exact: true }).click();
      await expect(format).toHaveValue("print");
      await page.getByRole("button", { name: "Publish", exact: true }).click();
      await expect(page.getByRole("status", { name: "Submitted formats" })).toHaveText("digital,digital,print");
      await format.selectOption("digital");
      await page.getByRole("button", { name: "Publish and reset format", exact: true }).click();
      await expect(format).toHaveValue("print");
      await expect(page.getByRole("status", { name: "Current format" })).toHaveText("print");
      await page.getByRole("button", { name: "Publish", exact: true }).click();
      await expect(page.getByRole("status", { name: "Submitted formats" })).toHaveText("digital,digital,print,digital,print");
      await page.getByRole("link", { name: "Member details" }).click();
      await page.waitForURL(/[?]destination=member$/);
      expect(errors).toEqual([]);
      await page.close();
      console.log(`${implementation}: native keyboard scrolling, visible focus, link navigation, row activation and React action resets passed`);
    }
  } finally {
    if (browser) await browser.close();
    server.kill();
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
