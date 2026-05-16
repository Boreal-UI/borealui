import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DateTimePicker, LabelPositionType } from "../src/index.core";
import type { DateTimePickerProps } from "../src/components/DateTimePicker/DateTimePicker.types";
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
  renderOutlineVariants,
  renderGlassVariants,
  renderGlassOutlineVariants,
  renderStateOutlineVariants,
} from "../shared-story-assets/VisualVariantStories";

const labelPositionOptions: LabelPositionType[] = [
  "top",
  "bottom",
  "left",
  "right",
];

const meta: Meta<DateTimePickerProps> = {
  title: "Components/DateTimePicker",
  component: DateTimePicker,
  tags: ["autodocs"],
  args: {
    label: "Select date and time",
    theme: "primary",
    size: "medium",
  },
};

export default meta;

type Story = StoryObj<DateTimePickerProps>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState("2025-04-15T10:30");
    return <DateTimePicker {...args} value={value} onChange={setValue} />;
  },
};

export const FullWidth: Story = {
  render: (args) => {
    const [value, setValue] = useState("2025-04-15T10:30");
    return (
      <DateTimePicker {...args} fullWidth value={value} onChange={setValue} />
    );
  },
};

export const WithMinMax: Story = {
  render: (args) => {
    const [value, setValue] = useState("2025-04-15T12:00");
    return (
      <DateTimePicker
        {...args}
        value={value}
        onChange={setValue}
        min="2025-04-15T08:00"
        max="2025-04-15T18:00"
        theme="secondary"
      />
    );
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: "2025-04-15T14:00",
    onChange: () => {},
  },
};

export const Required: Story = {
  render: (args) => {
    const [value, setValue] = useState("");
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          alert(`Submitted: ${value}`);
        }}
      >
        <DateTimePicker {...args} required value={value} onChange={setValue} />
        <button type="submit" style={{ marginTop: "1rem" }}>
          Submit
        </button>
      </form>
    );
  },
};

export const Sizes: Story = {
  render: (args) => {
    const [value, setValue] = useState("2025-04-15T09:00");
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <DateTimePicker
          {...args}
          size="xs"
          value={value}
          theme="secondary"
          onChange={setValue}
          label="xs"
        />
        <DateTimePicker
          {...args}
          size="small"
          value={value}
          theme="secondary"
          onChange={setValue}
          label="Small"
        />
        <DateTimePicker
          {...args}
          size="medium"
          value={value}
          theme="secondary"
          onChange={setValue}
          label="Medium"
        />
        <DateTimePicker
          {...args}
          size="large"
          value={value}
          theme="secondary"
          onChange={setValue}
          label="Large"
        />
        <DateTimePicker
          {...args}
          size="xl"
          value={value}
          theme="secondary"
          onChange={setValue}
          label="xl"
        />
      </div>
    );
  },
};

export const LabelPositionVariants: Story = {
  render: (args) => {
    const [value, setValue] = useState("2025-04-15T11:00");

    return (
      <div style={{ display: "grid", gap: "1rem", padding: "1rem" }}>
        {labelPositionOptions.map((labelPosition) => (
          <DateTimePicker
            key={labelPosition}
            {...args}
            labelPosition={labelPosition}
            value={value}
            onChange={setValue}
            label={`${labelPosition.charAt(0).toUpperCase() + labelPosition.slice(1)} Label`}
          />
        ))}
      </div>
    );
  },
};

export const RoundingVariants = () => (
  <StoryGrid title="Rounding Variants">
    {roundingOptions.map((rounding) => (
      <DateTimePicker key={rounding} rounding={rounding} />
    ))}
  </StoryGrid>
);

export const ShadowVariants = () => (
  <StoryGrid title="Shadow Variants">
    {shadowOptions.map((shadow) => (
      <DateTimePicker key={shadow} shadow={shadow} />
    ))}
  </StoryGrid>
);

export const WithClassName: Story = {
  args: {
    className: "storybook-datetime-custom",
    value: "2025-04-15T15:30",
    onChange: () => {},
  },
};

export const WithDataTestid: Story = {
  args: {
    "data-testid": "datetimepicker-storybook",
    value: "2025-04-15T15:30",
    onChange: () => {},
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
