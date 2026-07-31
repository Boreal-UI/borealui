import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ComboBox } from "../src/index.core";
import {
  stateOptions,
  themeOptions,
  shadowOptions,
  roundingOptions,
} from "../shared-story-assets/OptionTypes";
import {
  ComboBoxOption,
  ComboBoxProps,
} from "../src/components/ComboBox/ComboBox.types";
import {
  renderThemeVariants,
  renderStateVariants,
  renderSizeVariants,
  renderOutlineVariants,
  renderGlassVariants,
  renderGlassOutlineVariants,
  renderStateOutlineVariants,
} from "../shared-story-assets/VisualVariantStories";

const options = [
  { value: "react", label: "React", helperText: "UI library" },
  { value: "next", label: "Next.js", helperText: "App framework" },
  { value: "vite", label: "Vite", helperText: "Build tool" },
  { value: "astro", label: "Astro", helperText: "Content-focused framework" },
  {
    value: "svelte",
    label: "Svelte",
    helperText: "Compiler-based UI framework",
  },
];

const optionsWithDisabled = [
  ...options,
  {
    value: "angular",
    label: "Angular",
    helperText: "Enterprise framework",
    disabled: true,
  },
];

const meta: Meta<ComboBoxProps> = {
  title: "Components/ComboBox",
  component: ComboBox,
  tags: ["autodocs"],
  args: {
    label: "Framework",
    options,
    placeholder: "Search frameworks",
    helperText: "Start typing to filter the available options.",
  },
  argTypes: {
    theme: {
      control: "select",
      options: themeOptions,
    },
    state: {
      control: "select",
      options: stateOptions,
    },
    rounding: {
      control: "select",
      options: roundingOptions,
    },
    shadow: {
      control: "select",
      options: shadowOptions,
    },
    labelPosition: {
      control: "select",
      options: ["top", "bottom", "left", "right", "hidden"],
    },
    value: {
      control: "text",
    },
    inputValue: {
      control: "text",
    },
    loading: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
    required: {
      control: "boolean",
    },
    onChange: {
      action: "changed",
    },
    onInputChange: {
      action: "input changed",
    },
    variant: {
      control: "select",
      options: ["solid", "outline", "glass", "glassOutline"],
    },
  },
};

export default meta;
type Story = StoryObj<ComboBoxProps>;

export const Sizes: Story = {
  render: () =>
    renderSizeVariants({
      component: ComboBox,
      args: { options, label: "Framework" },
      labelProp: "label",
    }),
};

export const Default: Story = {};

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState("react");
    const [inputValue, setInputValue] = useState("React");

    return (
      <ComboBox
        {...args}
        value={value}
        inputValue={inputValue}
        onInputChange={setInputValue}
        onChange={(nextValue, option) => {
          setValue(nextValue as string);
          setInputValue(option.label as string);
          args.onChange?.(nextValue as string, option as ComboBoxOption);
        }}
      />
    );
  },
};

export const WithSelectedValue: Story = {
  args: {
    value: "next",
  },
};

export const WithDisabledOption: Story = {
  args: {
    options: optionsWithDisabled,
    helperText: "Angular is disabled in this example.",
  },
};

export const Required: Story = {
  args: {
    required: true,
    helperText: "This field is required.",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: "react",
    helperText: "This ComboBox is disabled.",
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    loadingMessage: "Loading frameworks...",
  },
};

export const Empty: Story = {
  args: {
    options: [],
    emptyMessage: "No frameworks found.",
  },
};

export const LabelPositions: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: "1rem", maxWidth: "36rem" }}>
      {(["top", "bottom", "left", "right"] as const).map((labelPosition) => (
        <ComboBox
          key={labelPosition}
          {...args}
          label={`${labelPosition} label`}
          labelPosition={labelPosition}
          aria-label={labelPosition}
        />
      ))}
    </div>
  ),
};

export const Rounding: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: "1rem", maxWidth: "32rem" }}>
      {roundingOptions.map((rounding) => (
        <ComboBox
          key={rounding}
          {...args}
          label={`${rounding} rounding`}
          rounding={rounding}
        />
      ))}
    </div>
  ),
};

export const Shadows: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: "1rem", maxWidth: "32rem" }}>
      {shadowOptions.map((shadow) => (
        <ComboBox
          key={shadow}
          {...args}
          label={`${shadow} shadow`}
          shadow={shadow}
        />
      ))}
    </div>
  ),
};

export const CustomMessages: Story = {
  args: {
    helperText: "Pick the framework your project is built with.",
    emptyMessage: "No matching framework was found.",
    loadingMessage: "Checking available frameworks...",
  },
};

export const CustomClassNames: Story = {
  args: {
    className: "storybook-combobox",
    layoutClassName: "storybook-combobox-layout",
    labelClassName: "storybook-combobox-label",
    inputClassName: "storybook-combobox-input",
    listboxClassName: "storybook-combobox-listbox",
    optionClassName: "storybook-combobox-option",
    helperTextClassName: "storybook-combobox-helper",
    errorClassName: "storybook-combobox-errorMessage",
    helperText: "Custom class names are applied for styling hooks.",
  },
};

export const ThemeVariants: Story = {
  render: (args) => renderThemeVariants({ component: ComboBox, args }),
};

export const StateVariants: Story = {
  render: (args) => renderStateVariants({ component: ComboBox, args }),
};

export const OutlineVariants: Story = {
  render: (args) => renderOutlineVariants({ component: ComboBox, args }),
};

export const GlassVariants: Story = {
  render: (args) => renderGlassVariants({ component: ComboBox, args }),
};

export const GlassOutlineVariants: Story = {
  render: (args) => renderGlassOutlineVariants({ component: ComboBox, args }),
};

export const StateOutlineVariants: Story = {
  render: (args) => renderStateOutlineVariants({ component: ComboBox, args }),
};
