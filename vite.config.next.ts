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

const isExternal = (id: string) =>
  externals.includes(id) || id === "next" || id.startsWith("next/");

const nextEntries = getEntryMap("./src/next") as Record<string, string>;

nextEntries.index = path.resolve(__dirname, "./src/index.next.ts");

export default defineConfig({
  plugins: [react(), libInjectCss()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },

  build: {
    outDir: "dist/next",
    emptyOutDir: true,
    sourcemap: true,
    minify: false,
    cssCodeSplit: true,

    lib: {
      entry: nextEntries,
      formats: ["es"],
      fileName: (_format, entryName) => `${entryName}.js`,
    },

    rollupOptions: {
      external: isExternal,
    },
  },
});
