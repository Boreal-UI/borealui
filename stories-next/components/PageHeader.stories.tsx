import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button, PageHeader } from "../../src/index.next";
import type { PageHeaderProps } from "../../src/components/PageHeader/PageHeader.types";
import {
  renderThemeVariants,
  renderStateVariants,
  renderOutlineVariants,
  renderGlassVariants,
  renderGlassOutlineVariants,
  renderStateOutlineVariants,
} from "../../shared-story-assets/VisualVariantStories";
import { FaTree } from "react-icons/fa";
import { roundingOptions } from "../../shared-story-assets/OptionTypes";

const BreadcrumbExample = () => (
  <nav
    aria-label="Breadcrumb"
    style={{
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      flexWrap: "wrap",
      fontSize: "0.875rem",
    }}
  >
    <a href="#home">Home</a>
    <span aria-hidden="true">/</span>
    <a href="#projects">Projects</a>
    <span aria-hidden="true">/</span>
    <strong>Dashboard</strong>
  </nav>
);

const MetaExample = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      flexWrap: "wrap",
    }}
  >
    <span>Updated 5 minutes ago</span>
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.35rem",
        padding: "0.25rem 0.5rem",
        border: "1px solid currentColor",
        borderRadius: "0.375rem",
        opacity: 0.8,
      }}
    >
      Admin Access
    </span>
  </div>
);

const ActionsExample = () => (
  <>
    <Button theme="secondary" type="button">
      Export Report
    </Button>
    <Button theme="tertiary" outline type="button">
      Create New Task
    </Button>
  </>
);

const BodyContentExample = () => (
  <div
    style={{
      display: "flex",
      gap: "0.5rem",
      flexWrap: "wrap",
      marginTop: "0.25rem",
    }}
  >
    <span>Active projects: 12</span>
    <span>Open incidents: 1</span>
    <span>Region: North America</span>
  </div>
);

const FooterExample = () => (
  <div>
    <nav
      aria-label="Page sections"
      style={{
        display: "flex",
        gap: "1rem",
        flexWrap: "wrap",
      }}
    >
      <a href="#overview">Overview</a>
      <a href="#timeline">Timeline</a>
      <a href="#resources">Resources</a>
      <a href="#settings">Settings</a>
    </nav>

    <span style={{ whiteSpace: "nowrap" }}>3 collaborators</span>
  </div>
);

const meta: Meta<PageHeaderProps> = {
  title: "Components/PageHeader",
  component: PageHeader,
  tags: ["autodocs"],
  argTypes: {
    rounding: {
      control: "select",
      options: roundingOptions,
      description: "Controls the border radius of the page header.",
    },
  },
  args: {
    before: <BreadcrumbExample />,
    eyebrow: "Project Management",
    icon: <FaTree />,
    title: "Executive Overview",
    subtitle:
      "A comprehensive view of active projects, resource allocation, and timeline milestones.",
    meta: <MetaExample />,
    actions: <ActionsExample />,
    children: <BodyContentExample />,
    footer: <FooterExample />,
    theme: "primary",
    fullWidth: true,
  },
};

export default meta;

type Story = StoryObj<PageHeaderProps>;

export const Default: Story = {};

export const SectionBreakdown: Story = {
  args: {
    before: (
      <div>
        <strong>before:</strong> Used for breadcrumbs or content that should
        appear above the main title row.
      </div>
    ),
    icon: <FaTree />,
    eyebrow: "eyebrow: Small contextual label",
    title: "title: Main Page Heading",
    subtitle:
      "subtitle: Supporting page description that explains what this screen is for.",
    meta: (
      <div>
        <strong>meta:</strong> Updated 5 minutes ago · Admin Access
      </div>
    ),
    actions: (
      <>
        <button type="button">Primary Action</button>
        <button type="button">Secondary Action</button>
      </>
    ),
    children: (
      <div>
        <strong>children:</strong> Additional body content rendered under the
        title cluster.
      </div>
    ),
    footer: (
      <div>
        <strong>footer:</strong> Tabs, filters, status summaries, or secondary
        navigation.
      </div>
    ),
  },
};

export const DashboardHeader: Story = {
  args: {
    before: <BreadcrumbExample />,
    eyebrow: "Project Management",
    icon: <FaTree />,
    title: "Executive Overview",
    subtitle:
      "A comprehensive view of active projects, resource allocation, and timeline milestones within the global infrastructure network.",
    meta: <MetaExample />,
    actions: <ActionsExample />,
    children: <BodyContentExample />,
    footer: <FooterExample />,
    fullWidth: true,
  },
};

export const WithoutActions: Story = {
  args: {
    title: "Project Overview",
    subtitle: "A simplified header without action controls.",
    actions: undefined,
  },
};

export const WithoutFooter: Story = {
  args: {
    footer: undefined,
  },
};

export const Compact: Story = {
  args: {
    compact: true,
    before: <BreadcrumbExample />,
    eyebrow: "Team",
    title: "Members",
    subtitle: "Invite teammates and manage access.",
    meta: "24 active members",
    actions: <button type="button">Invite</button>,
    footer: undefined,
  },
};

export const WithFooter: Story = {
  args: {
    footer: <FooterExample />,
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    title: "Loading dashboard",
    subtitle: "Fetching the latest project metrics.",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    title: "Disabled header",
    subtitle: "This header is visually disabled.",
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
