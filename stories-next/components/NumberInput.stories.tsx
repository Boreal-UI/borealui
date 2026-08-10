import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import { NumberInput } from "../../src/index.next";
import type { NumberInputProps } from "../../src/components/NumberInput/NumberInput.types";
import { StoryGrid } from "../../.storybook-core/helpers/StoryGrid";
import {
  roundingOptions,
  shadowOptions,
} from "../../shared-story-assets/OptionTypes";
import {
  renderThemeVariants,
  renderStateVariants,
  renderSizeVariants,
  renderOutlineVariants,
  renderGlassVariants,
  renderGlassOutlineVariants,
  renderStateOutlineVariants,
} from "../../shared-story-assets/VisualVariantStories";

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

export const Sizes: Story = {
  render: () =>
    renderSizeVariants({
      component: NumberInput,
      args: { label: "Quantity" },
      labelProp: "label",
    }),
};

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

export const ThemeVariants: Story = {
  render: (args) => renderThemeVariants({ component: NumberInput, args }),
};

export const StateVariants: Story = {
  render: (args) => renderStateVariants({ component: NumberInput, args }),
};

export const OutlineVariants: Story = {
  render: (args) => renderOutlineVariants({ component: NumberInput, args }),
};

export const GlassVariants: Story = {
  render: (args) => renderGlassVariants({ component: NumberInput, args }),
};

export const GlassOutlineVariants: Story = {
  render: (args) =>
    renderGlassOutlineVariants({ component: NumberInput, args }),
};

export const StateOutlineVariants: Story = {
  render: (args) =>
    renderStateOutlineVariants({ component: NumberInput, args }),
};
