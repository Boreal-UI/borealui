import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TrendBadge } from "../../src/index.core";
import type { TrendBadgeProps } from "../../src/components/TrendBadge/TrendBadge.types";
const meta: Meta<TrendBadgeProps> = {
  title: "Components/TrendBadge",
  component: TrendBadge,
  tags: ["autodocs"],
  args: { label: "Revenue", value: 124, previousValue: 100, suffix: "%" },
};
export default meta;
type Story = StoryObj<TrendBadgeProps>;
export const Default: Story = {};
export const Down: Story = { args: { value: 82, previousValue: 100 } };
export const Flat: Story = { args: { value: 100, previousValue: 100 } };
