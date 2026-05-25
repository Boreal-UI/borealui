import type { Meta, StoryObj } from "@storybook/react-vite";
import { Breadcrumbs } from "../src/index.core";
import { FaArrowRight } from "react-icons/fa";
import { withVariants } from "../.storybook-core/helpers/withVariants";
import {
  RoundingType,
  ShadowType,
  SizeType,
  StateType,
  ThemeType,
} from "../src/types/types";
import {
  roundingOptions,
  shadowOptions,
  sizeOptions,
} from "../shared-story-assets/OptionTypes";
import {
  renderThemeVariants,
  renderStateVariants,
  renderOutlineVariants,
  renderGlassVariants,
  renderGlassOutlineVariants,
  renderStateOutlineVariants,
} from "../shared-story-assets/VisualVariantStories";

const meta: Meta<typeof Breadcrumbs> = {
  title: "Components/Breadcrumbs",
  component: Breadcrumbs,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Breadcrumbs>;

const baseItems = [
  { label: "Home", href: "/" },
  { label: "Library", href: "/library" },
  { label: "Data", href: "/library/data" },
];

const defaultArgs = {
  items: baseItems,
  size: "medium" as SizeType,
  theme: "primary" as ThemeType,
  state: "" as StateType,
  rounding: "medium" as RoundingType,
  shadow: "medium" as ShadowType,
};

export const Default: Story = {
  args: {
    ...defaultArgs,
  },
};

export const RoundingVariants = () =>
  withVariants(Breadcrumbs, { ...defaultArgs }, [
    { propName: "rounding", values: roundingOptions },
  ]);

export const ShadowVariants = () =>
  withVariants(Breadcrumbs, { ...defaultArgs }, [
    { propName: "shadow", values: shadowOptions },
  ]);

export const SizeVariants = () =>
  withVariants(Breadcrumbs, { ...defaultArgs }, [
    { propName: "size", values: sizeOptions },
  ]);

export const Truncated: Story = {
  args: {
    items: [
      { label: "Home", href: "/" },
      { label: "Category", href: "/category" },
      { label: "Subcategory", href: "/category/sub" },
      { label: "Details", href: "/category/sub/details" },
      { label: "Final Page" },
    ],
    maxVisible: 3,
  },
};

export const Disabled: Story = {
  args: {
    items: baseItems,
    disabled: true,
  },
};

export const CustomSeparator: Story = {
  args: {
    items: baseItems,
    separator: <FaArrowRight />,
  },
};

export const WithClassName: Story = {
  args: {
    ...defaultArgs,
    className: "storybook-breadcrumbs-custom",
  },
};

export const ThemeVariants: Story = {
  render: (args) =>
    renderThemeVariants({
      component: Breadcrumbs,
      args: { ...args, ...defaultArgs },
    }),
};

export const StateVariants: Story = {
  render: (args) =>
    renderStateVariants({
      component: Breadcrumbs,
      args: { ...args, ...defaultArgs },
    }),
};

export const OutlineVariants: Story = {
  render: (args) =>
    renderOutlineVariants({
      component: Breadcrumbs,
      args: { ...args, ...defaultArgs },
    }),
};

export const GlassVariants: Story = {
  render: (args) =>
    renderGlassVariants({
      component: Breadcrumbs,
      args: { ...args, ...defaultArgs },
    }),
};

export const GlassOutlineVariants: Story = {
  render: (args) =>
    renderGlassOutlineVariants({
      component: Breadcrumbs,
      args: { ...args, ...defaultArgs },
    }),
};

export const StateOutlineVariants: Story = {
  render: (args) =>
    renderStateOutlineVariants({
      component: Breadcrumbs,
      args: { ...args, ...defaultArgs },
    }),
};
