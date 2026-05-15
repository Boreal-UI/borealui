import type { Meta, StoryObj } from "@storybook/react-vite";
import { AppShell } from "../src/index.core";
import type { AppShellProps } from "../src/components/AppShell/AppShell.types";

const meta: Meta<AppShellProps> = {
  title: "Components/AppShell",
  component: AppShell,
  tags: ["autodocs"],
  args: {
    header: <strong>Boreal Admin</strong>,
    sidebar: (
      <nav aria-label="Primary">
        <a href="#overview">Overview</a>
        <br />
        <a href="#reports">Reports</a>
      </nav>
    ),
    aside: <span>Usage: 84%</span>,
    footer: <small>Synced just now</small>,
    children: (
      <section>
        <h2 id="overview">Overview</h2>
        <p>Application content sits in the shell main landmark.</p>
      </section>
    ),
    theme: "primary",
  },
};

export default meta;

type Story = StoryObj<AppShellProps>;

export const Default: Story = {};

export const StickyHeader: Story = {
  args: {
    stickyHeader: true,
  },
};

export const CollapsedSidebar: Story = {
  args: {
    sidebarCollapsed: true,
  },
};

export const MainOnly: Story = {
  args: {
    header: undefined,
    sidebar: undefined,
    aside: undefined,
    footer: undefined,
    children: <p>Shell can render a simple main-only layout.</p>,
  },
};
