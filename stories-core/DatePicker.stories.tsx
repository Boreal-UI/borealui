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

export const Default: Story = {};

export const WithConstraints: Story = {
  args: {
    label: "Booking date",
    min: "2026-05-01",
    max: "2026-05-31",
    defaultValue: "2026-05-14",
    description: "Only dates in May 2026 are available.",
  },
};

export const ErrorState: Story = {
  args: {
    label: "Deadline",
    value: "2026-04-30",
    min: "2026-05-01",
    error: "Choose a date after May 1, 2026.",
  },
};

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    label: "Launch date",
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
      <DatePicker
        key={theme}
        label={theme}
        theme={theme}
        defaultValue="2026-05-14"
      />
    ))}
  </StoryGrid>
);

export const GlassThemeVariants = () => (
  <StoryGrid title="Glass Theme Variants">
    {themeOptions.map((theme) => (
      <DatePicker
        key={theme}
        label={theme}
        theme={theme}
        defaultValue="2026-05-14"
        glass
      />
    ))}
  </StoryGrid>
);

export const StateVariants = () => (
  <StoryGrid title="State Variants">
    {stateOptions.map((state) => (
      <DatePicker
        key={state}
        label={state}
        state={state}
        defaultValue="2026-05-14"
      />
    ))}
  </StoryGrid>
);

export const OutlineVariants = () => (
  <StoryGrid title="Outline Variants">
    {themeOptions.map((theme) => (
      <DatePicker
        key={theme}
        label={`${theme} outline`}
        theme={theme}
        defaultValue="2026-05-14"
        outline
      />
    ))}
  </StoryGrid>
);

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
