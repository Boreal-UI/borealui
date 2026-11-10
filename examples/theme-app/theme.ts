import type { ColorScheme } from "../../src/types/types";

// Illustrative palettes: keep your application's own brand values in this file.
export const workspaceTheme: ColorScheme = {
  name: "Workspace", primaryColor: "#24563f", secondaryColor: "#efc579",
  tertiaryColor: "#b49878", quaternaryColor: "#354d42", backgroundColor: "#f8faf7",
};
export const eveningTheme: ColorScheme = {
  ...workspaceTheme, name: "Evening", backgroundColor: "#14251c",
  semanticTokens: {
    "--background-color-surface": "#20382a", "--border-color": "#8ea598",
    "--text-color-light": "#d7e2da", "--focus-outline-color": "#f4d995",
  },
};
export const themeConfig = {
  customSchemes: [workspaceTheme, eveningTheme], useOnlyCustomSchemes: true,
};
