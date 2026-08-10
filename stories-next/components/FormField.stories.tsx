import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FormField } from "../../src/index.next";
import { FormFieldProps } from "../../src/components/FormField/FormField.types";
import { stateOptions } from "../../shared-story-assets/OptionTypes";

const labelPositionOptions = ["top", "bottom", "left", "right"] as const;

const meta: Meta<FormFieldProps> = {
  title: "Components/FormField",
  component: FormField,
  tags: ["autodocs"],
  argTypes: {
    id: {
      control: "text",
      helperText: "Optional ID passed to the child control and label.",
    },
    label: {
      control: "text",
      helperText:
        "Label content rendered above, below, left, or right of the control.",
    },
    helperText: {
      control: "text",
      helperText:
        "Supporting helper text connected to the control with aria-describedby.",
    },
    errorMessage: {
      control: "text",
      helperText:
        "Error message connected to the control and rendered with role='alert'.",
    },
    required: {
      control: "boolean",
      helperText:
        "Marks the child control as required and hides optional text.",
    },
    optionalText: {
      control: "text",
      helperText: "Text shown beside the label when the field is not required.",
    },
    labelPosition: {
      control: "select",
      options: labelPositionOptions,
      helperText:
        "Controls where the label is positioned relative to the control.",
    },
    state: {
      control: "select",
      options: ["", ...stateOptions],
      helperText: "Visual state class applied to the form field wrapper.",
    },
    className: {
      control: "text",
    },
    labelClassName: {
      control: "text",
    },
    controlClassName: {
      control: "text",
    },
    helperTextClassName: {
      control: "text",
    },
    errorClassName: {
      control: "text",
    },
    testId: {
      control: "text",
    },
    children: {
      control: false,
      helperText: "A single form control element cloned by FormFieldBase.",
    },
  },
  args: {
    id: "email-field",
    label: "Email",
    helperText: "Use your work email.",
    optionalText: "Optional",
    labelPosition: "top",
    state: "",
    required: false,
    children: (
      <input title="email" type="email" placeholder="name@example.com" />
    ),
  },
};

export default meta;
type Story = StoryObj<FormFieldProps>;

export const Default: Story = {};

export const Required: Story = {
  args: {
    required: true,
    helperText: "This field is required.",
    children: (
      <input title="email" type="email" placeholder="name@example.com" />
    ),
  },
};

export const Error: Story = {
  args: {
    required: true,
    errorMessage: "Email is required.",
    helperText: "Use your work email.",
    children: (
      <input title="email" type="email" placeholder="name@example.com" />
    ),
  },
};

export const Success: Story = {
  args: {
    state: "success",
    helperText: "This email looks good.",
    children: (
      <input
        title="email"
        type="email"
        defaultValue="davin@example.com"
        placeholder="name@example.com"
      />
    ),
  },
};

export const Warning: Story = {
  args: {
    state: "warning",
    helperText: "Double-check that this is the correct contact email.",
    children: (
      <input
        title="email"
        type="email"
        defaultValue="personal@example.com"
        placeholder="name@example.com"
      />
    ),
  },
};

export const Info: Story = {
  args: {
    state: "info",
    helperText: "This is some informational text.",
    children: (
      <input
        title="email"
        type="email"
        defaultValue="personal@example.com"
        placeholder="name@example.com"
      />
    ),
  },
};

export const WithCustomId: Story = {
  args: {
    id: "custom-email-id",
    label: "Contact email",
    helperText: "The label should be connected to the input by this custom ID.",
    children: <input title="contact email" type="email" />,
  },
};

export const WithoutHelperText: Story = {
  args: {
    helperText: undefined,
    children: (
      <input title="email" type="email" placeholder="name@example.com" />
    ),
  },
};

export const WithoutOptionalText: Story = {
  args: {
    optionalText: "",
    children: (
      <input title="email" type="email" placeholder="name@example.com" />
    ),
  },
};

export const LabelLeft: Story = {
  args: {
    labelPosition: "left",
    children: (
      <input title="email" type="email" placeholder="name@example.com" />
    ),
  },
};

export const LabelRight: Story = {
  args: {
    labelPosition: "right",
    children: (
      <input title="email" type="email" placeholder="name@example.com" />
    ),
  },
};

export const LabelBottom: Story = {
  args: {
    labelPosition: "bottom",
    children: (
      <input title="email" type="email" placeholder="name@example.com" />
    ),
  },
};

export const TextArea: Story = {
  args: {
    id: "message-field",
    label: "Message",
    helperText: "Write a short message.",
    children: (
      <textarea title="message" rows={5} placeholder="Type your message..." />
    ),
  },
};

export const Select: Story = {
  args: {
    id: "role-field",
    label: "Role",
    helperText: "Choose the user role.",
    children: (
      <select title="role" defaultValue="">
        <option value="" disabled>
          Select a role
        </option>
        <option value="admin">Admin</option>
        <option value="editor">Editor</option>
        <option value="viewer">Viewer</option>
      </select>
    ),
  },
};

export const WithExistingChildDescription: Story = {
  args: {
    id: "username-field",
    label: "Username",
    helperText: "This helper text is appended to the existing helperText.",
    children: (
      <>
        {/* Storybook note: FormField expects a single child control, so keep the helperText outside in real usage. */}
        <input
          title="username"
          aria-describedby="external-username-helperText"
          placeholder="davin"
        />
      </>
    ) as unknown as FormFieldProps["children"],
  },
  render: (args) => (
    <div>
      <p id="external-username-helperText">Existing external helperText.</p>
      <FormField {...args} />
    </div>
  ),
};

export const Playground: Story = {
  args: {
    id: "playground-field",
    label: "Playground field",
    helperText: "Use the controls panel to test different props.",
    errorMessage: "",
    required: false,
    optionalText: "Optional",
    labelPosition: "top",
    state: "",
    children: (
      <input title="playground field" placeholder="Try editing props" />
    ),
  },
};
