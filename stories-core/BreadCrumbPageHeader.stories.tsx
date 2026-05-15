import type { Meta, StoryObj } from "@storybook/react-vite";
import { BreadCrumbPageHeader } from "../src/index.core";
import type { BreadCrumbPageHeaderProps } from "../src/components/BreadCrumbPageHeader/BreadCrumbPageHeader.types";

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
    actions: <button type="button">Invite member</button>,
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
    maxVisibleBreadcrumbs: 3,
  },
};

export const CustomSeparator: Story = {
  args: {
    separator: "/",
  },
};
