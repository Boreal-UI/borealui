import { useState } from "react";
import { Meta, StoryObj } from "@storybook/react-vite";
import { Rating, StateType, ThemeType } from "../src/index.core";
import type { RatingProps } from "../src/components/Rating/Rating.types";

const themeOptions: ThemeType[] = [
  "primary",
  "secondary",
  "tertiary",
  "quaternary",
  "clear",
];

const stateOptions: StateType[] = ["success", "error", "warning"];

const meta: Meta<RatingProps> = {
  title: "Components/Rating",
  component: Rating,
  tags: ["autodocs"],
  args: {
    max: 5,
    theme: "primary",
    size: "medium",
  },
};

export default meta;

type Story = StoryObj<RatingProps>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState(3);
    return <Rating {...args} value={value} onChange={setValue} />;
  },
};

export const NonInteractive: Story = {
  args: {
    value: 4,
    interactive: false,
  },
};

export const SizeVariants: Story = {
  render: () => {
    const sizes = ["xs", "small", "medium", "large", "xl"] as const;
    const [value, setValue] = useState(3);

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {sizes.map((size) => (
          <Rating
            key={size}
            size={size}
            value={value}
            onChange={setValue}
            label={`Size: ${size}`}
          />
        ))}
      </div>
    );
  },
};

export const ThemedVariants: Story = {
  render: () => {
    const [value, setValue] = useState(3);

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {themeOptions.map((theme) => (
          <Rating
            key={theme}
            theme={theme}
            value={value}
            onChange={setValue}
            label={`Theme: ${theme}`}
          />
        ))}
      </div>
    );
  },
};

export const StateVariants: Story = {
  render: () => {
    const [value, setValue] = useState(3);

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {stateOptions.map((state) => (
          <Rating
            key={state}
            state={state}
            value={value}
            onChange={setValue}
            label={`State: ${state}`}
          />
        ))}
      </div>
    );
  },
};

export const GlassThemeVariants: Story = {
  render: () => {
    const [value, setValue] = useState(3);

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {themeOptions.map((theme) => (
          <Rating
            key={theme}
            theme={theme}
            glass
            value={value}
            onChange={setValue}
            label={`Glass theme: ${theme}`}
          />
        ))}
      </div>
    );
  },
};

export const GlassStateVariants: Story = {
  render: () => {
    const [value, setValue] = useState(3);

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {stateOptions.map((state) => (
          <Rating
            key={state}
            state={state}
            glass
            value={value}
            onChange={setValue}
            label={`Glass state: ${state}`}
          />
        ))}
      </div>
    );
  },
};

export const TenStars: Story = {
  render: () => {
    const [value, setValue] = useState(7);
    return <Rating max={10} value={value} onChange={setValue} />;
  },
};
