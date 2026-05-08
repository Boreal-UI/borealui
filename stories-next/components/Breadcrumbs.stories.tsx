import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Breadcrumbs } from "../../src/index.next";
import { FaArrowRight } from "react-icons/fa";
import { withVariants } from "../../.storybook-core/helpers/withVariants";
import {
  RoundingType,
  ShadowType,
  SizeType,
  StateType,
  ThemeType,
} from "../../src/types/types";

const themeOptions: ThemeType[] = [
  "primary",
  "secondary",
  "tertiary",
  "quaternary",
  "clear",
];

const stateOptions: StateType[] = ["success", "error", "warning"];

const sizeOptions: SizeType[] = ["xs", "small", "medium", "large", "xl"];

const roundingOptions: RoundingType[] = ["none", "small", "medium", "large"];

const shadowOptions: ShadowType[] = [
  "none",
  "light",
  "medium",
  "strong",
  "intense",
];

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

export const ThemeVariants = () =>
  withVariants(Breadcrumbs, { ...defaultArgs }, [
    { propName: "theme", values: [...themeOptions] },
  ]);

export const GlassThemeVariants = () =>
  withVariants(Breadcrumbs, { ...defaultArgs, glass: true }, [
    { propName: "theme", values: [...themeOptions] },
  ]);

export const StateVariants = () =>
  withVariants(Breadcrumbs, { ...defaultArgs }, [
    { propName: "state", values: stateOptions },
  ]);

export const GlassStateVariants = () =>
  withVariants(Breadcrumbs, { ...defaultArgs, glass: true }, [
    { propName: "state", values: stateOptions },
  ]);

export const SizeVariants = () =>
  withVariants(Breadcrumbs, { ...defaultArgs }, [
    { propName: "size", values: sizeOptions },
  ]);

export const OutlineVariants = () =>
  withVariants(
    Breadcrumbs,
    {
      ...defaultArgs,
      outline: true,
    },
    [{ propName: "theme", values: [...themeOptions, ...stateOptions] }],
  );

export const GlassOutlineVariants = () =>
  withVariants(
    Breadcrumbs,
    {
      ...defaultArgs,
      outline: true,
      glass: true,
    },
    [{ propName: "theme", values: [...themeOptions, ...stateOptions] }],
  );

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
