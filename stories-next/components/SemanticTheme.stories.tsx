import type { Meta } from "@storybook/nextjs-vite";
import { Card, Modal, Button, TextInput, Select, DataTable, Portal, ThemeProvider } from "../../src/index.next";
import { SemanticThemeRecipes } from "../../shared-story-assets/SemanticThemeRecipes";
import { themeConfig, workspaceTheme } from "../../examples/theme-app/theme";
export default { title: "Recipes/Semantic themes and composition" } satisfies Meta;
export const Application = { render: () => <ThemeProvider scope="local" {...themeConfig} initialSchemeName={workspaceTheme.name}><SemanticThemeRecipes {...{ Card, Modal, Button, TextInput, Select, DataTable, Portal }} /></ThemeProvider> };
