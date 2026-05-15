import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { InputGroup } from "../../src/index.next";
import type { InputGroupProps } from "../../src/components/InputGroup/InputGroup.types";
import { StoryGrid } from "../../.storybook-core/helpers/StoryGrid";
import {
  roundingOptions,
  shadowOptions,
  stateOptions,
  themeOptions,
} from "../../shared-story-assets/OptionTypes";
import {
  renderThemeVariants,
  renderStateVariants,
  renderOutlineVariants,
  renderGlassVariants,
  renderGlassOutlineVariants,
  renderStateOutlineVariants,
} from "../../shared-story-assets/VisualVariantStories";

const ExampleInput = () => (
  <input name="amount" type="number" placeholder="0.00" />
);

const meta: Meta<InputGroupProps> = {
  title: "Components/InputGroup",
  component: InputGroup,
  tags: ["autodocs"],
  args: {
    id: "invoice-amount",
    label: "Invoice amount",
    description: "Enter the amount before taxes.",
    helperText: "Amounts are stored in USD.",
    prefix: "$",
    suffix: "USD",
    children: <ExampleInput />,
    theme: "primary",
  },
};

export default meta;

type Story = StoryObj<InputGroupProps>;

export const Default: Story = {};

export const WithAddons: Story = {
  args: {
    startAddon: "https://",
    endAddon: ".com",
    prefix: undefined,
    suffix: undefined,
    label: "Workspace domain",
    helperText: "Use lowercase letters and numbers.",
    children: <input name="domain" placeholder="acme" />,
  },
};

export const Validation: Story = {
  args: {
    required: true,
    state: "error",
    error: "Invoice amount is required.",
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    loadingMessage: "Checking amount",
  },
};

export const LabelPositions = () => (
  <StoryGrid title="Label Positions">
    {(["top", "bottom", "left", "right"] as const).map((labelPosition) => (
      <InputGroup
        key={labelPosition}
        label={labelPosition}
        labelPosition={labelPosition}
        prefix="$"
        suffix="USD"
      >
        <ExampleInput />
      </InputGroup>
    ))}
  </StoryGrid>
);

export const ThemeVariants = () => (
  <StoryGrid title="Theme Variants">
    {themeOptions.map((theme) => (
      <InputGroup key={theme} label={theme} theme={theme} prefix="$">
        <ExampleInput />
      </InputGroup>
    ))}
  </StoryGrid>
);

export const GlassThemeVariants = () => (
  <StoryGrid title="Glass Theme Variants">
    {themeOptions.map((theme) => (
      <InputGroup key={theme} label={theme} theme={theme} glass prefix="$">
        <ExampleInput />
      </InputGroup>
    ))}
  </StoryGrid>
);

export const StateVariants = () => (
  <StoryGrid title="State Variants">
    {stateOptions.map((state) => (
      <InputGroup key={state} label={state || "default"} state={state}>
        <ExampleInput />
      </InputGroup>
    ))}
  </StoryGrid>
);

export const OutlineVariants = () => (
  <StoryGrid title="Outline Variants">
    {themeOptions.map((theme) => (
      <InputGroup key={theme} label={`${theme} outline`} theme={theme} outline>
        <ExampleInput />
      </InputGroup>
    ))}
  </StoryGrid>
);

export const RoundingVariants = () => (
  <StoryGrid title="Rounding Variants">
    {roundingOptions.map((rounding) => (
      <InputGroup key={rounding} label={rounding} rounding={rounding}>
        <ExampleInput />
      </InputGroup>
    ))}
  </StoryGrid>
);

export const ShadowVariants = () => (
  <StoryGrid title="Shadow Variants">
    {shadowOptions.map((shadow) => (
      <InputGroup key={shadow} label={shadow} shadow={shadow}>
        <ExampleInput />
      </InputGroup>
    ))}
  </StoryGrid>
);

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const ThemeMatrix: Story = {
  render: (args) => renderThemeVariants({ component: InputGroup, args }),
};

export const StateMatrix: Story = {
  render: (args) => renderStateVariants({ component: InputGroup, args }),
};

export const OutlineMatrix: Story = {
  render: (args) => renderOutlineVariants({ component: InputGroup, args }),
};

export const GlassMatrix: Story = {
  render: (args) => renderGlassVariants({ component: InputGroup, args }),
};

export const GlassOutlineMatrix: Story = {
  render: (args) => renderGlassOutlineVariants({ component: InputGroup, args }),
};

export const StateOutlineMatrix: Story = {
  render: (args) => renderStateOutlineVariants({ component: InputGroup, args }),
};
