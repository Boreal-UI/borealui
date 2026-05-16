import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SegmentedControl } from "../../src/index.next";
import type { SegmentedControlProps } from "../../src/components/SegmentedControl/SegmentedControl.types";
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

export const ThemeVariants = () => (
  <StoryGrid title="Theme Variants">
    {themeOptions.map((theme) => (
      <SegmentedControl
        key={theme}
        label={theme}
        theme={theme}
        options={rangeOptions}
        defaultValue="week"
      />
    ))}
  </StoryGrid>
);

export const GlassThemeVariants = () => (
  <StoryGrid title="Glass Theme Variants">
    {themeOptions.map((theme) => (
      <SegmentedControl
        key={theme}
        label={theme}
        theme={theme}
        glass
        options={rangeOptions}
        defaultValue="week"
      />
    ))}
  </StoryGrid>
);

export const StateVariants = () => (
  <StoryGrid title="State Variants">
    {stateOptions.map((state) => (
      <SegmentedControl
        key={state}
        label={state}
        state={state}
        options={rangeOptions}
        defaultValue="week"
      />
    ))}
  </StoryGrid>
);

export const OutlineVariants = () => (
  <StoryGrid title="Outline Variants">
    {themeOptions.map((theme) => (
      <SegmentedControl
        key={theme}
        label={`${theme} outline`}
        theme={theme}
        outline
        options={rangeOptions}
        defaultValue="week"
      />
    ))}
  </StoryGrid>
);

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

export const ThemeMatrix: Story = {
  render: (args) => renderThemeVariants({ component: SegmentedControl, args }),
};

export const StateMatrix: Story = {
  render: (args) => renderStateVariants({ component: SegmentedControl, args }),
};

export const OutlineMatrix: Story = {
  render: (args) =>
    renderOutlineVariants({ component: SegmentedControl, args }),
};

export const GlassMatrix: Story = {
  render: (args) => renderGlassVariants({ component: SegmentedControl, args }),
};

export const GlassOutlineMatrix: Story = {
  render: (args) =>
    renderGlassOutlineVariants({ component: SegmentedControl, args }),
};

export const StateOutlineMatrix: Story = {
  render: (args) =>
    renderStateOutlineVariants({ component: SegmentedControl, args }),
};
