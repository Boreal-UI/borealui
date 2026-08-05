import { Meta, StoryObj } from "@storybook/react-vite";
import { PopOver, Button } from "../src/index.core";
import type { PopOverProps } from "../src/components/PopOver/PopOver.types";
import {
  roundingOptions,
  shadowOptions,
  stateOptions,
} from "../shared-story-assets/OptionTypes";

const meta: Meta<PopOverProps> = {
  title: "Components/PopOver",
  component: PopOver,
  tags: ["autodocs"],
  args: {
    placement: "bottom",
    theme: "primary",
  },
};

export default meta;

type Story = StoryObj<PopOverProps>;

export const Default: Story = {
  args: {
    trigger: <Button size="small">Toggle PopOver</Button>,
    content: (
      <div style={{ padding: "1rem", maxWidth: "200px" }}>
        This is some helpful info shown in a popover.
      </div>
    ),
  },
};

export const ThemedVariants: Story = {
  render: () => {
    const themes = [
      "primary",
      "secondary",
      "tertiary",
      "quaternary",
      "clear",
    ] as const;

    return (
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {themes.map((theme) => (
          <PopOver
            key={theme}
            theme={theme}
            trigger={<Button theme={theme}>{theme}</Button>}
            content={
              <div style={{ padding: "0.5rem" }}>
                {theme.charAt(0).toUpperCase() + theme.slice(1)} theme
              </div>
            }
          />
        ))}
      </div>
    );
  },
};

export const StateVariants: Story = {
  render: () => {
    return (
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {stateOptions.map((state) => (
          <PopOver
            key={state}
            state={state}
            trigger={<Button state={state}>{state}</Button>}
            content={
              <div style={{ padding: "0.5rem" }}>
                {state.charAt(0).toUpperCase() + state.slice(1)} state
              </div>
            }
          />
        ))}
      </div>
    );
  },
};

export const GlassThemeVariants: Story = {
  render: () => {
    const themes = [
      "primary",
      "secondary",
      "tertiary",
      "quaternary",
      "clear",
    ] as const;

    return (
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {themes.map((theme) => (
          <PopOver
            key={theme}
            theme={theme}
            variant="glass"
            trigger={
              <Button theme={theme} variant="glass">
                {theme}
              </Button>
            }
            content={
              <div style={{ padding: "0.5rem" }}>Glass {theme} theme</div>
            }
          />
        ))}
      </div>
    );
  },
};

export const GlassStateVariants: Story = {
  render: () => {
    return (
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {stateOptions.map((state) => (
          <PopOver
            key={state}
            state={state}
            variant="glass"
            trigger={
              <Button state={state} variant="glass">
                {state}
              </Button>
            }
            content={
              <div style={{ padding: "0.5rem" }}>Glass {state} state</div>
            }
          />
        ))}
      </div>
    );
  },
};

export const PlacementVariants: Story = {
  render: () => {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateAreas: `
            ".   top    ."
            "left center right"
            ".  bottom  ."
          `,
          gridTemplateColumns: "1fr auto 1fr",
          gridTemplateRows: "auto auto auto",
          gap: "2rem",
          alignItems: "center",
          justifyItems: "center",
          minHeight: "300px",
          marginTop: "5rem",
        }}
      >
        <div style={{ gridArea: "top" }}>
          <PopOver
            placement="top"
            trigger={<Button>Top</Button>}
            content={<div style={{ padding: "0.5rem" }}>Top popover</div>}
          />
        </div>
        <div style={{ gridArea: "right" }}>
          <PopOver
            placement="right"
            trigger={<Button>Right</Button>}
            content={<div style={{ padding: "0.5rem" }}>Right popover</div>}
          />
        </div>
        <div style={{ gridArea: "bottom" }}>
          <PopOver
            placement="bottom"
            trigger={<Button>Bottom</Button>}
            content={<div style={{ padding: "0.5rem" }}>Bottom popover</div>}
          />
        </div>
        <div style={{ gridArea: "left" }}>
          <PopOver
            placement="left"
            trigger={<Button>Left</Button>}
            content={<div style={{ padding: "0.5rem" }}>Left popover</div>}
          />
        </div>
        <div style={{ gridArea: "center" }}>
          <span style={{ opacity: 0.5 }}>Pop over uses dynamic placements</span>
          <br />
          <span style={{ opacity: 0.5 }}>
            and will readjust to avoid overflow
          </span>
        </div>
      </div>
    );
  },
};

export const KeyboardAccessible: Story = {
  args: {
    trigger: (
      <div
        tabIndex={0}
        style={{
          padding: "0.5rem 1rem",
          border: "1px solid gray",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Press Enter to toggle
      </div>
    ),
    content: (
      <div style={{ padding: "0.5rem" }}>
        This opens on Enter and closes on Escape.
      </div>
    ),
  },
};

export const RoundingVariants: Story = {
  render: () => {
    return (
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {roundingOptions.map((rounding) => (
          <PopOver
            key={rounding}
            rounding={rounding}
            trigger={<Button>{rounding}</Button>}
            content={
              <div style={{ padding: "0.5rem" }}>
                {rounding.charAt(0).toUpperCase() + rounding.slice(1)} rounding
              </div>
            }
          />
        ))}
      </div>
    );
  },
};

export const ShadowVariants: Story = {
  render: () => {
    return (
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {shadowOptions.map((shadow) => (
          <PopOver
            key={shadow}
            shadow={shadow}
            trigger={<Button>{shadow}</Button>}
            content={
              <div style={{ padding: "0.5rem" }}>
                {shadow.charAt(0).toUpperCase() + shadow.slice(1)} shadow
              </div>
            }
          />
        ))}
      </div>
    );
  },
};
