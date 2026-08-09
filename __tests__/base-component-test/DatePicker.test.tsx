import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { axe, toHaveNoViolations } from "jest-axe";
import DatePickerBase from "@/components/DatePicker/DatePickerBase";

expect.extend(toHaveNoViolations);

const classMap = {
  large: "large",
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
  description: "helperText",
  helperText: "helperText",
  errorText: "error",
  loader: "loader",
  srOnly: "srOnly",
  fullWidth: "fullWidth",
  readOnly: "readOnly",
  primary: "primary",
  secondary: "secondary",
  success: "success",
  error: "error",
  clear: "clear",
  disabled: "disabled",
  loading: "loading",
  shadowLight: "shadowLight",
  shadowStrong: "shadowStrong",
  roundMedium: "roundMedium",
  roundLarge: "roundLarge",
  glass: "glass",
  outline: "outline",
};

const renderDatePicker = (
  props: Partial<React.ComponentProps<typeof DatePickerBase>> = {},
) =>
  render(<DatePickerBase label="Start date" classMap={classMap} {...props} />);

describe("DatePickerBase", () => {
  it("applies the selected size class", () => {
    renderDatePicker({ size: "large" });
    expect(screen.getByTestId("date-picker-root")).toHaveClass("large");
  });

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("renders a labelled native date input", () => {
    renderDatePicker({
      value: "2026-05-14",
      name: "startDate",
      min: "2026-01-01",
      max: "2026-12-31",
    });

    const input = screen.getByLabelText("Start date");
    expect(input).toHaveAttribute("type", "date");
    expect(input).toHaveValue("2026-05-14");
    expect(input).toHaveAttribute("name", "startDate");
    expect(input).toHaveAttribute("min", "2026-01-01");
    expect(input).toHaveAttribute("max", "2026-12-31");
  });

  it("falls back to an accessible label when no visible label is provided", () => {
    renderDatePicker({ label: undefined });

    expect(screen.getByLabelText("Date")).toBeInTheDocument();
  });

  it("emits string values from user input", () => {
    const onChange = jest.fn();
    renderDatePicker({ onChange });

    fireEvent.change(screen.getByTestId("date-picker-input"), {
      target: { value: "2026-06-01" },
    });

    expect(onChange).toHaveBeenCalledWith("2026-06-01");
  });

  it("connects helper and screen-reader text", () => {
    renderDatePicker({
      id: "deadline",
      helperText: "Weekdays are preferred",
      srOnlyText: "Native date picker",
    });

    const input = screen.getByTestId("date-picker-input");
    expect(input).toHaveAttribute(
      "aria-describedby",
      "deadline-helperText deadline-sr-helperText",
    );
    expect(screen.getByTestId("date-picker-helperText")).toHaveTextContent(
      "Weekdays are preferred",
    );
    expect(screen.getByTestId("date-picker-sr-only-text")).toHaveTextContent(
      "Native date picker",
    );
  });

  it("renders errors as alerts and marks the input invalid", () => {
    renderDatePicker({
      id: "deadline",
      helperText: "Weekdays are preferred",
      errorMessage: "Choose a valid date",
    });

    const input = screen.getByTestId("date-picker-input");
    const errorMessage = screen.getByRole("alert");

    expect(screen.getByTestId("date-picker-helperText")).toHaveTextContent(
      "Weekdays are preferred",
    );
    expect(errorMessage).toHaveTextContent("Choose a valid date");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-errormessage", "deadline-errorMessage");
    expect(input).toHaveAttribute(
      "aria-describedby",
      "deadline-helperText deadline-errorMessage",
    );
  });

  it("marks values outside min and max as invalid", () => {
    renderDatePicker({
      value: "2026-05-14",
      min: "2026-06-01",
      max: "2026-12-31",
    });

    expect(screen.getByTestId("date-picker-input")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("applies theme, state, outline, glass, rounding, shadow, and full-width classes", () => {
    renderDatePicker({
      theme: "secondary",
      state: "success",
      variant: "glassOutline",
      rounding: "large",
      shadow: "strong",
      fullWidth: true,
    });

    const root = screen.getByTestId("date-picker-root");
    expect(screen.getByTestId("date-picker")).toHaveClass("fullWidth");
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
    renderDatePicker({
      labelPosition: "left",
      containerClassName: "customContainer",
      labelClassName: "customLabel",
      inputWrapperClassName: "customWrapper",
      inputClassName: "customInput",
      buttonClassName: "customButton",
    });

    expect(screen.getByTestId("date-picker")).toHaveClass("labelLeft");
    expect(screen.getByTestId("date-picker")).toHaveClass("customContainer");
    expect(screen.getByTestId("date-picker-label")).toHaveClass("customLabel");
    expect(screen.getByTestId("date-picker-input-wrapper")).toHaveClass(
      "customWrapper",
    );
    expect(screen.getByTestId("date-picker-input")).toHaveClass("customInput");
    expect(screen.getByTestId("date-picker-button")).toHaveClass(
      "customButton",
    );
  });

  it("applies disabled, loading, required, and read-only states", () => {
    renderDatePicker({ disabled: true, loading: true, required: true });

    const root = screen.getByTestId("date-picker-root");
    const input = screen.getByTestId("date-picker-input");
    const button = screen.getByTestId("date-picker-button");

    expect(root).toHaveClass("disabled");
    expect(root).toHaveClass("loading");
    expect(root).toHaveAttribute("aria-busy", "true");
    expect(root).toHaveAttribute("aria-disabled", "true");
    expect(input).toBeDisabled();
    expect(input).toBeRequired();
    expect(input).toHaveAttribute("aria-required", "true");
    expect(button).toBeDisabled();
    expect(screen.getByTestId("date-picker-loader")).toBeInTheDocument();
  });

  it("disables the picker button when read-only", () => {
    renderDatePicker({ readOnly: true });

    expect(screen.getByTestId("date-picker-root")).toHaveClass("readOnly");
    expect(screen.getByTestId("date-picker-input")).toHaveAttribute("readonly");
    expect(screen.getByTestId("date-picker-button")).toBeDisabled();
  });

  it("opens the native picker or falls back to focus", () => {
    const showPicker = jest.fn();
    Object.defineProperty(HTMLInputElement.prototype, "showPicker", {
      configurable: true,
      value: showPicker,
    });

    renderDatePicker();
    fireEvent.click(screen.getByTestId("date-picker-button"));

    expect(showPicker).toHaveBeenCalledTimes(1);
  });

  it("forwards refs to the root", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<DatePickerBase label="Start date" classMap={classMap} ref={ref} />);

    expect(ref.current).toBe(screen.getByTestId("date-picker-root"));
  });

  it("has no accessibility violations", async () => {
    const { container } = renderDatePicker({
      helperText: "Use the native date format",
    });

    expect(await axe(container)).toHaveNoViolations();
  });
});
