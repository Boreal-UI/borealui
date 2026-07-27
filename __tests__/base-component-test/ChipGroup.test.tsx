import React, { forwardRef, useImperativeHandle } from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";

import ChipGroupBase from "@/components/Chip/ChipGroup/ChipGroupBase";
import type { ChipGroupRef } from "@/components/Chip/ChipGroup/ChipGroup.types";
import type { ChipProps } from "@/components/Chip/Chip.types";
import { DummyChip } from "../test-utils/dummyComponents";

expect.extend(toHaveNoViolations);

type ClosableChildHandle = {
  close: () => void;
};

type ClosableChildProps = {
  label: string;
  onClose?: () => void;
  onRemove?: () => void;
  size?: string;
  position?: string;
  "data-testid"?: string;
};

const ClosableChild = forwardRef<ClosableChildHandle, ClosableChildProps>(
  function ClosableChild(
    { label, onClose, onRemove, size, position, "data-testid": testId },
    ref,
  ) {
    const closeHandler = onClose ?? onRemove;

    useImperativeHandle(ref, () => ({
      close: () => closeHandler?.(),
    }));

    return (
      <div
        data-testid={testId}
        data-size={size}
        data-position={position}
        role="status"
      >
        <span>{label}</span>
        <button
          type="button"
          aria-label={`Close ${label}`}
          onClick={() => closeHandler?.()}
          data-testid={`close-${label}`}
        />
      </div>
    );
  },
);

