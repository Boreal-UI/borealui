import React, { useState } from "react";
import { Meta, StoryObj } from "@storybook/react-vite";
import {
  RadioButton,
  RoundingType,
  ShadowType,
  StateType,
  ThemeType,
} from "../src/index.core";
import type { RadioButtonProps } from "../src/components/RadioButton/RadioButton.types";

const themeOptions: ThemeType[] = [
  "primary",
  "secondary",
  "tertiary",
  "quaternary",
  "clear",
];

const stateOptions: StateType[] = ["success", "error", "warning"];

const roundingOptions: RoundingType[] = ["none", "small", "medium", "large"];
const shadowOptions: ShadowType[] = [
  "none",
  "light",
  "medium",
  "strong",
  "intense",
];

const meta: Meta<RadioButtonProps> = {
  title: "Components/RadioButton",
  component: RadioButton,
  tags: ["autodocs"],
  args: {
    label: "Option A",
    value: "a",
    checked: false,
    theme: "secondary",
  },
};

export default meta;

type Story = StoryObj<RadioButtonProps>;

export const Default: Story = {
  render: (args) => {
    const [selected, setSelected] = useState("a");

    return (
      <RadioButton
        {...args}
        checked={selected === args.value}
        onChange={setSelected}
      />
    );
  },
};

export const Grouped: Story = {
  render: () => {
    const [selected, setSelected] = useState("b");
    const options = ["a", "b", "c"];

    return (
      <div style={{ display: "flex", gap: "1rem" }}>
        {options.map((opt) => (
          <RadioButton
            key={opt}
            theme="secondary"
            label={`Option ${opt.toUpperCase()}`}
            value={opt}
            checked={selected === opt}
            onChange={setSelected}
          />
        ))}
      </div>
    );
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled Option",
    value: "x",
    checked: false,
    disabled: true,
  },
};

export const ThemeVariants: Story = {
  render: () => {
    const [selected, setSelected] = useState("primary");

    return (
      <div style={{ display: "grid", gap: "1rem" }}>
        {themeOptions.map((theme) => (
          <RadioButton
            key={theme}
            label={theme.charAt(0).toUpperCase() + theme.slice(1)}
            value={theme}
            theme={theme}
            checked={selected === theme}
            onChange={setSelected}
          />
        ))}
      </div>
    );
  },
};

export const GlassThemeVariants: Story = {
  render: () => {
    const [selected, setSelected] = useState("primary");

    return (
      <div style={{ display: "grid", gap: "1rem" }}>
        {themeOptions.map((theme) => (
          <RadioButton
            key={`glass-${theme}`}
            label={`${theme.charAt(0).toUpperCase() + theme.slice(1)} Glass`}
            value={theme}
            theme={theme}
            glass
            checked={selected === theme}
            onChange={setSelected}
          />
        ))}
      </div>
    );
  },
};

export const StateVariants: Story = {
  render: () => {
    const [selected, setSelected] = useState("primary");

    return (
      <div style={{ display: "grid", gap: "1rem" }}>
        {stateOptions.map((state) => (
          <RadioButton
            key={state}
            label={state.charAt(0).toUpperCase() + state.slice(1)}
            value={state}
            state={state}
            checked={selected === state}
            onChange={setSelected}
          />
        ))}
      </div>
    );
  },
};

export const GlassStateVariants: Story = {
  render: () => {
    const [selected, setSelected] = useState("success");

    return (
      <div style={{ display: "grid", gap: "1rem" }}>
        {stateOptions.map((state) => (
          <RadioButton
            key={`glass-${state}`}
            label={`${state.charAt(0).toUpperCase() + state.slice(1)} Glass`}
            value={state}
            state={state}
            glass
            checked={selected === state}
            onChange={setSelected}
          />
        ))}
      </div>
    );
  },
};

export const RoundingVariants: Story = {
  render: () => {
    const [selected, setSelected] = useState("primary");

    return (
      <div style={{ display: "grid", gap: "1rem" }}>
        {roundingOptions.map((rounding) => (
          <RadioButton
            key={rounding}
            label={rounding.charAt(0).toUpperCase() + rounding.slice(1)}
            value={rounding}
            rounding={rounding}
            checked={selected === rounding}
            onChange={setSelected}
          />
        ))}
      </div>
    );
  },
};

export const ShadowVariants: Story = {
  render: () => {
    const [selected, setSelected] = useState("primary");

    return (
      <div style={{ display: "grid", gap: "1rem" }}>
        {shadowOptions.map((shadow) => (
          <RadioButton
            key={shadow}
            label={shadow.charAt(0).toUpperCase() + shadow.slice(1)}
            value={shadow}
            shadow={shadow}
            checked={selected === shadow}
            onChange={setSelected}
          />
        ))}
      </div>
    );
  },
};
