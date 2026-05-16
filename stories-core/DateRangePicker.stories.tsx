import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DateRangePicker } from "../src/index.core";
import {
  themeOptions,
  stateOptions,
  roundingOptions,
  shadowOptions,
} from "../shared-story-assets/OptionTypes";
import {
  DateRangePickerProps,
  DateRangeValue,
} from "../src/components/DateRangePicker/DateRangePicker.types";
import {
  renderThemeVariants,
  renderStateVariants,
  renderOutlineVariants,
  renderGlassVariants,
  renderGlassOutlineVariants,
  renderStateOutlineVariants,
} from "../shared-story-assets/VisualVariantStories";

const meta: Meta<DateRangePickerProps> = {
  title: "Components/DateRangePicker",
  component: DateRangePicker,
  tags: ["autodocs"],
  argTypes: {
    theme: {
      control: "select",
      options: themeOptions,
    },
    state: {
      control: "select",
      options: [...stateOptions],
    },
    rounding: {
      control: "select",
      options: roundingOptions,
    },
    shadow: {
      control: "select",
      options: shadowOptions,
    },
    labelPosition: {
      control: "select",
      options: ["top", "bottom", "left", "right"],
    },
    outline: {
      control: "boolean",
    },
    glass: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
    required: {
      control: "boolean",
    },
    min: {
      control: "text",
    },
    max: {
      control: "text",
    },
    onChange: {
      action: "changed",
    },
  },
  args: {
    label: "Report range",
    startLabel: "Start date",
    endLabel: "End date",
    labelPosition: "top",
    value: { start: "2026-05-01", end: "2026-05-12" },
    min: "2026-01-01",
    max: "2026-12-31",
    helperText: "Choose the date range used for the report.",
    theme: "primary",
    state: "",
    outline: false,
    glass: false,
    rounding: "medium",
    shadow: "none",
    disabled: false,
    required: false,
    onChange: () => undefined,
  },
};

export default meta;
type Story = StoryObj<DateRangePickerProps>;

function DateRangePickerDemo(args: DateRangePickerProps) {
  const [value, setValue] = useState<DateRangeValue>(args.value);

  return (
    <DateRangePicker
      {...args}
      value={value}
      onChange={(nextValue) => {
        setValue(nextValue);
        args.onChange?.(nextValue);
      }}
    />
  );
}

export const Default: Story = {
  render: (args) => <DateRangePickerDemo {...args} />,
};

export const Error: Story = {
  render: (args) => <DateRangePickerDemo {...args} />,
  args: {
    state: "error",
    error: "End date must be after start date.",
    helperText: "Start dates cannot be later than end dates.",
  },
};

export const Required: Story = {
  render: (args) => <DateRangePickerDemo {...args} />,
  args: {
    required: true,
    helperText: "Both dates are required.",
  },
};

export const Disabled: Story = {
  render: (args) => <DateRangePickerDemo {...args} />,
  args: {
    disabled: true,
    helperText: "This date range cannot be edited.",
  },
};

export const CustomLabels: Story = {
  render: (args) => <DateRangePickerDemo {...args} />,
  args: {
    label: "Booking dates",
    startLabel: "Check-in",
    endLabel: "Check-out",
    helperText: "Select the arrival and departure dates.",
    value: { start: "2026-07-10", end: "2026-07-18" },
  },
};

export const LabelLeft: Story = {
  render: (args) => <DateRangePickerDemo {...args} />,
  args: {
    labelPosition: "left",
  },
};

export const LabelRight: Story = {
  render: (args) => <DateRangePickerDemo {...args} />,
  args: {
    labelPosition: "right",
  },
};

export const LabelBottom: Story = {
  render: (args) => <DateRangePickerDemo {...args} />,
  args: {
    labelPosition: "bottom",
  },
};

export const ThemeVariants: Story = {
  render: (args) => renderThemeVariants({ component: DateRangePicker, args }),
};

export const StateVariants: Story = {
  render: (args) => renderStateVariants({ component: DateRangePicker, args }),
};

export const OutlineVariants: Story = {
  render: (args) => renderOutlineVariants({ component: DateRangePicker, args }),
};

export const GlassVariants: Story = {
  render: (args) => renderGlassVariants({ component: DateRangePicker, args }),
};

export const GlassOutlineVariants: Story = {
  render: (args) =>
    renderGlassOutlineVariants({ component: DateRangePicker, args }),
};

export const StateOutlineVariants: Story = {
  render: (args) =>
    renderStateOutlineVariants({ component: DateRangePicker, args }),
};
