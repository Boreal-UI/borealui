import type { Meta, StoryObj } from "@storybook/react-vite";
import { SplitPane } from "../src/index.core";
import type { SplitPaneProps } from "../src/components/SplitPane/SplitPane.types";
import {
  renderThemeVariants,
  renderStateVariants,
  renderOutlineVariants,
  renderGlassVariants,
  renderGlassOutlineVariants,
  renderStateOutlineVariants,
} from "../shared-story-assets/VisualVariantStories";

const paneStyle = {
  minHeight: "12rem",
  padding: "1rem",
} as const;

const meta: Meta<SplitPaneProps> = {
  title: "Components/SplitPane",
  component: SplitPane,
  tags: ["autodocs"],
  args: {
    startPane: <div style={paneStyle}>Navigation or source list</div>,
    endPane: <div style={paneStyle}>Details, preview, or editor content</div>,
    defaultSize: 35,
    minSize: 20,
    maxSize: 75,
    theme: "primary",
  },
};

export default meta;

type Story = StoryObj<SplitPaneProps>;

export const Default: Story = {};

export const Vertical: Story = {
  args: {
    orientation: "vertical",
    defaultSize: 45,
    startPane: <div style={paneStyle}>Top pane</div>,
    endPane: <div style={paneStyle}>Bottom pane</div>,
  },
};

export const Static: Story = {
  args: {
    resizable: false,
    defaultSize: 40,
  },
};

export const ChildrenFallback: Story = {
  args: {
    children: [
      <div key="start" style={paneStyle}>
        First child becomes the start pane
      </div>,
      <div key="end" style={paneStyle}>
        Second child becomes the end pane
      </div>,
    ],
  },
};

export const ThemeVariants: Story = {
  render: (args) => renderThemeVariants({ component: SplitPane, args }),
};

export const StateVariants: Story = {
  render: (args) => renderStateVariants({ component: SplitPane, args }),
};

export const OutlineVariants: Story = {
  render: (args) => renderOutlineVariants({ component: SplitPane, args }),
};

export const GlassVariants: Story = {
  render: (args) => renderGlassVariants({ component: SplitPane, args }),
};

export const GlassOutlineVariants: Story = {
  render: (args) => renderGlassOutlineVariants({ component: SplitPane, args }),
};

export const StateOutlineVariants: Story = {
  render: (args) => renderStateOutlineVariants({ component: SplitPane, args }),
};