describe("ChipGroupBase", () => {
  const chips: ChipProps[] = [
    {
      id: "chip1",
      message: "First chip",
      "data-testid": "chip-1",
      visible: true,
    },
    {
      id: "chip2",
      message: "Second chip",
      "data-testid": "chip-2",
      visible: true,
    },
  ];

  const classMap = {
    container: "chip-container",
    list: "chip-list",
    chip: "chip",
    topLeft: "chip-topLeft",
    topCenter: "chip-topCenter",
    topRight: "chip-topRight",
    bottomLeft: "chip-bottomLeft",
    bottomCenter: "chip-bottomCenter",
    bottomRight: "chip-bottomRight",
  };

  type ChipsModeRenderProps = {
    chips?: ChipProps[];
    onRemove?: (id: string) => void;
    position?: React.ComponentProps<typeof ChipGroupBase>["position"];
    size?: React.ComponentProps<typeof ChipGroupBase>["size"];
    className?: string;
    "data-testid"?: string;
  };

  const renderGroupWithChips = ({
    chips: chipsOverride,
    onRemove,
    position,
    size,
    className,
    "data-testid": testId = "chip-group",
  }: ChipsModeRenderProps = {}) =>
    render(
      <ChipGroupBase
        chips={chipsOverride ?? chips}
        ChipComponent={DummyChip}
        classMap={classMap}
        onRemove={onRemove ?? jest.fn()}
        position={position}
        size={size}
        className={className}
        data-testid={testId}
      />,
    );

  type ChildrenModeRenderProps = {
    children: React.ReactNode;
    onRemove?: (id: string) => void;
    position?: React.ComponentProps<typeof ChipGroupBase>["position"];
    size?: React.ComponentProps<typeof ChipGroupBase>["size"];
    className?: string;
    "data-testid"?: string;
  };

  const renderGroupWithChildren = ({
    children,
    onRemove,
    position,
    size,
    className,
    "data-testid": testId = "chip-group",
  }: ChildrenModeRenderProps) =>
    render(
      <ChipGroupBase
        ChipComponent={DummyChip}
        classMap={classMap}
        onRemove={onRemove ?? jest.fn()}
        position={position}
        size={size}
        className={className}
        data-testid={testId}
      >
        {children}
      </ChipGroupBase>,
    );

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the region and list with correct accessibility", () => {
    renderGroupWithChips();

    const region = screen.getByRole("region", { name: /notifications/i });
    expect(region).toBeInTheDocument();
    expect(region).toHaveAttribute("aria-live", "polite");

    const list = screen.getByRole("list");
    expect(list).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("renders chips from the chips prop", () => {
    renderGroupWithChips();

    expect(screen.getByTestId("chip-1")).toHaveTextContent("First chip");
    expect(screen.getByTestId("chip-2")).toHaveTextContent("Second chip");
  });

  it("calls onRemove when a chip close button is clicked", () => {
    const onRemove = jest.fn();

    renderGroupWithChips({ onRemove });

    fireEvent.click(screen.getByTestId("close-button-chip1"));
    expect(onRemove).toHaveBeenCalledTimes(1);
    expect(onRemove).toHaveBeenCalledWith("chip1");
  });

  it("removes a chip from the DOM when closed", () => {
    renderGroupWithChips();

    expect(screen.getByTestId("chip-1")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("close-button-chip1"));
    expect(screen.queryByTestId("chip-1")).not.toBeInTheDocument();
    expect(screen.getByTestId("chip-2")).toBeInTheDocument();
  });

  it("renders chips with inherited default size", () => {
    renderGroupWithChips({ size: "large" });

    expect(screen.getByTestId("chip-1")).toHaveAttribute("data-size", "large");
    expect(screen.getByTestId("chip-2")).toHaveAttribute("data-size", "large");
  });

  it("uses chip-specific size over group size", () => {
    renderGroupWithChips({
      chips: [
        {
          id: "chip1",
          message: "First chip",
          size: "small",
          "data-testid": "chip-1",
          visible: true,
        },
      ],
      size: "large",
    });

    expect(screen.getByTestId("chip-1")).toHaveAttribute("data-size", "small");
  });

  it("uses the group position when chip position is not provided", () => {
    renderGroupWithChips({ position: "bottomRight" });

    expect(screen.getByTestId("chip-1")).toHaveAttribute(
      "data-position",
      "bottomRight",
    );
    expect(screen.getByTestId("chip-2")).toHaveAttribute(
      "data-position",
      "bottomRight",
    );
  });

  it("uses chip-specific position over group position", () => {
    renderGroupWithChips({
      chips: [
        {
          id: "chip1",
          message: "First chip",
          position: "topLeft",
          "data-testid": "chip-1",
          visible: true,
        },
      ],
      position: "bottomRight",
    });

    expect(screen.getByTestId("chip-1")).toHaveAttribute(
      "data-position",
      "topLeft",
    );
  });

  it("passes stack index to chips", () => {
    renderGroupWithChips();

    expect(screen.getByTestId("chip-1")).toHaveAttribute(
      "data-stack-index",
      "0",
    );
    expect(screen.getByTestId("chip-2")).toHaveAttribute(
      "data-stack-index",
      "1",
    );
  });

  it("applies container, list, position, and custom class names", () => {
    renderGroupWithChips({
      position: "topCenter",
      className: "custom-group-class",
    });

    const container = screen.getByTestId("chip-group");
    const list = screen.getByRole("list");

    expect(container).toHaveClass("chip-container");
    expect(container).toHaveClass("chip-topCenter");
    expect(container).toHaveClass("custom-group-class");
    expect(list).toHaveClass("chip-list");
  });

  it("applies chip and position classes to rendered chips", () => {
    renderGroupWithChips({ position: "topCenter" });

    expect(screen.getByTestId("chip-1")).toHaveClass("chip");
    expect(screen.getByTestId("chip-1")).toHaveClass("chip-topCenter");
  });

  it("uses the default test id when none is provided", () => {
    render(
      <ChipGroupBase
        chips={chips}
        ChipComponent={DummyChip}
        classMap={classMap}
        onRemove={jest.fn()}
      />,
    );

    expect(screen.getByTestId("chip-group")).toBeInTheDocument();
  });

  it("renders children instead of chips when children are provided", () => {
    renderGroupWithChildren({
      children: (
        <>
          <ClosableChild label="Child chip 1" data-testid="child-chip-1" />
          <ClosableChild label="Child chip 2" data-testid="child-chip-2" />
        </>
      ),
    });

    expect(screen.getByTestId("child-chip-1")).toBeInTheDocument();
    expect(screen.getByTestId("child-chip-2")).toBeInTheDocument();
    expect(screen.queryByTestId("chip-1")).not.toBeInTheDocument();
    expect(screen.queryByTestId("chip-2")).not.toBeInTheDocument();
  });

  it("injects default size and position into children when absent", () => {
    renderGroupWithChildren({
      size: "large",
      position: "bottomCenter",
      children: <ClosableChild label="Child chip" data-testid="child-chip" />,
    });

    const child = screen.getByTestId("child-chip");
    expect(child).toHaveAttribute("data-size", "large");
    expect(child).toHaveAttribute("data-position", "bottomCenter");
  });

  it("does not override child size and position when already provided", () => {
    renderGroupWithChildren({
      size: "large",
      position: "bottomCenter",
      children: (
        <ClosableChild
          label="Child chip"
          size="small"
          position="topLeft"
          data-testid="child-chip"
        />
      ),
    });

    const child = screen.getByTestId("child-chip");
    expect(child).toHaveAttribute("data-size", "small");
    expect(child).toHaveAttribute("data-position", "topLeft");
  });

  it("supports closeAllChips via ref in chips mode", () => {
    const onRemove = jest.fn();
    const ref = React.createRef<ChipGroupRef>();

    render(
      <ChipGroupBase
        ref={ref}
        chips={chips}
        ChipComponent={DummyChip}
        classMap={classMap}
        onRemove={onRemove}
        data-testid="chip-group"
      />,
    );

    expect(screen.getByTestId("chip-1")).toBeInTheDocument();
    expect(screen.getByTestId("chip-2")).toBeInTheDocument();

    act(() => {
      ref.current?.closeAllChips();
    });

    expect(screen.queryByTestId("chip-1")).not.toBeInTheDocument();
    expect(screen.queryByTestId("chip-2")).not.toBeInTheDocument();
    expect(onRemove).toHaveBeenCalledWith("chip1");
    expect(onRemove).toHaveBeenCalledWith("chip2");
  });

  it("supports closeAllChips via ref in children mode", () => {
    const childOneClose = jest.fn();
    const childTwoRemove = jest.fn();
    const ref = React.createRef<ChipGroupRef>();

    render(
      <ChipGroupBase
        ref={ref}
        ChipComponent={DummyChip}
        classMap={classMap}
        onRemove={jest.fn()}
        data-testid="chip-group"
      >
        <ClosableChild
          label="Child chip 1"
          onClose={childOneClose}
          data-testid="child-chip-1"
        />
        <ClosableChild
          label="Child chip 2"
          onRemove={childTwoRemove}
          data-testid="child-chip-2"
        />
      </ChipGroupBase>,
    );

    ref.current?.closeAllChips();

    expect(childOneClose).toHaveBeenCalledTimes(1);
    expect(childTwoRemove).toHaveBeenCalledTimes(1);
  });

  it("keeps non-element children in children mode", () => {
    renderGroupWithChildren({
      children: (
        <>
          {"Loose text child"}
          <ClosableChild label="Child chip" data-testid="child-chip" />
        </>
      ),
    });

    expect(screen.getByText("Loose text child")).toBeInTheDocument();
    expect(screen.getByTestId("child-chip")).toBeInTheDocument();
  });

  it("assigns generated ids to chips without an id", () => {
    renderGroupWithChips({
      chips: [
        {
          message: "Generated id chip",
          "data-testid": "generated-chip",
          visible: true,
        },
      ],
    });

    expect(screen.getByTestId("generated-chip")).toBeInTheDocument();
    expect(screen.getByTestId("generated-chip")).toHaveTextContent(
      "Generated id chip",
    );
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });

  it("has no accessibility violations in chips mode", async () => {
    const { container } = renderGroupWithChips();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations in children mode", async () => {
    const { container } = renderGroupWithChildren({
      children: (
        <>
          <ClosableChild label="Child chip 1" data-testid="child-chip-1" />
          <ClosableChild label="Child chip 2" data-testid="child-chip-2" />
        </>
      ),
    });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
