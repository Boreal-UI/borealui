import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ThemeSelect } from "../../src/index.next";
import type { SelectProps } from "../../src/components/Select/Select.types";

const meta: Meta<SelectProps> = {
  title: "Components/ThemeSelect",
  component: ThemeSelect,
  tags: ["autodocs"],
  args: {
    placeholder: "App Theme",
  },
};

export default meta;

type Story = StoryObj<SelectProps>;

export const Default: Story = {
  render: (args) => {
    return <ThemeSelect {...args} />;
  },
};
