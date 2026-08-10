import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SegmentedControl } from "../../src/index.next";
import type { SegmentedControlProps } from "../../src/components/SegmentedControl/SegmentedControl.types";
import { StoryGrid } from "../../.storybook-core/helpers/StoryGrid";
import {
  roundingOptions,
  shadowOptions,
} from "../../shared-story-assets/OptionTypes";
import {
  renderThemeVariants,
  renderStateVariants,
  renderOutlineVariants,
  renderGlassVariants,
  renderGlassOutlineVariants,
  renderStateOutlineVariants,
} from "../../shared-story-assets/VisualVariantStories";

const rangeOptions = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
];

const meta: Meta<SegmentedControlProps> = {
  title: "Components/SegmentedControl",
  component: SegmentedControl,
  tags: ["autodocs"],
  args: {
    label: "Range",
    options: rangeOptions,
    defaultValue: "week",
    theme: "primary",
  },
};

export default meta;

type Story = StoryObj<SegmentedControlProps>;

export const Default: Story = {};

export const WithFormName: Story = {
  args: {
    name: "range",
    required: true,
  },
};

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    equalWidth: true,
  },
};

export const Vertical: Story = {
  args: {
    orientation: "vertical",
    options: [
      { value: "compact", label: "Compact" },
      { value: "comfortable", label: "Comfortable" },
      { value: "spacious", label: "Spacious" },
    ],
    defaultValue: "comfortable",
  },
};

export const DisabledOptions: Story = {
  args: {
    options: [
      { value: "overview", label: "Overview" },
      { value: "activity", label: "Activity" },
      { value: "billing", label: "Billing", disabled: true },
    ],
    defaultValue: "overview",
  },
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};

export const RoundingVariants = () => (
  <StoryGrid title="Rounding Variants">
    {roundingOptions.map((rounding) => (
      <SegmentedControl
        key={rounding}
        label={rounding}
        rounding={rounding}
        options={rangeOptions}
        defaultValue="week"
      />
    ))}
  </StoryGrid>
);

export const ShadowVariants = () => (
  <StoryGrid title="Shadow Variants">
    {shadowOptions.map((shadow) => (
      <SegmentedControl
        key={shadow}
        label={shadow}
        shadow={shadow}
        options={rangeOptions}
        defaultValue="week"
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
  render: (args) => renderThemeVariants({ component: SegmentedControl, args }),
};

export const StateVariants: Story = {
  render: (args) => renderStateVariants({ component: SegmentedControl, args }),
};

export const OutlineVariants: Story = {
  render: (args) =>
    renderOutlineVariants({ component: SegmentedControl, args }),
};

export const GlassVariants: Story = {
  render: (args) => renderGlassVariants({ component: SegmentedControl, args }),
};

export const GlassOutlineVariants: Story = {
  render: (args) =>
    renderGlassOutlineVariants({ component: SegmentedControl, args }),
};

export const StateOutlineVariants: Story = {
  render: (args) =>
    renderStateOutlineVariants({ component: SegmentedControl, args }),
};
