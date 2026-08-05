import { defineConfig } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },

  build: {
    outDir: "dist/docs",
    emptyOutDir: true,
    sourcemap: false,
    minify: "esbuild",

    lib: {
      entry: path.resolve(__dirname, "./src/docs/index.ts"),
      formats: ["es"],
      fileName: () => "index.js",
    },

    rollupOptions: {
      output: {
        exports: "named",
      },
    },
  },
});
