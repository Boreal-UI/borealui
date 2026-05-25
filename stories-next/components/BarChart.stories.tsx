import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BarChart } from "../../src/index.core";
import type { BarChartProps } from "../../src/components/BarChart/BarChart.types";
const data = [
  { label: "Jan", value: 12 },
  { label: "Feb", value: 18 },
  { label: "Mar", value: 9 },
  { label: "Apr", value: 22 },
];
const meta: Meta<BarChartProps> = {
  title: "Components/BarChart",
  component: BarChart,
  tags: ["autodocs"],
  args: { label: "Monthly revenue", data },
};
export default meta;
type Story = StoryObj<BarChartProps>;
export const Default: Story = {};
export const WithUnits: Story = { args: { units: "k USD" } };
export const WithoutGrid: Story = { args: { showGrid: false } };
export const Compact: Story = {
  args: { width: 240, height: 140, showLabels: false },
};
