import type { Meta, StoryObj } from "@storybook/react-vite";
import { BreadCrumbPageHeader, Button } from "../src/index.core";
import type { BreadCrumbPageHeaderProps } from "../src/components/BreadCrumbPageHeader/BreadCrumbPageHeader.types";
import { Breadcrumb } from "../dist/types/core/Breadcrumbs";

const breadcrumbs: Breadcrumb[] = [
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
    breadcrumbProps: {
      items: [
        { label: "Home", href: "#" },
        { label: "Organization", href: "#" },
        { label: "Departments", href: "#" },
        { label: "Engineering", href: "#" },
        { label: "Platform" },
      ],
      maxVisible: 3,
    },
  },
};

export const CustomSeparator: Story = {
  args: {
    breadcrumbProps: {
      separator: "/",
      items: breadcrumbs,
    },
  },
};
