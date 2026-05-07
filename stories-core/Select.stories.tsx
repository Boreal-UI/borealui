import { useCallback, useRef, useState } from "react";
import { Meta, StoryObj } from "@storybook/react-vite";
import {
  RoundingType,
  Select,
  ShadowType,
  StateType,
  ThemeType,
} from "../src/index.core";
import type { SelectProps } from "../src/components/Select/Select.types";
import { withVariants } from "../.storybook-core/helpers/withVariants";

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

export const ThemeVariants: Story = {
  render: (args) => {
    const [value, setValue] = useState("");
    const options = [
      { label: "Alpha", value: "alpha" },
      { label: "Beta", value: "beta" },
      { label: "Gamma", value: "gamma" },
    ];

    return (
      <div style={{ display: "grid", gap: "1rem" }}>
        {themeOptions.map((theme) => (
          <Select
            key={theme}
            {...args}
            theme={theme}
            value={value}
            onChange={setValue}
            options={options}
            aria-label={`Select with ${theme} theme`}
          />
        ))}
      </div>
    );
  },
};

export const StateVariants: Story = {
  render: (args) => {
    const [value, setValue] = useState("");
    const options = [
      { label: "Alpha", value: "alpha" },
      { label: "Beta", value: "beta" },
      { label: "Gamma", value: "gamma" },
    ];

    return (
      <div style={{ display: "grid", gap: "1rem" }}>
        {stateOptions.map((state) => (
          <Select
            key={state}
            {...args}
            state={state}
            value={value}
            onChange={setValue}
            options={options}
            aria-label={`Select with ${state} state`}
          />
        ))}
      </div>
    );
  },
};

export const OutlineVariants: Story = {
  render: (args) => {
    const [value, setValue] = useState("");
    const options = [
      { label: "Outlined A", value: "a" },
      { label: "Outlined B", value: "b" },
      { label: "Outlined C", value: "c" },
    ];

    return (
      <div style={{ display: "grid", gap: "1rem" }}>
        {themeOptions.map((theme) => (
          <Select
            key={theme}
            {...args}
            theme={theme}
            outline
            value={value}
            onChange={setValue}
            options={options}
            aria-label={`Outlined ${theme} select`}
          />
        ))}
        {stateOptions.map((state) => (
          <Select
            key={state}
            {...args}
            state={state}
            outline
            value={value}
            onChange={setValue}
            options={options}
            aria-label={`Outlined ${state} select`}
          />
        ))}
      </div>
    );
  },
};

export const GlassThemeVariants: Story = {
  render: (args) => {
    const [value, setValue] = useState("");
    const options = [
      { label: "Alpha", value: "alpha" },
      { label: "Beta", value: "beta" },
      { label: "Gamma", value: "gamma" },
    ];

    return (
      <div style={{ display: "grid", gap: "1rem" }}>
        {themeOptions.map((theme) => (
          <Select
            key={`glass-${theme}`}
            {...args}
            theme={theme}
            glass
            value={value}
            onChange={setValue}
            options={options}
            aria-label={`Glass ${theme} select`}
          />
        ))}
      </div>
    );
  },
};

export const GlassStateVariants: Story = {
  render: (args) => {
    const [value, setValue] = useState("");
    const options = [
      { label: "Alpha", value: "alpha" },
      { label: "Beta", value: "beta" },
      { label: "Gamma", value: "gamma" },
    ];

    return (
      <div style={{ display: "grid", gap: "1rem" }}>
        {stateOptions.map((state) => (
          <Select
            key={`glass-${state}`}
            {...args}
            state={state}
            glass
            value={value}
            onChange={setValue}
            options={options}
            aria-label={`Glass ${state} select`}
          />
        ))}
      </div>
    );
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
