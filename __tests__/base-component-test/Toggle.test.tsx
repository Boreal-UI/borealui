import { render, screen, fireEvent } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import ToggleBase from "@/components/Toggle/ToggleBase";

expect.extend(toHaveNoViolations);

const mockStyles = {
  container: "container",
  toggle: "toggle",
  glass: "glass",
  glassTrack: "glassTrack",
  active: "active",
  slider: "slider",
  label: "label",
  primary: "primary",
  secondary: "secondary",
  medium: "medium",
  small: "small",
  disabled: "disabled",
  shadowLight: "shadowLight",
  shadowMedium: "shadowMedium",
  roundSmall: "roundSmall",
  roundMedium: "roundMedium",
};

describe("ToggleBase", () => {
  it("is accessible with a visible label", async () => {
    const { container } = render(
      <ToggleBase
        checked={false}
        onChange={() => {}}
        label="Enable setting"
        classMap={mockStyles}
      />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders the wrapper, switch, slider, and label", () => {
    render(
      <ToggleBase
        checked={false}
        onChange={() => {}}
        label="Enable setting"
        classMap={mockStyles}
        data-testid="toggle"
      />,
    );

    expect(screen.getByTestId("toggle-wrapper")).toBeInTheDocument();
    expect(screen.getByTestId("toggle")).toBeInTheDocument();
    expect(screen.getByTestId("toggle-slider")).toBeInTheDocument();
    expect(screen.getByTestId("toggle-label")).toBeInTheDocument();
    expect(screen.getByText("Enable setting")).toBeInTheDocument();
  });

  it("applies the expected default accessibility attributes with a visible label", () => {
    render(
      <ToggleBase
        checked={false}
        onChange={() => {}}
        label="Enable setting"
        classMap={mockStyles}
      />,
    );

    const toggle = screen.getByRole("switch", { name: "Enable setting" });
    const label = screen.getByTestId("toggle-label");

    expect(toggle).toHaveAttribute("type", "button");
    expect(toggle).toHaveAttribute("role", "switch");
    expect(toggle).toHaveAttribute("aria-checked", "false");
    expect(toggle).toHaveAttribute("aria-labelledby", label.id);
    expect(toggle).not.toHaveAttribute("aria-label");
  });

  it("uses aria-label when no visible label is provided", () => {
    render(
      <ToggleBase
        checked={false}
        onChange={() => {}}
        aria-label="Hidden toggle label"
        classMap={mockStyles}
      />,
    );

    const toggle = screen.getByRole("switch", { name: "Hidden toggle label" });

    expect(toggle).toBeInTheDocument();
    expect(toggle).toHaveAttribute("aria-label", "Hidden toggle label");
    expect(screen.queryByTestId("toggle-label")).not.toBeInTheDocument();
  });

  it("falls back to the default aria-label when no label or aria-label is provided", () => {
    render(
      <ToggleBase checked={false} onChange={() => {}} classMap={mockStyles} />,
    );

    const toggle = screen.getByRole("switch", { name: "Toggle switch" });

    expect(toggle).toBeInTheDocument();
    expect(toggle).toHaveAttribute("aria-label", "Toggle switch");
  });

  it("prefers aria-labelledby over aria-label when both are provided", () => {
    render(
      <>
        <span id="external-toggle-label">External toggle label</span>
        <ToggleBase
          checked={false}
          onChange={() => {}}
          aria-label="Fallback label"
          aria-labelledby="external-toggle-label"
          classMap={mockStyles}
        />
      </>,
    );

    const toggle = screen.getByRole("switch", {
      name: "External toggle label",
    });

    expect(toggle).toBeInTheDocument();
    expect(toggle).toHaveAttribute("aria-labelledby", "external-toggle-label");
    expect(toggle).not.toHaveAttribute("aria-label");
  });

  it("uses external aria-labelledby instead of the internal label association when both exist", () => {
    render(
      <>
        <span id="external-toggle-label">External label</span>
        <ToggleBase
          checked={false}
          onChange={() => {}}
          label="Internal label"
          aria-labelledby="external-toggle-label"
          classMap={mockStyles}
        />
      </>,
    );

    const toggle = screen.getByRole("switch", { name: "External label" });

    expect(toggle).toHaveAttribute("aria-labelledby", "external-toggle-label");
    expect(toggle).not.toHaveAttribute("aria-label");
    expect(screen.queryByTestId("toggle-label")).not.toBeInTheDocument();
  });

  it("applies aria-describedby when provided", () => {
    render(
      <>
        <p id="toggle-help">This controls notifications.</p>
        <ToggleBase
          checked={false}
          onChange={() => {}}
          label="Notifications"
          aria-describedby="toggle-help"
          classMap={mockStyles}
        />
      </>,
    );

    expect(
      screen.getByRole("switch", { name: "Notifications" }),
    ).toHaveAttribute("aria-describedby", "toggle-help");
  });

  it("applies aria-invalid and aria-errormessage when provided", () => {
    render(
      <>
        <p id="toggle-error">This field is required.</p>
        <ToggleBase
          checked={false}
          onChange={() => {}}
          label="Required toggle"
          aria-invalid={true}
          aria-errormessage="toggle-error"
          classMap={mockStyles}
        />
      </>,
    );

    const toggle = screen.getByRole("switch", { name: "Required toggle" });

    expect(toggle).toHaveAttribute("aria-invalid", "true");
    expect(toggle).toHaveAttribute("aria-errormessage", "toggle-error");
  });

  it("calls onChange with true when clicked while unchecked", () => {
    const onChange = jest.fn();

    render(
      <ToggleBase
        checked={false}
        onChange={onChange}
        label="Click me"
        classMap={mockStyles}
      />,
    );

    fireEvent.click(screen.getByRole("switch", { name: "Click me" }));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("calls onChange with false when clicked while checked", () => {
    const onChange = jest.fn();

    render(
      <ToggleBase
        checked={true}
        onChange={onChange}
        label="Click me"
        classMap={mockStyles}
      />,
    );

    fireEvent.click(screen.getByRole("switch", { name: "Click me" }));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it("toggles on with Space key", () => {
    const onChange = jest.fn();

    render(
      <ToggleBase
        checked={false}
        onChange={onChange}
        label="Press space"
        classMap={mockStyles}
      />,
    );

    fireEvent.keyDown(screen.getByRole("switch", { name: "Press space" }), {
      key: " ",
    });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("toggles on with Enter key", () => {
    const onChange = jest.fn();

    render(
      <ToggleBase
        checked={false}
        onChange={onChange}
        label="Press enter"
        classMap={mockStyles}
      />,
    );

    fireEvent.keyDown(screen.getByRole("switch", { name: "Press enter" }), {
      key: "Enter",
    });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("sets checked state to true with ArrowRight", () => {
    const onChange = jest.fn();

    render(
      <ToggleBase
        checked={false}
        onChange={onChange}
        label="Arrow right"
        classMap={mockStyles}
      />,
    );

    fireEvent.keyDown(screen.getByRole("switch", { name: "Arrow right" }), {
      key: "ArrowRight",
    });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("does not call onChange with ArrowRight when already checked", () => {
    const onChange = jest.fn();

    render(
      <ToggleBase
        checked={true}
        onChange={onChange}
        label="Already on"
        classMap={mockStyles}
      />,
    );

    fireEvent.keyDown(screen.getByRole("switch", { name: "Already on" }), {
      key: "ArrowRight",
    });

    expect(onChange).not.toHaveBeenCalled();
  });

  it("sets checked state to false with ArrowLeft", () => {
    const onChange = jest.fn();

    render(
      <ToggleBase
        checked={true}
        onChange={onChange}
        label="Arrow left"
        classMap={mockStyles}
      />,
    );

    fireEvent.keyDown(screen.getByRole("switch", { name: "Arrow left" }), {
      key: "ArrowLeft",
    });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it("does not call onChange with ArrowLeft when already unchecked", () => {
    const onChange = jest.fn();

    render(
      <ToggleBase
        checked={false}
        onChange={onChange}
        label="Already off"
        classMap={mockStyles}
      />,
    );

    fireEvent.keyDown(screen.getByRole("switch", { name: "Already off" }), {
      key: "ArrowLeft",
    });

    expect(onChange).not.toHaveBeenCalled();
  });

  it("does not react to unsupported keyboard keys", () => {
    const onChange = jest.fn();

    render(
      <ToggleBase
        checked={false}
        onChange={onChange}
        label="Ignore keys"
        classMap={mockStyles}
      />,
    );

    fireEvent.keyDown(screen.getByRole("switch", { name: "Ignore keys" }), {
      key: "Escape",
    });

    expect(onChange).not.toHaveBeenCalled();
  });

  it("is disabled and does not call onChange on click or keyboard interaction", () => {
    const onChange = jest.fn();

    render(
      <ToggleBase
        checked={false}
        onChange={onChange}
        label="Disabled"
        disabled
        classMap={mockStyles}
      />,
    );

    const toggle = screen.getByRole("switch", { name: "Disabled" });

    expect(toggle).toBeDisabled();
    expect(toggle).toHaveAttribute("aria-disabled", "true");

    fireEvent.click(toggle);
    fireEvent.keyDown(toggle, { key: " " });
    fireEvent.keyDown(toggle, { key: "Enter" });
    fireEvent.keyDown(toggle, { key: "ArrowRight" });
    fireEvent.keyDown(toggle, { key: "ArrowLeft" });

    expect(onChange).not.toHaveBeenCalled();
  });

  it("applies checked styling when checked", () => {
    render(
      <ToggleBase
        checked={true}
        onChange={() => {}}
        label="Active toggle"
        classMap={mockStyles}
      />,
    );

    expect(screen.getByRole("switch", { name: "Active toggle" })).toHaveClass(
      "toggle",
      "active",
    );
  });

  it("does not apply checked styling when unchecked", () => {
    render(
      <ToggleBase
        checked={false}
        onChange={() => {}}
        label="Inactive toggle"
        classMap={mockStyles}
      />,
    );

    expect(screen.getByRole("switch", { name: "Inactive toggle" })).toHaveClass(
      "toggle",
    );
    expect(
      screen.getByRole("switch", { name: "Inactive toggle" }),
    ).not.toHaveClass("active");
  });

  it("applies theme, glass, size, disabled, className, rounding, and shadow classes", () => {
    render(
      <ToggleBase
        checked={false}
        onChange={() => {}}
        label="Styled toggle"
        theme="primary"
        glass
        size="medium"
        rounding="medium"
        shadow="light"
        disabled
        className="customClass"
        classMap={mockStyles}
      />,
    );

    expect(screen.getByTestId("toggle-wrapper")).toHaveClass(
      "container",
      "primary",
      "glass",
      "medium",
      "disabled",
      "customClass",
    );

    expect(screen.getByRole("switch", { name: "Styled toggle" })).toHaveClass(
      "toggle",
      "glassTrack",
      "shadowLight",
      "roundMedium",
    );
  });

  it("uses a custom data-testid consistently", () => {
    render(
      <ToggleBase
        checked={false}
        onChange={() => {}}
        label="Custom test id"
        data-testid="custom-toggle"
        classMap={mockStyles}
      />,
    );

    expect(screen.getByTestId("custom-toggle-wrapper")).toBeInTheDocument();
    expect(screen.getByTestId("custom-toggle")).toBeInTheDocument();
    expect(screen.getByTestId("custom-toggle-slider")).toBeInTheDocument();
    expect(screen.getByTestId("custom-toggle-label")).toBeInTheDocument();
  });

  it("uses a custom id when provided", () => {
    render(
      <ToggleBase
        id="custom-toggle-id"
        checked={false}
        onChange={() => {}}
        label="Custom id toggle"
        classMap={mockStyles}
      />,
    );

    expect(
      screen.getByRole("switch", { name: "Custom id toggle" }),
    ).toHaveAttribute("id", "custom-toggle-id");
  });

  it("passes through tabIndex when provided", () => {
    render(
      <ToggleBase
        checked={false}
        onChange={() => {}}
        label="Focusable toggle"
        tabIndex={-1}
        classMap={mockStyles}
      />,
    );

    expect(
      screen.getByRole("switch", { name: "Focusable toggle" }),
    ).toHaveAttribute("tabindex", "-1");
  });

  it("updates aria-checked based on the controlled checked prop", () => {
    const { rerender } = render(
      <ToggleBase
        checked={false}
        onChange={() => {}}
        label="Controlled toggle"
        classMap={mockStyles}
      />,
    );

    expect(
      screen.getByRole("switch", { name: "Controlled toggle" }),
    ).toHaveAttribute("aria-checked", "false");

    rerender(
      <ToggleBase
        checked={true}
        onChange={() => {}}
        label="Controlled toggle"
        classMap={mockStyles}
      />,
    );

    expect(
      screen.getByRole("switch", { name: "Controlled toggle" }),
    ).toHaveAttribute("aria-checked", "true");
  });
});
