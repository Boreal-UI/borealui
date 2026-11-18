import { defineConfig } from "@playwright/test";
import { fileURLToPath } from "node:url";
const port = Number(process.env.PLAYWRIGHT_PORT ?? 4178);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("Invalid PLAYWRIGHT_PORT");
export default defineConfig({ testDir: ".", testMatch: "*.spec.ts", timeout: 240000,
  workers: 1, use: { baseURL: `http://127.0.0.1:${port}`, headless: true,
    browserName: (process.env.PLAYWRIGHT_BROWSER ?? "chromium") as "chromium" | "firefox" | "webkit",
    channel: process.env.PLAYWRIGHT_CHANNEL },
  outputDir: `../../output/playwright/${process.env.PLAYWRIGHT_BROWSER ?? "chromium"}-regressions`,
  webServer: { cwd: fileURLToPath(new URL("../../", import.meta.url)), command: `npx vite --config __tests__/browser/vite.config.ts --port ${port}`, url: `http://127.0.0.1:${port}/__tests__/browser/index.html`, reuseExistingServer: false, timeout: 60000 },
});
