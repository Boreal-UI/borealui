import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Legend } from "../../src/index.core";
import type { LegendProps } from "../../src/components/Legend/Legend.types";
const items = [
  { label: "Desktop", color: "#2563eb", value: "60%" },
  { label: "Mobile", color: "#16a34a", value: "32%" },
  { label: "Tablet", color: "#f59e0b", value: "8%" },
];
const meta: Meta<LegendProps> = {
  title: "Components/Legend",
  component: Legend,
  tags: ["autodocs"],
  args: { label: "Segments", items },
};
export default meta;
type Story = StoryObj<LegendProps>;
export const Default: Story = {};
export const Vertical: Story = { args: { orientation: "vertical" } };
