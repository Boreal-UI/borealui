import { defineConfig } from "cypress";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  component: {
    specPattern: "cypress/component/**/*.cy.{ts,tsx}",
    supportFile: "cypress/support/component.ts",
    setupNodeEvents(on) {
      on("task", {
        log(message) {
          console.log(JSON.stringify(message, null, 2));

          return null;
        },
      });
    },
    devServer: {
      framework: "react",
      bundler: "vite",
      viteConfig: {
        plugins: [react()],
        resolve: {
          alias: {
            "@": path.resolve(__dirname, "src"),
          },
        },
        css: {
          preprocessorOptions: {
            scss: {
              api: "modern",
              loadPaths: [path.resolve(__dirname, "node_modules")],
            },
          },
        },
      },
    },
  },
});
