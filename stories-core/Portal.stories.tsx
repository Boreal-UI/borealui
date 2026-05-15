import type { Meta, StoryObj } from "@storybook/react-vite";
import { Portal } from "../src/index.core";
import type { PortalProps } from "../src/components/Portal/Portal.types";
import {
  renderThemeVariants,
  renderStateVariants,
  renderOutlineVariants,
  renderGlassVariants,
  renderGlassOutlineVariants,
  renderStateOutlineVariants,
} from "../shared-story-assets/VisualVariantStories";

const meta: Meta<PortalProps> = {
  title: "Components/Portal",
  component: Portal,
  tags: ["autodocs"],
  args: {
    children: (
      <div
        style={{
          bottom: "1rem",
          position: "fixed",
          right: "1rem",
          zIndex: 1000,
        }}
      >
        Portal content mounted at document body
      </div>
    ),
  },
};

export default meta;

type Story = StoryObj<PortalProps>;

export const Default: Story = {};

export const InlineFallback: Story = {
  args: {
    disabled: true,
    children: <div>Rendered inline when portal behavior is disabled.</div>,
  },
};

export const WithAccessibleContext: Story = {
  args: {
    srOnlyText: "Supplemental portal region",
    children: (
      <div
        role="status"
        style={{
          bottom: "1rem",
          position: "fixed",
          right: "1rem",
          zIndex: 1000,
        }}
      >
        Saved changes
      </div>
    ),
  },
};

export const ThemeMatrix: Story = {
  render: (args) => renderThemeVariants({ component: Portal, args }),
};

export const StateMatrix: Story = {
  render: (args) => renderStateVariants({ component: Portal, args }),
};

export const OutlineMatrix: Story = {
  render: (args) => renderOutlineVariants({ component: Portal, args }),
};

export const GlassMatrix: Story = {
  render: (args) => renderGlassVariants({ component: Portal, args }),
};

export const GlassOutlineMatrix: Story = {
  render: (args) => renderGlassOutlineVariants({ component: Portal, args }),
};

export const StateOutlineMatrix: Story = {
  render: (args) => renderStateOutlineVariants({ component: Portal, args }),
};
