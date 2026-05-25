import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Sparkline } from "../../src/index.core";
import type { SparklineProps } from "../../src/components/Sparkline/Sparkline.types";

const data = [4, 8, 6, 12, 10, 16];
const meta: Meta<SparklineProps> = {
  title: "Components/Sparkline",
  component: Sparkline,
  tags: ["autodocs"],
  args: { label: "Revenue", data, showValue: true, showArea: true },
};
export default meta;
type Story = StoryObj<SparklineProps>;
export const Default: Story = {};
export const WithUnits: Story = { args: { units: "k USD" } };
export const CustomColor: Story = {
  args: {
    color: "#0ea5e9",
    data: [
      { label: "Jan", value: 2 },
      { label: "Feb", value: 7 },
      { label: "Mar", value: 5 },
    ],
  },
};
