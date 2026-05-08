import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { axe, toHaveNoViolations } from "jest-axe";
import DateTimePickerBase from "@/components/DateTimePicker/DateTimePickerBase";

expect.extend(toHaveNoViolations);

const styles = {
  wrapper: "pickerWrapper",
  inputWrapper: "inputWrapper",
  input: "inputField",
  label: "labelField",
  description: "descText",
  error: "errorText",
  outline: "outline",
  disabled: "disabled",
  readOnly: "readOnly",
  glass: "glass",
  primary: "themePrimary",
  secondary: "themeSecondary",
  success: "stateSuccess",
  medium: "sizeMedium",
  small: "sizeSmall",
  icon: "iconCalendar",
  shadowLight: "shadowLight",
  roundMedium: "roundMedium",
};

describe("DateTimePickerBase", () => {
  const renderPicker = (
    props: Partial<React.ComponentProps<typeof DateTimePickerBase>> = {},
  ) =>
    render(
      <DateTimePickerBase
        label="Select date and time"
        value=""
        onChange={jest.fn()}
        classMap={styles}
        data-testid="datetime"
        {...props}
      />,
    );

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("renders wrapper, label, input, and button", () => {
    renderPicker();

    expect(screen.getByTestId("datetime")).toBeInTheDocument();
    expect(screen.getByTestId("datetime-label")).toBeInTheDocument();
    expect(screen.getByTestId("datetime-input")).toBeInTheDocument();
    expect(screen.getByTestId("datetime-button")).toBeInTheDocument();
  });

  it("renders the input as datetime-local", () => {
    renderPicker();

    expect(screen.getByTestId("datetime-input")).toHaveAttribute(
      "type",
      "datetime-local",
    );
  });

  it("uses the provided label text and associates it with the input", () => {
    renderPicker({ label: "Event time" });

    const input = screen.getByLabelText("Event time");
    const label = screen.getByText("Event time");

    expect(input).toBeInTheDocument();
    expect(label.tagName.toLowerCase()).toBe("label");
    expect(label).toHaveAttribute("for", input.getAttribute("id"));
  });

  it("uses the generated label id for aria-labelledby when a visible label is present", () => {
    renderPicker({ id: "event-datetime" });

    const input = screen.getByTestId("datetime-input");
    const label = screen.getByTestId("datetime-label");

    expect(label).toHaveAttribute("id", "event-datetime-label");
    expect(input).toHaveAttribute("aria-labelledby", "event-datetime-label");
    expect(input).not.toHaveAttribute("aria-label", "Date and time");
  });

  it("falls back to a default aria-label when no label is provided", () => {
    render(
      <DateTimePickerBase
        value=""
        onChange={jest.fn()}
        classMap={styles}
        data-testid="datetime"
      />,
    );

    expect(screen.getByLabelText("Date and time")).toBeInTheDocument();
  });

  it("uses aria-label override when provided", () => {
    renderPicker({
      label: undefined,
      "aria-label": "Appointment date and time",
    });

    const input = screen.getByLabelText("Appointment date and time");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("aria-label", "Appointment date and time");
  });

  it("uses custom aria-labelledby when provided", () => {
    render(
      <>
        <span id="external-datetime-label">External schedule label</span>
        <DateTimePickerBase
          value=""
          onChange={jest.fn()}
          classMap={styles}
          data-testid="datetime"
          aria-labelledby="external-datetime-label"
        />
      </>,
    );

    const input = screen.getByTestId("datetime-input");
    expect(input).toHaveAttribute("aria-labelledby", "external-datetime-label");
    expect(input).not.toHaveAttribute("aria-label", "Date and time");
  });

  it("renders required indicator and applies required attribute", () => {
    renderPicker({ required: true });

    const input = screen.getByTestId("datetime-input");
    expect(input).toBeRequired();
    expect(input).toHaveAttribute("aria-required", "true");
    expect(screen.getByText("*")).toBeInTheDocument();
    expect(screen.getByText("*")).toHaveAttribute("aria-hidden", "true");
  });

  it("does not render required indicator when not required", () => {
    renderPicker({ required: false });

    expect(screen.queryByText("*")).not.toBeInTheDocument();
  });

  it("respects aria-required override", () => {
    renderPicker({ required: false, "aria-required": true });

    expect(screen.getByTestId("datetime-input")).toHaveAttribute(
      "aria-required",
      "true",
    );
  });

  it("applies disabled state to input and button", () => {
    renderPicker({ disabled: true });

    expect(screen.getByTestId("datetime-input")).toBeDisabled();
    expect(screen.getByTestId("datetime-button")).toBeDisabled();
  });

  it("applies readOnly state to input and disables the button", () => {
    renderPicker({ readOnly: true });

    const input = screen.getByTestId("datetime-input");
    const button = screen.getByTestId("datetime-button");
    const wrapper = screen.getByTestId("datetime");

    expect(input).toHaveAttribute("readonly");
    expect(button).toBeDisabled();
    expect(wrapper).toHaveClass("readOnly");
  });

  it("passes name, min, and max attributes to the input", () => {
    renderPicker({
      name: "appointment",
      min: "2025-04-01T09:00",
      max: "2025-04-30T17:00",
    });

    const input = screen.getByTestId("datetime-input");
    expect(input).toHaveAttribute("name", "appointment");
    expect(input).toHaveAttribute("min", "2025-04-01T09:00");
    expect(input).toHaveAttribute("max", "2025-04-30T17:00");
  });

  it("renders description when provided and no error exists", () => {
    renderPicker({ description: "Select an available time slot" });

    const input = screen.getByTestId("datetime-input");
    const description = screen.getByText("Select an available time slot");

    expect(description).toBeInTheDocument();
    expect(description.tagName.toLowerCase()).toBe("p");
    expect(description).toHaveAttribute("id");
    expect(input).toHaveAttribute("aria-describedby", description.id);
  });

  it("includes custom aria-describedby with description and error ids", () => {
    renderPicker({
      id: "meeting-time",
      description: "Pick a date",
      error: "Invalid date",
      "aria-describedby": "external-help",
    });

    const input = screen.getByTestId("datetime-input");
    const describedBy = input.getAttribute("aria-describedby");

    expect(describedBy).toContain("external-help");
    expect(describedBy).toContain("meeting-time-description");
    expect(describedBy).toContain("meeting-time-error");
  });

  it("renders error message with correct accessibility attributes", () => {
    renderPicker({ error: "This field is required" });

    const input = screen.getByTestId("datetime-input");
    const error = screen.getByRole("alert");

    expect(error).toHaveTextContent("This field is required");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-errormessage", error.id);
    expect(input).toHaveAttribute("aria-describedby", error.id);
  });

  it("respects aria-invalid override", () => {
    renderPicker({
      value: "2025-04-15T12:00",
      min: "2025-04-01T09:00",
      max: "2025-04-30T17:00",
      "aria-invalid": true,
    });

    expect(screen.getByTestId("datetime-input")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("respects aria-errormessage override", () => {
    renderPicker({
      error: "Invalid value",
      "aria-errormessage": "external-error-id",
    });

    expect(screen.getByTestId("datetime-input")).toHaveAttribute(
      "aria-errormessage",
      "external-error-id",
    );
  });

  it("renders error instead of description when both are provided", () => {
    renderPicker({
      description: "Choose a meeting time",
      error: "This field is required",
    });

    expect(screen.queryByText("Choose a meeting time")).not.toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "This field is required",
    );
  });

  it("includes both description and error ids in aria-describedby when both are configured", () => {
    renderPicker({
      id: "schedule-time",
      description: "Choose carefully",
      error: "Invalid selection",
    });

    const input = screen.getByTestId("datetime-input");
    const describedBy = input.getAttribute("aria-describedby");

    expect(describedBy).toContain("schedule-time-description");
    expect(describedBy).toContain("schedule-time-error");
  });

  it("does not set aria-invalid when there is no error and value is within bounds", () => {
    renderPicker({
      value: "2025-04-15T12:00",
      min: "2025-04-01T09:00",
      max: "2025-04-30T17:00",
    });

    expect(screen.getByTestId("datetime-input")).not.toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("sets aria-invalid when value is below min", () => {
    renderPicker({
      value: "2025-03-31T12:00",
      min: "2025-04-01T09:00",
    });

    expect(screen.getByTestId("datetime-input")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("sets aria-invalid when value is above max", () => {
    renderPicker({
      value: "2025-05-01T12:00",
      max: "2025-04-30T17:00",
    });

    expect(screen.getByTestId("datetime-input")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("sets aria-invalid when min is greater than max", () => {
    renderPicker({
      min: "2025-05-01T09:00",
      max: "2025-04-01T09:00",
    });

    expect(screen.getByTestId("datetime-input")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("does not mark out-of-bounds when there is no value", () => {
    renderPicker({
      value: "",
      min: "2025-04-01T09:00",
      max: "2025-04-30T17:00",
    });

    expect(screen.getByTestId("datetime-input")).not.toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("calls onChange with the new value when input changes", () => {
    const handleChange = jest.fn();

    render(
      <DateTimePickerBase
        label="Schedule"
        value=""
        onChange={handleChange}
        classMap={styles}
        data-testid="datetime"
      />,
    );

    fireEvent.change(screen.getByTestId("datetime-input"), {
      target: { value: "2025-04-30T14:00" },
    });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith("2025-04-30T14:00");
  });

  it("does not fail when onChange is omitted", () => {
    render(
      <DateTimePickerBase
        label="Schedule"
        value=""
        classMap={styles}
        data-testid="datetime"
      />,
    );

    expect(() => {
      fireEvent.change(screen.getByTestId("datetime-input"), {
        target: { value: "2025-04-30T14:00" },
      });
    }).not.toThrow();
  });

  it("uses a custom id when provided", () => {
    renderPicker({ id: "custom-datetime-id" });

    const input = screen.getByTestId("datetime-input");
    const label = screen.getByText("Select date and time");

    expect(input).toHaveAttribute("id", "custom-datetime-id");
    expect(label).toHaveAttribute("for", "custom-datetime-id");
  });

  it("uses custom labelId, descriptionId, and errorId when provided", () => {
    renderPicker({
      id: "meeting-time",
      labelId: "custom-label-id",
      descriptionId: "custom-description-id",
      errorId: "custom-error-id",
      description: "Pick a date",
      error: "Invalid date",
    });

    const label = screen.getByTestId("datetime-label");
    const input = screen.getByTestId("datetime-input");
    const error = screen.getByRole("alert");

    expect(label).toHaveAttribute("id", "custom-label-id");
    expect(input).toHaveAttribute("aria-labelledby", "custom-label-id");
    expect(error).toHaveAttribute("id", "custom-error-id");
    expect(input).toHaveAttribute("aria-errormessage", "custom-error-id");
    expect(input.getAttribute("aria-describedby")).toContain(
      "custom-description-id",
    );
    expect(input.getAttribute("aria-describedby")).toContain("custom-error-id");
  });

  it("applies base wrapper and mapped theme/size/outline/disabled classes", () => {
    renderPicker({
      theme: "primary",
      size: "medium",
      glass: true,
      outline: true,
      disabled: true,
      className: "customClass",
    });

    const wrapper = screen.getByTestId("datetime");

    expect(wrapper).toHaveClass("pickerWrapper");
    expect(wrapper).toHaveClass("themePrimary");
    expect(wrapper).toHaveClass("sizeMedium");
    expect(wrapper).toHaveClass("glass");
    expect(wrapper).toHaveClass("outline");
    expect(wrapper).toHaveClass("disabled");
    expect(wrapper).toHaveClass("customClass");
  });

  it("applies state, rounding, and shadow classes when matching keys exist", () => {
    renderPicker({
      state: "success",
      rounding: "medium",
      shadow: "light",
    });

    const wrapper = screen.getByTestId("datetime");

    expect(wrapper).toHaveClass("stateSuccess");
    expect(wrapper).toHaveClass("roundMedium");
    expect(wrapper).toHaveClass("shadowLight");
  });

  it("applies input, label, description, error, icon, and wrapper classes", () => {
    renderPicker({
      description: "Helpful text",
      error: undefined,
    });

    expect(screen.getByTestId("datetime")).toHaveClass("pickerWrapper");
    expect(screen.getByTestId("datetime-input")).toHaveClass("inputField");
    expect(screen.getByText("Select date and time")).toHaveClass("labelField");
    expect(screen.getByText("Helpful text")).toHaveClass("descText");
    expect(screen.getByTestId("datetime-button")).toHaveClass("iconCalendar");
  });

  it("renders input wrapper class", () => {
    renderPicker();

    const input = screen.getByTestId("datetime-input");
    expect(input.parentElement).toHaveClass("inputWrapper");
  });

  it("clicking the button calls showPicker when available", () => {
    const showPickerMock = jest.fn();

    Object.defineProperty(HTMLInputElement.prototype, "showPicker", {
      configurable: true,
      value: showPickerMock,
    });

    renderPicker();

    fireEvent.click(screen.getByTestId("datetime-button"));

    expect(showPickerMock).toHaveBeenCalledTimes(1);
  });

  it("falls back to focus when showPicker is not available", () => {
    const focusSpy = jest.spyOn(HTMLInputElement.prototype, "focus");

    Object.defineProperty(HTMLInputElement.prototype, "showPicker", {
      configurable: true,
      value: undefined,
    });

    renderPicker();

    fireEvent.click(screen.getByTestId("datetime-button"));

    expect(focusSpy).toHaveBeenCalledTimes(1);
  });

  it("does not call showPicker when disabled", () => {
    const showPickerMock = jest.fn();

    Object.defineProperty(HTMLInputElement.prototype, "showPicker", {
      configurable: true,
      value: showPickerMock,
    });

    renderPicker({ disabled: true });

    fireEvent.click(screen.getByTestId("datetime-button"));

    expect(showPickerMock).not.toHaveBeenCalled();
  });

  it("does not call showPicker when readOnly", () => {
    const showPickerMock = jest.fn();

    Object.defineProperty(HTMLInputElement.prototype, "showPicker", {
      configurable: true,
      value: showPickerMock,
    });

    renderPicker({ readOnly: true });

    fireEvent.click(screen.getByTestId("datetime-button"));

    expect(showPickerMock).not.toHaveBeenCalled();
  });

  it("button has the correct accessible name by default", () => {
    renderPicker();

    expect(
      screen.getByRole("button", { name: "Open date and time picker" }),
    ).toBeInTheDocument();
  });

  it("uses custom picker button aria-label and title", () => {
    renderPicker({
      pickerButtonAriaLabel: "Open appointment picker",
      pickerButtonTitle: "Choose appointment time",
    });

    const button = screen.getByRole("button", {
      name: "Open appointment picker",
    });

    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("title", "Choose appointment time");
  });

  it("uses picker button aria-labelledby when provided", () => {
    render(
      <>
        <span id="picker-btn-label">Launch picker</span>
        <DateTimePickerBase
          label="Select date and time"
          value=""
          onChange={jest.fn()}
          classMap={styles}
          data-testid="datetime"
          pickerButtonAriaLabelledBy="picker-btn-label"
        />
      </>,
    );

    const button = screen.getByTestId("datetime-button");
    expect(button).toHaveAttribute("aria-labelledby", "picker-btn-label");
  });

  it("uses picker button aria-describedby when provided", () => {
    render(
      <>
        <span id="picker-btn-description">Opens native date picker</span>
        <DateTimePickerBase
          label="Select date and time"
          value=""
          onChange={jest.fn()}
          classMap={styles}
          data-testid="datetime"
          pickerButtonAriaDescribedBy="picker-btn-description"
        />
      </>,
    );

    const button = screen.getByTestId("datetime-button");
    expect(button).toHaveAttribute(
      "aria-describedby",
      "picker-btn-description",
    );
  });

  it("input has autoComplete turned off by default", () => {
    renderPicker();

    expect(screen.getByTestId("datetime-input")).toHaveAttribute(
      "autocomplete",
      "off",
    );
  });

  it("supports custom autoComplete and placeholder", () => {
    renderPicker({
      autoComplete: "bday",
      placeholder: "Choose date and time",
    });

    const input = screen.getByTestId("datetime-input");
    expect(input).toHaveAttribute("autocomplete", "bday");
    expect(input).toHaveAttribute("placeholder", "Choose date and time");
  });

  it("matches the controlled value passed in", () => {
    renderPicker({ value: "2025-04-30T14:00" });

    expect(screen.getByTestId("datetime-input")).toHaveValue(
      "2025-04-30T14:00",
    );
  });

  it("passes additional props through inputProps", () => {
    renderPicker({
      inputProps: {
        "aria-controls": "schedule-panel",
      },
    });

    const input = screen.getByTestId("datetime-input");
    expect(input).toHaveAttribute("aria-controls", "schedule-panel");
  });

  it("passes additional props through buttonProps", () => {
    renderPicker({
      buttonProps: {
        "aria-controls": "native-picker-panel",
      },
    });

    const button = screen.getByTestId("datetime-button");
    expect(button).toHaveAttribute("aria-controls", "native-picker-panel");
  });

  it("renders decorative calendar icon button without accessibility violations in default state", async () => {
    const { container } = renderPicker({
      description: "Choose a time for the meeting",
    });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations in error state", async () => {
    const { container } = renderPicker({
      error: "Please select a valid date and time",
    });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations in disabled state", async () => {
    const { container } = renderPicker({
      disabled: true,
      description: "Currently unavailable",
    });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations in readOnly state", async () => {
    const { container } = renderPicker({
      readOnly: true,
      description: "Value cannot be changed right now",
    });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
