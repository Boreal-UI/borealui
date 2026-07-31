import React from "react";
import { StoryGrid } from "../.storybook-core/helpers/StoryGrid";
import { sizeOptions, stateOptions, themeOptions } from "./OptionTypes";

type VariantStoryOptions = {
  component: React.ElementType;
  args: object;
  labelProp?: string;
};

const getLabelProps = (labelProp: string | undefined, label: string) =>
  labelProp ? { [labelProp]: label } : {};

export const renderThemeVariants = ({
  component: Component,
  args,
  labelProp,
}: VariantStoryOptions) => (
  <StoryGrid title="Theme Variants">
    {themeOptions.map((theme) => (
      <Component
        key={theme}
        {...args}
        {...getLabelProps(labelProp, `${theme} theme`)}
        theme={theme}
      />
    ))}
  </StoryGrid>
);

export const renderStateVariants = ({
  component: Component,
  args,
  labelProp,
}: VariantStoryOptions) => (
  <StoryGrid title="State Variants">
    {stateOptions.map((state) => (
      <Component
        key={state}
        {...args}
        {...getLabelProps(labelProp, `${state} state`)}
        state={state}
      />
    ))}
  </StoryGrid>
);

export const renderSizeVariants = ({
  component: Component,
  args,
  labelProp,
}: VariantStoryOptions) => (
  <StoryGrid title="Size Variants">
    {sizeOptions.map((size) => (
      <Component
        key={size}
        {...args}
        {...getLabelProps(labelProp, `${size} size`)}
        size={size}
      />
    ))}
  </StoryGrid>
);

export const renderOutlineVariants = ({
  component: Component,
  args,
  labelProp,
}: VariantStoryOptions) => (
  <StoryGrid title="Outline Theme Variants">
    {themeOptions.map((theme) => (
      <Component
        key={theme}
        {...args}
        {...getLabelProps(labelProp, `${theme} outline`)}
        theme={theme}
        variant="outline"
      />
    ))}
  </StoryGrid>
);

export const renderGlassVariants = ({
  component: Component,
  args,
  labelProp,
}: VariantStoryOptions) => (
  <StoryGrid title="Glass Theme Variants">
    {themeOptions.map((theme) => (
      <Component
        key={theme}
        {...args}
        {...getLabelProps(labelProp, `${theme} glass`)}
        theme={theme}
        variant="glass"
      />
    ))}
  </StoryGrid>
);

export const renderGlassOutlineVariants = ({
  component: Component,
  args,
  labelProp,
}: VariantStoryOptions) => (
  <StoryGrid title="Glass Outline Theme Variants">
    {themeOptions.map((theme) => (
      <Component
        key={theme}
        {...args}
        {...getLabelProps(labelProp, `${theme} glass outline`)}
        theme={theme}
        variant="glassOutline"
      />
    ))}
  </StoryGrid>
);

export const renderStateOutlineVariants = ({
  component: Component,
  args,
  labelProp,
}: VariantStoryOptions) => (
  <StoryGrid title="State Outline Variants">
    {stateOptions.map((state) => (
      <Component
        key={state}
        {...args}
        {...getLabelProps(labelProp, `${state} outline`)}
        state={state}
        variant="outline"
      />
    ))}
  </StoryGrid>
);
