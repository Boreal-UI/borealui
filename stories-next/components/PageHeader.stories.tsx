import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PageHeader } from "../../src/index.next";
import type { PageHeaderProps } from "../../src/components/PageHeader/PageHeader.types";
import { StoryGrid } from "../../.storybook-core/helpers/StoryGrid";
import { themeOptions } from "../../shared-story-assets/OptionTypes";
import {
  renderThemeVariants,
  renderStateVariants,
  renderOutlineVariants,
  renderGlassVariants,
  renderGlassOutlineVariants,
  renderStateOutlineVariants,
} from "../../shared-story-assets/VisualVariantStories";

const meta: Meta<PageHeaderProps> = {
  title: "Components/PageHeader",
  component: PageHeader,
  tags: ["autodocs"],
  args: {
    eyebrow: "Workspace",
    title: "Analytics dashboard",
    subtitle: "Track usage, adoption, and operational health across teams.",
    meta: "Updated 5 minutes ago",
    actions: <button type="button">Export</button>,
    children: <span>North America region</span>,
    theme: "primary",
  },
};

export default meta;

type Story = StoryObj<PageHeaderProps>;

export const Default: Story = {};

export const Compact: Story = {
  args: {
    compact: true,
    title: "Members",
    subtitle: "Invite teammates and manage access.",
    actions: <button type="button">Invite</button>,
  },
};

export const WithFooter: Story = {
  args: {
    footer: (
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <span>Active projects: 12</span>
        <span>Open incidents: 1</span>
      </div>
    ),
  },
};

export const ThemeVariants: Story = {
  render: (args) => renderThemeVariants({ component: PageHeader, args }),
};

export const StateVariants: Story = {
  render: (args) => renderStateVariants({ component: PageHeader, args }),
};

export const OutlineVariants: Story = {
  render: (args) => renderOutlineVariants({ component: PageHeader, args }),
};

export const GlassVariants: Story = {
  render: (args) => renderGlassVariants({ component: PageHeader, args }),
};

export const GlassOutlineVariants: Story = {
  render: (args) => renderGlassOutlineVariants({ component: PageHeader, args }),
};

export const StateOutlineVariants: Story = {
  render: (args) => renderStateOutlineVariants({ component: PageHeader, args }),
};
