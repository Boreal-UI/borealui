import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Badge } from "../../src/index.next";
import { FaCheck, FaExclamation, FaInfoCircle } from "react-icons/fa";
import { withVariants } from "../../.storybook-core/helpers/withVariants";
import type {
  RoundingType,
  ShadowType,
  SizeType,
  StateType,
  ThemeType,
} from "../../src/types/types";
import {
  renderThemeVariants,
  renderStateVariants,
  renderOutlineVariants,
  renderGlassVariants,
  renderGlassOutlineVariants,
  renderStateOutlineVariants,
} from "../../shared-story-assets/VisualVariantStories";
import {
  roundingOptions,
  shadowOptions,
  sizeOptions,
} from "../../shared-story-assets/OptionTypes";

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Badge>;

const defaultArgs = {
  children: "Badge",
  theme: "primary" as ThemeType,
  state: "" as StateType,
  size: "medium" as SizeType,
  shadow: "none" as ShadowType,
  rounding: "small" as RoundingType,
};

export const Default: Story = {
  args: {
    ...defaultArgs,
  },
};

export const WithIcon: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
      <Badge icon={FaCheck} state="success">
        Check
      </Badge>
      <Badge icon={FaExclamation} state="warning">
        Warning
      </Badge>
      <Badge icon={FaInfoCircle} theme="primary">
        Info
      </Badge>
    </div>
  ),
};

export const WithOnClick: Story = {
  args: {
    ...defaultArgs,
    children: "Clickable Badge",
    onClick: () => alert("Badge clicked!"),
    state: "success" as StateType,
  },
};

export const Disabled: Story = {
  args: {
    ...defaultArgs,
    children: "Disabled Badge",
    onClick: () => alert("Badge clicked!"),
    disabled: true,
  },
};

export const SizeVariants = () =>
  withVariants(Badge, { ...defaultArgs }, [
    { propName: "size", values: sizeOptions },
  ]);

export const RoundingVariants = () =>
  withVariants(Badge, { ...defaultArgs }, [
    { propName: "rounding", values: roundingOptions },
  ]);

export const ShadowVariants = () =>
  withVariants(Badge, { ...defaultArgs }, [
    { propName: "shadow", values: shadowOptions },
  ]);

export const WithChildren: Story = {
  render: () => (
    <Badge aria-label="With children star badge">
      <span>With Children</span>
      <span aria-hidden="true"> ⭐</span>
    </Badge>
  ),
};

export const IconOnly: Story = {
  args: {
    icon: FaInfoCircle,
    "aria-label": "Information badge",
  },
  render: (args) => <Badge {...args} />,
};

export const ThemeVariants: Story = {
  render: (args) =>
    renderThemeVariants({
      component: Badge,
      args: { ...args, ...defaultArgs },
    }),
};

export const StateVariants: Story = {
  render: (args) =>
    renderStateVariants({
      component: Badge,
      args: { ...args, ...defaultArgs },
    }),
};

export const OutlineVariants: Story = {
  render: (args) =>
    renderOutlineVariants({
      component: Badge,
      args: { ...args, ...defaultArgs },
    }),
};

export const GlassVariants: Story = {
  render: (args) =>
    renderGlassVariants({
      component: Badge,
      args: { ...args, ...defaultArgs },
    }),
};

export const GlassOutlineVariants: Story = {
  render: (args) =>
    renderGlassOutlineVariants({
      component: Badge,
      args: { ...args, ...defaultArgs },
    }),
};

export const StateOutlineVariants: Story = {
  render: (args) =>
    renderStateOutlineVariants({
      component: Badge,
      args: { ...args, ...defaultArgs },
    }),
};
