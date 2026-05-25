import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { axe, toHaveNoViolations } from "jest-axe";
import DateTimePickerBase from "@/components/DateTimePicker/DateTimePickerBase";

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

const renderDateTimePicker = (
  props: Partial<React.ComponentProps<typeof DateTimePickerBase>> = {},
) =>
  render(
    <DateTimePickerBase
      label="Start date and time"
      classMap={classMap}
      {...props}
    />,
  );

describe("DateTimePickerBase", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("renders a labelled native datetime-local input", () => {
    renderDateTimePicker({
      value: "2026-05-14T09:30",
      name: "startDateTime",
      min: "2026-01-01T00:00",
      max: "2026-12-31T23:59",
    });

    const input = screen.getByLabelText("Start date and time");
    expect(input).toHaveAttribute("type", "datetime-local");
    expect(input).toHaveValue("2026-05-14T09:30");
    expect(input).toHaveAttribute("name", "startDateTime");
    expect(input).toHaveAttribute("min", "2026-01-01T00:00");
    expect(input).toHaveAttribute("max", "2026-12-31T23:59");
  });

  it("supports defaultValue for uncontrolled usage", () => {
    renderDateTimePicker({ defaultValue: "2026-05-14T09:30" });

    expect(screen.getByTestId("datetime-picker-input")).toHaveValue(
      "2026-05-14T09:30",
    );
  });

  it("falls back to an accessible label when no visible label is provided", () => {
    renderDateTimePicker({ label: undefined });

    expect(screen.getByLabelText("Date and time")).toBeInTheDocument();
  });

  it("emits string values from user input", () => {
    const onChange = jest.fn();
    renderDateTimePicker({ onChange });

    fireEvent.change(screen.getByTestId("datetime-picker-input"), {
      target: { value: "2026-06-01T14:45" },
    });

    expect(onChange).toHaveBeenCalledWith("2026-06-01T14:45");
  });

  it("connects description, helper text, error text, and screen-reader text", () => {
    renderDateTimePicker({
      id: "deadline",
      description: "Choose the delivery date and time",
      helperText: "Weekdays are preferred",
      srOnlyText: "Native date and time picker",
    });

    const input = screen.getByTestId("datetime-picker-input");
    expect(input).toHaveAttribute(
      "aria-describedby",
      "deadline-description deadline-helper deadline-sr-description",
    );
    expect(
      screen.getByTestId("datetime-picker-description"),
    ).toHaveTextContent("Choose the delivery date and time");
    expect(screen.getByTestId("datetime-picker-helper")).toHaveTextContent(
      "Weekdays are preferred",
    );
    expect(screen.getByTestId("datetime-picker-sr-only-text")).toHaveTextContent(
      "Native date and time picker",
    );
  });

  it("renders errors as alerts and marks the input invalid", () => {
    renderDateTimePicker({
      id: "deadline",
      helperText: "Weekdays are preferred",
      error: "Choose a valid date and time",
    });

    const input = screen.getByTestId("datetime-picker-input");
    const error = screen.getByRole("alert");

    expect(
      screen.queryByTestId("datetime-picker-helper"),
    ).not.toBeInTheDocument();
    expect(error).toHaveTextContent("Choose a valid date and time");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-errormessage", "deadline-error");
    expect(input).toHaveAttribute("aria-describedby", "deadline-error");
  });

  it("marks values outside min and max as invalid", () => {
    renderDateTimePicker({
      value: "2026-05-14T09:30",
      min: "2026-06-01T00:00",
      max: "2026-12-31T23:59",
    });

    expect(screen.getByTestId("datetime-picker-input")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("respects input aria overrides", () => {
    renderDateTimePicker({
      label: undefined,
      "aria-label": "Appointment date and time",
      "aria-invalid": true,
      "aria-errormessage": "external-error-id",
      "aria-describedby": "external-help",
    });

    const input = screen.getByLabelText("Appointment date and time");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-errormessage", "external-error-id");
    expect(input).toHaveAttribute("aria-describedby", "external-help");
  });

  it("applies theme, state, outline, glass, rounding, shadow, and full-width classes", () => {
    renderDateTimePicker({
      theme: "secondary",
      state: "success",
      outline: true,
      glass: true,
      rounding: "large",
      shadow: "strong",
      fullWidth: true,
    });

    const root = screen.getByTestId("datetime-picker-root");
    expect(screen.getByTestId("datetime-picker")).toHaveClass("fullWidth");
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
    renderDateTimePicker({
      labelPosition: "left",
      containerClassName: "customContainer",
      labelClassName: "customLabel",
      inputWrapperClassName: "customWrapper",
      inputClassName: "customInput",
      buttonClassName: "customButton",
      description: "Helpful text",
      descriptionClassName: "customDescription",
    });

    expect(screen.getByTestId("datetime-picker")).toHaveClass("labelLeft");
    expect(screen.getByTestId("datetime-picker")).toHaveClass(
      "customContainer",
    );
    expect(screen.getByTestId("datetime-picker-label")).toHaveClass(
      "customLabel",
    );
    expect(screen.getByTestId("datetime-picker-input-wrapper")).toHaveClass(
      "customWrapper",
    );
    expect(screen.getByTestId("datetime-picker-input")).toHaveClass(
      "customInput",
    );
    expect(screen.getByTestId("datetime-picker-button")).toHaveClass(
      "customButton",
    );
    expect(screen.getByTestId("datetime-picker-description")).toHaveClass(
      "customDescription",
    );
  });

  it("applies disabled, loading, required, and read-only states", () => {
    renderDateTimePicker({ disabled: true, loading: true, required: true });

    const root = screen.getByTestId("datetime-picker-root");
    const input = screen.getByTestId("datetime-picker-input");
    const button = screen.getByTestId("datetime-picker-button");

    expect(root).toHaveClass("disabled");
    expect(root).toHaveClass("loading");
    expect(root).toHaveAttribute("aria-busy", "true");
    expect(root).toHaveAttribute("aria-disabled", "true");
    expect(input).toBeDisabled();
    expect(input).toBeRequired();
    expect(input).toHaveAttribute("aria-required", "true");
    expect(button).toBeDisabled();
    expect(screen.getByTestId("datetime-picker-loader")).toBeInTheDocument();
  });

  it("disables the picker button when read-only", () => {
    renderDateTimePicker({ readOnly: true });

    expect(screen.getByTestId("datetime-picker-root")).toHaveClass("readOnly");
    expect(screen.getByTestId("datetime-picker-input")).toHaveAttribute(
      "readonly",
    );
    expect(screen.getByTestId("datetime-picker-button")).toBeDisabled();
  });

  it("opens the native picker or falls back to focus", () => {
    const showPicker = jest.fn();
    Object.defineProperty(HTMLInputElement.prototype, "showPicker", {
      configurable: true,
      value: showPicker,
    });

    renderDateTimePicker();
    fireEvent.click(screen.getByTestId("datetime-picker-button"));

    expect(showPicker).toHaveBeenCalledTimes(1);
  });

  it("does not open the native picker when loading", () => {
    const showPicker = jest.fn();
    Object.defineProperty(HTMLInputElement.prototype, "showPicker", {
      configurable: true,
      value: showPicker,
    });

    renderDateTimePicker({ loading: true });
    fireEvent.click(screen.getByTestId("datetime-picker-button"));

    expect(showPicker).not.toHaveBeenCalled();
  });

  it("supports a custom picker button accessible name and references", () => {
    render(
      <>
        <span id="button-label">Launch picker</span>
        <span id="button-help">Opens native date and time picker</span>
        <DateTimePickerBase
          label="Start date and time"
          classMap={classMap}
          pickerButtonAriaLabel="Open appointment picker"
          pickerButtonAriaLabelledBy="button-label"
          pickerButtonAriaDescribedBy="button-help"
          pickerButtonTitle="Choose appointment time"
        />
      </>,
    );

    const button = screen.getByTestId("datetime-picker-button");
    expect(button).toHaveAttribute("aria-label", "Open appointment picker");
    expect(button).toHaveAttribute("aria-labelledby", "button-label");
    expect(button).toHaveAttribute("aria-describedby", "button-help");
    expect(button).toHaveAttribute("title", "Choose appointment time");
  });

  it("forwards refs to the root", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <DateTimePickerBase
        label="Start date and time"
        classMap={classMap}
        ref={ref}
      />,
    );

    expect(ref.current).toBe(screen.getByTestId("datetime-picker-root"));
  });

  it("has no accessibility violations", async () => {
    const { container } = renderDateTimePicker({
      description: "Choose a start date and time",
      helperText: "Use the native datetime format",
    });

    expect(await axe(container)).toHaveNoViolations();
  });
});
