import type { Meta, StoryObj } from "@storybook/react-vite";
import { DateTimePicker } from "../src/index.core";
import type { DateTimePickerProps } from "../src/components/DateTimePicker/DateTimePicker.types";
import { StoryGrid } from "../.storybook-core/helpers/StoryGrid";
import {
  roundingOptions,
  shadowOptions,
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

const meta: Meta<DateTimePickerProps> = {
  title: "Components/DateTimePicker",
  component: DateTimePicker,
  tags: ["autodocs"],
  args: {
    label: "Start date and time",
    defaultValue: "2026-05-14T09:30",
    helperText: "Choose a date and time for the work to begin.",
    theme: "primary",
  },
};

export default meta;

type Story = StoryObj<DateTimePickerProps>;

export const Sizes: Story = {
  render: () =>
    renderSizeVariants({
      component: DateTimePicker,
      args: { label: "Start date and time" },
      labelProp: "label",
    }),
};

export const Default: Story = {};

export const WithConstraints: Story = {
  args: {
    label: "Booking date and time",
    min: "2026-05-01T00:00",
    max: "2026-05-31T23:59",
    defaultValue: "2026-05-14T09:30",
    helperText: "Only times in May 2026 are available.",
  },
};

export const ErrorState: Story = {
  args: {
    label: "Deadline",
    value: "2026-04-30T16:00",
    min: "2026-05-01T00:00",
    errorMessage: "Choose a date and time after May 1, 2026.",
  },
};

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    label: "Launch date and time",
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
      <DateTimePicker
        key={rounding}
        label={rounding}
        rounding={rounding}
        defaultValue="2026-05-14T09:30"
      />
    ))}
  </StoryGrid>
);

export const ShadowVariants = () => (
  <StoryGrid title="Shadow Variants">
    {shadowOptions.map((shadow) => (
      <DateTimePicker
        key={shadow}
        label={shadow}
        shadow={shadow}
        defaultValue="2026-05-14T09:30"
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
  render: (args) => renderThemeVariants({ component: DateTimePicker, args }),
};

export const StateVariants: Story = {
  render: (args) => renderStateVariants({ component: DateTimePicker, args }),
};

export const OutlineVariants: Story = {
  render: (args) => renderOutlineVariants({ component: DateTimePicker, args }),
};

export const GlassVariants: Story = {
  render: (args) => renderGlassVariants({ component: DateTimePicker, args }),
};

export const GlassOutlineVariants: Story = {
  render: (args) =>
    renderGlassOutlineVariants({ component: DateTimePicker, args }),
};

export const StateOutlineVariants: Story = {
  render: (args) =>
    renderStateOutlineVariants({ component: DateTimePicker, args }),
};
