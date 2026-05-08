import { useState } from "react";
import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MessagePopup } from "../../src/index.next";
import type { MessagePopupProps } from "../../src/components/MessagePopup/MessagePopup.types";
import { RoundingType, ShadowType } from "../../src/types/types";

const roundingOptions = ["none", "small", "medium", "large"];
const shadowOptions = ["none", "light", "medium", "strong", "intense"];

const meta: Meta<MessagePopupProps> = {
  title: "Components/MessagePopup",
  component: MessagePopup,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <>
        <div id="popup-portal" />
        <Story />
      </>
    ),
  ],
};

export default meta;

type Story = StoryObj<MessagePopupProps>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <button onClick={() => setOpen(true)}>Show Popup</button>
        {open && (
          <MessagePopup
            message="Are you sure you want to delete this item?"
            onClose={() => setOpen(false)}
            onConfirm={() => {
              alert("Confirmed!");
              setOpen(false);
            }}
            onCancel={() => {
              alert("Cancelled!");
              setOpen(false);
            }}
          />
        )}
      </>
    );
  },
};

export const WithTitle: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <button onClick={() => setOpen(true)}>Show Titled Popup</button>
        {open && (
          <MessagePopup
            title="Delete item"
            message="Are you sure you want to delete this item? This action cannot be undone."
            onClose={() => setOpen(false)}
            onConfirm={() => {
              alert("Confirmed!");
              setOpen(false);
            }}
            onCancel={() => {
              alert("Cancelled!");
              setOpen(false);
            }}
            confirmText="Delete"
            cancelText="Keep"
          />
        )}
      </>
    );
  },
};

export const MessageOnly: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button onClick={() => setOpen(true)}>Show Message</button>
        {open && (
          <MessagePopup
            message="Just letting you know something happened."
            onClose={() => setOpen(false)}
          />
        )}
      </>
    );
  },
};

export const ConfirmOnly: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button onClick={() => setOpen(true)}>Show Confirm</button>
        {open && (
          <MessagePopup
            message="This will confirm an action without cancel."
            onClose={() => setOpen(false)}
            onConfirm={() => {
              alert("Confirmed!");
              setOpen(false);
            }}
          />
        )}
      </>
    );
  },
};

export const CancelOnly: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button onClick={() => setOpen(true)}>Show Cancel</button>
        {open && (
          <MessagePopup
            message="Cancel-only option"
            onClose={() => setOpen(false)}
            onCancel={() => {
              alert("Cancelled!");
              setOpen(false);
            }}
          />
        )}
      </>
    );
  },
};

export const RoundingVariants: Story = {
  render: () => {
    const [visibleRounding, setVisibleRounding] = useState<RoundingType | null>(
      null,
    );

    return (
      <>
        <div className="grid grid-cols-6 gap-2">
          {roundingOptions.map((rounding) => (
            <button
              key={rounding}
              onClick={() => setVisibleRounding(rounding as RoundingType)}
              className="p-2 border rounded"
            >
              {rounding}
            </button>
          ))}
        </div>

        {visibleRounding && (
          <MessagePopup
            message={`Rounding: ${visibleRounding}`}
            rounding={visibleRounding}
            onClose={() => setVisibleRounding(null)}
          />
        )}
      </>
    );
  },
};

export const ShadowVariants: Story = {
  render: () => {
    const [visibleShadow, setVisibleShadow] = useState<ShadowType | null>(null);

    return (
      <>
        <div className="grid grid-cols-6 gap-2">
          {shadowOptions.map((shadow) => (
            <button
              key={shadow}
              onClick={() => setVisibleShadow(shadow as ShadowType)}
              className="p-2 border rounded"
            >
              {shadow}
            </button>
          ))}
        </div>

        {visibleShadow && (
          <MessagePopup
            message={`Shadow: ${visibleShadow}`}
            shadow={visibleShadow}
            onClose={() => setVisibleShadow(null)}
          />
        )}
      </>
    );
  },
};
