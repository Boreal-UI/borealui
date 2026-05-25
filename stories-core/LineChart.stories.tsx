import type { Meta, StoryObj } from "@storybook/react-vite";
import { LineChart } from "../src/index.core";
import type { LineChartProps } from "../src/components/LineChart/LineChart.types";
const data = [
  { label: "Mon", value: 4 },
  { label: "Tue", value: 9 },
  { label: "Wed", value: 7 },
  { label: "Thu", value: 14 },
  { label: "Fri", value: 11 },
];
const meta: Meta<LineChartProps> = {
  title: "Components/LineChart",
  component: LineChart,
  tags: ["autodocs"],
  args: { label: "Traffic", data },
};
export default meta;
type Story = StoryObj<LineChartProps>;
export const Default: Story = {};
export const WithUnits: Story = { args: { units: "visits" } };
export const WithoutPoints: Story = { args: { showPoints: false } };
export const CustomColor: Story = { args: { color: "#22c55e" } };
