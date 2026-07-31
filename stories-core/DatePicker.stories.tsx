import type { Meta, StoryObj } from "@storybook/react-vite";
import { DatePicker } from "../src/index.core";
import type { DatePickerProps } from "../src/components/DatePicker/DatePicker.types";
import { StoryGrid } from "../.storybook-core/helpers/StoryGrid";
import {
  roundingOptions,
  shadowOptions,
  stateOptions,
  themeOptions,
} from "../shared-story-assets/OptionTypes";
import {
  renderThemeVariants,
  renderStateVariants,
  renderSizeVariants,
  renderOutlineVariants,
  renderGlassVariants,
  renderGlassOutlineVariants,
  renderStateOutlineVariants,
} from "../shared-story-assets/VisualVariantStories";

const meta: Meta<DatePickerProps> = {
  title: "Components/DatePicker",
  component: DatePicker,
  tags: ["autodocs"],
  args: {
    label: "Start date",
    defaultValue: "2026-05-14",
    helperText: "Choose a date for the work to begin.",
    theme: "primary",
  },
};

export default meta;

type Story = StoryObj<DatePickerProps>;

export const Sizes: Story = {
  render: () =>
    renderSizeVariants({
      component: DatePicker,
      args: { label: "Start date" },
      labelProp: "label",
    }),
};

export const Default: Story = {};

export const WithConstraints: Story = {
  args: {
    label: "Booking date",
    min: "2026-05-01",
    max: "2026-05-31",
    defaultValue: "2026-05-14",
    helperText: "Only dates in May 2026 are available.",
  },
};

export const ErrorState: Story = {
  args: {
    label: "Deadline",
    value: "2026-04-30",
    min: "2026-05-01",
    errorMessage: "Choose a date after May 1, 2026.",
  },
};

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    label: "Launch date",
    helperText: "The control stretches to the width of its parent.",
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
      <DatePicker
        key={rounding}
        label={rounding}
        rounding={rounding}
        defaultValue="2026-05-14"
      />
    ))}
  </StoryGrid>
);

export const ShadowVariants = () => (
  <StoryGrid title="Shadow Variants">
    {shadowOptions.map((shadow) => (
      <DatePicker
        key={shadow}
        label={shadow}
        shadow={shadow}
        defaultValue="2026-05-14"
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
  render: (args) => renderThemeVariants({ component: DatePicker, args }),
};

export const StateVariants: Story = {
  render: (args) => renderStateVariants({ component: DatePicker, args }),
};

export const OutlineVariants: Story = {
  render: (args) => renderOutlineVariants({ component: DatePicker, args }),
};

export const GlassVariants: Story = {
  render: (args) => renderGlassVariants({ component: DatePicker, args }),
};

export const GlassOutlineVariants: Story = {
  render: (args) => renderGlassOutlineVariants({ component: DatePicker, args }),
};

export const StateOutlineVariants: Story = {
  render: (args) => renderStateOutlineVariants({ component: DatePicker, args }),
};
