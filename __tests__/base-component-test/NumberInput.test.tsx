import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { axe, toHaveNoViolations } from "jest-axe";
import NumberInputBase from "@/components/NumberInput/NumberInputBase";

expect.extend(toHaveNoViolations);

const classMap = {
  large: "large",
  container: "container",
  label: "label",
  labelTop: "labelTop",
  labelBottom: "labelBottom",
  labelLeft: "labelLeft",
  labelRight: "labelRight",
  numberInput: "numberInput",
  input: "input",
  controls: "controls",
  controlButton: "controlButton",
  srOnly: "srOnly",
  primary: "primary",
  secondary: "secondary",
  success: "success",
  error: "error",
  clear: "clear",
  disabled: "disabled",
  shadowLight: "shadowLight",
  shadowStrong: "shadowStrong",
  roundMedium: "roundMedium",
  roundLarge: "roundLarge",
  glass: "glass",
  outline: "outline",
};

const renderNumberInput = (
  props: Partial<React.ComponentProps<typeof NumberInputBase>> = {},
) =>
  render(<NumberInputBase label="Quantity" classMap={classMap} {...props} />);

describe("NumberInputBase", () => {
  it("applies the selected size class", () => {
    renderNumberInput({ size: "large" });
    expect(screen.getByTestId("number-input-wrapper")).toHaveClass("large");
  });

  it("renders a labelled native number input", () => {
    renderNumberInput({ value: 3 });

    const input = screen.getByRole("spinbutton", { name: "Quantity" });
    expect(input).toHaveAttribute("type", "number");
    expect(input).toHaveValue(3);
    expect(screen.getByTestId("number-input-label")).toHaveTextContent(
      "Quantity",
    );
  });

  it("emits numeric values from user input", () => {
    const onChange = jest.fn();
    const onValueChange = jest.fn();
    renderNumberInput({ onChange, onValueChange });

    fireEvent.change(screen.getByTestId("number-input-input"), {
      target: { value: "42" },
    });

    expect(onChange).toHaveBeenCalledWith(42, expect.any(Object));
    expect(onValueChange).toHaveBeenCalledWith(42);
  });

  it("emits an empty string when the input is cleared", () => {
    const onChange = jest.fn();
    const onValueChange = jest.fn();
    renderNumberInput({ defaultValue: 4, onChange, onValueChange });

    fireEvent.change(screen.getByTestId("number-input-input"), {
      target: { value: "" },
    });

    expect(onChange).toHaveBeenCalledWith("", expect.any(Object));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("increments and decrements uncontrolled values", () => {
    const onValueChange = jest.fn();
    renderNumberInput({ defaultValue: 2, step: 0.5, onValueChange });

    fireEvent.click(screen.getByTestId("number-input-increment"));
    expect(screen.getByTestId("number-input-input")).toHaveValue(2.5);
    expect(onValueChange).toHaveBeenCalledWith(2.5);

    fireEvent.click(screen.getByTestId("number-input-decrement"));
    expect(screen.getByTestId("number-input-input")).toHaveValue(2);
    expect(onValueChange).toHaveBeenCalledWith(2);
  });

  it("clamps stepper controls to min and max", () => {
    renderNumberInput({ defaultValue: 10, min: 0, max: 10 });

    expect(screen.getByTestId("number-input-increment")).toBeDisabled();

    fireEvent.click(screen.getByTestId("number-input-decrement"));
    expect(screen.getByTestId("number-input-input")).toHaveValue(9);
  });

  it("clamps values on blur by default", () => {
    const onValueChange = jest.fn();
    renderNumberInput({ defaultValue: 5, min: 0, max: 10, onValueChange });

    const input = screen.getByTestId("number-input-input");
    fireEvent.change(input, { target: { value: "12" } });
    fireEvent.blur(input);

    expect(input).toHaveValue(10);
    expect(onValueChange).toHaveBeenCalledWith(10);
  });

  it("can hide stepper controls", () => {
    renderNumberInput({ showControls: false });

    expect(
      screen.queryByTestId("number-input-controls"),
    ).not.toBeInTheDocument();
  });

  it("uses aria-label when no visible label is provided", () => {
    renderNumberInput({ label: undefined, "aria-label": "Item count" });

    expect(
      screen.getByRole("spinbutton", { name: "Item count" }),
    ).toBeInTheDocument();
  });

  it("connects screen-reader-only text with aria-describedby", () => {
    renderNumberInput({
      id: "quantity",
      srOnlyText: "Use whole numbers only",
    });

    expect(screen.getByTestId("number-input-sr-only-text")).toHaveTextContent(
      "Use whole numbers only",
    );
    expect(screen.getByTestId("number-input-input")).toHaveAttribute(
      "aria-describedby",
      "quantity-sr-description",
    );
  });

  it("applies theme, state, outline, glass, rounding, and shadow classes", () => {
    renderNumberInput({
      theme: "secondary",
      state: "success",
      variant: "glassOutline",
      rounding: "large",
      shadow: "strong",
    });

    const wrapper = screen.getByTestId("number-input-wrapper");
    expect(wrapper).toHaveClass("numberInput");
    expect(wrapper).toHaveClass("secondary");
    expect(wrapper).toHaveClass("success");
    expect(wrapper).toHaveClass("outline");
    expect(wrapper).toHaveClass("glass");
    expect(wrapper).toHaveClass("roundLarge");
    expect(wrapper).toHaveClass("shadowStrong");
  });

  it("applies label position and custom class names", () => {
    renderNumberInput({
      labelPosition: "left",
      containerClassName: "customContainer",
      labelClassName: "customLabel",
      inputClassName: "customInput",
      controlsClassName: "customControls",
    });

    expect(screen.getByTestId("number-input")).toHaveClass("labelLeft");
    expect(screen.getByTestId("number-input")).toHaveClass("customContainer");
    expect(screen.getByTestId("number-input-label")).toHaveClass("customLabel");
    expect(screen.getByTestId("number-input-input")).toHaveClass("customInput");
    expect(screen.getByTestId("number-input-controls")).toHaveClass(
      "customControls",
    );
  });

  it("disables input and controls when disabled", () => {
    renderNumberInput({ disabled: true });

    expect(screen.getByTestId("number-input-wrapper")).toHaveClass("disabled");
    expect(screen.getByTestId("number-input-input")).toBeDisabled();
    expect(screen.getByTestId("number-input-increment")).toBeDisabled();
    expect(screen.getByTestId("number-input-decrement")).toBeDisabled();
  });

  it("forwards refs to the input", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<NumberInputBase label="Quantity" classMap={classMap} ref={ref} />);

    expect(ref.current).toBe(screen.getByTestId("number-input-input"));
  });

  it("has no accessibility violations", async () => {
    const { container } = renderNumberInput({
      defaultValue: 3,
      min: 0,
      max: 10,
      srOnlyText: "Quantity between zero and ten",
    });

    expect(await axe(container)).toHaveNoViolations();
  });
});
