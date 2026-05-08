import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { FaBell, FaTimes } from "react-icons/fa";
import ChipBase from "@/components/Chip/ChipBase";
import { DummyIconButton } from "../test-utils/dummyComponents";

expect.extend(toHaveNoViolations);

const classMap = {
  chip: "chip",

  primary: "primary",
  secondary: "secondary",
  tertiary: "tertiary",
  quaternary: "quaternary",
  clear: "clear",

  success: "success",
  warning: "warning",
  error: "error",

  xs: "xs",
  small: "small",
  medium: "medium",
  large: "large",
  xl: "xl",

  topLeft: "topLeft",
  topCenter: "topCenter",
  topRight: "topRight",
  bottomLeft: "bottomLeft",
  bottomCenter: "bottomCenter",
  bottomRight: "bottomRight",

  shadowNone: "shadowNone",
  shadowLight: "shadowLight",
  shadowMedium: "shadowMedium",
  shadowStrong: "shadowStrong",
  shadowIntense: "shadowIntense",

  roundNone: "roundNone",
  roundSmall: "roundSmall",
  roundMedium: "roundMedium",
  roundLarge: "roundLarge",
  roundFull: "roundFull",

  fadeout: "fadeout",
  fixed: "fixed",
  icon: "icon",
  inner_icon: "innerIcon",
  message: "message",
  close: "close",
  glass: "glass",
};

