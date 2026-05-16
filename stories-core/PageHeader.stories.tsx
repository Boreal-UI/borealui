import type { Meta, StoryObj } from "@storybook/react-vite";
import { PageHeader } from "../src/index.core";
import type { PageHeaderProps } from "../src/components/PageHeader/PageHeader.types";
import { StoryGrid } from "../.storybook-core/helpers/StoryGrid";
import { themeOptions } from "../shared-story-assets/OptionTypes";
import {
  renderThemeVariants,
  renderStateVariants,
  renderOutlineVariants,
  renderGlassVariants,
  renderGlassOutlineVariants,
  renderStateOutlineVariants,
} from "../shared-story-assets/VisualVariantStories";

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

export const ThemeMatrix: Story = {
  render: (args) => renderThemeVariants({ component: PageHeader, args }),
};

export const StateMatrix: Story = {
  render: (args) => renderStateVariants({ component: PageHeader, args }),
};

export const OutlineMatrix: Story = {
  render: (args) => renderOutlineVariants({ component: PageHeader, args }),
};

export const GlassMatrix: Story = {
  render: (args) => renderGlassVariants({ component: PageHeader, args }),
};

export const GlassOutlineMatrix: Story = {
  render: (args) => renderGlassOutlineVariants({ component: PageHeader, args }),
};

export const StateOutlineMatrix: Story = {
  render: (args) => renderStateOutlineVariants({ component: PageHeader, args }),
};
