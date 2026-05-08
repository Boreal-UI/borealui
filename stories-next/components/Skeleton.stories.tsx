import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Skeleton } from "../../src/index.next";
import type { SkeletonProps } from "../../src/components/Skeleton/Skeleton.types";
import { withVariants } from "../../.storybook-core/helpers/withVariants";

const roundingOptions = ["none", "small", "medium", "large"];
const shadowOptions = ["none", "light", "medium", "strong", "intense"];

const meta: Meta<SkeletonProps> = {
  title: "Components/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  args: {
    width: "100%",
    height: "20px",
  },
};

export default meta;

type Story = StoryObj<SkeletonProps>;

export const Default: Story = {
  args: {
    width: "100%",
    height: "20px",
  },
};

export const FixedSize: Story = {
  args: {
    width: "200px",
    height: "40px",
  },
};

export const InlineSkeletons: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem" }}>
      <Skeleton {...args} width="80px" height="20px" />
      <Skeleton {...args} width="120px" height="20px" />
      <Skeleton {...args} width="100px" height="20px" />
    </div>
  ),
};

export const BlockPlaceholder: Story = {
  args: {
    width: "100%",
    height: "150px",
    className: "rounded",
  },
};

export const MultipleLines: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: "0.5rem" }}>
      <Skeleton {...args} width="100%" height="20px" />
      <Skeleton {...args} width="95%" height="20px" />
      <Skeleton {...args} width="90%" height="20px" />
      <Skeleton {...args} width="85%" height="20px" />
    </div>
  ),
};

export const RoundingVariants = (args: React.ComponentProps<typeof Skeleton>) =>
  withVariants(Skeleton, { ...args }, [
    { propName: "rounding", values: roundingOptions },
  ]);

export const ShadowVariants = (args: React.ComponentProps<typeof Skeleton>) =>
  withVariants(Skeleton, { ...args }, [
    { propName: "shadow", values: shadowOptions },
  ]);
