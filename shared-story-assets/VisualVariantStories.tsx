import React from "react";
import { StoryGrid } from "../.storybook-core/helpers/StoryGrid";
import { stateOptions, themeOptions } from "./OptionTypes";

type VariantCapableProps = {
  theme?: string;
  state?: string;
  outline?: boolean;
  glass?: boolean;
};

type VariantStoryOptions = {
  component: React.ElementType;
  args: VariantCapableProps;
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
        outline
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
        glass
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
        glass
        outline
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
        outline
      />
    ))}
  </StoryGrid>
);
