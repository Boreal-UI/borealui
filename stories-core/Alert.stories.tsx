import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaTimesCircle,
} from "react-icons/fa";

import { Alert, Button } from "../src/index.core";
import type { AlertProps } from "../src/components/Alert/Alert.types";
import {
  renderThemeVariants,
  renderStateVariants,
  renderOutlineVariants,
  renderGlassVariants,
  renderGlassOutlineVariants,
  renderStateOutlineVariants,
} from "../shared-story-assets/VisualVariantStories";

const meta: Meta<AlertProps> = {
  title: "Components/Alert",
  component: Alert,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Alert displays contextual feedback messages with support for status roles, icons, actions, dismiss buttons, variants, glass styling, rounding, shadows, and custom slot class names.",
      },
    },
  },
  argTypes: {
    title: {
      control: "text",
      description: "Optional title displayed above the alert message.",
    },
    children: {
      control: "text",
      description: "Main alert message content.",
    },
    state: {
      control: "select",
      options: ["", "success", "error", "warning", "info"],
      description:
        "Semantic alert state. Error alerts default to role='alert'; other states default to role='status'.",
    },
    theme: {
      control: "select",
      options: ["primary", "secondary", "tertiary", "quaternary", "clear"],
      description: "Theme color applied to the alert.",
    },
    variant: {
      control: "select",
      options: ["soft", "solid", "outline", "subtle"],
      description: "Visual alert style.",
    },
    glass: {
      control: "boolean",
      description:
        "Applies the glass styling layer when supported by the theme.",
    },
    rounding: {
      control: "select",
      options: ["none", "small", "medium", "large", "full"],
      description: "Controls the alert border radius.",
    },
    shadow: {
      control: "select",
      options: ["none", "light", "medium", "strong", "intense"],
      description: "Controls the alert shadow depth.",
    },
    dismissible: {
      control: "boolean",
      description: "Shows a dismiss button.",
    },
    dismissLabel: {
      control: "text",
      description: "Accessible label for the dismiss button.",
    },
    role: {
      control: "text",
      description: "ARIA role for the alert container.",
    },
    icon: {
      control: false,
      description:
        "Optional decorative icon displayed before the alert content.",
    },
    actions: {
      control: false,
      description: "Optional action area rendered after the message content.",
    },
    onDismiss: {
      action: "dismissed",
      description: "Called when the dismiss button is clicked.",
    },
    className: {
      control: "text",
      description: "Custom class applied to the alert root.",
    },
    iconClassName: {
      control: "text",
      description: "Custom class applied to the icon wrapper.",
    },
    contentClassName: {
      control: "text",
      description: "Custom class applied to the content wrapper.",
    },
    titleClassName: {
      control: "text",
      description: "Custom class applied to the title.",
    },
    messageClassName: {
      control: "text",
      description: "Custom class applied to the message.",
    },
    actionsClassName: {
      control: "text",
      description: "Custom class applied to the actions wrapper.",
    },
    dismissButtonClassName: {
      control: "text",
      description: "Custom class applied to the dismiss button.",
    },
    testId: {
      control: "text",
      description: "Test id applied to the alert root.",
    },
  },
  args: {
    title: "Deployment ready",
    children: "Your production build completed successfully.",
    dismissible: false,
    dismissLabel: "Dismiss alert",
  },
};

export default meta;

type Story = StoryObj<AlertProps>;

export const Default: Story = {};

export const Dismissible: Story = {
  args: {
    title: "Notification saved",
    children: "This alert can be dismissed.",
    state: "info",
    dismissible: true,
    dismissLabel: "Close notification",
    icon: <FaInfoCircle />,
  },
};

export const InteractiveDismissible: Story = {
  render: (args) => {
    const [visible, setVisible] = useState(true);

    if (!visible) {
      return (
        <Button size="small" onClick={() => setVisible(true)}>
          Show alert
        </Button>
      );
    }

    return (
      <Alert
        {...args}
        dismissible
        onDismiss={() => {
          args.onDismiss?.();
          setVisible(false);
        }}
      />
    );
  },
  args: {
    title: "Profile updated",
    children: "Your account settings were saved.",
    state: "success",
    icon: <FaCheckCircle />,
    dismissLabel: "Dismiss profile update message",
  },
};

export const WithActions: Story = {
  args: {
    title: "Deployment ready",
    children: "Your production build completed successfully.",
    state: "success",
    icon: <FaCheckCircle />,
    actions: (
      <>
        <Button size="small">View build</Button>
        <Button size="small" outline>
          Open dashboard
        </Button>
      </>
    ),
  },
};

export const WithoutTitle: Story = {
  args: {
    title: undefined,
    children: "This alert only includes message content.",
    state: "info",
    icon: <FaInfoCircle />,
  },
};

export const WithoutIcon: Story = {
  args: {
    title: "No icon",
    children: "This alert uses text-only content.",
    state: "success",
    icon: undefined,
  },
};

export const CustomShapeAndShadow: Story = {
  args: {
    title: "Rounded alert",
    children: "This alert uses lg rounding and an intense shadow.",
    state: "success",
    rounding: "lg",
    shadow: "intense",
    icon: <FaCheckCircle />,
  },
};

export const VariantExamples: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: "1rem" }}>
      <Alert {...args} variant="soft" title="Soft variant">
        A soft alert for lower emphasis feedback.
      </Alert>
      <Alert {...args} variant="solid" title="Solid variant">
        A solid alert for stronger emphasis feedback.
      </Alert>
    </div>
  ),
  args: {
    state: "info",
    icon: <FaInfoCircle />,
  },
};

export const AccessibilityRoles: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "1rem" }}>
      <Alert title="Status message" state="success" icon={<FaCheckCircle />}>
        Success, info, and warning alerts default to role status.
      </Alert>

      <Alert title="Error message" state="error" icon={<FaTimesCircle />}>
        Error alerts default to role alert.
      </Alert>

      <Alert
        title="Custom role"
        state="info"
        role="note"
        icon={<FaInfoCircle />}
      >
        The role can be overridden when a different semantic meaning is needed.
      </Alert>
    </div>
  ),
};

export const CustomSlotClasses: Story = {
  args: {
    title: "Custom class slots",
    children: "Each major slot can receive a custom class name.",
    state: "info",
    icon: <FaInfoCircle />,
    actions: <Button size="small">Action</Button>,
    dismissible: true,
    className: "custom-alert-root",
    iconClassName: "custom-alert-icon",
    contentClassName: "custom-alert-content",
    titleClassName: "custom-alert-title",
    messageClassName: "custom-alert-message",
    actionsClassName: "custom-alert-actions",
    dismissButtonClassName: "custom-alert-dismiss",
  },
};

export const ThemeVariants: Story = {
  render: (args) => renderThemeVariants({ component: Alert, args }),
};

export const StateVariants: Story = {
  render: (args) => renderStateVariants({ component: Alert, args }),
};

export const OutlineVariants: Story = {
  render: (args) => renderOutlineVariants({ component: Alert, args }),
};

export const GlassVariants: Story = {
  render: (args) => renderGlassVariants({ component: Alert, args }),
};

export const GlassOutlineVariants: Story = {
  render: (args) => renderGlassOutlineVariants({ component: Alert, args }),
};

export const StateOutlineVariants: Story = {
  render: (args) => renderStateOutlineVariants({ component: Alert, args }),
};
