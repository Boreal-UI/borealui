import { Meta, StoryObj } from "@storybook/react-vite";
import { Tooltip, Button } from "../src/index.core";
import type { TooltipProps } from "../src/components/Tooltip/Tooltip.types";
import {
  roundingOptions,
  shadowOptions,
  stateOptions,
  themeOptions,
} from "../shared-story-assets/OptionTypes";

const meta: Meta<TooltipProps> = {
  title: "Components/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  args: {
    content: "Tooltip message",
    position: "top",
    theme: "primary",
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "The `Tooltip` component displays helpful information when users hover or focus on an element. This version uses global SCSS classes for styling.",
      },
    },
  },
};

const defaultArgs: Partial<React.ComponentProps<typeof Tooltip>> = {
  theme: "primary",
  state: "success",
  content: "Tooltip text",
  children: <button>Hover me</button>,
};

export default meta;
type Story = StoryObj<TooltipProps>;

export const Default: Story = {
  name: "Default Tooltip",
  args: {
    ...defaultArgs,
  },
};

export const Positions: Story = {
  name: "Tooltip Positions",
  render: (args) => (
    <div
      style={{
        display: "grid",
        gap: "2rem",
        gridTemplateColumns: "repeat(2, auto)",
        placeItems: "center",
        height: "300px",
      }}
    >
      <Tooltip {...args} position="top" content="Top tooltip">
        <Button>Top</Button>
      </Tooltip>
      <Tooltip {...args} position="bottom" content="Bottom tooltip">
        <Button>Bottom</Button>
      </Tooltip>
      <Tooltip {...args} position="left" content="Left tooltip">
        <Button>Left</Button>
      </Tooltip>
      <Tooltip {...args} position="right" content="Right tooltip">
        <Button>Right</Button>
      </Tooltip>
    </div>
  ),
};

export const Themed: Story = {
  name: "Tooltip Themes",
  render: (args) => (
    <div style={{ display: "grid", gap: "5rem" }}>
      {themeOptions.map((theme) => (
        <Tooltip
          key={theme}
          {...args}
          theme={theme}
          title={`${theme.charAt(0).toUpperCase() + theme.slice(1)} Theme`}
        >
          <Button>{theme.charAt(0).toUpperCase() + theme.slice(1)}</Button>
        </Tooltip>
      ))}
    </div>
  ),
};

export const States: Story = {
  name: "Tooltip State",
  render: (args) => (
    <div style={{ display: "grid", gap: "5rem" }}>
      {stateOptions.map((state) => (
        <Tooltip
          key={state}
          {...args}
          state={state}
          title={`${state.charAt(0).toUpperCase() + state.slice(1)} state`}
        >
          <Button>{state.charAt(0).toUpperCase() + state.slice(1)}</Button>
        </Tooltip>
      ))}
    </div>
  ),
};

export const GlassThemes: Story = {
  name: "Tooltip Glass Themes",
  render: (args) => (
    <div style={{ display: "grid", gap: "5rem" }}>
      {themeOptions.map((theme) => (
        <Tooltip
          key={`glass-${theme}`}
          {...args}
          theme={theme}
          glass
          title={`${theme.charAt(0).toUpperCase() + theme.slice(1)} glass`}
        >
          <Button>{theme.charAt(0).toUpperCase() + theme.slice(1)}</Button>
        </Tooltip>
      ))}
    </div>
  ),
};

export const GlassStates: Story = {
  name: "Tooltip Glass States",
  render: (args) => (
    <div style={{ display: "grid", gap: "5rem" }}>
      {stateOptions.map((state) => (
        <Tooltip
          key={`glass-${state}`}
          {...args}
          state={state}
          glass
          title={`${state.charAt(0).toUpperCase() + state.slice(1)} glass`}
        >
          <Button>{state.charAt(0).toUpperCase() + state.slice(1)}</Button>
        </Tooltip>
      ))}
    </div>
  ),
};

export const Rounding: Story = {
  name: "Tooltip Rounding Variants",
  render: (args) => (
    <div style={{ display: "grid", gap: "5rem" }}>
      {roundingOptions.map((rounding) => (
        <Tooltip
          key={rounding}
          {...args}
          rounding={rounding}
          title={`${rounding.charAt(0).toUpperCase() + rounding.slice(1)} rounding`}
        >
          <Button>
            {rounding.charAt(0).toUpperCase() + rounding.slice(1)}
          </Button>
        </Tooltip>
      ))}
    </div>
  ),
};

export const Shadow: Story = {
  name: "Tooltip Shadow Variants",
  render: (args) => (
    <div style={{ display: "grid", gap: "5rem" }}>
      {shadowOptions.map((shadow) => (
        <Tooltip
          key={shadow}
          {...args}
          shadow={shadow}
          title={`${shadow.charAt(0).toUpperCase() + shadow.slice(1)} shadow`}
        >
          <Button>{shadow.charAt(0).toUpperCase() + shadow.slice(1)}</Button>
        </Tooltip>
      ))}
    </div>
  ),
};
