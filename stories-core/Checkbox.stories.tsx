import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckBox } from "../src/index.core";
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
  stateOptions,
  themeOptions,
} from "./assets/OptionTypes";

const meta: Meta<typeof CheckBox> = {
  title: "Components/CheckBox",
  component: CheckBox,
  tags: ["autodocs"],
  args: {
    label: "Accept Terms",
    theme: "primary",
    labelPosition: "right",
    disabled: false,
  },
};

export default meta;

const defaultArgs = {
  label: "Label",
  checked: true,
  onChange: () => {},
  size: "medium" as SizeType,
  theme: "primary" as ThemeType,
  state: "" as StateType,
  rounding: "medium" as RoundingType,
  shadow: "none" as ShadowType,
};

type Story = StoryObj<typeof CheckBox>;

export const Default: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return <CheckBox {...args} checked={checked} onChange={setChecked} />;
  },
};

export const Indeterminate: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false);
    const [indeterminate, setIndeterminate] = useState(true);

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <CheckBox
          {...args}
          label="Partially selected"
          checked={checked}
          indeterminate={indeterminate}
          onChange={(val) => {
            setChecked(val);
            setIndeterminate(false);
          }}
        />
        <button onClick={() => setIndeterminate(!indeterminate)}>
          Toggle Indeterminate
        </button>
      </div>
    );
  },
};

export const LabelLeft: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return (
      <CheckBox
        {...args}
        labelPosition="left"
        checked={checked}
        onChange={setChecked}
      />
    );
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    checked: true,
  },
};

export const ThemeVariants = () =>
  withVariants(
    CheckBox,
    {
      label: "Themed",
      checked: true,
      onChange: () => {},
      theme: "primary",
    },
    [
      {
        propName: "theme",
        values: themeOptions,
      },
    ],
  );

export const GlassThemeVariants = () =>
  withVariants(
    CheckBox,
    {
      label: "Themed",
      checked: true,
      onChange: () => {},
      theme: "primary",
      glass: true,
    },
    [
      {
        propName: "theme",
        values: themeOptions,
      },
    ],
  );

export const StateVariants = () =>
  withVariants(
    CheckBox,
    {
      label: "With State",
      checked: true,
      onChange: () => {},
      theme: "primary",
      state: "success",
    },
    [
      {
        propName: "state",
        values: stateOptions,
      },
    ],
  );

export const GlassStateVariants = () =>
  withVariants(
    CheckBox,
    {
      label: "With State",
      checked: true,
      onChange: () => {},
      theme: "primary",
      state: "success",
      glass: true,
    },
    [
      {
        propName: "state",
        values: stateOptions,
      },
    ],
  );

export const SizeVariants = () =>
  withVariants(CheckBox, { ...defaultArgs }, [
    { propName: "size", values: sizeOptions },
  ]);

export const RoundingVariants = () =>
  withVariants(CheckBox, { ...defaultArgs }, [
    { propName: "rounding", values: roundingOptions },
  ]);

export const ShadowVariants = () =>
  withVariants(CheckBox, { ...defaultArgs }, [
    { propName: "shadow", values: shadowOptions },
  ]);

export const WithClassName: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return (
      <CheckBox
        {...args}
        className="storybook-checkbox-custom"
        checked={checked}
        onChange={setChecked}
      />
    );
  },
};

export const WithIdAndTestId: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return (
      <CheckBox
        {...args}
        id="custom-checkbox-id"
        data-testid="storybook-checkbox"
        checked={checked}
        onChange={setChecked}
      />
    );
  },
};
