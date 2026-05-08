import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  IconButton,
  RoundingType,
  ShadowType,
  SizeType,
  StateType,
  ThemeType,
} from "../../src/index.next";
import { FaPlus, FaExternalLinkAlt } from "react-icons/fa";
import { withVariants } from "../../.storybook-core/helpers/withVariants";

const themeOptions: ThemeType[] = [
  "primary",
  "secondary",
  "tertiary",
  "quaternary",
  "clear",
];

const stateOptions: StateType[] = ["success", "warning", "error"];

const sizeOptions: SizeType[] = ["xs", "small", "medium", "large", "xl"];

const roundingOptions: RoundingType[] = ["none", "small", "medium", "large"];
const shadowOptions: ShadowType[] = [
  "none",
  "light",
  "medium",
  "strong",
  "intense",
];

const meta: Meta<typeof IconButton> = {
  title: "Components/IconButton",
  component: IconButton,
  tags: ["autodocs"],
  args: {
    icon: FaPlus,
    theme: "primary",
    size: "medium",
    rounding: "large",
    "aria-label": "Add",
  },
};

export default meta;

type Story = StoryObj<typeof IconButton>;

export const Default: Story = {};

export const ThemeVariants = () =>
  withVariants(
    IconButton,
    {
      icon: FaPlus,
      size: "medium",
      "aria-label": "Theme",
      theme: "primary",
    },
    [{ propName: "theme", values: themeOptions }],
  );

export const StateVariants = () =>
  withVariants(
    IconButton,
    {
      icon: FaPlus,
      size: "medium",
      "aria-label": "State",
      state: "",
    },
    [{ propName: "state", values: stateOptions }],
  );

export const OutlineAndDisabledVariants: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
      {themeOptions.map((theme) => (
        <IconButton
          key={theme}
          {...args}
          theme={theme}
          outline
          aria-label={`Theme: ${theme}`}
        />
      ))}
      {stateOptions.map((state) => (
        <IconButton
          key={state}
          {...args}
          state={state}
          outline
          aria-label={`State: ${state}`}
        />
      ))}
      <IconButton {...args} disabled aria-label="Disabled" />
    </div>
  ),
};

export const GlassThemeVariants = () =>
  withVariants(
    IconButton,
    {
      icon: FaPlus,
      size: "medium",
      "aria-label": "Glass Theme",
      theme: "primary",
      glass: true,
    },
    [{ propName: "theme", values: themeOptions }],
  );

export const GlassStateVariants = () =>
  withVariants(
    IconButton,
    {
      icon: FaPlus,
      size: "medium",
      "aria-label": "Glass State",
      state: "" as StateType,
      glass: true,
    },
    [{ propName: "state", values: stateOptions }],
  );

export const GlassOutlineVariants: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
      {themeOptions.map((theme) => (
        <IconButton
          key={`glass-theme-${theme}`}
          {...args}
          theme={theme}
          outline
          glass
          aria-label={`Glass Theme: ${theme}`}
        />
      ))}
      {stateOptions.map((state) => (
        <IconButton
          key={`glass-state-${state}`}
          {...args}
          state={state}
          outline
          glass
          aria-label={`Glass State: ${state}`}
        />
      ))}
    </div>
  ),
};

export const SizeVariants = () =>
  withVariants(
    IconButton,
    {
      icon: FaPlus,
      theme: "primary",
      "aria-label": "Size",
      size: "medium",
    },
    [{ propName: "size", values: sizeOptions }],
  );

export const LoadingState: Story = {
  args: {
    loading: true,
  },
};

export const LinkVariants: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem" }}>
      <IconButton
        {...args}
        href="https://example.com"
        icon={FaExternalLinkAlt}
        isExternal
        aria-label="External Link"
      />
      <IconButton
        {...args}
        href="/internal-route"
        icon={FaPlus}
        aria-label="Internal Link"
      />
    </div>
  ),
};

export const RoundingVariants = () =>
  withVariants(
    IconButton,
    {
      icon: FaPlus,
      theme: "primary",
      "aria-label": "Size",
      rounding: "large",
      size: "medium",
    },
    [{ propName: "rounding", values: roundingOptions }],
  );

export const ShadowVariants = () =>
  withVariants(
    IconButton,
    {
      icon: FaPlus,
      theme: "primary",
      "aria-label": "Size",
      shadow: "none",
      size: "medium",
    },
    [{ propName: "shadow", values: shadowOptions }],
  );
