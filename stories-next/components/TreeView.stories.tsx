import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TreeView } from "../../src/index.next";
import type {
  TreeViewNode,
  TreeViewProps,
} from "../../src/components/TreeView/TreeView.types";
import {
  renderThemeVariants,
  renderStateVariants,
  renderOutlineVariants,
  renderGlassVariants,
  renderGlassOutlineVariants,
  renderStateOutlineVariants,
} from "../../shared-story-assets/VisualVariantStories";

const items: TreeViewNode[] = [
  {
    id: "workspace",
    label: "Workspace",
    children: [
      { id: "overview", label: "Overview" },
      { id: "activity", label: "Activity" },
      {
        id: "settings",
        label: "Settings",
        children: [
          { id: "members", label: "Members" },
          { id: "billing", label: "Billing" },
        ],
      },
    ],
  },
  {
    id: "archive",
    label: "Archive",
    children: [{ id: "2026", label: "2026" }],
  },
];

const meta: Meta<TreeViewProps> = {
  title: "Components/TreeView",
  component: TreeView,
  tags: ["autodocs"],
  args: {
    label: "Workspace navigation",
    items,
    defaultExpandedIds: ["workspace", "settings"],
    defaultSelectedId: "overview",
    theme: "primary",
  },
};

export default meta;

type Story = StoryObj<TreeViewProps>;

export const Default: Story = {};

export const ControlledSelection: Story = {
  args: {
    selectedId: "billing",
    expandedIds: ["workspace", "settings"],
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const ThemeMatrix: Story = {
  render: (args) => renderThemeVariants({ component: TreeView, args }),
};

export const StateMatrix: Story = {
  render: (args) => renderStateVariants({ component: TreeView, args }),
};

export const OutlineMatrix: Story = {
  render: (args) => renderOutlineVariants({ component: TreeView, args }),
};

export const GlassMatrix: Story = {
  render: (args) => renderGlassVariants({ component: TreeView, args }),
};

export const GlassOutlineMatrix: Story = {
  render: (args) => renderGlassOutlineVariants({ component: TreeView, args }),
};

export const StateOutlineMatrix: Story = {
  render: (args) => renderStateOutlineVariants({ component: TreeView, args }),
};
