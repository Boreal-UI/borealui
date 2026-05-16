import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BreadCrumbPageHeader, Button } from "../../src/index.next";
import type { BreadCrumbPageHeaderProps } from "../../src/components/BreadCrumbPageHeader/BreadCrumbPageHeader.types";
import {
  renderThemeVariants,
  renderStateVariants,
  renderOutlineVariants,
  renderGlassVariants,
  renderGlassOutlineVariants,
  renderStateOutlineVariants,
} from "../../shared-story-assets/VisualVariantStories";

const breadcrumbs = [
  { label: "Home", href: "#" },
  { label: "Admin", href: "#" },
  { label: "Teams", href: "#" },
  { label: "Platform" },
];

const meta: Meta<BreadCrumbPageHeaderProps> = {
  title: "Components/BreadCrumbPageHeader",
  component: BreadCrumbPageHeader,
  tags: ["autodocs"],
  args: {
    breadcrumbs,
    title: "Platform team",
    subtitle: "Manage members, roles, and team-level settings.",
    actions: (
      <Button theme="secondary" type="button">
        Invite member
      </Button>
    ),
    children: <span>24 members</span>,
    theme: "primary",
  },
};

export default meta;

type Story = StoryObj<BreadCrumbPageHeaderProps>;

export const Default: Story = {};

export const CollapsedBreadcrumbs: Story = {
  args: {
    breadcrumbs: [
      { label: "Home", href: "#" },
      { label: "Organization", href: "#" },
      { label: "Departments", href: "#" },
      { label: "Engineering", href: "#" },
      { label: "Platform" },
    ],
    breadcrumbProps: {
      maxVisible: 3,
    },
  },
};

export const CustomSeparator: Story = {
  args: {
    breadcrumbProps: {
      separator: "/",
    },
  },
};

export const ThemeMatrix: Story = {
  render: (args) =>
    renderThemeVariants({ component: BreadCrumbPageHeader, args }),
};

export const StateMatrix: Story = {
  render: (args) =>
    renderStateVariants({ component: BreadCrumbPageHeader, args }),
};

export const OutlineMatrix: Story = {
  render: (args) =>
    renderOutlineVariants({ component: BreadCrumbPageHeader, args }),
};

export const GlassMatrix: Story = {
  render: (args) =>
    renderGlassVariants({ component: BreadCrumbPageHeader, args }),
};

export const GlassOutlineMatrix: Story = {
  render: (args) =>
    renderGlassOutlineVariants({ component: BreadCrumbPageHeader, args }),
};

export const StateOutlineMatrix: Story = {
  render: (args) =>
    renderStateOutlineVariants({ component: BreadCrumbPageHeader, args }),
};
