import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { NumberInput } from "../src/index.core";
import type { NumberInputProps } from "../src/components/NumberInput/NumberInput.types";
import { StoryGrid } from "../.storybook-core/helpers/StoryGrid";
import {
  roundingOptions,
  shadowOptions,
  stateOptions,
  themeOptions,
} from "../shared-story-assets/OptionTypes";

const meta: Meta<NumberInputProps> = {
  title: "Components/NumberInput",
  component: NumberInput,
  tags: ["autodocs"],
  args: {
    label: "Quantity",
    defaultValue: 2,
    min: 0,
    max: 10,
    step: 1,
    theme: "primary",
  },
};

export default meta;

type Story = StoryObj<NumberInputProps>;

export const Default: Story = {};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState<number | "">(4);

    return (
      <NumberInput
        label="Seats"
        value={value}
        min={1}
        max={12}
        onChange={setValue}
        onValueChange={setValue}
      />
    );
  },
};

export const WithoutControls: Story = {
  args: {
    label: "Budget",
    defaultValue: 2500,
    min: 0,
    step: 100,
    showControls: false,
  },
};

export const DecimalStep: Story = {
  args: {
    label: "Ratio",
    defaultValue: 1.5,
    min: 0,
    max: 3,
    step: 0.25,
  },
};

export const ThemeVariants = () => (
  <StoryGrid title="Theme Variants">
    {themeOptions.map((theme) => (
      <NumberInput
        key={theme}
        label={theme}
        defaultValue={3}
        min={0}
        max={10}
        theme={theme}
      />
    ))}
  </StoryGrid>
);

export const GlassThemeVariants = () => (
  <StoryGrid title="Glass Theme Variants">
    {themeOptions.map((theme) => (
      <NumberInput
        key={theme}
        label={theme}
        defaultValue={3}
        min={0}
        max={10}
        theme={theme}
        glass
      />
    ))}
  </StoryGrid>
);

export const StateVariants = () => (
  <StoryGrid title="State Variants">
    {stateOptions.map((state) => (
      <NumberInput
        key={state}
        label={state}
        defaultValue={3}
        min={0}
        max={10}
        state={state}
      />
    ))}
  </StoryGrid>
);

export const OutlineVariants = () => (
  <StoryGrid title="Outline Variants">
    {themeOptions.map((theme) => (
      <NumberInput
        key={theme}
        label={`${theme} outline`}
        defaultValue={3}
        min={0}
        max={10}
        theme={theme}
        outline
      />
    ))}
  </StoryGrid>
);

export const RoundingVariants = () => (
  <StoryGrid title="Rounding Variants">
    {roundingOptions.map((rounding) => (
      <NumberInput
        key={rounding}
        label={rounding}
        defaultValue={3}
        rounding={rounding}
      />
    ))}
  </StoryGrid>
);

export const ShadowVariants = () => (
  <StoryGrid title="Shadow Variants">
    {shadowOptions.map((shadow) => (
      <NumberInput
        key={shadow}
        label={shadow}
        defaultValue={3}
        shadow={shadow}
      />
    ))}
  </StoryGrid>
);

export const Disabled: Story = {
  args: {
    label: "Locked quantity",
    defaultValue: 5,
    disabled: true,
  },
};
