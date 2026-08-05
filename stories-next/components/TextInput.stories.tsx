import { useState } from "react";
import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FaInbox, FaUser } from "../../shared-story-assets/icons";
import { TextInput } from "../../src/index.next";
import type { TextInputProps } from "../../src/components/TextInput/TextInput.types";
import { withVariants } from "../../.storybook-core/helpers/withVariants";
import {
  renderThemeVariants,
  renderStateVariants,
  renderSizeVariants,
  renderOutlineVariants,
  renderGlassVariants,
  renderGlassOutlineVariants,
  renderStateOutlineVariants,
} from "../../shared-story-assets/VisualVariantStories";

const roundingOptions: NonNullable<TextInputProps["rounding"]>[] = [
  "none",
  "small",
  "medium",
  "large",
];

const shadowOptions: NonNullable<TextInputProps["shadow"]>[] = [
  "none",
  "light",
  "medium",
  "strong",
  "intense",
];

const labelPositionOptions: NonNullable<TextInputProps["labelPosition"]>[] = [
  "top",
  "bottom",
  "left",
  "right",
];

const meta: Meta<TextInputProps> = {
  title: "Components/TextInput",
  component: TextInput,
  tags: ["autodocs"],
  args: {
    placeholder: "Enter text...",
    theme: "primary",
    disabled: false,
    readOnly: false,
    password: false,
    autoComplete: "off",
    labelPosition: "top",
  },
};

export default meta;

type Story = StoryObj<TextInputProps>;

export const Sizes: Story = {
  render: () =>
    renderSizeVariants({
      component: TextInput,
      args: { label: "Name" },
      labelProp: "label",
    }),
};

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState("");
    return (
      <TextInput
        {...args}
        value={value}
        onChange={(value) => setValue(value)}
      />
    );
  },
};

export const WithIcon: Story = {
  render: (args) => {
    const [value, setValue] = useState("");
    return (
      <TextInput
        {...args}
        icon={FaUser}
        placeholder="Username"
        value={value}
        onChange={(value) => setValue(value)}
      />
    );
  },
};

export const FullWidth: Story = {
  render: (args) => {
    const [value, setValue] = useState("");
    return (
      <TextInput
        {...args}
        icon={FaUser}
        placeholder="Username"
        fullWidth
        value={value}
        onChange={(value) => setValue(value)}
      />
    );
  },
};

export const WithLabel: Story = {
  render: (args) => {
    const [value, setValue] = useState("");
    return (
      <TextInput
        {...args}
        label="Username"
        labelPosition="top"
        placeholder="Enter your username"
        value={value}
        onChange={(value) => setValue(value)}
      />
    );
  },
};

export const LabelPositionVariants: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: "1rem", maxWidth: "420px" }}>
      {labelPositionOptions.map((position) => (
        <TextInput
          key={position}
          {...args}
          label={`Label ${position}`}
          labelPosition={position}
          placeholder={`Label position: ${position}`}
          defaultValue=""
        />
      ))}
    </div>
  ),
};

export const PasswordInput: Story = {
  render: (args) => {
    const [value, setValue] = useState("");
    return (
      <TextInput
        {...args}
        placeholder="Enter password"
        password
        value={value}
        onChange={(value) => setValue(value)}
      />
    );
  },
};

export const Disabled: Story = {
  render: (args) => {
    return (
      <div style={{ display: "grid", gap: "1rem" }}>
        <TextInput
          {...args}
          disabled
          theme={"primary"}
          placeholder={`Disabled`}
          value=""
          onChange={() => {}}
        />
      </div>
    );
  },
};

export const WithAriaDescription: Story = {
  render: (args) => {
    const [value, setValue] = useState("");
    return (
      <TextInput
        {...args}
        placeholder="Type a short bio..."
        aria-description="This field is used to describe yourself in 100 characters or less."
        value={value}
        onChange={(value) => setValue(value)}
      />
    );
  },
};

export const HelperAndErrorMessages: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: "1.5rem", maxWidth: "32rem" }}>
      <TextInput
        {...args}
        label="Email address"
        helperText="We will only use this address for account notifications."
        placeholder="name@example.com"
        type="email"
        fullWidth
      />
      <TextInput
        {...args}
        label="Email address with an error"
        helperText="Enter the address associated with your account."
        errorMessage="Enter a valid email address."
        defaultValue="not-an-email"
        type="email"
        fullWidth
      />
      <TextInput
        {...args}
        label="Username"
        labelPosition="left"
        helperText="Letters, numbers, and underscores are supported."
        placeholder="username"
        fullWidth
      />
    </div>
  ),
};

export const RoundingVariants = (
  args: React.ComponentProps<typeof TextInput>,
) =>
  withVariants(TextInput, { ...args }, [
    { propName: "rounding", values: roundingOptions },
  ]);

export const ShadowVariants = (args: React.ComponentProps<typeof TextInput>) =>
  withVariants(TextInput, { ...args }, [
    { propName: "shadow", values: shadowOptions },
  ]);

export const ThemeVariants: Story = {
  render: (args) => renderThemeVariants({ component: TextInput, args }),
};

export const StateVariants: Story = {
  render: (args) => renderStateVariants({ component: TextInput, args }),
};

export const OutlineVariants: Story = {
  render: (args) => renderOutlineVariants({ component: TextInput, args }),
};

export const GlassVariants: Story = {
  render: (args) => renderGlassVariants({ component: TextInput, args }),
};

export const GlassOutlineVariants: Story = {
  render: (args) => renderGlassOutlineVariants({ component: TextInput, args }),
};

export const StateOutlineVariants: Story = {
  render: (args) => renderStateOutlineVariants({ component: TextInput, args }),
};
