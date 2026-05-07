import { useState } from "react";
import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Slider, StateType, ThemeType } from "../../src/index.next";
import type { SliderProps } from "../../src/components/Slider/Slider.types";
import { withVariants } from "../../.storybook-core/helpers/withVariants";

const themeOptions: ThemeType[] = [
  "primary",
  "secondary",
  "tertiary",
  "quaternary",
  "clear",
];

const stateOptions: StateType[] = ["success", "error", "warning"];

const roundingOptions = ["none", "small", "medium", "large"];
const shadowOptions = ["none", "light", "medium", "strong", "intense"];

const meta: Meta<SliderProps> = {
  title: "Components/Slider",
  component: Slider,
  tags: ["autodocs"],
  args: {
    min: 0,
    max: 100,
    step: 1,
    theme: "primary",
    size: "medium",
    label: "Volume",
    showValue: true,
  },
};

export default meta;

type Story = StoryObj<SliderProps>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState(50);
    return (
      <Slider
        {...args}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
      />
    );
  },
};

export const CustomRange: Story = {
  render: (args) => {
    const [value, setValue] = useState(25);
    return (
      <Slider
        {...args}
        min={10}
        max={50}
        step={5}
        value={value}
        label="Speed"
        onChange={(e) => setValue(Number(e.target.value))}
      />
    );
  },
};

export const HiddenValue: Story = {
  render: (args) => {
    const [value, setValue] = useState(40);
    return (
      <Slider
        {...args}
        value={value}
        showValue={false}
        onChange={(e) => setValue(Number(e.target.value))}
      />
    );
  },
};

export const SizeVariants: Story = {
  render: (args) => {
    const sizes = ["xs", "small", "medium", "large", "xl"] as const;
    const [value, setValue] = useState(30);

    return (
      <div style={{ display: "grid", gap: "1rem" }}>
        {sizes.map((size) => (
          <Slider
            key={size}
            {...args}
            size={size}
            label={`Size: ${size}`}
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
          />
        ))}
      </div>
    );
  },
};

export const ThemeVariants: Story = {
  render: (args) => {
    const [value, setValue] = useState(75);

    return (
      <div style={{ display: "grid", gap: "1rem" }}>
        {themeOptions.map((theme) => (
          <Slider
            key={theme}
            {...args}
            theme={theme}
            label={`Theme: ${theme}`}
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
          />
        ))}
      </div>
    );
  },
};

export const GlassThemeVariants: Story = {
  render: (args) => {
    const [value, setValue] = useState(75);

    return (
      <div style={{ display: "grid", gap: "1rem" }}>
        {themeOptions.map((theme) => (
          <Slider
            key={`glass-${theme}`}
            {...args}
            theme={theme}
            glass
            label={`Glass theme: ${theme}`}
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
          />
        ))}
      </div>
    );
  },
};

export const StateVariants: Story = {
  render: (args) => {
    const [value, setValue] = useState(75);

    return (
      <div style={{ display: "grid", gap: "1rem" }}>
        {stateOptions.map((state) => (
          <Slider
            key={state}
            {...args}
            state={state}
            label={`State: ${state}`}
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
          />
        ))}
      </div>
    );
  },
};

export const GlassStateVariants: Story = {
  render: (args) => {
    const [value, setValue] = useState(75);

    return (
      <div style={{ display: "grid", gap: "1rem" }}>
        {stateOptions.map((state) => (
          <Slider
            key={`glass-${state}`}
            {...args}
            state={state}
            glass
            label={`Glass state: ${state}`}
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
          />
        ))}
      </div>
    );
  },
};

export const RoundingVariants = (args: React.ComponentProps<typeof Slider>) =>
  withVariants(Slider, { ...args }, [
    { propName: "rounding", values: roundingOptions },
  ]);

export const ShadowVariants = (args: React.ComponentProps<typeof Slider>) =>
  withVariants(Slider, { ...args }, [
    { propName: "shadow", values: shadowOptions },
  ]);
