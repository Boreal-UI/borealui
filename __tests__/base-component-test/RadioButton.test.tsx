import React, { createRef } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import BaseRadioButton from "@/components/RadioButton/RadioButtonBase";

expect.extend(toHaveNoViolations);

const mockClassNames = {
  wrapper: "radioWrapper",
  labelWrapper: "radioLabelWrapper",
  input: "radioInput",
  circle: "radioCircle",
  glass: "radioGlass",
  glassCircle: "radioGlassCircle",
  label: "radioLabel",

  primary: "themePrimary",
  secondary: "themeSecondary",

  success: "stateSuccess",
  error: "stateError",
  warning: "stateWarning",

  disabled: "radioDisabled",

  shadowSmall: "shadowSmall",
  shadowMedium: "shadowMedium",
  shadowStrong: "shadowStrong",

  roundSmall: "roundSmall",
  roundMedium: "roundMedium",
  roundLarge: "roundLarge",
};

describe("BaseRadioButton", () => {
  const defaultProps = {
    label: "Option A",
    value: "A",
    checked: false,
    onChange: jest.fn(),
    classMap: mockClassNames,
    "data-testid": "radio",
  } as const;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with label", () => {
    render(<BaseRadioButton {...defaultProps} />);

    expect(screen.getByTestId("radio-root")).toBeInTheDocument();
    expect(screen.getByTestId("radio-label-wrapper")).toBeInTheDocument();
    expect(screen.getByTestId("radio")).toBeInTheDocument();
    expect(screen.getByTestId("radio-circle")).toBeInTheDocument();
    expect(screen.getByTestId("radio-label")).toHaveTextContent("Option A");
    expect(screen.getByTestId("radio")).not.toBeChecked();
  });

  it("renders as checked when checked is true", () => {
    render(<BaseRadioButton {...defaultProps} checked={true} />);

    expect(screen.getByTestId("radio")).toBeChecked();
  });

  it("renders the correct input type and value", () => {
    render(<BaseRadioButton {...defaultProps} value="radio-value" />);

    const radio = screen.getByTestId("radio");

    expect(radio).toHaveAttribute("type", "radio");
    expect(radio).toHaveAttribute("value", "radio-value");
  });

  it("calls onChange with the radio value when selected", () => {
    const handleChange = jest.fn();

    render(
      <BaseRadioButton
        {...defaultProps}
        checked={false}
        value="B"
        label="Option B"
        onChange={handleChange}
      />,
    );

    fireEvent.click(screen.getByTestId("radio"));

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith("B");
  });

  it("does not call onChange when disabled and clicked", () => {
    const handleChange = jest.fn();

    render(
      <BaseRadioButton
        {...defaultProps}
        disabled={true}
        onChange={handleChange}
      />,
    );

    fireEvent.click(screen.getByTestId("radio"));

    expect(handleChange).not.toHaveBeenCalled();
  });

  it("disables input when disabled is true", () => {
    render(<BaseRadioButton {...defaultProps} disabled={true} />);

    expect(screen.getByTestId("radio")).toBeDisabled();
  });

  it("applies disabled class to the root when disabled", () => {
    render(<BaseRadioButton {...defaultProps} disabled={true} />);

    expect(screen.getByTestId("radio-root")).toHaveClass(
      "radioWrapper",
      "themePrimary",
      "radioDisabled",
    );
  });

  it("applies wrapper classes for theme, state, glass, disabled, and custom className", () => {
    render(
      <BaseRadioButton
        {...defaultProps}
        theme="secondary"
        state="error"
        glass
        disabled={true}
        className="customClass"
      />,
    );

    expect(screen.getByTestId("radio-root")).toHaveClass(
      "radioWrapper",
      "themeSecondary",
      "stateError",
      "radioGlass",
      "radioDisabled",
      "customClass",
    );
  });

  it("applies label wrapper class from classMap", () => {
    render(<BaseRadioButton {...defaultProps} />);

    expect(screen.getByTestId("radio-label-wrapper")).toHaveClass(
      "radioLabelWrapper",
    );
  });

  it("applies circle classes for glass, shadow, and rounding", () => {
    render(
      <BaseRadioButton
        {...defaultProps}
        glass
        shadow="medium"
        rounding="large"
      />,
    );

    expect(screen.getByTestId("radio-circle")).toHaveClass(
      "radioCircle",
      "radioGlassCircle",
      "shadowMedium",
      "roundLarge",
    );
  });

  it("applies input class from classMap", () => {
    render(<BaseRadioButton {...defaultProps} />);

    expect(screen.getByTestId("radio")).toHaveClass("radioInput");
  });

  it("applies label class from classMap", () => {
    render(<BaseRadioButton {...defaultProps} />);

    expect(screen.getByTestId("radio-label")).toHaveClass("radioLabel");
  });

  it("sets aria-labelledby from the visible label by default", () => {
    render(<BaseRadioButton {...defaultProps} />);

    const radio = screen.getByTestId("radio");
    const label = screen.getByTestId("radio-label");

    expect(label).toHaveAttribute("id");
    expect(radio).toHaveAttribute("aria-labelledby", label.id);
  });

  it("uses custom aria-labelledby when provided", () => {
    render(
      <>
        <span id="custom-label">Custom Accessible Label</span>
        <BaseRadioButton {...defaultProps} aria-labelledby="custom-label" />
      </>,
    );

    expect(screen.getByTestId("radio")).toHaveAttribute(
      "aria-labelledby",
      "custom-label",
    );
  });

  it("applies aria-label when provided", () => {
    render(
      <BaseRadioButton
        {...defaultProps}
        aria-label="Standalone radio option"
      />,
    );

    expect(screen.getByTestId("radio")).toHaveAttribute(
      "aria-label",
      "Standalone radio option",
    );
  });

  it("applies aria-describedby when provided", () => {
    render(
      <>
        <p id="radio-description">Helpful description</p>
        <BaseRadioButton
          {...defaultProps}
          aria-describedby="radio-description"
        />
      </>,
    );

    expect(screen.getByTestId("radio")).toHaveAttribute(
      "aria-describedby",
      "radio-description",
    );
  });

  it("applies aria-invalid when provided", () => {
    render(<BaseRadioButton {...defaultProps} aria-invalid={true} />);

    expect(screen.getByTestId("radio")).toHaveAttribute("aria-invalid", "true");
  });

  it("applies aria-required based on required when aria-required is not explicitly provided", () => {
    render(<BaseRadioButton {...defaultProps} required={true} />);

    const radio = screen.getByTestId("radio");

    expect(radio).toHaveAttribute("required");
    expect(radio).toHaveAttribute("aria-required", "true");
  });

  it("prefers explicit aria-required over required fallback", () => {
    render(
      <BaseRadioButton
        {...defaultProps}
        required={true}
        aria-required={false}
      />,
    );

    const radio = screen.getByTestId("radio");

    expect(radio).toHaveAttribute("required");
    expect(radio).toHaveAttribute("aria-required", "false");
  });

  it("passes through native input attributes", () => {
    render(
      <BaseRadioButton
        {...defaultProps}
        name="group-1"
        id="custom-radio-id"
        title="My radio title"
      />,
    );

    const radio = screen.getByTestId("radio");

    expect(radio).toHaveAttribute("name", "group-1");
    expect(radio).toHaveAttribute("id", "custom-radio-id");
    expect(radio).toHaveAttribute("title", "My radio title");
  });

  it("uses the provided id for the input and associates the label wrapper htmlFor correctly", () => {
    render(<BaseRadioButton {...defaultProps} id="my-radio-id" />);

    const labelWrapper = screen.getByTestId("radio-label-wrapper");
    const radio = screen.getByTestId("radio");

    expect(radio).toHaveAttribute("id", "my-radio-id");
    expect(labelWrapper).toHaveAttribute("for", "my-radio-id");
  });

  it("generates input and label ids when id is not provided", () => {
    render(<BaseRadioButton {...defaultProps} />);

    const radio = screen.getByTestId("radio");
    const label = screen.getByTestId("radio-label");

    expect(radio.getAttribute("id")).toContain("radio-input-");
    expect(label.getAttribute("id")).toContain("radio-label-");
  });

  it("renders the label before the input when labelPosition is left", () => {
    render(<BaseRadioButton {...defaultProps} labelPosition="left" />);

    const labelWrapper = screen.getByTestId("radio-label-wrapper");
    const label = screen.getByTestId("radio-label");
    const radio = screen.getByTestId("radio");

    expect(labelWrapper.compareDocumentPosition(label)).toBe(
      Node.DOCUMENT_POSITION_CONTAINED_BY | Node.DOCUMENT_POSITION_FOLLOWING,
    );

    expect(label.compareDocumentPosition(radio)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  it("renders the label after the circle when labelPosition is right", () => {
    render(<BaseRadioButton {...defaultProps} labelPosition="right" />);

    const circle = screen.getByTestId("radio-circle");
    const label = screen.getByTestId("radio-label");

    expect(circle.compareDocumentPosition(label)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  it("does not render a label when label is not provided", () => {
    render(<BaseRadioButton {...defaultProps} label={undefined} />);

    expect(screen.queryByTestId("radio-label")).not.toBeInTheDocument();
    expect(screen.getByTestId("radio")).not.toHaveAttribute("aria-labelledby");
  });

  it("marks the decorative circle as aria-hidden", () => {
    render(<BaseRadioButton {...defaultProps} />);

    expect(screen.getByTestId("radio-circle")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("forwards refs to the input element", () => {
    const ref = createRef<HTMLInputElement>();

    render(<BaseRadioButton {...defaultProps} ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current).toBe(screen.getByTestId("radio"));
  });

  it("supports focusing the input through the forwarded ref", () => {
    const ref = createRef<HTMLInputElement>();

    render(<BaseRadioButton {...defaultProps} ref={ref} />);

    ref.current?.focus();

    expect(screen.getByTestId("radio")).toHaveFocus();
  });

  it("is discoverable by role with its visible label", () => {
    render(<BaseRadioButton {...defaultProps} />);

    expect(screen.getByRole("radio", { name: "Option A" })).toBeInTheDocument();
  });

  it("allows selecting by clicking the label text", () => {
    const handleChange = jest.fn();

    render(
      <BaseRadioButton
        {...defaultProps}
        onChange={handleChange}
        value="label-click"
      />,
    );

    fireEvent.click(screen.getByTestId("radio-label"));

    expect(handleChange).toHaveBeenCalledWith("label-click");
  });

  it("allows selecting by clicking the label wrapper", () => {
    const handleChange = jest.fn();

    render(
      <BaseRadioButton
        {...defaultProps}
        onChange={handleChange}
        value="wrapper-click"
      />,
    );

    fireEvent.click(screen.getByTestId("radio-label-wrapper"));

    expect(handleChange).toHaveBeenCalledWith("wrapper-click");
  });

  it("does not reuse the same test id for root and label wrapper", () => {
    render(<BaseRadioButton {...defaultProps} />);

    expect(screen.getByTestId("radio-root")).toBeInTheDocument();
    expect(screen.getByTestId("radio-label-wrapper")).toBeInTheDocument();
    expect(screen.queryByTestId("radio-wrapper")).not.toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <BaseRadioButton {...defaultProps} aria-describedby="radio-help" />,
    );

    const helper = document.createElement("div");
    helper.id = "radio-help";
    helper.textContent = "This is helper text";
    container.appendChild(helper);

    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});
