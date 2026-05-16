import type { Preview } from "@storybook/nextjs-vite";
import ThemeProvider from "../src/context/ThemeContext";
import "../src/styles/globals.scss";
import { ThemeSelect } from "../src/index.next";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <ThemeProvider enableThemeScript>
        <div
          style={{
            padding: "2rem",
            backgroundColor: "var(--background-color)",
          }}
        >
          <Story />
        </div>
        <ThemeSelect />
      </ThemeProvider>
    ),
  ],
};

export default preview;
