import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import { MultiSelect } from "../../src/index.next";
import type {
  MultiSelectOption,
  MultiSelectProps,
} from "../../src/components/MultiSelect/MultiSelect.types";
import { StoryGrid } from "../../.storybook-core/helpers/StoryGrid";
import {
  roundingOptions,
  shadowOptions,
  stateOptions,
  themeOptions,
} from "../../shared-story-assets/OptionTypes";
import {
  renderThemeVariants,
  renderStateVariants,
  renderOutlineVariants,
  renderGlassVariants,
  renderGlassOutlineVariants,
  renderStateOutlineVariants,
} from "../../shared-story-assets/VisualVariantStories";

const componentOptions: MultiSelectOption[] = [
  {
    value: "button",
    label: "Button",
    description: "Actions and form submission",
  },
  { value: "card", label: "Card", description: "Content surfaces" },
  { value: "dialog", label: "Dialog", description: "Modal workflows" },
  { value: "table", label: "DataTable", description: "Data-heavy views" },
  { value: "toast", label: "Toast", description: "Notifications" },
  { value: "disabled", label: "Deprecated item", disabled: true },
];

const meta: Meta<MultiSelectProps> = {
  title: "Components/MultiSelect",
  component: MultiSelect,
  tags: ["autodocs"],
  args: {
    label: "Components",
    options: componentOptions,
    defaultValue: ["button", "card"],
    theme: "primary",
  },
};

export default meta;

type Story = StoryObj<MultiSelectProps>;

export const Default: Story = {};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState(["button", "dialog"]);

    return (
      <MultiSelect
        label="Controlled components"
        options={componentOptions}
        value={value}
        onChange={setValue}
      />
    );
  },
};

export const WithMaxSelected: Story = {
  args: {
    label: "Pick two",
    defaultValue: ["button"],
    maxSelected: 2,
  },
};

export const NotSearchable: Story = {
  args: {
    label: "Simple picker",
    searchable: false,
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    defaultValue: ["button"],
  },
};

export const ThemeVariants = () => (
  <StoryGrid title="Theme Variants">
    {themeOptions.map((theme) => (
      <MultiSelect
        key={theme}
        label={theme}
        options={componentOptions}
        defaultValue={["button"]}
        theme={theme}
      />
    ))}
  </StoryGrid>
);

export const GlassThemeVariants = () => (
  <StoryGrid title="Glass Theme Variants">
    {themeOptions.map((theme) => (
      <MultiSelect
        key={theme}
        label={theme}
        options={componentOptions}
        defaultValue={["card"]}
        theme={theme}
        glass
      />
    ))}
  </StoryGrid>
);

export const StateVariants = () => (
  <StoryGrid title="State Variants">
    {stateOptions.map((state) => (
      <MultiSelect
        key={state}
        label={state}
        options={componentOptions}
        defaultValue={["button"]}
        state={state}
      />
    ))}
  </StoryGrid>
);

export const OutlineVariants = () => (
  <StoryGrid title="Outline Variants">
    {themeOptions.map((theme) => (
      <MultiSelect
        key={theme}
        label={`${theme} outline`}
        options={componentOptions}
        defaultValue={["button"]}
        theme={theme}
        outline
      />
    ))}
  </StoryGrid>
);

export const RoundingVariants = () => (
  <StoryGrid title="Rounding Variants">
    {roundingOptions.map((rounding) => (
      <MultiSelect
        key={rounding}
        label={rounding}
        options={componentOptions}
        defaultValue={["button"]}
        rounding={rounding}
      />
    ))}
  </StoryGrid>
);

export const ShadowVariants = () => (
  <StoryGrid title="Shadow Variants">
    {shadowOptions.map((shadow) => (
      <MultiSelect
        key={shadow}
        label={shadow}
        options={componentOptions}
        defaultValue={["button"]}
        shadow={shadow}
      />
    ))}
  </StoryGrid>
);

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: ["button", "card"],
  },
};

export const ThemeMatrix: Story = {
  render: (args) => renderThemeVariants({ component: MultiSelect, args }),
};

export const StateMatrix: Story = {
  render: (args) => renderStateVariants({ component: MultiSelect, args }),
};

export const OutlineMatrix: Story = {
  render: (args) => renderOutlineVariants({ component: MultiSelect, args }),
};

export const GlassMatrix: Story = {
  render: (args) => renderGlassVariants({ component: MultiSelect, args }),
};

export const GlassOutlineMatrix: Story = {
  render: (args) =>
    renderGlassOutlineVariants({ component: MultiSelect, args }),
};

export const StateOutlineMatrix: Story = {
  render: (args) =>
    renderStateOutlineVariants({ component: MultiSelect, args }),
};
