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
import { FaStop } from "../shared-story-assets/icons";
import {
  renderThemeVariants,
  renderStateVariants,
  renderOutlineVariants,
  renderGlassVariants,
  renderGlassOutlineVariants,
  renderStateOutlineVariants,
} from "../shared-story-assets/VisualVariantStories";

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

export const Icon: Story = {
  args: {
    items: [
      "Choose an account type.",
      "Add at least one workspace member.",
      "Select a billing contact.",
    ],
    icon: <FaStop />,
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

export const ThemeVariants: Story = {
  render: (args) => renderThemeVariants({ component: ValidationSummary, args }),
};

export const StateVariants: Story = {
  render: (args) => renderStateVariants({ component: ValidationSummary, args }),
};

export const OutlineVariants: Story = {
  render: (args) =>
    renderOutlineVariants({ component: ValidationSummary, args }),
};

export const GlassVariants: Story = {
  render: (args) => renderGlassVariants({ component: ValidationSummary, args }),
};

export const GlassOutlineVariants: Story = {
  render: (args) =>
    renderGlassOutlineVariants({ component: ValidationSummary, args }),
};

export const StateOutlineVariants: Story = {
  render: (args) =>
    renderStateOutlineVariants({ component: ValidationSummary, args }),
};
