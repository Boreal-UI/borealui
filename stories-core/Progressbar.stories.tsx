import { useState, useEffect } from "react";
import { Meta, StoryObj } from "@storybook/react-vite";
import {
  Progressbar,
  RoundingType,
  ShadowType,
  StateType,
  ThemeType,
} from "../src/index.core";
import type { ProgressBarProps } from "../src/components/ProgressBar/ProgressBar.types";

const themeOptions: ThemeType[] = [
  "primary",
  "secondary",
  "tertiary",
  "quaternary",
  "clear",
];

const stateOptions: StateType[] = ["success", "error", "warning"];

const roundingOptions: RoundingType[] = [
  "none",
  "small",
  "medium",
  "large",
  "full",
];
const shadowOptions: ShadowType[] = [
  "none",
  "light",
  "medium",
  "strong",
  "intense",
];

const meta: Meta<ProgressBarProps> = {
  title: "Components/ProgressBar",
  component: Progressbar,
  tags: ["autodocs"],
  args: {
    theme: "primary",
    size: "medium",
    animated: true,
  },
};

export default meta;

type Story = StoryObj<ProgressBarProps>;

export const Default: Story = {
  args: {
    value: 65,
  },
};

export const Indeterminate: Story = {
  args: {
    indeterminate: true,
  },
};

export const StaticBar: Story = {
  args: {
    value: 45,
    animated: false,
  },
};

export const LabelPositions: Story = {
  render: (args) => {
    const positions = ["top", "bottom", "left", "right"] as const;

    return (
      <div style={{ display: "grid", gap: "1rem", maxWidth: "560px" }}>
        {positions.map((pos) => (
          <div key={pos} style={{ display: "grid", gap: "0.5rem" }}>
            <div style={{ fontSize: "0.9rem", opacity: 0.8 }}>
              Label Position: <strong>{pos}</strong>
            </div>
            <Progressbar
              {...args}
              value={72}
              label={`Build ${72}%`}
              labelPosition={pos}
            />
          </div>
        ))}
      </div>
    );
  },
};

export const SizeVariants: Story = {
  render: (args) => {
    const sizes = ["xs", "small", "medium", "large", "xl"] as const;

    return (
      <div style={{ display: "grid", gap: "1rem" }}>
        {sizes.map((size) => (
          <div key={size}>
            <Progressbar
              {...args}
              value={40 + sizes.indexOf(size) * 20}
              size={size}
              label={size.charAt(0).toUpperCase() + size.slice(1)}
            />
          </div>
        ))}
      </div>
    );
  },
};

export const ThemedVariants: Story = {
  render: (args) => {
    return (
      <div style={{ display: "grid", gap: "1rem" }}>
        {themeOptions.map((theme) => (
          <div key={theme}>
            <Progressbar
              {...args}
              value={20 + themeOptions.indexOf(theme) * 15}
              theme={theme}
              label={theme.charAt(0).toUpperCase() + theme.slice(1)}
            />
          </div>
        ))}
      </div>
    );
  },
};

export const StateVariants: Story = {
  render: (args) => {
    return (
      <div style={{ display: "grid", gap: "1rem" }}>
        {stateOptions.map((state) => (
          <div key={state}>
            <Progressbar
              {...args}
              value={20 + stateOptions.indexOf(state) * 15}
              state={state}
              label={state.charAt(0).toUpperCase() + state.slice(1)}
            />
          </div>
        ))}
      </div>
    );
  },
};

export const GlassThemeVariants: Story = {
  render: (args) => {
    return (
      <div style={{ display: "grid", gap: "1rem" }}>
        {themeOptions.map((theme) => (
          <div key={`glass-${theme}`}>
            <Progressbar
              {...args}
              value={20 + themeOptions.indexOf(theme) * 15}
              theme={theme}
              glass
              label={`${theme.charAt(0).toUpperCase() + theme.slice(1)} Glass`}
            />
          </div>
        ))}
      </div>
    );
  },
};

export const GlassStateVariants: Story = {
  render: (args) => {
    return (
      <div style={{ display: "grid", gap: "1rem" }}>
        {stateOptions.map((state) => (
          <div key={`glass-${state}`}>
            <Progressbar
              {...args}
              value={20 + stateOptions.indexOf(state) * 15}
              state={state}
              glass
              label={`${state.charAt(0).toUpperCase() + state.slice(1)} Glass`}
            />
          </div>
        ))}
      </div>
    );
  },
};

export const LiveProgress: Story = {
  render: (args) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 5));
      }, 300);
      return () => clearInterval(interval);
    }, []);

    return (
      <div style={{ maxWidth: "500px" }}>
        <Progressbar
          {...args}
          value={progress}
          label={`Live Updating Progress: ${progress}%`}
        />
      </div>
    );
  },
};

export const RoundingVariants: Story = {
  render: (args) => {
    return (
      <div style={{ display: "grid", gap: "1rem" }}>
        {roundingOptions.map((rounding) => (
          <div key={rounding}>
            <Progressbar
              {...args}
              value={20 + roundingOptions.indexOf(rounding) * 15}
              rounding={rounding}
              label={rounding.charAt(0).toUpperCase() + rounding.slice(1)}
            />
          </div>
        ))}
      </div>
    );
  },
};

export const ShadowVariants: Story = {
  render: (args) => {
    return (
      <div style={{ display: "grid", gap: "1rem" }}>
        {shadowOptions.map((shadow) => (
          <div key={shadow}>
            <Progressbar
              {...args}
              value={20 + shadowOptions.indexOf(shadow) * 15}
              shadow={shadow}
              label={shadow.charAt(0).toUpperCase() + shadow.slice(1)}
            />
          </div>
        ))}
      </div>
    );
  },
};
