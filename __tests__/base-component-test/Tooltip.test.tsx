import React, { createRef } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import TooltipBase from "@/components/Tooltip/TooltipBase";

expect.extend(toHaveNoViolations);

const mockStyles = {
  container: "tooltipContainer",
  triggerWrapper: "triggerWrapper",
  tooltip: "tooltip",
  glass: "glass",

  top: "top",
  bottom: "bottom",
  left: "left",
  right: "right",

  primary: "primary",
  secondary: "secondary",
  tertiary: "tertiary",
  quaternary: "quaternary",
  clear: "clear",

  success: "success",
  error: "error",
  warning: "warning",
  disabled: "disabled",

  visible: "visible",

  roundSmall: "roundSmall",
  roundMedium: "roundMedium",
  roundLarge: "roundLarge",

  shadowLight: "shadowLight",
  shadowMedium: "shadowMedium",
  shadowStrong: "shadowStrong",
};

describe("TooltipBase", () => {
  it("renders the trigger and tooltip with the expected default attributes", () => {
    render(
      <TooltipBase content="Tooltip content" classMap={mockStyles}>
        <button type="button">Hover me</button>
      </TooltipBase>,
    );

    const container = screen.getByTestId("tooltip-container");
    const trigger = screen.getByTestId("tooltip-trigger");
    const tooltip = screen.getByTestId("tooltip");

    expect(container).toBeInTheDocument();
    expect(trigger).toBeInTheDocument();
    expect(tooltip).toBeInTheDocument();

    expect(tooltip).toHaveAttribute("role", "tooltip");
    expect(tooltip).toHaveAttribute("aria-hidden", "true");
    expect(tooltip).not.toHaveClass("visible");

    expect(tooltip).toHaveTextContent("Tooltip content");
    expect(tooltip).toHaveClass("tooltip");
    expect(tooltip).toHaveClass("top");
    expect(tooltip).toHaveClass("primary");
    expect(tooltip).toHaveClass("roundMedium");
    expect(tooltip).toHaveClass("shadowLight");
  });

  it("shows and hides the tooltip on mouse enter and mouse leave", () => {
    render(
      <TooltipBase content="Hover tooltip" classMap={mockStyles}>
        <button type="button">Hover me</button>
      </TooltipBase>,
    );

    const trigger = screen.getByTestId("tooltip-trigger");
    const tooltip = screen.getByTestId("tooltip");

    expect(tooltip).toHaveAttribute("aria-hidden", "true");
    expect(tooltip).not.toHaveClass("visible");

    fireEvent.mouseEnter(trigger);
    expect(tooltip).toHaveAttribute("aria-hidden", "false");
    expect(tooltip).toHaveClass("visible");
    expect(trigger).toHaveAttribute("aria-describedby", tooltip.id);

    fireEvent.mouseLeave(trigger);
    expect(tooltip).toHaveAttribute("aria-hidden", "true");
    expect(tooltip).not.toHaveClass("visible");
    expect(trigger).not.toHaveAttribute("aria-describedby");
  });

  it("shows and hides the tooltip on focus and blur", () => {
    render(
      <TooltipBase content="Focus tooltip" classMap={mockStyles}>
        <button type="button">Focus me</button>
      </TooltipBase>,
    );

    const trigger = screen.getByTestId("tooltip-trigger");
    const tooltip = screen.getByTestId("tooltip");

    expect(trigger).not.toHaveAttribute("aria-describedby");

    fireEvent.focus(trigger);
    expect(tooltip).toHaveAttribute("aria-hidden", "false");
    expect(tooltip).toHaveClass("visible");
    expect(trigger).toHaveAttribute("aria-describedby", tooltip.id);

    fireEvent.blur(trigger);
    expect(tooltip).toHaveAttribute("aria-hidden", "true");
    expect(tooltip).not.toHaveClass("visible");
    expect(trigger).not.toHaveAttribute("aria-describedby");
  });

  it("hides the tooltip when Escape is pressed while visible", () => {
    render(
      <TooltipBase content="Escape tooltip" classMap={mockStyles}>
        <button type="button">Press escape</button>
      </TooltipBase>,
    );

    const trigger = screen.getByTestId("tooltip-trigger");
    const tooltip = screen.getByTestId("tooltip");

    fireEvent.focus(trigger);
    expect(tooltip).toHaveClass("visible");

    fireEvent.keyDown(document, { key: "Escape" });
    expect(tooltip).not.toHaveClass("visible");
    expect(tooltip).toHaveAttribute("aria-hidden", "true");
  });

  it("does not fail when Escape is pressed while the tooltip is hidden", () => {
    render(
      <TooltipBase content="Hidden tooltip" classMap={mockStyles}>
        <button type="button">Hidden</button>
      </TooltipBase>,
    );

    const tooltip = screen.getByTestId("tooltip");

    fireEvent.keyDown(document, { key: "Escape" });

    expect(tooltip).toHaveAttribute("aria-hidden", "true");
    expect(tooltip).not.toHaveClass("visible");
  });

  it("applies custom position, theme, state, glass, rounding, and shadow classes", () => {
    render(
      <TooltipBase
        content="Styled tooltip"
        position="bottom"
        theme="secondary"
        state="error"
        glass
        rounding="large"
        shadow="strong"
        classMap={mockStyles}
      >
        <button type="button">Styled trigger</button>
      </TooltipBase>,
    );

    const tooltip = screen.getByTestId("tooltip");

    expect(tooltip).toHaveClass("tooltip");
    expect(tooltip).toHaveClass("bottom");
    expect(tooltip).toHaveClass("secondary");
    expect(tooltip).toHaveClass("error");
    expect(tooltip).toHaveClass("glass");
    expect(tooltip).toHaveClass("roundLarge");
    expect(tooltip).toHaveClass("shadowStrong");
  });

  it("applies the provided className to the outer container", () => {
    render(
      <TooltipBase
        content="Container class test"
        classMap={mockStyles}
        className="customContainer"
      >
        <button type="button">Child</button>
      </TooltipBase>,
    );

    expect(screen.getByTestId("tooltip-container")).toHaveClass(
      "tooltipContainer",
      "customContainer",
    );
  });

  it("supports a custom tooltip id", () => {
    render(
      <TooltipBase
        id="custom-tooltip-id"
        content="Custom id tooltip"
        classMap={mockStyles}
      >
        <button type="button">Trigger</button>
      </TooltipBase>,
    );

    const tooltip = screen.getByTestId("tooltip");
    expect(tooltip).toHaveAttribute("id", "custom-tooltip-id");
  });

  it("supports a custom trigger id", () => {
    render(
      <TooltipBase
        triggerId="custom-trigger-id"
        content="Trigger id tooltip"
        classMap={mockStyles}
      >
        <button type="button">Trigger</button>
      </TooltipBase>,
    );

    expect(screen.getByTestId("tooltip-trigger")).toHaveAttribute(
      "id",
      "custom-trigger-id",
    );
  });

  it("applies aria-label to the tooltip element", () => {
    render(
      <TooltipBase
        content="Tooltip content"
        aria-label="Helpful tooltip"
        classMap={mockStyles}
      >
        <button type="button">Trigger</button>
      </TooltipBase>,
    );

    expect(screen.getByTestId("tooltip")).toHaveAttribute(
      "aria-label",
      "Helpful tooltip",
    );
  });

  it("applies aria-labelledby to the tooltip element", () => {
    render(
      <>
        <span id="tooltip-label">Tooltip Label</span>
        <TooltipBase
          content="Tooltip content"
          aria-labelledby="tooltip-label"
          classMap={mockStyles}
        >
          <button type="button">Trigger</button>
        </TooltipBase>
      </>,
    );

    expect(screen.getByTestId("tooltip")).toHaveAttribute(
      "aria-labelledby",
      "tooltip-label",
    );
  });

  it("applies triggerAriaLabel to the trigger element", () => {
    render(
      <TooltipBase
        content="Tooltip content"
        triggerAriaLabel="Open help"
        classMap={mockStyles}
      >
        <button type="button" title="test button" />
      </TooltipBase>,
    );

    expect(screen.getByTestId("tooltip-trigger")).toHaveAttribute(
      "aria-label",
      "Open help",
    );
  });

  it("applies triggerAriaLabelledBy to the trigger element", () => {
    render(
      <>
        <span id="external-trigger-label">External Trigger Label</span>
        <TooltipBase
          content="Tooltip content"
          triggerAriaLabelledBy="external-trigger-label"
          classMap={mockStyles}
        >
          <button type="button" title="test button" />
        </TooltipBase>
      </>,
    );

    expect(screen.getByTestId("tooltip-trigger")).toHaveAttribute(
      "aria-labelledby",
      "external-trigger-label",
    );
  });

  it("merges triggerAriaDescribedBy with the tooltip id when visible", () => {
    render(
      <TooltipBase
        content="Tooltip content"
        triggerAriaDescribedBy="extra-description"
        classMap={mockStyles}
      >
        <button type="button">Trigger</button>
      </TooltipBase>,
    );

    const trigger = screen.getByTestId("tooltip-trigger");
    const tooltip = screen.getByTestId("tooltip");

    fireEvent.focus(trigger);

    expect(trigger).toHaveAttribute(
      "aria-describedby",
      `extra-description ${tooltip.id}`,
    );
  });

  it("preserves an existing child aria-describedby and merges it with the tooltip id when visible", () => {
    render(
      <TooltipBase content="Tooltip content" classMap={mockStyles}>
        <button type="button" aria-describedby="existing-description">
          Trigger
        </button>
      </TooltipBase>,
    );

    const trigger = screen.getByTestId("tooltip-trigger");
    const tooltip = screen.getByTestId("tooltip");

    fireEvent.focus(trigger);

    expect(trigger).toHaveAttribute(
      "aria-describedby",
      `existing-description ${tooltip.id}`,
    );
  });

  it("merges existing child aria-describedby with triggerAriaDescribedBy and tooltip id", () => {
    render(
      <TooltipBase
        content="Tooltip content"
        triggerAriaDescribedBy="extra-description"
        classMap={mockStyles}
      >
        <button type="button" aria-describedby="existing-description">
          Trigger
        </button>
      </TooltipBase>,
    );

    const trigger = screen.getByTestId("tooltip-trigger");
    const tooltip = screen.getByTestId("tooltip");

    fireEvent.focus(trigger);

    expect(trigger).toHaveAttribute(
      "aria-describedby",
      `existing-description extra-description ${tooltip.id}`,
    );
  });

  it("does not override an existing child aria-label unless triggerAriaLabel is provided", () => {
    render(
      <TooltipBase content="Tooltip content" classMap={mockStyles}>
        <button type="button" aria-label="Existing label">
          Trigger
        </button>
      </TooltipBase>,
    );

    expect(screen.getByTestId("tooltip-trigger")).toHaveAttribute(
      "aria-label",
      "Existing label",
    );
  });

  it("overrides an existing child aria-label when triggerAriaLabel is provided", () => {
    render(
      <TooltipBase
        content="Tooltip content"
        triggerAriaLabel="Override label"
        classMap={mockStyles}
      >
        <button type="button" aria-label="Existing label">
          Trigger
        </button>
      </TooltipBase>,
    );

    expect(screen.getByTestId("tooltip-trigger")).toHaveAttribute(
      "aria-label",
      "Override label",
    );
  });

  it("does not override an existing child aria-labelledby unless triggerAriaLabelledBy is provided", () => {
    render(
      <>
        <span id="existing-label">Existing Label</span>
        <TooltipBase content="Tooltip content" classMap={mockStyles}>
          <button type="button" aria-labelledby="existing-label">
            Trigger
          </button>
        </TooltipBase>
      </>,
    );

    expect(screen.getByTestId("tooltip-trigger")).toHaveAttribute(
      "aria-labelledby",
      "existing-label",
    );
  });

  it("overrides an existing child aria-labelledby when triggerAriaLabelledBy is provided", () => {
    render(
      <>
        <span id="override-label">Override Label</span>
        <TooltipBase
          content="Tooltip content"
          triggerAriaLabelledBy="override-label"
          classMap={mockStyles}
        >
          <button type="button" aria-labelledby="existing-label">
            Trigger
          </button>
        </TooltipBase>
      </>,
    );

    expect(screen.getByTestId("tooltip-trigger")).toHaveAttribute(
      "aria-labelledby",
      "override-label",
    );
  });

  it("preserves child onMouseEnter and onMouseLeave handlers", () => {
    const handleMouseEnter = jest.fn();
    const handleMouseLeave = jest.fn();

    render(
      <TooltipBase content="Tooltip content" classMap={mockStyles}>
        <button
          type="button"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Trigger
        </button>
      </TooltipBase>,
    );

    const trigger = screen.getByTestId("tooltip-trigger");
    const tooltip = screen.getByTestId("tooltip");

    fireEvent.mouseEnter(trigger);
    expect(handleMouseEnter).toHaveBeenCalledTimes(1);
    expect(tooltip).toHaveClass("visible");

    fireEvent.mouseLeave(trigger);
    expect(handleMouseLeave).toHaveBeenCalledTimes(1);
    expect(tooltip).not.toHaveClass("visible");
  });

  it("preserves child onFocus and onBlur handlers", () => {
    const handleFocus = jest.fn();
    const handleBlur = jest.fn();

    render(
      <TooltipBase content="Tooltip content" classMap={mockStyles}>
        <button type="button" onFocus={handleFocus} onBlur={handleBlur}>
          Trigger
        </button>
      </TooltipBase>,
    );

    const trigger = screen.getByTestId("tooltip-trigger");
    const tooltip = screen.getByTestId("tooltip");

    fireEvent.focus(trigger);
    expect(handleFocus).toHaveBeenCalledTimes(1);
    expect(tooltip).toHaveClass("visible");

    fireEvent.blur(trigger);
    expect(handleBlur).toHaveBeenCalledTimes(1);
    expect(tooltip).not.toHaveClass("visible");
  });

  it("adds tabIndex=0 to a valid but non-focusable child element", () => {
    render(
      <TooltipBase content="Tooltip content" classMap={mockStyles}>
        <div>Focusable wrapper</div>
      </TooltipBase>,
    );

    expect(screen.getByTestId("tooltip-trigger")).toHaveAttribute(
      "tabindex",
      "0",
    );
  });

  it("does not add tabIndex when the child is naturally focusable", () => {
    render(
      <TooltipBase content="Tooltip content" classMap={mockStyles}>
        <button type="button">Focusable button</button>
      </TooltipBase>,
    );

    expect(screen.getByTestId("tooltip-trigger")).not.toHaveAttribute(
      "tabindex",
    );
  });

  it("does not override an existing child tabIndex", () => {
    render(
      <TooltipBase content="Tooltip content" classMap={mockStyles}>
        <div tabIndex={-1}>Custom tabindex</div>
      </TooltipBase>,
    );

    expect(screen.getByTestId("tooltip-trigger")).toHaveAttribute(
      "tabindex",
      "-1",
    );
  });

  it("wraps non-element children in a focusable span trigger", () => {
    render(
      <TooltipBase content="Tooltip content" classMap={mockStyles}>
        Plain text trigger
      </TooltipBase>,
    );

    const trigger = screen.getByTestId("tooltip-trigger");

    expect(trigger.tagName.toLowerCase()).toBe("span");
    expect(trigger).toHaveAttribute("tabindex", "0");
    expect(trigger).toHaveClass("triggerWrapper");
  });

  it("supports accessible props on the wrapped span trigger for non-element children", () => {
    render(
      <TooltipBase
        content="Tooltip content"
        triggerId="wrapped-trigger"
        triggerAriaLabel="Wrapped label"
        triggerAriaLabelledBy="wrapped-labelledby"
        triggerAriaDescribedBy="wrapped-description"
        classMap={mockStyles}
      >
        Wrapped trigger
      </TooltipBase>,
    );

    const trigger = screen.getByTestId("tooltip-trigger");

    expect(trigger).toHaveAttribute("id", "wrapped-trigger");
    expect(trigger).toHaveAttribute("aria-label", "Wrapped label");
    expect(trigger).toHaveAttribute("aria-labelledby", "wrapped-labelledby");
    expect(trigger).toHaveAttribute("aria-describedby", "wrapped-description");
  });

  it("removes the tooltip from the DOM when keepMountedWhenHidden is false and hidden", () => {
    render(
      <TooltipBase
        content="Conditional tooltip"
        keepMountedWhenHidden={false}
        classMap={mockStyles}
      >
        <button type="button">Trigger</button>
      </TooltipBase>,
    );

    expect(screen.queryByTestId("tooltip")).not.toBeInTheDocument();
  });

  it("renders the tooltip when keepMountedWhenHidden is false and it becomes visible", () => {
    render(
      <TooltipBase
        content="Conditional tooltip"
        keepMountedWhenHidden={false}
        classMap={mockStyles}
      >
        <button type="button">Trigger</button>
      </TooltipBase>,
    );

    const trigger = screen.getByTestId("tooltip-trigger");

    fireEvent.focus(trigger);

    const tooltip = screen.getByTestId("tooltip");
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveClass("visible");
    expect(tooltip).toHaveAttribute("aria-hidden", "false");
  });

  it("uses a custom data-testid prefix consistently", () => {
    render(
      <TooltipBase
        content="Custom ids"
        data-testid="custom-tooltip"
        classMap={mockStyles}
      >
        <button type="button">Trigger</button>
      </TooltipBase>,
    );

    expect(screen.getByTestId("custom-tooltip-container")).toBeInTheDocument();
    expect(screen.getByTestId("custom-tooltip-trigger")).toBeInTheDocument();
    expect(screen.getByTestId("custom-tooltip")).toBeInTheDocument();
  });

  it("forwards the ref to the tooltip element", () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <TooltipBase content="Ref tooltip" classMap={mockStyles} ref={ref}>
        <button type="button">Trigger</button>
      </TooltipBase>,
    );

    expect(ref.current).toBe(screen.getByTestId("tooltip"));
  });

  it("passes through extra div attributes to the tooltip element", () => {
    render(
      <TooltipBase
        content="Extra props"
        classMap={mockStyles}
        title="Tooltip title"
        aria-live="polite"
      >
        <button type="button">Trigger</button>
      </TooltipBase>,
    );

    const tooltip = screen.getByTestId("tooltip");
    expect(tooltip).toHaveAttribute("title", "Tooltip title");
    expect(tooltip).toHaveAttribute("aria-live", "polite");
  });

  describe("accessibility", () => {
    it("has no accessibility violations with a button trigger", async () => {
      const { container } = render(
        <TooltipBase content="Accessible tooltip" classMap={mockStyles}>
          <button type="button">Hover me</button>
        </TooltipBase>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has no accessibility violations with a wrapped text trigger", async () => {
      const { container } = render(
        <TooltipBase content="Wrapped accessible tooltip" classMap={mockStyles}>
          Wrapped text
        </TooltipBase>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
