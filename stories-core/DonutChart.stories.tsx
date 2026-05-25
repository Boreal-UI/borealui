import type { Meta, StoryObj } from "@storybook/react-vite";
import { DonutChart } from "../src/index.core";
import type { DonutChartProps } from "../src/components/DonutChart/DonutChart.types";
const data = [
  { label: "Desktop", value: 60 },
  { label: "Mobile", value: 32 },
  { label: "Tablet", value: 8 },
];
const meta: Meta<DonutChartProps> = {
  title: "Components/DonutChart",
  component: DonutChart,
  tags: ["autodocs"],
  args: { label: "Device split", data, centerLabel: "100%", showLegend: true },
};
export default meta;
type Story = StoryObj<DonutChartProps>;
export const Default: Story = {};
export const WithUnits: Story = { args: { units: "users" } };
export const ThickRing: Story = { args: { thickness: 40 } };
