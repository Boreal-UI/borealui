import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FaPlus } from "react-icons/fa";
import { Button } from "../../src/index.next";
import { ButtonProps } from "../../src/components/Button/Button.types";
import { StoryGrid } from "../../.storybook-core/helpers/StoryGrid";
import {
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
    },
    variant: {
      control: "select",
      options: ["solid", "outline", "glass", "glassOutline"],
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

export const Disabled = () => (
  <StoryGrid title="Disabled Buttons">
    <Button icon={FaPlus} disabled>
      Icon Left
    </Button>

    <Button icon={FaPlus} disabled variant="outline">
      Icon Right
    </Button>

    <Button icon={FaPlus} disabled variant="glass">
      Icon Right
    </Button>
  </StoryGrid>
);

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    children: "Full Width Button",
  },
};

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
    target: "_blank",
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

export const ThemeVariants: Story = {
  render: (args) => renderThemeVariants({ component: Button, args }),
};

export const StateVariants: Story = {
  render: (args) => renderStateVariants({ component: Button, args }),
};

export const OutlineVariants: Story = {
  render: (args) => renderOutlineVariants({ component: Button, args }),
};

export const GlassVariants: Story = {
  render: (args) => renderGlassVariants({ component: Button, args }),
};

export const GlassOutlineVariants: Story = {
  render: (args) => renderGlassOutlineVariants({ component: Button, args }),
};

export const StateOutlineVariants: Story = {
  render: (args) => renderStateOutlineVariants({ component: Button, args }),
};
