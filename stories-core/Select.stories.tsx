import { useCallback, useRef, useState } from "react";
import { Meta, StoryObj } from "@storybook/react-vite";
import { RoundingType, Select, ShadowType, ThemeType } from "../src/index.core";
import type { SelectProps } from "../src/components/Select/Select.types";
import { withVariants } from "../.storybook-core/helpers/withVariants";
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

const meta: Meta<SelectProps> = {
  title: "Components/Select",
  component: Select,
  tags: ["autodocs"],
  args: {
    placeholder: "Choose an option",
    theme: "primary",
    options: [
      { label: "Option A", value: "a" },
      { label: "Option B", value: "b" },
      { label: "Option C", value: "c" },
    ],
  },
};

const defaultArgs = {
  placeholder: "Choose an option",
  theme: "primary" as ThemeType,
  options: [
    { label: "Option A", value: "a" },
    { label: "Option B", value: "b" },
    { label: "Option C", value: "c" },
  ],
  value: "a",
  onChange: () => {},
  rounding: "medium" as RoundingType,
  shadow: "light" as ShadowType,
};

export default meta;

type Story = StoryObj<SelectProps>;

export const Sizes: Story = {
  render: () =>
    renderSizeVariants({
      component: Select,
      args: defaultArgs,
      labelProp: "label",
    }),
};

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState("");
    return (
      <Select
        {...args}
        value={value}
        onChange={setValue}
        aria-label="Default select"
      />
    );
  },
};

export const LabelPositions: Story = {
  render: (args) => {
    const [value, setValue] = useState("a");
    const positions = ["top", "bottom", "left", "right"] as const;

    return (
      <div style={{ display: "grid", gap: "1rem", maxWidth: "520px" }}>
        {positions.map((pos) => (
          <div key={pos} style={{ display: "grid", gap: "0.5rem" }}>
            <div style={{ fontSize: "0.9rem", opacity: 0.8 }}>
              Label Position: <strong>{pos}</strong>
            </div>

            <Select
              {...args}
              value={value}
              onChange={setValue}
              label={`Program`}
              labelPosition={pos}
              aria-label={`Select with labelPosition ${pos}`}
            />
          </div>
        ))}
      </div>
    );
  },
};

export const WithNumericOptions: Story = {
  args: {
    placeholder: "Choose a number",
    options: [
      { label: "1", value: "1" },
      { label: "2", value: "2" },
      { label: "3", value: "3" },
    ],
  },
  render: (args) => {
    const [value, setValue] = useState("");
    return (
      <Select
        {...args}
        value={value}
        onChange={setValue}
        aria-label="Numeric select"
      />
    );
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: "",
  },
};

export const RoundingVariants = () =>
  withVariants(Select, { ...defaultArgs }, [
    { propName: "rounding", values: roundingOptions },
  ]);

export const ShadowVariants = () =>
  withVariants(Select, { ...defaultArgs }, [
    { propName: "shadow", values: shadowOptions },
  ]);

export const WithPollingAsyncOptions: Story = {
  render: (args) => {
    const [value, setValue] = useState("");
    const counterRef = useRef(1);

    const asyncOptions = useCallback(() => {
      const timestamp = new Date().toLocaleTimeString();
      const newOptions = Array.from({ length: 3 }, (_, i) => ({
        label: `Polled ${counterRef.current + i} (${timestamp})`,
        value: `${counterRef.current + i}`,
      }));
      counterRef.current += 1;
      return Promise.resolve(newOptions);
    }, []);

    return (
      <Select
        {...args}
        value={value}
        onChange={setValue}
        asyncOptions={asyncOptions}
        pollInterval={10000}
        placeholder="Polling from server..."
        aria-label="Polling select"
      />
    );
  },
};

export const ThemeVariants: Story = {
  render: (args) => renderThemeVariants({ component: Select, args }),
};

export const StateVariants: Story = {
  render: (args) => renderStateVariants({ component: Select, args }),
};

export const OutlineVariants: Story = {
  render: (args) => renderOutlineVariants({ component: Select, args }),
};

export const GlassVariants: Story = {
  render: (args) => renderGlassVariants({ component: Select, args }),
};

export const GlassOutlineVariants: Story = {
  render: (args) => renderGlassOutlineVariants({ component: Select, args }),
};

export const StateOutlineVariants: Story = {
  render: (args) => renderStateOutlineVariants({ component: Select, args }),
};
