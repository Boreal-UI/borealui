import { useState } from "react";
import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FaCommentDots, FaInbox } from "react-icons/fa";
import { StateType, TextArea, ThemeType } from "../../src/index.next";
import type { TextAreaProps } from "../../src/components/TextArea/TextArea.types";
import { withVariants } from "../../.storybook-core/helpers/withVariants";

const themeOptions: ThemeType[] = [
  "primary",
  "secondary",
  "tertiary",
  "quaternary",
  "clear",
];

const stateOptions: StateType[] = ["success", "error", "warning"];

const roundingOptions = ["none", "small", "medium", "large"];
const shadowOptions = ["none", "light", "medium", "strong", "intense"];

const meta: Meta<TextAreaProps> = {
  title: "Components/TextArea",
  component: TextArea,
  tags: ["autodocs"],
  args: {
    placeholder: "Enter your message...",
    theme: "primary",
    disabled: false,
    readOnly: false,
    autoComplete: "off",
  },
};

export default meta;
type Story = StoryObj<TextAreaProps>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState("");
    return (
      <TextArea {...args} value={value} onChange={(value) => setValue(value)} />
    );
  },
};

export const WithIcon: Story = {
  render: (args) => {
    const [value, setValue] = useState("");
    return (
      <TextArea
        {...args}
        icon={FaCommentDots}
        placeholder="Leave a comment..."
        value={value}
        onChange={(value) => setValue(value)}
      />
    );
  },
};

export const ThemedVariants: Story = {
  render: (args) => {
    return (
      <div style={{ display: "grid", gap: "1rem" }}>
        {themeOptions.map((theme) => {
          const [value, setValue] = useState("");
          return (
            <TextArea
              key={theme}
              {...args}
              theme={theme}
              placeholder={`${theme} theme`}
              value={value}
              onChange={(value) => setValue(value)}
            />
          );
        })}
      </div>
    );
  },
};

export const StateVariants: Story = {
  render: (args) => {
    return (
      <div style={{ display: "grid", gap: "1rem" }}>
        {stateOptions.map((state) => {
          const [value, setValue] = useState("");
          return (
            <TextArea
              key={state}
              {...args}
              state={state}
              placeholder={`${state} state`}
              value={value}
              onChange={(value) => setValue(value)}
            />
          );
        })}
      </div>
    );
  },
};

export const OutlineVariants: Story = {
  render: (args) => {
    return (
      <div style={{ display: "grid", gap: "1rem" }}>
        {themeOptions.map((theme) => {
          const [value, setValue] = useState("");
          return (
            <TextArea
              key={theme}
              {...args}
              outline
              theme={theme}
              icon={FaInbox}
              placeholder={`${theme} outline`}
              value={value}
              onChange={(value) => setValue(value)}
            />
          );
        })}
      </div>
    );
  },
};

export const GlassThemeVariants: Story = {
  render: (args) => {
    return (
      <div style={{ display: "grid", gap: "1rem" }}>
        {themeOptions.map((theme) => {
          const [value, setValue] = useState("");
          return (
            <TextArea
              key={`glass-${theme}`}
              {...args}
              icon={FaInbox}
              glass
              theme={theme}
              placeholder={`${theme} glass`}
              value={value}
              onChange={(value) => setValue(value)}
            />
          );
        })}
      </div>
    );
  },
};

export const GlassStateVariants: Story = {
  render: (args) => {
    return (
      <div style={{ display: "grid", gap: "1rem" }}>
        {stateOptions.map((state) => {
          const [value, setValue] = useState("");
          return (
            <TextArea
              key={`glass-${state}`}
              {...args}
              icon={FaInbox}
              glass
              state={state}
              placeholder={`${state} glass`}
              value={value}
              onChange={(value) => setValue(value)}
            />
          );
        })}
      </div>
    );
  },
};

export const CustomHeight: Story = {
  render: (args) => {
    const [value, setValue] = useState("");
    return (
      <TextArea
        {...args}
        height="150px"
        placeholder="Tall textarea for longer input..."
        value={value}
        onChange={(value) => setValue(value)}
      />
    );
  },
};

export const Unresizable: Story = {
  render: (args) => {
    const [value, setValue] = useState("");
    return (
      <TextArea
        {...args}
        resizable={false}
        placeholder="Cannot be resized"
        value={value}
        rows={1}
        onChange={(value) => setValue(value)}
      />
    );
  },
  args: {
    resizable: false,
  },
};

export const WithAriaDescription: Story = {
  render: (args) => {
    const [value, setValue] = useState("");
    return (
      <TextArea
        {...args}
        placeholder="Describe your experience..."
        aria-description="Use this field to describe your experience with our product."
        value={value}
        onChange={(value) => setValue(value)}
      />
    );
  },
};

export const Disabled: Story = {
  render: (args) => (
    <TextArea
      {...args}
      disabled
      value="This field is disabled."
      onChange={() => {}}
    />
  ),
};

export const LabelPositionVariants: Story = {
  render: (args) => {
    return (
      <div style={{ display: "grid", gap: "1.5rem", maxWidth: "700px" }}>
        {(["top", "left", "right", "bottom"] as const).map((position) => {
          const [value, setValue] = useState("");
          return (
            <TextArea
              key={position}
              {...args}
              label={`Label ${position}`}
              labelPosition={position}
              placeholder={`Label position: ${position}`}
              value={value}
              onChange={(value) => setValue(value)}
            />
          );
        })}
      </div>
    );
  },
};

export const RoundingVariants = (args: React.ComponentProps<typeof TextArea>) =>
  withVariants(TextArea, { ...args }, [
    { propName: "rounding", values: roundingOptions },
  ]);

export const ShadowVariants = (args: React.ComponentProps<typeof TextArea>) =>
  withVariants(TextArea, { ...args }, [
    { propName: "shadow", values: shadowOptions },
  ]);
