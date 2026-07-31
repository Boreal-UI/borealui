import type { Meta, StoryObj } from "@storybook/react-vite";
import { Divider, ThemeType } from "../src/index.core";
import type { DividerProps } from "../src/components/Divider/Divider.types";

const meta: Meta<DividerProps> = {
  title: "Components/Divider",
  component: Divider,
  tags: ["autodocs"],
  args: {
    orientation: "horizontal",
    length: "100%",
    thickness: "1px",
    dashed: false,
    theme: "primary",
  },
};

export default meta;

type Story = StoryObj<DividerProps>;

export const Horizontal: Story = {
  render: (args) => (
    <div style={{ padding: "1rem" }}>
      <p>Above</p>
      <Divider {...args} />
      <p>Below</p>
    </div>
  ),
};

export const Vertical: Story = {
  render: (args) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        height: "100px",
      }}
    >
      <span>Left</span>
      <Divider {...args} orientation="vertical" length="100%" thickness="2px" />
      <span>Right</span>
    </div>
  ),
};

export const Dashed: Story = {
  args: {
    dashed: true,
    thickness: "2px",
  },
  render: (args) => (
    <div style={{ padding: "1rem" }}>
      <p>Dashed Divider</p>
      <Divider {...args} />
    </div>
  ),
};

export const CustomLengthAndThickness: Story = {
  args: {
    length: "200px",
    thickness: "5px",
  },
  render: (args) => (
    <div style={{ padding: "1rem" }}>
      <p>Custom Size</p>
      <Divider {...args} />
    </div>
  ),
};

export const Themed: Story = {
  render: () => (
    <div style={{ padding: "1rem", display: "grid", gap: "1rem" }}>
      <Divider theme="primary" />
      <Divider theme="secondary" />
      <Divider theme="tertiary" />
      <Divider theme="quaternary" />
      <Divider theme="clear" />
    </div>
  ),
};

export const GlassThemes: Story = {
  render: () => (
    <div style={{ padding: "1rem", display: "grid", gap: "1rem" }}>
      <Divider theme="primary" thickness="4px" variant="glass" />
      <Divider theme="secondary" thickness="4px" variant="glass" />
      <Divider theme="tertiary" thickness="4px" variant="glass" />
      <Divider theme="quaternary" thickness="4px" variant="glass" />
      <Divider theme="clear" thickness="4px" variant="glass" />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={{ padding: "1rem", display: "grid", gap: "1rem" }}>
      <Divider theme={"success" as ThemeType} />
      <Divider theme={"error" as ThemeType} />
      <Divider theme={"warning" as ThemeType} />
    </div>
  ),
};

export const GlassStates: Story = {
  render: () => (
    <div style={{ padding: "1rem", display: "grid", gap: "1rem" }}>
      <Divider state="success" thickness="4px" variant="glass" />
      <Divider state="error" thickness="4px" variant="glass" />
      <Divider state="warning" thickness="4px" variant="glass" />
    </div>
  ),
};
