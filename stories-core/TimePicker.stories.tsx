import type { Meta, StoryObj } from "@storybook/react-vite";
import { TimePicker } from "../src/index.core";
import type { TimePickerProps } from "../src/components/TimePicker/TimePicker.types";
import { StoryGrid } from "../.storybook-core/helpers/StoryGrid";
import {
  roundingOptions,
  shadowOptions,
  stateOptions,
  themeOptions,
} from "../shared-story-assets/OptionTypes";

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

export const Default: Story = {};

export const WithConstraints: Story = {
  args: {
    label: "Appointment time",
    min: "08:00",
    max: "17:00",
    step: 900,
    defaultValue: "09:30",
    description: "Appointments are available in 15 minute increments.",
  },
};

export const ErrorState: Story = {
  args: {
    label: "Cutoff time",
    value: "07:30",
    min: "08:00",
    error: "Choose a time after 8:00 AM.",
  },
};

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    label: "Launch window",
    description: "The control stretches to the width of its parent.",
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
      <TimePicker
        key={theme}
        label={theme}
        theme={theme}
        defaultValue="09:30"
      />
    ))}
  </StoryGrid>
);

export const GlassThemeVariants = () => (
  <StoryGrid title="Glass Theme Variants">
    {themeOptions.map((theme) => (
      <TimePicker
        key={theme}
        label={theme}
        theme={theme}
        defaultValue="09:30"
        glass
      />
    ))}
  </StoryGrid>
);

export const StateVariants = () => (
  <StoryGrid title="State Variants">
    {stateOptions.map((state) => (
      <TimePicker
        key={state}
        label={state}
        state={state}
        defaultValue="09:30"
      />
    ))}
  </StoryGrid>
);

export const OutlineVariants = () => (
  <StoryGrid title="Outline Variants">
    {themeOptions.map((theme) => (
      <TimePicker
        key={theme}
        label={`${theme} outline`}
        theme={theme}
        defaultValue="09:30"
        outline
      />
    ))}
  </StoryGrid>
);

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
