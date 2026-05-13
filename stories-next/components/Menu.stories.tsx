import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FaCopy, FaEdit, FaFolderOpen, FaTrash } from "react-icons/fa";
import { Menu } from "../../src/index.next";
import type { MenuProps } from "../../src/components/Menu/Menu.types";
import { StoryGrid } from "../../.storybook-core/helpers/StoryGrid";
import {
  roundingOptions,
  shadowOptions,
  stateOptions,
  themeOptions,
} from "../../shared-story-assets/OptionTypes";

const meta: Meta<MenuProps> = {
  title: "Components/Menu",
  component: Menu,
  tags: ["autodocs"],
  args: {
    theme: "primary",
    activation: "contextmenu",
  },
};

export default meta;

type Story = StoryObj<MenuProps>;

const applicationItems: MenuProps["items"] = [
  { type: "label", label: "File" },
  {
    label: "Rename",
    icon: <FaEdit />,
    shortcut: "Enter",
    onClick: () => alert("Rename"),
  },
  {
    label: "Duplicate",
    icon: <FaCopy />,
    shortcut: "Ctrl+D",
    onClick: () => alert("Duplicate"),
  },
  { type: "separator" },
  {
    label: "Move to",
    icon: <FaFolderOpen />,
    submenuAriaLabel: "Move destinations",
    items: [
      { label: "Backlog", onClick: () => alert("Backlog") },
      { label: "In review", onClick: () => alert("In review") },
      {
        label: "Archive",
        items: [
          { label: "This month", onClick: () => alert("This month") },
          { label: "All time", onClick: () => alert("All time") },
        ],
      },
    ],
  },
  { type: "separator" },
  {
    label: "Delete",
    icon: <FaTrash />,
    destructive: true,
    onClick: () => alert("Delete"),
  },
];

const Target = () => (
  <div
    style={{
      display: "grid",
      placeItems: "center",
      width: "min(100%, 28rem)",
      minHeight: "12rem",
      padding: "1rem",
      border: "1px dashed var(--border-color)",
      borderRadius: "var(--border-radius-md)",
      background: "var(--background-color-lighter)",
      color: "var(--text-color-primary)",
    }}
  >
    Right click this project tile
  </div>
);

export const ContextMenu: Story = {
  args: {
    items: applicationItems,
    "aria-label": "Project context menu",
    children: <Target />,
  },
};

export const TriggerMenu: Story = {
  args: {
    trigger: "Actions",
    activation: "click",
    items: applicationItems,
    "aria-label": "Action menu",
  },
};

export const ComplexSelectionMenu: Story = {
  render: () => (
    <Menu
      trigger="View options"
      activation="click"
      aria-label="View options"
      items={[
        { type: "label", label: "Columns" },
        {
          label: "Assignee",
          role: "menuitemcheckbox",
          checked: true,
          onClick: () => alert("Assignee"),
        },
        {
          label: "Status",
          role: "menuitemcheckbox",
          checked: true,
          onClick: () => alert("Status"),
        },
        { type: "separator" },
        {
          label: "Comfortable density",
          role: "menuitemradio",
          checked: true,
          onClick: () => alert("Comfortable"),
        },
        {
          label: "Compact density",
          role: "menuitemradio",
          checked: false,
          onClick: () => alert("Compact"),
        },
      ]}
    />
  ),
};

export const Themed: Story = {
  render: () => (
    <StoryGrid title="Theme Variants">
      {themeOptions.map((theme) => (
        <Menu
          key={theme}
          trigger={theme}
          activation="click"
          theme={theme}
          aria-label={`${theme} menu`}
          items={[
            { label: `1`, onClick: () => {} },
            { label: `2`, onClick: () => {} },
            { label: `3`, onClick: () => {} },
            { label: `4`, onClick: () => {} },
          ]}
        />
      ))}
    </StoryGrid>
  ),
};

export const States: Story = {
  render: () => (
    <StoryGrid title="State Variants">
      {stateOptions.map((state) => (
        <Menu
          key={state}
          trigger={state}
          activation="click"
          state={state}
          aria-label={`${state} menu`}
          items={[
            { label: `1`, onClick: () => {} },
            { label: `2`, onClick: () => {} },
            { label: `3`, onClick: () => {} },
            { label: `4`, onClick: () => {} },
          ]}
        />
      ))}
    </StoryGrid>
  ),
};

export const GlassThemeVariants: Story = {
  render: () => (
    <StoryGrid title="Glass Theme Variants">
      {themeOptions.map((theme) => (
        <Menu
          key={theme}
          trigger={theme}
          activation="click"
          theme={theme}
          glass
          aria-label={`Glass ${theme} menu`}
          items={[
            { label: `1`, onClick: () => {} },
            { label: `2`, onClick: () => {} },
            { label: `3`, onClick: () => {} },
            { label: `4`, onClick: () => {} },
          ]}
        />
      ))}
    </StoryGrid>
  ),
};

export const RoundingVariants: Story = {
  render: () => (
    <StoryGrid title="Rounding Variants">
      {roundingOptions.map((rounding) => (
        <Menu
          key={rounding}
          trigger={rounding}
          activation="click"
          rounding={rounding}
          items={[{ label: `Rounding ${rounding}`, onClick: () => {} }]}
        />
      ))}
    </StoryGrid>
  ),
};

export const ShadowVariants: Story = {
  render: () => (
    <StoryGrid title="Shadow Variants">
      {shadowOptions.map((shadow) => (
        <Menu
          key={shadow}
          trigger={shadow}
          activation="click"
          shadow={shadow}
          items={[{ label: `Shadow ${shadow}`, onClick: () => {} }]}
        />
      ))}
    </StoryGrid>
  ),
};
