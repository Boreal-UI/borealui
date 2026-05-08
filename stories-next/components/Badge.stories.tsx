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

const themeOptions = [
  "primary",
  "secondary",
  "tertiary",
  "quaternary",
  "clear",
];

const stateOptions = ["success", "error", "warning"];
const sizeOptions = ["xs", "small", "medium", "large", "xl"];
const shadowOptions = ["none", "light", "medium", "strong", "intense"];
const roundingOptions = ["none", "small", "medium", "large", "full"];

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
    disabled: true,
  },
};

export const ThemeVariants = () =>
  withVariants(Badge, { ...defaultArgs }, [
    { propName: "theme", values: themeOptions },
  ]);

export const GlassThemeVariants = () =>
  withVariants(Badge, { ...defaultArgs, glass: true }, [
    { propName: "theme", values: themeOptions },
  ]);

export const StateVariants = () =>
  withVariants(Badge, { ...defaultArgs }, [
    { propName: "state", values: stateOptions },
  ]);

export const GlassStateVariants = () =>
  withVariants(Badge, { ...defaultArgs, glass: true }, [
    { propName: "state", values: stateOptions },
  ]);

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

export const OutlineVariants = () =>
  withVariants(
    Badge,
    {
      ...defaultArgs,
      outline: true,
    },
    [{ propName: "theme", values: themeOptions }],
  );

export const GlassOutlineVariants = () =>
  withVariants(
    Badge,
    {
      ...defaultArgs,
      outline: true,
      glass: true,
    },
    [{ propName: "theme", values: themeOptions }],
  );

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
