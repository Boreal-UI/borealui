import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TimePicker } from "../../src/index.next";
import type { TimePickerProps } from "../../src/components/TimePicker/TimePicker.types";
import { StoryGrid } from "../../.storybook-core/helpers/StoryGrid";
import {
  roundingOptions,
  shadowOptions,
} from "../../shared-story-assets/OptionTypes";
import {
  renderThemeVariants,
  renderStateVariants,
  renderSizeVariants,
  renderOutlineVariants,
  renderGlassVariants,
  renderGlassOutlineVariants,
  renderStateOutlineVariants,
} from "../../shared-story-assets/VisualVariantStories";

const meta: Meta<TimePickerProps> = {
  title: "Components/TimePicker",
  component: TimePicker,
  tags: ["autodocs"],
  args: {
    label: "Start time",
    defaultValue: "09:30",
    helperText: "Choose a local start time.",
    theme: "primary",
  },
};

export default meta;

type Story = StoryObj<TimePickerProps>;

export const Sizes: Story = {
  render: () =>
    renderSizeVariants({
      component: TimePicker,
      args: { label: "Start time" },
      labelProp: "label",
    }),
};

export const Default: Story = {};

export const WithConstraints: Story = {
  args: {
    label: "Appointment time",
    min: "08:00",
    max: "17:00",
    step: 900,
    defaultValue: "09:30",
    helperText: "Appointments are available in 15 minute increments.",
  },
};

export const ErrorState: Story = {
  args: {
    label: "Cutoff time",
    value: "07:30",
    min: "08:00",
    errorMessage: "Choose a time after 8:00 AM.",
  },
};

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    label: "Launch window",
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
      <TimePicker
        key={rounding}
        label={rounding}
        rounding={rounding}
        defaultValue="09:30"
      />
    ))}
  </StoryGrid>
);

export const ShadowVariants = () => (
  <StoryGrid title="Shadow Variants">
    {shadowOptions.map((shadow) => (
      <TimePicker
        key={shadow}
        label={shadow}
        shadow={shadow}
        defaultValue="09:30"
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
  render: (args) => renderThemeVariants({ component: TimePicker, args }),
};

export const StateVariants: Story = {
  render: (args) => renderStateVariants({ component: TimePicker, args }),
};

export const OutlineVariants: Story = {
  render: (args) => renderOutlineVariants({ component: TimePicker, args }),
};

export const GlassVariants: Story = {
  render: (args) => renderGlassVariants({ component: TimePicker, args }),
};

export const GlassOutlineVariants: Story = {
  render: (args) => renderGlassOutlineVariants({ component: TimePicker, args }),
};

export const StateOutlineVariants: Story = {
  render: (args) => renderStateOutlineVariants({ component: TimePicker, args }),
};
