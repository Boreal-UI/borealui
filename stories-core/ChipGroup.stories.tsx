import { useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChipGroup } from "../src/index.core";
import type {
  ChipGroupProps,
  ChipGroupRef,
} from "../src/components/Chip/ChipGroup/ChipGroup.types";
import { ChipProps } from "../src/components/Chip/Chip.types";
import { FaCheckCircle, FaExclamationTriangle } from "../shared-story-assets/icons";
import { StoryGrid } from "../.storybook-core/helpers/StoryGrid";

const meta: Meta<ChipGroupProps> = {
  title: "Components/ChipGroup",
  component: ChipGroup,
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

type Story = StoryObj<ChipGroupProps>;

const createChip = (
  message: string,
  overrides: Partial<ChipProps> = {},
): ChipProps => ({
  id: crypto.randomUUID(),
  visible: true,
  message,
  autoClose: true,
  ...overrides,
});

const positions: ChipGroupProps["placement"][] = [
  "topLeft",
  "topCenter",
  "topRight",
  "bottomLeft",
  "bottomCenter",
  "bottomRight",
];

const defaultChips: ChipProps[] = [
  createChip("Success message!", {
    state: "success",
    icon: FaCheckCircle,
    duration: 4000,
  }),
  createChip("Something went wrong!", {
    state: "error",
    icon: FaExclamationTriangle,
    autoClose: false,
  }),
];

export const Default: Story = {
  render: () => {
    const [chips, setChips] = useState<ChipProps[]>(defaultChips);

    return (
      <div style={{ padding: "2rem" }}>
        <button
          onClick={() =>
            setChips((prev) => [
              ...prev,
              createChip("New chip at " + new Date().toLocaleTimeString(), {
                theme: "primary",
              }),
            ])
          }
        >
          Add Chip
        </button>
        <ChipGroup
          chips={chips}
          onRemove={(id) => setChips((prev) => prev.filter((c) => c.id !== id))}
        />
      </div>
    );
  },
};

export const WithRefCloseAll: Story = {
  render: () => {
    const ref = useRef<ChipGroupRef>(null);
    const [chips, setChips] = useState<ChipProps[]>(defaultChips);

    return (
      <div style={{ padding: "2rem" }}>
        <button
          onClick={() =>
            setChips((prev) => [
              ...prev,
              createChip("Ref chip at " + new Date().toLocaleTimeString(), {
                theme: "secondary",
              }),
            ])
          }
        >
          Add Chip
        </button>
        <button
          onClick={() => ref.current?.closeAllChips()}
          style={{ marginLeft: "1rem" }}
        >
          Close All
        </button>
        <ChipGroup
          ref={ref}
          chips={chips}
          onRemove={(id) => setChips((prev) => prev.filter((c) => c.id !== id))}
        />
      </div>
    );
  },
};

export const PositionVariants = () => (
  <StoryGrid title="Position Variants">
    {positions.map((position) => (
      <ChipGroup
        key={position}
        placement={position}
        chips={[
          createChip(`Position: ${position}`, {
            theme: "primary",
            autoClose: false,
          }),
        ]}
      />
    ))}
  </StoryGrid>
);

export const WithClassName: Story = {
  render: () => {
    return (
      <ChipGroup
        chips={[createChip("ClassName Chip", { theme: "secondary" })]}
        placement="topRight"
        className="storybook-chip-group-custom"
        onRemove={() => {}}
      />
    );
  },
};
