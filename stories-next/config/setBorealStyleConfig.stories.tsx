import React, { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  ShadowType,
  RoundingType,
  SizeType,
  ThemeType,
} from "../../src/types/types";
import { Button, Card, Typography, setBorealStyleConfig } from "boreal-ui";

type DemoProps = {
  theme?: ThemeType;
  size?: SizeType;
  rounding?: RoundingType;
  shadow?: ShadowType;
};

function SetBorealStyleConfigDemo({
  theme = "primary",
  size = "medium",
  rounding = "medium",
  shadow = "medium",
}: DemoProps) {
  const [config, setConfig] = useState({
    theme,
    size,
    rounding,
    shadow,
  });

  useEffect(() => {
    setBorealStyleConfig({
      defaultTheme: theme,
      defaultSize: size,
      defaultRounding: rounding,
      defaultShadow: shadow,
    });

    setConfig({
      theme,
      size,
      rounding,
      shadow,
    });
  }, [theme, size, rounding, shadow]);

  return (
    <div
      style={{
        padding: "2rem",
        display: "grid",
        gap: "1.5rem",
        maxWidth: "700px",
      }}
    >
      <div>
        <Typography variant="h3">setBorealStyleConfig Demo</Typography>
        <Typography variant="body">
          This story updates the Boreal UI global style defaults so you can
          preview how shared defaults affect components.
        </Typography>
      </div>

      <Card
        title="Current Global Config"
        description="These values were applied through setBorealStyleConfig."
      >
        <div style={{ display: "grid", gap: "0.5rem" }}>
          <Typography variant="body">
            <strong>Theme:</strong> {config.theme}
          </Typography>
          <Typography variant="body">
            <strong>Size:</strong> {config.size}
          </Typography>
          <Typography variant="body">
            <strong>Rounding:</strong> {config.rounding}
          </Typography>
          <Typography variant="body">
            <strong>Shadow:</strong> {config.shadow}
          </Typography>
        </div>
      </Card>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <Button>Default Button</Button>
        <Button theme="secondary">Secondary Button</Button>
        <Button outline>Outline Button</Button>
      </div>

      <Card
        title="Preview Card"
        description="Use the controls in Storybook to test different default styling combinations."
      >
        <Typography variant="body">
          This card helps confirm that your global Boreal style config is being
          applied.
        </Typography>
      </Card>
    </div>
  );
}

const meta: Meta<typeof SetBorealStyleConfigDemo> = {
  title: "Utilities/setBorealStyleConfig",
  component: SetBorealStyleConfigDemo,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Demonstrates how setBorealStyleConfig updates Boreal UI global default styling such as theme, size, rounding, and shadow.",
      },
    },
  },
  argTypes: {
    theme: {
      control: "select",
      options: ["primary", "secondary", "success", "warning", "error", "info"],
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
    },
    rounding: {
      control: "select",
      options: ["none", "small", "medium", "large", "full"],
    },
    shadow: {
      control: "select",
      options: ["none", "light", "medium", "strong", "intense"],
    },
  },
  args: {
    theme: "primary",
    size: "medium",
    rounding: "medium",
    shadow: "medium",
  },
};

export default meta;

type Story = StoryObj<typeof SetBorealStyleConfigDemo>;

export const Default: Story = {};

export const SecondaryRounded: Story = {
  args: {
    theme: "secondary",
    rounding: "large",
    shadow: "strong",
  },
};

export const Minimal: Story = {
  args: {
    theme: "primary",
    size: "small",
    rounding: "small",
    shadow: "none",
  },
};
