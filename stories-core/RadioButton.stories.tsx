import React, { useState } from "react";
import { Meta, StoryObj } from "@storybook/react-vite";
import { RadioButton, RadioGroup } from "../src/index.core";
import type {
  RadioButtonProps,
  RadioGroupProps,
} from "../src/components/RadioButton/RadioButton.types";
import {
  roundingOptions,
  shadowOptions,
  stateOptions,
  themeOptions,
} from "../shared-story-assets/OptionTypes";

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
type GroupStory = StoryObj<RadioGroupProps>;

const contactOptions = [
  { label: "Email", value: "email" },
  { label: "SMS", value: "sms" },
  { label: "Phone", value: "phone" },
];

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

export const RadioGroupDefault: GroupStory = {
  render: (args) => {
    const [selected, setSelected] = useState("email");

    return (
      <RadioGroup
        {...args}
        value={selected}
        onChange={setSelected}
        options={contactOptions}
      />
    );
  },
  args: {
    legend: "Preferred contact method",
    name: "storybook-contact",
    theme: "secondary",
    description: "Radio groups select one option from a shared set.",
  },
};

export const RadioGroupHorizontal: GroupStory = {
  render: () => {
    const [selected, setSelected] = useState("monthly");

    return (
      <RadioGroup
        legend="Billing cycle"
        name="storybook-billing"
        value={selected}
        onChange={setSelected}
        orientation="horizontal"
        theme="primary"
        options={[
          { label: "Monthly", value: "monthly" },
          { label: "Quarterly", value: "quarterly" },
          { label: "Annual", value: "annual" },
        ]}
      />
    );
  },
};

export const RadioGroupWithDisabledOption: GroupStory = {
  render: () => {
    const [selected, setSelected] = useState("standard");

    return (
      <RadioGroup
        legend="Shipping speed"
        name="storybook-shipping"
        value={selected}
        onChange={setSelected}
        theme="tertiary"
        options={[
          { label: "Standard", value: "standard" },
          { label: "Express", value: "express" },
          { label: "Overnight", value: "overnight", disabled: true },
        ]}
      />
    );
  },
};

export const RadioGroupGlass: GroupStory = {
  render: () => {
    const [selected, setSelected] = useState("design");

    return (
      <RadioGroup
        legend="Project focus"
        name="storybook-focus"
        value={selected}
        onChange={setSelected}
        theme="quaternary"
        glass
        options={[
          { label: "Design", value: "design" },
          { label: "Engineering", value: "engineering" },
          { label: "Research", value: "research" },
        ]}
      />
    );
  },
};

export const RadioGroupInvalid: GroupStory = {
  render: () => (
    <RadioGroup
      legend="Deployment target"
      name="storybook-deployment"
      value=""
      onChange={() => {}}
      state="error"
      invalid
      required
      errorMessage="Choose one deployment target."
      options={[
        { label: "Preview", value: "preview" },
        { label: "Production", value: "production" },
      ]}
    />
  ),
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
