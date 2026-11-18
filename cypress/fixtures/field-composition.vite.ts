import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": fileURLToPath(new URL("../../src", import.meta.url)) } },
  // Next Button imports next/link; this visual fixture has no Next router.
  // Match the environment replacement provided by the Next/Storybook builders.
  define: { "process.env": "{}" },
});
