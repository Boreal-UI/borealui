import type { Meta, StoryObj } from "@storybook/react-vite";
import { ValidationSummary } from "../src/index.core";
import type { ValidationSummaryProps } from "../src/components/ValidationSummary/ValidationSummary.types";
import { StoryGrid } from "../.storybook-core/helpers/StoryGrid";
import {
  roundingOptions,
  shadowOptions,
  stateOptions,
  themeOptions,
} from "../shared-story-assets/OptionTypes";

const validationItems = [
  {
    id: "email",
    message: "Email address is required.",
    fieldId: "email",
  },
  {
    id: "password",
    message: "Password must be at least 8 characters.",
    fieldId: "password",
  },
  {
    id: "terms",
    message: "Accept the terms before continuing.",
    fieldId: "terms",
  },
];

const meta: Meta<ValidationSummaryProps> = {
  title: "Components/ValidationSummary",
  component: ValidationSummary,
  tags: ["autodocs"],
  args: {
    label: "Fix the following",
    description: "Review these fields before submitting the form.",
    items: validationItems,
    theme: "primary",
  },
};

export default meta;

type Story = StoryObj<ValidationSummaryProps>;

export const Default: Story = {};

export const CallbackItems: Story = {
  args: {
    items: [
      "Choose an account type.",
      "Add at least one workspace member.",
      "Select a billing contact.",
    ],
    onItemClick: () => undefined,
  },
};

export const Empty: Story = {
  args: {
    items: [],
    hideWhenEmpty: false,
    emptyMessage: "No validation issues.",
    role: "status",
    state: "success",
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    loadingMessage: "Checking fields",
  },
};

export const FocusOnMount: Story = {
  args: {
    focusOnMount: true,
  },
};

export const ThemeVariants = () => (
  <StoryGrid title="Theme Variants">
    {themeOptions.map((theme) => (
      <ValidationSummary
        key={theme}
        label={theme}
        theme={theme}
        items={validationItems.slice(0, 2)}
      />
    ))}
  </StoryGrid>
);

export const GlassThemeVariants = () => (
  <StoryGrid title="Glass Theme Variants">
    {themeOptions.map((theme) => (
      <ValidationSummary
        key={theme}
        label={theme}
        theme={theme}
        glass
        items={validationItems.slice(0, 2)}
      />
    ))}
  </StoryGrid>
);

export const StateVariants = () => (
  <StoryGrid title="State Variants">
    {stateOptions.map((state) => (
      <ValidationSummary
        key={state}
        label={state || "default"}
        state={state}
        items={validationItems.slice(0, 2)}
      />
    ))}
  </StoryGrid>
);

export const OutlineVariants = () => (
  <StoryGrid title="Outline Variants">
    {themeOptions.map((theme) => (
      <ValidationSummary
        key={theme}
        label={`${theme} outline`}
        theme={theme}
        outline
        items={validationItems.slice(0, 2)}
      />
    ))}
  </StoryGrid>
);

export const RoundingVariants = () => (
  <StoryGrid title="Rounding Variants">
    {roundingOptions.map((rounding) => (
      <ValidationSummary
        key={rounding}
        label={rounding}
        rounding={rounding}
        items={validationItems.slice(0, 2)}
      />
    ))}
  </StoryGrid>
);

export const ShadowVariants = () => (
  <StoryGrid title="Shadow Variants">
    {shadowOptions.map((shadow) => (
      <ValidationSummary
        key={shadow}
        label={shadow}
        shadow={shadow}
        items={validationItems.slice(0, 2)}
      />
    ))}
  </StoryGrid>
);

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
