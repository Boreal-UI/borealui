import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PageHeader } from "../../src/index.next";
import type { PageHeaderProps } from "../../src/components/PageHeader/PageHeader.types";
import { StoryGrid } from "../../.storybook-core/helpers/StoryGrid";
import { themeOptions } from "../../shared-story-assets/OptionTypes";

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

export const ThemeVariants = () => (
  <StoryGrid title="Theme Variants">
    {themeOptions.map((theme) => (
      <PageHeader
        key={theme}
        title={`${theme} header`}
        subtitle="Theme-aware page context."
        theme={theme}
        actions={<button type="button">Action</button>}
      />
    ))}
  </StoryGrid>
);
