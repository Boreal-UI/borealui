import { useState } from "react";
import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FormGroup, TextInput, Button } from "../../src/index.next";
import type { FormGroupProps } from "../../src/components/FormGroup/FormGroup.types";

const meta: Meta<FormGroupProps> = {
  title: "Components/FormGroup",
  component: FormGroup,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<FormGroupProps>;

export const LayoutVariants: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <div style={{ display: "grid", gap: "1.5rem" }}>
        <FormGroup label="Vertical" id="layout-vertical" layout="vertical">
          <TextInput value={value} onChange={(value) => setValue(value)} />
        </FormGroup>
        <FormGroup
          label="Horizontal"
          id="layout-horizontal"
          layout="horizontal"
        >
          <TextInput value={value} onChange={(value) => setValue(value)} />
        </FormGroup>
      </div>
    );
  },
};

export const SpacingVariants: Story = {
  render: () => {
    const [value, setValue] = useState("");
    const spacings = ["xs", "small", "medium", "large", "xl"] as const;

    return (
      <div style={{ display: "grid", gap: "2rem" }}>
        {spacings.map((spacing) => (
          <FormGroup
            key={spacing}
            label={`Spacing: ${spacing}`}
            id={`spacing-${spacing}`}
            spacing={spacing}
          >
            <TextInput
              placeholder="Text 1"
              value={value}
              onChange={(value) => setValue(value)}
            />
            <TextInput
              placeholder="Text 2"
              value={value}
              onChange={(value) => setValue(value)}
            />
          </FormGroup>
        ))}
      </div>
    );
  },
};

export const DescriptionVariants: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <div style={{ display: "grid", gap: "1.5rem" }}>
        <FormGroup label="No Description" id="desc-none">
          <TextInput value={value} onChange={(value) => setValue(value)} />
        </FormGroup>
        <FormGroup
          label="With Description"
          id="desc-present"
          description="Helpful context goes here."
        >
          <TextInput value={value} onChange={(value) => setValue(value)} />
        </FormGroup>
      </div>
    );
  },
};

export const ErrorVariants: Story = {
  render: () => {
    return (
      <div style={{ display: "grid", gap: "1.5rem" }}>
        <FormGroup label="No Error" id="error-none">
          <TextInput value="" onChange={() => {}} />
        </FormGroup>
        <FormGroup
          label="With Error"
          id="error-present"
          error="This field is required"
        >
          <TextInput value="" onChange={() => {}} />
        </FormGroup>
      </div>
    );
  },
};

export const HideLabelVariants: Story = {
  render: () => {
    return (
      <div style={{ display: "grid", gap: "1.5rem" }}>
        <FormGroup label="Visible Label" id="label-visible">
          <TextInput value="" onChange={() => {}} />
        </FormGroup>
        <FormGroup
          label="Hidden Label"
          id="label-hidden"
          hideLabel
          description="Label is hidden but still available to screen readers"
        >
          <TextInput value="" onChange={() => {}} />
        </FormGroup>
      </div>
    );
  },
};

export const ControllerVariants: Story = {
  render: () => {
    return (
      <div style={{ display: "grid", gap: "1.5rem" }}>
        <FormGroup label="No Controller" id="ctrl-none">
          <TextInput value="" onChange={() => {}} />
        </FormGroup>
        <FormGroup
          label="With Controller"
          id="ctrl-present"
          controller={<Button size="small">Search</Button>}
        >
          <TextInput value="" onChange={() => {}} />
        </FormGroup>
      </div>
    );
  },
};
