import { defineConfig } from "@playwright/test";
import { fileURLToPath } from "node:url";
export default defineConfig({ testDir: ".", testMatch: "*.spec.ts", timeout: 240000,
  workers: 1, use: { baseURL: "http://127.0.0.1:4178", headless: true,
    browserName: (process.env.PLAYWRIGHT_BROWSER ?? "chromium") as "chromium" | "firefox" | "webkit",
    channel: process.env.PLAYWRIGHT_CHANNEL },
  outputDir: `../../output/playwright/${process.env.PLAYWRIGHT_BROWSER ?? "chromium"}-regressions`,
  webServer: { cwd: fileURLToPath(new URL("../../", import.meta.url)), command: "npx vite --config __tests__/browser/vite.config.ts", url: "http://127.0.0.1:4178/__tests__/browser/index.html", reuseExistingServer: false, timeout: 60000 },
});
