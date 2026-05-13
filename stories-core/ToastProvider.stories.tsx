/* eslint-disable @typescript-eslint/no-unsafe-return */
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, ToastProvider, useToast } from "../src/index.core";
import type { ToastProviderProps } from "../src/components/ToastProvider/ToastProvider.types";
import {
  stateOptions,
  roundingOptions,
  shadowOptions,
} from "../shared-story-assets/OptionTypes";

const placementOptions: ToastProviderProps["placement"][] = [
  "topRight",
  "topLeft",
  "bottomRight",
  "bottomLeft",
];

const meta: Meta<ToastProviderProps> = {
  title: "Components/ToastProvider",
  component: ToastProvider,
  tags: ["autodocs"],
  args: {
    placement: "topRight",
    defaultDuration: 5000,
    rounding: "medium",
    shadow: "medium",
  },
  argTypes: {
    placement: {
      control: "select",
      options: placementOptions,
    },
    defaultDuration: {
      control: {
        type: "number",
        min: 0,
        step: 500,
      },
    },
    rounding: {
      control: "select",
      options: roundingOptions,
    },
    shadow: {
      control: "select",
      options: shadowOptions,
    },
    className: {
      control: "text",
    },
    toastClassName: {
      control: "text",
    },
    testId: {
      control: "text",
    },
    children: {
      control: false,
    },
  },
};

export default meta;

type Story = StoryObj<ToastProviderProps>;

function DemoShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.75rem",
        alignItems: "center",
      }}
    >
      {children}
    </div>
  );
}

function SingleToastDemo() {
  const { addToast } = useToast();

  return (
    <Button
      onClick={() =>
        addToast({
          title: "Saved",
          message: "Settings were updated.",
          state: "success",
          duration: 0,
        })
      }
    >
      Show toast
    </Button>
  );
}

function ToastTypesDemo() {
  const { addToast } = useToast();

  return (
    <DemoShell>
      {stateOptions.map((state) => (
        <Button
          key={state}
          theme={state === "error" ? "primary" : "secondary"}
          onClick={() =>
            addToast({
              title: `${state.charAt(0).toUpperCase()}${state.slice(1)} toast`,
              message: `This is a ${state} notification.`,
              state: state,
              duration: 0,
            })
          }
        >
          Show {state}
        </Button>
      ))}
    </DemoShell>
  );
}

function AutoDismissDemo() {
  const { addToast } = useToast();

  return (
    <Button
      onClick={() =>
        addToast({
          title: "Auto dismiss",
          message: "This toast will close after 3 seconds.",
          state: "info",
          duration: 3000,
        })
      }
    >
      Show temporary toast
    </Button>
  );
}

function MultipleToastsDemo() {
  const { addToast, clearToasts } = useToast();

  return (
    <DemoShell>
      <Button
        onClick={() =>
          addToast({
            title: "Upload complete",
            message: "Your file was uploaded successfully.",
            state: "success",
            duration: 0,
          })
        }
      >
        Add success
      </Button>

      <Button
        onClick={() =>
          addToast({
            title: "Connection issue",
            message: "The request could not be completed.",
            state: "error",
            duration: 0,
          })
        }
      >
        Add error
      </Button>

      <Button
        onClick={() =>
          addToast({
            title: "Unsaved changes",
            message: "Remember to save before leaving this page.",
            state: "warning",
            duration: 0,
          })
        }
      >
        Add warning
      </Button>

      <Button theme="clear" onClick={clearToasts}>
        Clear all
      </Button>
    </DemoShell>
  );
}

export const Default: Story = {
  render: (args) => (
    <ToastProvider {...args}>
      <SingleToastDemo />
    </ToastProvider>
  ),
};

export const ToastTypes: Story = {
  args: {
    defaultDuration: 0,
  },
  render: (args) => (
    <ToastProvider {...args}>
      <ToastTypesDemo />
    </ToastProvider>
  ),
};

export const AutoDismiss: Story = {
  args: {
    defaultDuration: 3000,
  },
  render: (args) => (
    <ToastProvider {...args}>
      <AutoDismissDemo />
    </ToastProvider>
  ),
};

export const BottomLeftPlacement: Story = {
  args: {
    placement: "bottomLeft",
    defaultDuration: 0,
  },
  render: (args) => (
    <ToastProvider {...args}>
      <SingleToastDemo />
    </ToastProvider>
  ),
};

export const BottomRightPlacement: Story = {
  args: {
    placement: "bottomRight",
    defaultDuration: 0,
  },
  render: (args) => (
    <ToastProvider {...args}>
      <SingleToastDemo />
    </ToastProvider>
  ),
};

export const BottomCenterPlacement: Story = {
  args: {
    placement: "bottomCenter",
    defaultDuration: 0,
  },
  render: (args) => (
    <ToastProvider {...args}>
      <SingleToastDemo />
    </ToastProvider>
  ),
};

export const TopCenterPlacement: Story = {
  args: {
    placement: "topCenter",
    defaultDuration: 0,
  },
  render: (args) => (
    <ToastProvider {...args}>
      <SingleToastDemo />
    </ToastProvider>
  ),
};

export const TopLeftPlacement: Story = {
  args: {
    placement: "topLeft",
    defaultDuration: 0,
  },
  render: (args) => (
    <ToastProvider {...args}>
      <SingleToastDemo />
    </ToastProvider>
  ),
};

export const TopRightPlacement: Story = {
  args: {
    placement: "topRight",
    defaultDuration: 0,
  },
  render: (args) => (
    <ToastProvider {...args}>
      <SingleToastDemo />
    </ToastProvider>
  ),
};

export const MultipleToasts: Story = {
  args: {
    placement: "topRight",
    defaultDuration: 0,
  },
  render: (args) => (
    <ToastProvider {...args}>
      <MultipleToastsDemo />
    </ToastProvider>
  ),
};

export const CustomStyling: Story = {
  args: {
    placement: "bottomRight",
    rounding: "large",
    shadow: "strong",
    defaultDuration: 0,
    className: "storybook-toast-viewport",
    toastClassName: "storybook-toast-item",
  },
  render: (args) => (
    <ToastProvider {...args}>
      <SingleToastDemo />
    </ToastProvider>
  ),
};
