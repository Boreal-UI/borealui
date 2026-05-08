import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import BasePopover from "@/components/PopOver/PopOverBase";
import { axe, toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

const classNames = {
  container: "popoverContainer",
  trigger: "popoverTrigger",
  popover: "popoverContent",
  bottom: "placementBottom",
  top: "placementTop",
  left: "placementLeft",
  right: "placementRight",
  primary: "themePrimary",
  secondary: "themeSecondary",
  glass: "glass",
  success: "stateSuccess",
  shadowMedium: "shadowMedium",
  roundMedium: "roundMedium",
  srOnly: "srOnly",
};

describe("BasePopover", () => {
  const renderPopover = (props = {}) =>
    render(
      <BasePopover
        trigger={<span>Open Popover</span>}
        content={<div>Popover Content</div>}
        classMap={classNames}
        data-testid="popover"
        {...props}
      />,
    );

  it("renders the trigger button with default accessible name", () => {
    renderPopover();

    const trigger = screen.getByRole("button", { name: /toggle popover/i });
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveAttribute("data-testid", "popover-trigger");
    expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("renders a custom trigger aria-label and title when provided", () => {
    renderPopover({
      triggerAriaLabel: "Show details",
      triggerTitle: "Open the details popover",
    });

    const trigger = screen.getByRole("button", { name: /show details/i });
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveAttribute("title", "Open the details popover");
  });

  it("toggles popover open and closed on click", () => {
    renderPopover();

    const trigger = screen.getByTestId("popover-trigger");

    expect(screen.queryByTestId("popover-content")).not.toBeInTheDocument();

    fireEvent.click(trigger);
    expect(screen.getByTestId("popover-content")).toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(trigger);
    expect(screen.queryByTestId("popover-content")).not.toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("closes on Escape key and returns focus to the trigger", () => {
    renderPopover();

    const trigger = screen.getByTestId("popover-trigger");

    fireEvent.click(trigger);
    expect(screen.getByTestId("popover-content")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.queryByTestId("popover-content")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("closes when clicking outside the popover", () => {
    render(
      <div>
        <BasePopover
          trigger={<span>Open Popover</span>}
          content={<div>Popover Content</div>}
          classMap={classNames}
          data-testid="popover"
        />
        <button data-testid="outside-button" type="button">
          Outside
        </button>
      </div>,
    );

    fireEvent.click(screen.getByTestId("popover-trigger"));
    expect(screen.getByTestId("popover-content")).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByTestId("outside-button"));
    expect(screen.queryByTestId("popover-content")).not.toBeInTheDocument();
  });

  it("does not close when clicking inside the popover", () => {
    renderPopover({
      content: (
        <div>
          <button type="button">Inner Action</button>
        </div>
      ),
    });

    fireEvent.click(screen.getByTestId("popover-trigger"));

    const content = screen.getByTestId("popover-content");
    expect(content).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByRole("button", { name: /inner action/i }));
    expect(screen.getByTestId("popover-content")).toBeInTheDocument();
  });

  it("moves focus into the popover when opened for dialog role", () => {
    renderPopover({
      content: (
        <div>
          <button type="button">Focusable Action</button>
        </div>
      ),
    });

    fireEvent.click(screen.getByTestId("popover-trigger"));

    expect(
      screen.getByRole("button", { name: /focusable action/i }),
    ).toHaveFocus();
  });

  it("focuses the popover container when no focusable child exists", () => {
    renderPopover({
      content: <div>Read only content</div>,
    });

    fireEvent.click(screen.getByTestId("popover-trigger"));

    expect(screen.getByTestId("popover-content")).toHaveFocus();
  });

  it("does not force focus into the popover when role is tooltip", () => {
    renderPopover({
      role: "tooltip",
      content: <div>Helpful tooltip text</div>,
    });

    const trigger = screen.getByTestId("popover-trigger");
    fireEvent.click(trigger);

    const content = screen.getByTestId("popover-content");

    expect(content).toBeInTheDocument();
    expect(content).not.toHaveFocus();
    expect(document.activeElement).not.toBe(content);
  });

  it("uses tooltip-specific trigger aria-describedby only when open", () => {
    renderPopover({
      role: "tooltip",
      content: <div>Helpful tooltip text</div>,
    });

    const trigger = screen.getByTestId("popover-trigger");
    expect(trigger).not.toHaveAttribute("aria-haspopup");
    expect(trigger).not.toHaveAttribute("aria-controls");
    expect(trigger).not.toHaveAttribute("aria-expanded");
    expect(trigger).not.toHaveAttribute("aria-describedby");

    fireEvent.click(trigger);

    expect(trigger).toHaveAttribute("aria-describedby");
  });

  it("uses menu aria-haspopup when role is menu", () => {
    renderPopover({
      role: "menu",
      content: <div>Menu content</div>,
    });

    const trigger = screen.getByTestId("popover-trigger");
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("renders dialog role by default", () => {
    renderPopover();

    fireEvent.click(screen.getByTestId("popover-trigger"));

    expect(screen.getByTestId("popover-content")).toHaveAttribute(
      "role",
      "dialog",
    );
  });

  it("renders a custom id on the popover content when provided", () => {
    renderPopover({ id: "custom-popover-id" });

    const trigger = screen.getByTestId("popover-trigger");
    fireEvent.click(trigger);

    const content = screen.getByTestId("popover-content");
    expect(content).toHaveAttribute("id", "custom-popover-id");
    expect(trigger).toHaveAttribute("aria-controls", "custom-popover-id");
  });

  it("applies aria-label directly to the popover content when provided", () => {
    renderPopover({
      "aria-label": "Additional details",
    });

    fireEvent.click(screen.getByTestId("popover-trigger"));

    const content = screen.getByRole("dialog", { name: /additional details/i });
    expect(content).toBeInTheDocument();
    expect(content).toHaveAttribute("aria-label", "Additional details");
    expect(screen.queryByText("Popover Content")).toBeInTheDocument();
  });

  it("uses external aria-labelledby when provided", () => {
    render(
      <>
        <span id="external-popover-label">External Popover Label</span>
        <BasePopover
          trigger={<span>Open Popover</span>}
          content={<div>Popover Content</div>}
          classMap={classNames}
          data-testid="popover"
          aria-labelledby="external-popover-label"
        />
      </>,
    );

    fireEvent.click(screen.getByTestId("popover-trigger"));

    const content = screen.getByRole("dialog", {
      name: /external popover label/i,
    });

    expect(content).toBeInTheDocument();
    expect(content).toHaveAttribute(
      "aria-labelledby",
      "external-popover-label",
    );
  });

  it("uses the fallback screen-reader label when no aria-label or aria-labelledby is provided", () => {
    renderPopover();

    fireEvent.click(screen.getByTestId("popover-trigger"));

    const content = screen.getByTestId("popover-content");
    const labelledBy = content.getAttribute("aria-labelledby");

    expect(labelledBy).toBeTruthy();

    const fallbackLabel = document.getElementById(labelledBy as string);
    expect(fallbackLabel).toBeInTheDocument();
    expect(fallbackLabel).toHaveTextContent("Popover Content");
  });

  it("applies aria-describedby to the popover content when provided", () => {
    render(
      <>
        <p id="popover-description">This popover provides more context.</p>
        <BasePopover
          trigger={<span>Open Popover</span>}
          content={<div>Popover Content</div>}
          classMap={classNames}
          data-testid="popover"
          aria-describedby="popover-description"
        />
      </>,
    );

    fireEvent.click(screen.getByTestId("popover-trigger"));

    expect(screen.getByTestId("popover-content")).toHaveAttribute(
      "aria-describedby",
      "popover-description",
    );
  });

  it("applies aria-modal when role is dialog", () => {
    render(
      <BasePopover
        trigger={<span>Open Popover</span>}
        content={<div>Popover Content</div>}
        classMap={classNames}
        data-testid="popover"
        aria-modal={true}
        role="dialog"
      />,
    );

    fireEvent.click(screen.getByTestId("popover-trigger"));

    expect(screen.getByTestId("popover-content")).toHaveAttribute(
      "aria-modal",
      "true",
    );
  });

  it("does not apply aria-modal when role is not dialog", () => {
    render(
      <BasePopover
        trigger={<span>Open Popover</span>}
        content={<div>Popover Content</div>}
        classMap={classNames}
        data-testid="popover"
        aria-modal={true}
        role="menu"
      />,
    );

    fireEvent.click(screen.getByTestId("popover-trigger"));

    expect(screen.getByTestId("popover-content")).not.toHaveAttribute(
      "aria-modal",
    );
  });

  it("does not open when disabled", () => {
    renderPopover({ disabled: true });

    const trigger = screen.getByTestId("popover-trigger");
    expect(trigger).toBeDisabled();

    fireEvent.click(trigger);
    expect(screen.queryByTestId("popover-content")).not.toBeInTheDocument();
  });

  it("applies placement, theme, rounding, shadow, and state classes", () => {
    renderPopover({
      placement: "bottom",
      theme: "primary",
      rounding: "medium",
      shadow: "medium",
      state: "success",
      glass: true,
    });

    fireEvent.click(screen.getByTestId("popover-trigger"));

    expect(screen.getByTestId("popover-content")).toHaveClass(
      "popoverContent",
      "placementBottom",
      "themePrimary",
      "glass",
      "roundMedium",
      "shadowMedium",
      "stateSuccess",
    );
  });

  it("keeps the popover open when clicking the trigger again only if toggled intentionally", () => {
    renderPopover();

    const trigger = screen.getByTestId("popover-trigger");

    fireEvent.click(trigger);
    expect(screen.getByTestId("popover-content")).toBeInTheDocument();

    fireEvent.click(trigger);
    expect(screen.queryByTestId("popover-content")).not.toBeInTheDocument();
  });

  it("has no accessibility violations when open as a dialog", async () => {
    const { container } = render(
      <BasePopover
        trigger={<span>Open Popover</span>}
        content={
          <div>
            <p>Popover Content</p>
            <button type="button">Confirm</button>
          </div>
        }
        classMap={classNames}
        data-testid="popover"
        triggerAriaLabel="Open popover"
      />,
    );

    fireEvent.click(screen.getByTestId("popover-trigger"));

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations when open as a tooltip", async () => {
    const { container } = render(
      <BasePopover
        trigger={<span>Info</span>}
        content={<div>Helpful tooltip text</div>}
        classMap={classNames}
        data-testid="popover"
        role="tooltip"
        triggerAriaLabel="Show tooltip"
      />,
    );

    fireEvent.click(screen.getByTestId("popover-trigger"));

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
