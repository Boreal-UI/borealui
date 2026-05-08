import type { Meta, StoryObj } from "@storybook/react-vite";
import { FaPlus } from "react-icons/fa";
import { Button } from "../src/index.core";
import { ButtonProps } from "../src/components/Button/Button.types";
import { StoryGrid } from "../.storybook-core/helpers/StoryGrid";
import {
  RoundingType,
  ShadowType,
  SizeType,
  StateType,
  ThemeType,
} from "../src/types/types";

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

const meta: Meta<ButtonProps> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    children: "Click Me",
    size: "medium" as SizeType,
    theme: "primary" as ThemeType,
    state: "" as StateType,
    rounding: "medium" as RoundingType,
    shadow: "medium" as ShadowType,
  },
  argTypes: {
    iconPosition: {
      control: "select",
      options: ["left", "right"],
      description:
        "Controls whether the button icon renders before or after the label.",
    },
  },
};

const defaultArgs: ButtonProps = {
  children: "Click Me",
  size: "medium" as SizeType,
  theme: "primary" as ThemeType,
  state: "" as StateType,
  rounding: "medium" as RoundingType,
  shadow: "medium" as ShadowType,
};

export default meta;
type Story = StoryObj<ButtonProps>;

export const Default: Story = {};

export const WithIcon: Story = {
  args: {
    icon: FaPlus,
    children: "Add Item",
  },
};

export const IconPositions = () => (
  <StoryGrid title="Icon Positions">
    <Button icon={FaPlus} iconPosition="left">
      Icon Left
    </Button>

    <Button icon={FaPlus} iconPosition="right">
      Icon Right
    </Button>
  </StoryGrid>
);

export const Loading: Story = {
  args: {
    loading: true,
    children: "Loading...",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: "Disabled",
  },
};

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    children: "Full Width Button",
  },
};

export const OutlineVariants = () => (
  <StoryGrid title="Outline Buttons">
    {themeOptions.map((theme) => (
      <Button key={theme} theme={theme} outline>
        {theme} Outline
      </Button>
    ))}
    {stateOptions.map((state) => (
      <Button key={state} state={state} outline>
        {state} Outline
      </Button>
    ))}
  </StoryGrid>
);

export const ThemeVariants = () => (
  <StoryGrid title="Theme Variants">
    {themeOptions.map((theme) => (
      <Button key={theme} theme={theme}>
        {theme}
      </Button>
    ))}
  </StoryGrid>
);

export const StateVariants = () => (
  <StoryGrid title="State Variants">
    {stateOptions.map((state) => (
      <Button key={state} state={state}>
        {state}
      </Button>
    ))}
  </StoryGrid>
);

export const GlassVariants = () => (
  <StoryGrid title="Glass Buttons">
    {themeOptions.map((theme) => (
      <Button key={theme} theme={theme} glass>
        {theme} Glass
      </Button>
    ))}

    {stateOptions.map((state) => (
      <Button key={state} state={state} glass>
        {state} Glass
      </Button>
    ))}
  </StoryGrid>
);

export const OutlineGlassVariants = () => (
  <StoryGrid title="Glass Outline Buttons">
    {themeOptions.map((theme) => (
      <Button key={theme} theme={theme} outline glass>
        {theme} Glass Outline
      </Button>
    ))}

    {stateOptions.map((state) => (
      <Button key={state} state={state} outline glass>
        {state} Glass Outline
      </Button>
    ))}
  </StoryGrid>
);

export const SizeVariants = () => (
  <StoryGrid title="Size Variants">
    {sizeOptions.map((size) => (
      <Button key={size} size={size}>
        Button {size}
      </Button>
    ))}
  </StoryGrid>
);

export const RoundingVariants = () => (
  <StoryGrid title="Rounding Variants">
    {roundingOptions.map((rounding) => (
      <Button key={rounding} rounding={rounding}>
        Rounding {rounding}
      </Button>
    ))}
  </StoryGrid>
);

export const ShadowVariants = () => (
  <StoryGrid title="Shadow Variants">
    {shadowOptions.map((shadow) => (
      <Button key={shadow} shadow={shadow}>
        Shadow {shadow}
      </Button>
    ))}
  </StoryGrid>
);

export const WithClassName: Story = {
  args: {
    ...defaultArgs,
    children: "Custom Class",
    className: "storybook-button-custom",
  },
};

export const WithHref: Story = {
  args: {
    ...defaultArgs,
    href: "https://example.com",
    children: "Link Button",
  },
};

export const WithLongText: Story = {
  args: {
    ...defaultArgs,
    href: "https://example.com",
    children: "This is a very long link button text to test overflow handling",
  },
};

export const WithExternalLink: Story = {
  args: {
    ...defaultArgs,
    href: "https://example.com",
    _target: "_blank",
    isExternal: true,
    children: "External Link",
  },
};

export const SubmitType: Story = {
  args: {
    ...defaultArgs,
    type: "submit",
    children: "Submit",
  },
};

export const WithAriaLabel: Story = {
  args: {
    ...defaultArgs,
    "aria-label": "Custom Aria Label",
    children: "Accessible Button",
  },
};
