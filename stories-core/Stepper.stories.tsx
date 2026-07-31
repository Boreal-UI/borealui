import { useState } from "react";
import { Meta, StoryObj } from "@storybook/react-vite";
import { FaCheckCircle, FaClipboardList, FaFileAlt } from "react-icons/fa";
import { Stepper } from "../src/index.core";
import type { StepperProps } from "../src/components/Stepper/Stepper.types";
import { withVariants } from "../.storybook-core/helpers/withVariants";
import {
  roundingOptions,
  shadowOptions,
  sizeOptions,
  stateOptions,
  themeOptions,
} from "../shared-story-assets/OptionTypes";

const steps = [
  { label: "Start", icon: FaClipboardList },
  { label: "Review", icon: FaFileAlt },
  { label: "Submit", icon: FaCheckCircle },
];

const meta: Meta<StepperProps> = {
  title: "Components/Stepper",
  component: Stepper,
  tags: ["autodocs"],
  args: {
    orientation: "horizontal",
    theme: "primary",
    size: "medium",
    steps,
  },
};

export default meta;

type Story = StoryObj<StepperProps>;

export const Default: Story = {
  render: (args) => {
    const [activeStep, setActiveStep] = useState(0);
    return (
      <Stepper {...args} activeStep={activeStep} onStepClick={setActiveStep} />
    );
  },
};

export const Vertical: Story = {
  render: (args) => {
    const [activeStep, setActiveStep] = useState(1);
    return (
      <Stepper
        {...args}
        orientation="vertical"
        activeStep={activeStep}
        onStepClick={setActiveStep}
      />
    );
  },
};

export const ThemedVariants: Story = {
  render: (args) => {
    return (
      <div style={{ display: "grid", gap: "1rem" }}>
        {themeOptions.map((theme) => {
          const [activeStep, setActiveStep] = useState(1);
          return (
            <Stepper
              key={theme}
              {...args}
              theme={theme}
              activeStep={activeStep}
              onStepClick={setActiveStep}
            />
          );
        })}
      </div>
    );
  },
};

export const StateVariants: Story = {
  render: (args) => {
    return (
      <div style={{ display: "grid", gap: "1rem" }}>
        {stateOptions.map((state) => {
          const [activeStep, setActiveStep] = useState(1);
          return (
            <Stepper
              key={state}
              {...args}
              state={state}
              activeStep={activeStep}
              onStepClick={setActiveStep}
            />
          );
        })}
      </div>
    );
  },
};

export const GlassThemeVariants: Story = {
  render: (args) => {
    return (
      <div style={{ display: "grid", gap: "1rem" }}>
        {themeOptions.map((theme) => {
          const [activeStep, setActiveStep] = useState(1);
          return (
            <Stepper
              key={theme}
              {...args}
              theme={theme}
              variant="glass"
              activeStep={activeStep}
              onStepClick={setActiveStep}
            />
          );
        })}
      </div>
    );
  },
};

export const GlassStateVariants: Story = {
  render: (args) => {
    return (
      <div style={{ display: "grid", gap: "1rem" }}>
        {stateOptions.map((state) => {
          const [activeStep, setActiveStep] = useState(1);
          return (
            <Stepper
              key={state}
              {...args}
              state={state}
              variant="glass"
              activeStep={activeStep}
              onStepClick={setActiveStep}
            />
          );
        })}
      </div>
    );
  },
};

export const SizeVariants: Story = {
  render: (args) => {
    return (
      <div style={{ display: "grid", gap: "1rem" }}>
        {sizeOptions.map((size) => {
          const [activeStep, setActiveStep] = useState(1);
          return (
            <Stepper
              key={size}
              {...args}
              size={size}
              activeStep={activeStep}
              onStepClick={setActiveStep}
            />
          );
        })}
      </div>
    );
  },
};

export const NoBackwardsNavigation: Story = {
  args: {
    activeStep: 0,
  },

  render: (args) => {
    const [activeStep, setActiveStep] = useState(1);
    return (
      <Stepper
        {...args}
        disableBackNavigation
        activeStep={activeStep}
        onStepClick={(step) => {
          if (step > activeStep) setActiveStep(step);
        }}
      />
    );
  },
};

export const RoundingVariants = (args: React.ComponentProps<typeof Stepper>) =>
  withVariants(Stepper, { ...args }, [
    { propName: "rounding", values: roundingOptions },
  ]);

export const ShadowVariants = (args: React.ComponentProps<typeof Stepper>) =>
  withVariants(Stepper, { ...args }, [
    { propName: "shadow", values: shadowOptions },
  ]);
