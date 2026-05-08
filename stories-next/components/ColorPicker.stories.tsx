import { useState } from "react";
import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ColorPicker } from "../../src/index.next";
import type { ColorPickerProps } from "../../src/components/ColorPicker/ColorPicker.types";
import { StoryGrid } from "../../.storybook-core/helpers/StoryGrid";
import { ShadowType, SizeType } from "../../src/types/types";
import { ShapeType } from "../../src/components/ColorPicker/ColorPicker.types";

const sizeOptions: SizeType[] = ["xs", "small", "medium", "large", "xl"];
const shapeOptions: ShapeType[] = ["square", "round", "pill"];
const shadowOptions: ShadowType[] = [
  "none",
  "light",
  "medium",
  "strong",
  "intense",
];

const meta: Meta<ColorPickerProps> = {
  title: "Components/ColorPicker",
  component: ColorPicker,
  tags: ["autodocs"],
  args: {
    label: "Pick a theme color",
    name: "theme",
    colors: [
      { label: "Red", value: "#e63946" },
      { label: "Green", value: "#2a9d8f" },
      { label: "Blue", value: "#457b9d" },
      { label: "Yellow", value: "#f4a261" },
    ],
  },
};

export default meta;

type Story = StoryObj<ColorPickerProps>;

const defaultArgs: ColorPickerProps = {
  label: "Pick a theme color",
  name: "theme",
  shape: "round",
  colors: [
    { label: "Red", value: "#e63946" },
    { label: "Green", value: "#2a9d8f" },
    { label: "Blue", value: "#457b9d" },
    { label: "Yellow", value: "#f4a261" },
  ],
  size: "medium",
  selected: "#e63946",
  shadow: "none",
  onChange: () => {},
};

export const Default: Story = {
  render: (args) => {
    const [selected, setSelected] = useState("#2a9d8f");
    return <ColorPicker {...args} selected={selected} onChange={setSelected} />;
  },
};

export const WithCustomColorInput: Story = {
  render: (args) => {
    const [selected, setSelected] = useState("#e63946");
    return (
      <ColorPicker
        {...args}
        allowCustom
        selected={selected}
        onChange={setSelected}
      />
    );
  },
};

export const SizeVariants = () => (
  <StoryGrid title="Size Variants">
    {sizeOptions.map((size) => (
      <ColorPicker key={size} {...defaultArgs} size={size} />
    ))}
  </StoryGrid>
);

export const ShapeVariants = () => (
  <StoryGrid title="Shape Variants">
    {shapeOptions.map((shape) => (
      <ColorPicker key={shape} {...defaultArgs} shape={shape} />
    ))}
  </StoryGrid>
);

export const ShadowVariants = () => (
  <StoryGrid title="Shadow Variants">
    {shadowOptions.map((shadow) => (
      <ColorPicker
        key={shadow}
        {...defaultArgs}
        shadow={shadow as ShadowType}
      />
    ))}
  </StoryGrid>
);

export const Disabled: Story = {
  render: (args) => {
    const [selected, setSelected] = useState("#2a9d8f");
    return (
      <ColorPicker
        {...args}
        disabled
        selected={selected}
        onChange={setSelected}
      />
    );
  },
};

export const WithClassName: Story = {
  render: (args) => {
    const [selected, setSelected] = useState("#457b9d");
    return (
      <ColorPicker
        {...args}
        selected={selected}
        onChange={setSelected}
        className="storybook-colorpicker-custom"
      />
    );
  },
};

export const WithDataTestid: Story = {
  render: (args) => {
    const [selected, setSelected] = useState("#f4a261");
    return (
      <ColorPicker
        {...args}
        selected={selected}
        onChange={setSelected}
        data-testid="colorpicker-storybook"
      />
    );
  },
};
