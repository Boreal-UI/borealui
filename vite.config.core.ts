import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { libInjectCss } from "vite-plugin-lib-inject-css";
import getEntryMap from "./scripts/buildEntryMap.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const externals = [
  "react",
  "react-dom",
  "react/jsx-runtime",
  "react/jsx-dev-runtime",
  "marked",
  "uuid",
];

const coreEntries = getEntryMap("./src/core") as Record<string, string>;

coreEntries.index = path.resolve(__dirname, "./src/index.core.ts");

export default defineConfig({
  plugins: [react(), libInjectCss()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },

  build: {
    outDir: "dist/core",
    emptyOutDir: true,
    sourcemap: false,
    minify: "esbuild",
    cssCodeSplit: true,

    lib: {
      entry: coreEntries,
      formats: ["es", "cjs"],
      fileName: (format, entryName) =>
        `${entryName}${format === "es" ? ".js" : ".cjs.js"}`,
    },

    rollupOptions: {
      external: externals,
    },
  },
});
