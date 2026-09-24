import { defineConfig } from "cypress";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "node:url";

const configDirectory = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  allowCypressEnv: false,
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
            "@": path.resolve(configDirectory, "src"),
          },
        },
        css: {
          preprocessorOptions: {
            scss: {
              api: "modern",
              loadPaths: [path.resolve(configDirectory, "node_modules")],
            },
          },
        },
      },
    },
  },
});
