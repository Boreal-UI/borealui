import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { axe, toHaveNoViolations } from "jest-axe";
import TimePickerBase from "@/components/TimePicker/TimePickerBase";

expect.extend(toHaveNoViolations);

const classMap = {
  container: "container",
  label: "label",
  labelTop: "labelTop",
  labelBottom: "labelBottom",
  labelLeft: "labelLeft",
  labelRight: "labelRight",
  root: "root",
  inputWrapper: "inputWrapper",
  input: "input",
  button: "button",
  description: "description",
  helperText: "helperText",
  errorText: "errorText",
  loader: "loader",
  srOnly: "srOnly",
  fullWidth: "fullWidth",
  readOnly: "readOnly",
  primary: "primary",
  secondary: "secondary",
  success: "success",
  error: "error",
  clear: "clear",
  outline: "outline",
  glass: "glass",
  disabled: "disabled",
  loading: "loading",
  shadowLight: "shadowLight",
  shadowStrong: "shadowStrong",
  roundMedium: "roundMedium",
  roundLarge: "roundLarge",
};

const renderTimePicker = (
  props: Partial<React.ComponentProps<typeof TimePickerBase>> = {},
) =>
  render(<TimePickerBase label="Start time" classMap={classMap} {...props} />);

describe("TimePickerBase", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("renders a labelled native time input", () => {
    renderTimePicker({
      value: "09:30",
      name: "startTime",
      min: "08:00",
      max: "17:00",
      step: 900,
    });

    const input = screen.getByLabelText("Start time");
    expect(input).toHaveAttribute("type", "time");
    expect(input).toHaveValue("09:30");
    expect(input).toHaveAttribute("name", "startTime");
    expect(input).toHaveAttribute("min", "08:00");
    expect(input).toHaveAttribute("max", "17:00");
    expect(input).toHaveAttribute("step", "900");
  });

  it("falls back to an accessible label when no visible label is provided", () => {
    renderTimePicker({ label: undefined });

    expect(screen.getByLabelText("Time")).toBeInTheDocument();
  });

  it("emits string values from user input", () => {
    const onChange = jest.fn();
    renderTimePicker({ onChange });

    fireEvent.change(screen.getByTestId("time-picker-input"), {
      target: { value: "13:45" },
    });

    expect(onChange).toHaveBeenCalledWith("13:45");
  });

  it("connects description, helper text, error text, and screen-reader text", () => {
    renderTimePicker({
      id: "appointment",
      description: "Choose the appointment time",
      helperText: "Business hours only",
      srOnlyText: "Native time picker",
    });

    const input = screen.getByTestId("time-picker-input");
    expect(input).toHaveAttribute(
      "aria-describedby",
      "appointment-description appointment-helper appointment-sr-description",
    );
    expect(screen.getByTestId("time-picker-description")).toHaveTextContent(
      "Choose the appointment time",
    );
    expect(screen.getByTestId("time-picker-helper")).toHaveTextContent(
      "Business hours only",
    );
    expect(screen.getByTestId("time-picker-sr-only-text")).toHaveTextContent(
      "Native time picker",
    );
  });

  it("renders errors as alerts and marks the input invalid", () => {
    renderTimePicker({
      id: "appointment",
      helperText: "Business hours only",
      error: "Choose a valid time",
    });

    const input = screen.getByTestId("time-picker-input");
    const error = screen.getByRole("alert");

    expect(screen.queryByTestId("time-picker-helper")).not.toBeInTheDocument();
    expect(error).toHaveTextContent("Choose a valid time");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-errormessage", "appointment-error");
    expect(input).toHaveAttribute("aria-describedby", "appointment-error");
  });

  it("marks values outside min and max as invalid", () => {
    renderTimePicker({
      value: "07:30",
      min: "08:00",
      max: "17:00",
    });

    expect(screen.getByTestId("time-picker-input")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("applies theme, state, outline, glass, rounding, shadow, and full-width classes", () => {
    renderTimePicker({
      theme: "secondary",
      state: "success",
      outline: true,
      glass: true,
      rounding: "large",
      shadow: "strong",
      fullWidth: true,
    });

    const root = screen.getByTestId("time-picker-root");
    expect(screen.getByTestId("time-picker")).toHaveClass("fullWidth");
    expect(root).toHaveClass("root");
    expect(root).toHaveClass("secondary");
    expect(root).toHaveClass("success");
    expect(root).toHaveClass("outline");
    expect(root).toHaveClass("glass");
    expect(root).toHaveClass("roundLarge");
    expect(root).toHaveClass("shadowStrong");
    expect(root).toHaveClass("fullWidth");
  });

  it("applies label position and custom class names", () => {
    renderTimePicker({
      labelPosition: "left",
      containerClassName: "customContainer",
      labelClassName: "customLabel",
      inputWrapperClassName: "customWrapper",
      inputClassName: "customInput",
      buttonClassName: "customButton",
    });

    expect(screen.getByTestId("time-picker")).toHaveClass("labelLeft");
    expect(screen.getByTestId("time-picker")).toHaveClass("customContainer");
    expect(screen.getByTestId("time-picker-label")).toHaveClass("customLabel");
    expect(screen.getByTestId("time-picker-input-wrapper")).toHaveClass(
      "customWrapper",
    );
    expect(screen.getByTestId("time-picker-input")).toHaveClass("customInput");
    expect(screen.getByTestId("time-picker-button")).toHaveClass(
      "customButton",
    );
  });

  it("applies disabled, loading, required, and read-only states", () => {
    renderTimePicker({ disabled: true, loading: true, required: true });

    const root = screen.getByTestId("time-picker-root");
    const input = screen.getByTestId("time-picker-input");
    const button = screen.getByTestId("time-picker-button");

    expect(root).toHaveClass("disabled");
    expect(root).toHaveClass("loading");
    expect(root).toHaveAttribute("aria-busy", "true");
    expect(root).toHaveAttribute("aria-disabled", "true");
    expect(input).toBeDisabled();
    expect(input).toBeRequired();
    expect(input).toHaveAttribute("aria-required", "true");
    expect(button).toBeDisabled();
    expect(screen.getByTestId("time-picker-loader")).toBeInTheDocument();
  });

  it("disables the picker button when read-only", () => {
    renderTimePicker({ readOnly: true });

    expect(screen.getByTestId("time-picker-root")).toHaveClass("readOnly");
    expect(screen.getByTestId("time-picker-input")).toHaveAttribute("readonly");
    expect(screen.getByTestId("time-picker-button")).toBeDisabled();
  });

  it("opens the native picker or falls back to focus", () => {
    const showPicker = jest.fn();
    Object.defineProperty(HTMLInputElement.prototype, "showPicker", {
      configurable: true,
      value: showPicker,
    });

    renderTimePicker();
    fireEvent.click(screen.getByTestId("time-picker-button"));

    expect(showPicker).toHaveBeenCalledTimes(1);
  });

  it("forwards refs to the root", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<TimePickerBase label="Start time" classMap={classMap} ref={ref} />);

    expect(ref.current).toBe(screen.getByTestId("time-picker-root"));
  });

  it("has no accessibility violations", async () => {
    const { container } = renderTimePicker({
      description: "Choose a start time",
      helperText: "Use 24-hour time",
    });

    expect(await axe(container)).toHaveNoViolations();
  });
});
