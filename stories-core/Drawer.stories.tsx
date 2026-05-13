import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Drawer } from "../src/index.core";
import {
  themeOptions,
  roundingOptions,
  shadowOptions,
  stateOptions,
} from "../shared-story-assets/OptionTypes";
import { DrawerProps } from "../src/components/Drawer/Drawer.types";

const placementOptions = ["left", "right", "top", "bottom"] as const;

const meta: Meta<DrawerProps> = {
  title: "Components/Drawer",
  component: Drawer,
  tags: ["autodocs"],
  argTypes: {
    placement: {
      control: "select",
      options: placementOptions,
    },
    theme: {
      control: "select",
      options: themeOptions,
    },
    state: {
      control: "select",
      options: stateOptions,
    },
    rounding: {
      control: "select",
      options: roundingOptions,
    },
    shadow: {
      control: "select",
      options: shadowOptions,
    },
    glass: {
      control: "boolean",
    },
    closeOnOverlayClick: {
      control: "boolean",
    },
    closeOnEscape: {
      control: "boolean",
    },
    title: {
      control: "text",
    },
    closeButtonAriaLabel: {
      control: "text",
    },
    onClose: {
      action: "closed",
    },
  },
  args: {
    open: true,
    title: "Filters",
    placement: "right",
    theme: "primary",
    glass: false,
    rounding: "medium",
    shadow: "light",
    closeOnOverlayClick: true,
    closeOnEscape: true,
    closeButtonAriaLabel: "Close drawer",
    children: <p>Drawer content for settings, filters, or details.</p>,
  },
};

export default meta;
type Story = StoryObj<DrawerProps>;

function DrawerDemo(args: DrawerProps) {
  const [open, setOpen] = useState(args.open ?? false);

  return (
    <div style={{ minHeight: "22rem", padding: "1rem" }}>
      <Button onClick={() => setOpen(true)}>Open drawer</Button>

      <Drawer
        {...args}
        open={open}
        onClose={() => {
          args.onClose?.();
          setOpen(false);
        }}
      />
    </div>
  );
}

export const Default: Story = {
  render: (args) => <DrawerDemo {...args} />,
};

export const Left: Story = {
  render: (args) => <DrawerDemo {...args} />,
  args: {
    placement: "left",
    title: "Navigation",
    children: (
      <div>
        <p>Use a left drawer for navigation, menus, or app sections.</p>
        <ul>
          <li>Dashboard</li>
          <li>Projects</li>
          <li>Settings</li>
        </ul>
      </div>
    ),
  },
};

export const Right: Story = {
  render: (args) => <DrawerDemo {...args} />,
  args: {
    placement: "right",
    title: "Filters",
    children: (
      <div>
        <p>Use a right drawer for contextual tools and filters.</p>
        <label>
          <input type="checkbox" /> Include archived items
        </label>
      </div>
    ),
  },
};

export const Top: Story = {
  render: (args) => <DrawerDemo {...args} />,
  args: {
    placement: "top",
    title: "Quick actions",
    children: (
      <p>
        Top drawers work well for compact actions, search panels, or global
        notices.
      </p>
    ),
  },
};

export const Bottom: Story = {
  render: (args) => <DrawerDemo {...args} />,
  args: {
    placement: "bottom",
    title: "Details",
    children: (
      <p>
        Bottom drawers are useful for mobile-friendly sheets and secondary
        actions.
      </p>
    ),
  },
};

export const WithFooter: Story = {
  render: (args) => <DrawerDemo {...args} />,
  args: {
    title: "Edit filters",
    children: (
      <div>
        <p>Adjust your filter options, then apply or reset the results.</p>
        <label>
          <input type="checkbox" /> Show only active items
        </label>
      </div>
    ),
    footer: (
      <div style={{ display: "flex", gap: "0.75rem", justifyContent: "end" }}>
        <Button theme="secondary">Reset</Button>
        <Button>Apply</Button>
      </div>
    ),
  },
};

export const CustomHeader: Story = {
  render: (args) => <DrawerDemo {...args} />,
  args: {
    "aria-label": "Account drawer",
    header: (
      <div>
        <strong>Account</strong>
        <p style={{ margin: 0 }}>Manage profile preferences.</p>
      </div>
    ),
    children: (
      <p>
        Custom headers are useful when the drawer needs richer heading content
        than a simple title.
      </p>
    ),
  },
};

export const Glass: Story = {
  render: (args) => <DrawerDemo {...args} />,
  args: {
    title: "Glass drawer",
    glass: true,
    shadow: "strong",
    rounding: "large",
    children: (
      <p>
        The glass option adds translucent styling when supported by the active
        theme styles.
      </p>
    ),
  },
};

export const NoOverlayClose: Story = {
  render: (args) => <DrawerDemo {...args} />,
  args: {
    title: "Required action",
    closeOnOverlayClick: false,
    children: (
      <p>
        Clicking the overlay will not close this drawer. Use the close button or
        Escape key instead.
      </p>
    ),
  },
};

export const ClosedInitially: Story = {
  render: (args) => <DrawerDemo {...args} />,
  args: {
    open: false,
    title: "Closed drawer",
    children: <p>This drawer starts closed. Use the trigger to open it.</p>,
  },
};
