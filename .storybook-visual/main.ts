import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/nextjs-vite";
import path, { dirname } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config: StorybookConfig = {
  stories: ["../stories-visual/**/*.stories.@(js|jsx|ts|tsx|mdx)"],
  addons: ["@chromatic-com/storybook", "@storybook/addon-docs"],
  framework: {
    name: "@storybook/nextjs-vite",
    options: {},
  },
  viteFinal: (viteConfig) => {
    viteConfig.resolve = {
      ...viteConfig.resolve,
      alias: {
        "@": path.resolve(__dirname, "../src"),
        "@components": path.resolve(__dirname, "../src/components"),
        "@styles": path.resolve(__dirname, "../src/styles"),
        "@utils": path.resolve(__dirname, "../src/utils"),
        "@types": path.resolve(__dirname, "../src/types"),
        "@context": path.resolve(__dirname, "../src/context"),
      },
    };
    return viteConfig;
  },
};

export default config;
