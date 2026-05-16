import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { SearchInput } from "../src/index.core";
import type { SearchInputProps } from "../src/components/SearchInput/SearchInput.types";
import { StoryGrid } from "../.storybook-core/helpers/StoryGrid";
import {
  roundingOptions,
  shadowOptions,
  stateOptions,
  themeOptions,
} from "../shared-story-assets/OptionTypes";
import { FaTree } from "react-icons/fa";
import {
  renderThemeVariants,
  renderStateVariants,
  renderOutlineVariants,
  renderGlassVariants,
  renderGlassOutlineVariants,
  renderStateOutlineVariants,
} from "../shared-story-assets/VisualVariantStories";

const iconOptions = ["left", "right", undefined] as const;

const meta: Meta<SearchInputProps> = {
  title: "Components/SearchInput",
  component: SearchInput,
  tags: ["autodocs"],
  args: {
    label: "Search docs",
    defaultValue: "",
    placeholder: "Search components",
    theme: "primary",
  },
};

export default meta;

type Story = StoryObj<SearchInputProps>;

export const Default: Story = {};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState("button");

    return (
      <SearchInput
        label="Search components"
        value={value}
        onChange={setValue}
        showSearchButton
        onSearch={setValue}
      />
    );
  },
};

export const WithSearchButton: Story = {
  args: {
    label: "Catalog search",
    defaultValue: "toolbar",
    showSearchButton: true,
  },
};

export const Loading: Story = {
  args: {
    label: "Searching",
    defaultValue: "accordion",
    loading: true,
    showSearchButton: true,
  },
};

export const WithoutClearButton: Story = {
  args: {
    label: "Locked query",
    defaultValue: "theme",
    showClearButton: false,
  },
};

export const IconVariants = () => (
  <StoryGrid title="Icon Variants">
    {iconOptions.map((iconPosition) => (
      <SearchInput
        key={iconPosition}
        label={iconPosition}
        icon={FaTree}
        defaultValue={iconPosition}
        iconPosition={iconPosition}
      />
    ))}
  </StoryGrid>
);

export const ThemeVariants = () => (
  <StoryGrid title="Theme Variants">
    {themeOptions.map((theme) => (
      <SearchInput
        key={theme}
        label={theme}
        defaultValue={theme}
        theme={theme}
      />
    ))}
  </StoryGrid>
);

export const GlassThemeVariants = () => (
  <StoryGrid title="Glass Theme Variants">
    {themeOptions.map((theme) => (
      <SearchInput
        key={theme}
        label={theme}
        defaultValue={theme}
        theme={theme}
        glass
      />
    ))}
  </StoryGrid>
);

export const StateVariants = () => (
  <StoryGrid title="State Variants">
    {stateOptions.map((state) => (
      <SearchInput
        key={state}
        label={state}
        defaultValue={state}
        state={state}
      />
    ))}
  </StoryGrid>
);

export const OutlineVariants = () => (
  <StoryGrid title="Outline Variants">
    {themeOptions.map((theme) => (
      <SearchInput
        key={theme}
        label={`${theme} outline`}
        defaultValue={theme}
        theme={theme}
        outline
      />
    ))}
  </StoryGrid>
);

export const RoundingVariants = () => (
  <StoryGrid title="Rounding Variants">
    {roundingOptions.map((rounding) => (
      <SearchInput
        key={rounding}
        label={rounding}
        defaultValue={rounding}
        rounding={rounding}
      />
    ))}
  </StoryGrid>
);

export const ShadowVariants = () => (
  <StoryGrid title="Shadow Variants">
    {shadowOptions.map((shadow) => (
      <SearchInput
        key={shadow}
        label={shadow}
        defaultValue={shadow}
        shadow={shadow}
      />
    ))}
  </StoryGrid>
);

export const Disabled: Story = {
  args: {
    label: "Disabled search",
    defaultValue: "modal",
    disabled: true,
    showSearchButton: true,
  },
};

export const ThemeMatrix: Story = {
  render: (args) => renderThemeVariants({ component: SearchInput, args }),
};

export const StateMatrix: Story = {
  render: (args) => renderStateVariants({ component: SearchInput, args }),
};

export const OutlineMatrix: Story = {
  render: (args) => renderOutlineVariants({ component: SearchInput, args }),
};

export const GlassMatrix: Story = {
  render: (args) => renderGlassVariants({ component: SearchInput, args }),
};

export const GlassOutlineMatrix: Story = {
  render: (args) =>
    renderGlassOutlineVariants({ component: SearchInput, args }),
};

export const StateOutlineMatrix: Story = {
  render: (args) =>
    renderStateOutlineVariants({ component: SearchInput, args }),
};