describe("ChipBase", () => {
  const renderChip = (
    props: Partial<React.ComponentProps<typeof ChipBase>> = {},
  ) =>
    render(
      <ChipBase
        id="chip-1"
        message="Saved successfully"
        visible
        onClose={jest.fn()}
        closeIcon={FaTimes}
        IconButtonComponent={DummyIconButton}
        classMap={classMap}
        data-testid="chip"
        {...props}
      />,
    );

  beforeEach(() => {
    const portal = document.createElement("div");
    portal.setAttribute("id", "widget-portal");
    document.body.appendChild(portal);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
    const portal = document.getElementById("widget-portal");
    if (portal) portal.remove();
  });

  it("renders nothing when not visible and not closing", () => {
    renderChip({ visible: false });
    expect(screen.queryByTestId("chip")).not.toBeInTheDocument();
  });

  it("renders the chip when visible", () => {
    renderChip();

    const chip = screen.getByTestId("chip");
    expect(chip).toBeInTheDocument();
    expect(chip).toHaveAttribute("role", "alert");
    expect(chip).toHaveAttribute("aria-live", "assertive");
    expect(chip).toHaveAttribute("aria-atomic", "true");
    expect(screen.getByText("Saved successfully")).toBeInTheDocument();
  });

  it("renders the chip with the provided id", () => {
    renderChip();
    expect(screen.getByTestId("chip")).toHaveAttribute("id", "chip-1");
  });

  it("renders the message with the derived id from the component id", () => {
    renderChip();
    expect(screen.getByTestId("chip-message")).toHaveAttribute(
      "id",
      "chip-1-message",
    );
  });

  it("renders the message with a custom messageId when provided", () => {
    renderChip({ messageId: "custom-message-id" });

    expect(screen.getByTestId("chip-message")).toHaveAttribute(
      "id",
      "custom-message-id",
    );
  });

  it("renders an icon when provided", () => {
    renderChip({ icon: FaBell });

    expect(screen.getByTestId("chip-icon")).toBeInTheDocument();
  });

  it("does not render a message icon when none is provided", () => {
    renderChip();
    expect(screen.queryByTestId("chip-icon")).not.toBeInTheDocument();
  });

  it("treats the leading icon as decorative by default", () => {
    renderChip({ icon: FaBell });

    const icon = screen.getByTestId("chip-icon");
    expect(icon).toHaveAttribute("aria-hidden", "true");
    expect(icon).not.toHaveAttribute("aria-label");
  });

  it("allows the leading icon to be announced when iconDecorative is false", () => {
    renderChip({
      icon: FaBell,
      iconDecorative: false,
      iconAriaLabel: "Notification",
    });

    const icon = screen.getByTestId("chip-icon");
    expect(icon).not.toHaveAttribute("aria-hidden");
    expect(icon).toHaveAttribute("aria-label", "Notification");
  });

  it("renders the close button with default accessibility attributes", () => {
    renderChip();

    const closeButton = screen.getByTestId("chip-chip-close");
    expect(closeButton).toBeInTheDocument();
    expect(closeButton).toHaveAttribute("aria-label", "Close notification");
    expect(closeButton).toHaveAttribute("aria-controls", "chip-1-message");
  });

  it("renders the close button with a custom aria-label", () => {
    renderChip({ closeButtonAriaLabel: "Dismiss saved message" });

    expect(screen.getByTestId("chip-chip-close")).toHaveAttribute(
      "aria-label",
      "Dismiss saved message",
    );
  });

  it("uses the custom messageId for the close button aria-controls", () => {
    renderChip({ messageId: "custom-message-id" });

    expect(screen.getByTestId("chip-chip-close")).toHaveAttribute(
      "aria-controls",
      "custom-message-id",
    );
  });

  it("calls onClose after clicking the close button", () => {
    jest.useFakeTimers();
    const onClose = jest.fn();

    renderChip({ onClose });

    fireEvent.click(screen.getByTestId("chip-chip-close"));

    expect(onClose).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("adds fadeout class while closing", () => {
    jest.useFakeTimers();
    renderChip();

    const chip = screen.getByTestId("chip");
    expect(chip).not.toHaveClass("fadeout");

    fireEvent.click(screen.getByTestId("chip-chip-close"));
    expect(screen.getByTestId("chip")).toHaveClass("fadeout");
  });

  it("calls onClose when Escape is pressed", () => {
    jest.useFakeTimers();
    const onClose = jest.fn();

    renderChip({ onClose });

    fireEvent.keyDown(window, { key: "Escape" });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not close on non-Escape key press", () => {
    jest.useFakeTimers();
    const onClose = jest.fn();

    renderChip({ onClose });

    fireEvent.keyDown(window, { key: "Enter" });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(onClose).not.toHaveBeenCalled();
  });

  it("auto-closes after the default duration", () => {
    jest.useFakeTimers();
    const onClose = jest.fn();

    renderChip({ onClose });

    act(() => {
      jest.advanceTimersByTime(2999);
    });
    expect(onClose).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(onClose).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("auto-closes after a custom duration", () => {
    jest.useFakeTimers();
    const onClose = jest.fn();

    renderChip({ onClose, duration: 1000 });

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(onClose).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not auto-close when autoClose is false", () => {
    jest.useFakeTimers();
    const onClose = jest.fn();

    renderChip({ onClose, autoClose: false });

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(onClose).not.toHaveBeenCalled();
  });

  it("resets closing state when visible changes from false back to true", () => {
    jest.useFakeTimers();
    const onClose = jest.fn();

    const { rerender } = render(
      <ChipBase
        id="chip-1"
        message="Saved successfully"
        visible
        onClose={onClose}
        closeIcon={FaTimes}
        IconButtonComponent={DummyIconButton}
        classMap={classMap}
        data-testid="chip"
      />,
    );

    fireEvent.click(screen.getByTestId("chip-chip-close"));
    expect(screen.getByTestId("chip")).toHaveClass("fadeout");

    rerender(
      <ChipBase
        id="chip-1"
        message="Saved successfully"
        visible={false}
        onClose={onClose}
        closeIcon={FaTimes}
        IconButtonComponent={DummyIconButton}
        classMap={classMap}
        data-testid="chip"
      />,
    );

    rerender(
      <ChipBase
        id="chip-1"
        message="Saved successfully"
        visible
        onClose={onClose}
        closeIcon={FaTimes}
        IconButtonComponent={DummyIconButton}
        classMap={classMap}
        data-testid="chip"
      />,
    );

    expect(screen.getByTestId("chip")).not.toHaveClass("fadeout");
  });

  it("renders into the portal by default when portal exists", () => {
    renderChip();

    const portal = document.getElementById("widget-portal");
    expect(portal).toContainElement(screen.getByTestId("chip"));
  });

  it("renders without portal when usePortal is false", () => {
    renderChip({ usePortal: false });

    const chip = screen.getByTestId("chip");
    const portal = document.getElementById("widget-portal");

    expect(chip).toBeInTheDocument();
    expect(portal).not.toContainElement(chip);
  });

  it("falls back to normal render when portal is requested but portal element is missing", () => {
    const portal = document.getElementById("widget-portal");
    portal?.remove();

    renderChip({ usePortal: true });

    expect(screen.getByTestId("chip")).toBeInTheDocument();
  });

  it("applies zIndex style when stackIndex is provided", () => {
    renderChip({ stackIndex: 5000 });

    expect(screen.getByTestId("chip")).toHaveStyle({ zIndex: "5000" });
  });

  it("does not apply zIndex style when stackIndex is not provided", () => {
    renderChip();

    expect(screen.getByTestId("chip")).not.toHaveStyle({ zIndex: "5000" });
  });

  it("applies theme, state, size, position, shadow, rounding, fixed, and custom className", () => {
    renderChip({
      theme: "primary",
      state: "success",
      size: "medium",
      position: "topCenter",
      shadow: "light",
      rounding: "small",
      usePortal: true,
      className: "custom-chip-class",
    });

    const chip = screen.getByTestId("chip");
    expect(chip).toHaveClass("chip");
    expect(chip).toHaveClass("primary");
    expect(chip).toHaveClass("success");
    expect(chip).toHaveClass("medium");
    expect(chip).toHaveClass("topCenter");
    expect(chip).toHaveClass("shadowLight");
    expect(chip).toHaveClass("roundSmall");
    expect(chip).toHaveClass("fixed");
    expect(chip).toHaveClass("custom-chip-class");
  });

  it("does not apply fixed class when usePortal is false", () => {
    renderChip({ usePortal: false });
    expect(screen.getByTestId("chip")).not.toHaveClass("fixed");
  });

  it("uses the default test id when none is provided", () => {
    render(
      <ChipBase
        id="chip-1"
        message="Default test id"
        visible
        onClose={jest.fn()}
        closeIcon={FaTimes}
        IconButtonComponent={DummyIconButton}
        classMap={classMap}
      />,
    );

    expect(screen.getByTestId("chip")).toBeInTheDocument();
    expect(screen.getByTestId("chip-chip-close")).toBeInTheDocument();
    expect(screen.getByTestId("chip-message")).toHaveAttribute(
      "id",
      "chip-1-message",
    );
  });

  it("applies an explicit aria-label to the chip", () => {
    renderChip({ "aria-label": "Save confirmation" });

    const chip = screen.getByLabelText("Save confirmation");
    expect(chip).toBeInTheDocument();
    expect(chip).toHaveAttribute("aria-label", "Save confirmation");
  });

  it("applies aria-labelledby to the chip", () => {
    render(
      <>
        <span id="external-chip-label">External chip label</span>
        <ChipBase
          id="chip-1"
          message="Saved successfully"
          visible
          onClose={jest.fn()}
          closeIcon={FaTimes}
          IconButtonComponent={DummyIconButton}
          classMap={classMap}
          data-testid="chip"
          aria-labelledby="external-chip-label"
          usePortal={false}
        />
      </>,
    );

    const chip = screen.getByTestId("chip");
    expect(chip).toHaveAttribute("aria-labelledby", "external-chip-label");
    expect(chip).not.toHaveAttribute("aria-label");
  });

  it("applies aria-describedby to the chip", () => {
    render(
      <>
        <span id="external-description">Extra status information</span>
        <ChipBase
          id="chip-1"
          message="Saved successfully"
          visible
          onClose={jest.fn()}
          closeIcon={FaTimes}
          IconButtonComponent={DummyIconButton}
          classMap={classMap}
          data-testid="chip"
          aria-describedby="external-description"
          usePortal={false}
        />
      </>,
    );

    expect(screen.getByTestId("chip")).toHaveAttribute(
      "aria-describedby",
      "external-description",
    );
  });

  it("uses polite live region defaults when role is status", () => {
    renderChip({ role: "status" });

    const chip = screen.getByTestId("chip");
    expect(chip).toHaveAttribute("role", "status");
    expect(chip).toHaveAttribute("aria-live", "polite");
    expect(chip).toHaveAttribute("aria-atomic", "true");
  });

  it("allows aria-live to override the default live region behavior", () => {
    renderChip({ role: "status", "aria-live": "assertive" });

    expect(screen.getByTestId("chip")).toHaveAttribute(
      "aria-live",
      "assertive",
    );
  });

  it("allows aria-atomic to be overridden", () => {
    renderChip({ "aria-atomic": false });

    expect(screen.getByTestId("chip")).toHaveAttribute("aria-atomic", "false");
  });

  it("applies aria-relevant when provided", () => {
    renderChip({ "aria-relevant": "additions text" });

    expect(screen.getByTestId("chip")).toHaveAttribute(
      "aria-relevant",
      "additions text",
    );
  });

  it("applies aria-hidden when provided", () => {
    renderChip({ "aria-hidden": true });

    expect(screen.getByTestId("chip")).toHaveAttribute("aria-hidden", "true");
  });

  it("passes through standard HTML attributes", () => {
    renderChip({
      usePortal: false,
      title: "Chip title",
      tabIndex: 0,
    });

    const chip = screen.getByTestId("chip");
    expect(chip).toHaveAttribute("title", "Chip title");
    expect(chip).toHaveAttribute("tabindex", "0");
  });

  it("has no accessibility violations in standard state", async () => {
    const { container } = renderChip({
      usePortal: false,
      icon: FaBell,
    });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations without leading icon", async () => {
    const { container } = renderChip({
      usePortal: false,
    });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations while visible with close button", async () => {
    const { container } = renderChip({
      usePortal: false,
      theme: "primary",
      state: "success",
      glass: true,
    });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations when using role=status", async () => {
    const { container } = renderChip({
      usePortal: false,
      role: "status",
      icon: FaBell,
    });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
