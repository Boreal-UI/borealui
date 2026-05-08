import { useState } from "react";
import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Modal, Button } from "../../src/index.next";
import type { ModalProps } from "../../src/components/Modal/Modal.types";
import { RoundingType, ShadowType } from "../../src/types/types";

const roundingOptions = ["none", "small", "medium", "large"];
const shadowOptions = ["none", "light", "medium", "strong", "intense"];

const meta: Meta<ModalProps> = {
  title: "Components/Modal",
  component: Modal,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <>
        <div id="widget-portal" />
        <Story />
      </>
    ),
  ],
};

export default meta;

type Story = StoryObj<ModalProps>;

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button theme="primary" onClick={() => setIsOpen(true)}>
          Open Modal
        </Button>

        {isOpen && (
          <Modal onClose={() => setIsOpen(false)}>
            <div style={{ padding: "1rem" }}>
              <h2 style={{ marginTop: 0 }}>Hello from the modal!</h2>
              <p>
                This is a fully accessible, focus-trapped modal component
                rendered via portal.
              </p>
              <Button onClick={() => alert("Action inside modal!")}>
                Action
              </Button>
            </div>
          </Modal>
        )}
      </>
    );
  },
};

export const LongContent: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button theme="secondary" onClick={() => setIsOpen(true)}>
          Show Scrollable Modal
        </Button>

        {isOpen && (
          <Modal
            onClose={() => setIsOpen(false)}
            header="Scrollable Modal"
            footer={<Button onClick={() => setIsOpen(false)}>Close</Button>}
          >
            <div style={{ padding: "1rem", maxHeight: "70vh" }}>
              <p>
                This modal contains a lot of content to test vertical scroll
                behavior.
              </p>
              {[...Array(30)].map((_, i) => (
                <p key={i}>Line {i + 1}: Lorem ipsum dolor sit amet...</p>
              ))}
            </div>
          </Modal>
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
          <Modal
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
          <Modal
            shadow={visibleShadow}
            onClose={() => setVisibleShadow(null)}
          />
        )}
      </>
    );
  },
};
