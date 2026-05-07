import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  DateTimePicker,
  RoundingType,
  ShadowType,
  StateType,
  ThemeType,
} from "../src/index.core";
import type { DateTimePickerProps } from "../src/components/DateTimePicker/DateTimePicker.types";
import { StoryGrid } from "../.storybook-core/helpers/StoryGrid";

const themeOptions: ThemeType[] = [
  "primary",
  "secondary",
  "tertiary",
  "quaternary",
  "clear",
];

const stateOptions: StateType[] = ["success", "error", "warning"];

const roundingOptions: RoundingType[] = ["none", "small", "medium", "large"];
const shadowOptions: ShadowType[] = [
  "none",
  "light",
  "medium",
  "strong",
  "intense",
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

export const OutlineVariants: Story = {
  render: (args) => {
    const [value, setValue] = useState("2025-04-15T11:00");

    return (
      <div style={{ display: "grid", gap: "1rem", padding: "1rem" }}>
        {themeOptions.map((theme) => (
          <DateTimePicker
            key={theme}
            {...args}
            theme={theme}
            outline
            value={value}
            onChange={setValue}
            label={`${theme.charAt(0).toUpperCase() + theme.slice(1)} Outline`}
          />
        ))}
      </div>
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

export const ThemeVariants: Story = {
  render: (args) => {
    const [value, setValue] = useState("2025-04-15T11:00");

    return (
      <div style={{ display: "grid", gap: "1rem", padding: "1rem" }}>
        {themeOptions.map((theme) => (
          <DateTimePicker
            key={theme}
            {...args}
            theme={theme}
            value={value}
            onChange={setValue}
            label={`${theme.charAt(0).toUpperCase() + theme.slice(1)} Theme`}
          />
        ))}
      </div>
    );
  },
};

export const StateVariants: Story = {
  render: (args) => {
    const [value, setValue] = useState("2025-04-15T11:00");

    return (
      <div style={{ display: "grid", gap: "1rem", padding: "1rem" }}>
        {stateOptions.map((state) => (
          <DateTimePicker
            key={state}
            {...args}
            state={state}
            value={value}
            onChange={setValue}
            label={`${state.charAt(0).toUpperCase() + state.slice(1)} State`}
          />
        ))}
      </div>
    );
  },
};

export const GlassThemeVariants: Story = {
  render: (args) => {
    const [value, setValue] = useState("2025-04-15T11:00");

    return (
      <div style={{ display: "grid", gap: "1rem", padding: "1rem" }}>
        {themeOptions.map((theme) => (
          <DateTimePicker
            key={`glass-${theme}`}
            {...args}
            theme={theme}
            glass
            value={value}
            onChange={setValue}
            label={`${theme.charAt(0).toUpperCase() + theme.slice(1)} Glass`}
          />
        ))}
      </div>
    );
  },
};

export const GlassStateVariants: Story = {
  render: (args) => {
    const [value, setValue] = useState("2025-04-15T11:00");

    return (
      <div style={{ display: "grid", gap: "1rem", padding: "1rem" }}>
        {stateOptions.map((state) => (
          <DateTimePicker
            key={`glass-${state}`}
            {...args}
            state={state}
            glass
            value={value}
            onChange={setValue}
            label={`${state.charAt(0).toUpperCase() + state.slice(1)} Glass`}
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
