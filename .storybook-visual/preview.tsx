import type { Preview } from "@storybook/nextjs-vite";
import "../src/styles/globals.scss";
import "../stories-visual/visualParity.scss";

const preview: Preview = {
  parameters: {
    controls: { disable: true },
    chromatic: {
      pauseAnimationAtEnd: true,
    },
    options: {
      storySort: {
        order: ["Visual Parity", ["Core", "Next"]],
      },
    },
  },
};

export default preview;
