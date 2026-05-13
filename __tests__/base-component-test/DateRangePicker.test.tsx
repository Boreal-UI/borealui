import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import DateRangePickerBase from "../../src/components/DateRangePicker/DateRangePickerBase";

expect.extend(toHaveNoViolations);

const classMap = {
  dateRangePicker: "dateRangePicker",
  labelTop: "labelTop",
  labelBottom: "labelBottom",
  labelLeft: "labelLeft",
  labelRight: "labelRight",

  legend: "legend",
  label: "label",
  group: "group",
  field: "field",
  fieldLabel: "fieldLabel",
  input: "input",
  separator: "separator",
  helperText: "helperText",
  errorText: "errorText",

  primary: "primary",
  secondary: "secondary",
  tertiary: "tertiary",
  quaternary: "quaternary",
  clear: "clear",

  success: "success",
  error: "error",
  warning: "warning",

  outline: "outline",
  glass: "glass",
  disabled: "disabled",

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
};

const defaultValue = {
  start: "2026-05-01",
  end: "2026-05-12",
};

type DummyDatePickerProps = React.InputHTMLAttributes<HTMLInputElement> & {
  theme?: string;
  state?: string;
  fullWidth?: boolean;
  shadow?: string;
  glass?: boolean;
  outline?: boolean;
  rounding?: string;
};

const DummyDatePicker = React.forwardRef<
  HTMLInputElement,
  DummyDatePickerProps
>(({ ...inputProps }, ref) => <input ref={ref} {...inputProps} />);

DummyDatePicker.displayName = "DummyDatePicker";

function renderDateRangePicker(
  props: Partial<React.ComponentProps<typeof DateRangePickerBase>> = {},
) {
  const onChange = jest.fn();
  const resolvedTestId =
    props.testId ?? props["data-testid"] ?? "date-range-picker";

  render(
    <DateRangePickerBase
      value={defaultValue}
      onChange={onChange}
      label="Date range"
      classMap={classMap}
      DatePickerComponent={DummyDatePicker}
      {...props}
    />,
  );

  const fieldset = screen.getByTestId(resolvedTestId);
  const startInput = screen.getByTestId(`${resolvedTestId}-start`);
  const endInput = screen.getByTestId(`${resolvedTestId}-end`);

  return {
    onChange,
    fieldset,
    startInput,
    endInput,
  };
}

describe("DateRangePickerBase", () => {
  it("renders the fieldset, legend, default field labels, and date inputs", () => {
    const { fieldset, startInput, endInput } = renderDateRangePicker();

    expect(fieldset.tagName).toBe("FIELDSET");

    const legend = fieldset.querySelector("legend");
    expect(legend).toHaveTextContent("Date range");

    expect(screen.getByText("Start date")).toBeInTheDocument();
    expect(screen.getByText("End date")).toBeInTheDocument();

    expect(startInput).toHaveAttribute("type", "date");
    expect(endInput).toHaveAttribute("type", "date");

    expect(startInput).toHaveValue("2026-05-01");
    expect(endInput).toHaveValue("2026-05-12");
  });

  it("has no accessibility violations in the default rendered state", async () => {
    const { container } = render(
      <DateRangePickerBase
        value={defaultValue}
        onChange={jest.fn()}
        label="Date range"
        helperText="Choose a start and end date."
        classMap={classMap}
        DatePickerComponent={DummyDatePicker}
      />,
    );

    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });

  it("uses custom start and end labels", () => {
    renderDateRangePicker({
      startLabel: "From",
      endLabel: "To",
    });

    expect(screen.getByText("From")).toBeInTheDocument();
    expect(screen.getByText("To")).toBeInTheDocument();
  });

  it("renders without a legend when label is not provided", () => {
    renderDateRangePicker({
      label: undefined,
      "aria-label": "Date range",
    });

    expect(screen.queryByText("Date range")).not.toBeInTheDocument();
    expect(
      screen.getByRole("group", { name: "Date range" }),
    ).toBeInTheDocument();
  });

  it("applies aria-label and aria-labelledby to the fieldset", () => {
    const { fieldset } = renderDateRangePicker({
      label: undefined,
      "aria-label": "Custom date range",
      "aria-labelledby": "external-label",
    });

    expect(fieldset).toHaveAttribute("aria-label", "Custom date range");
    expect(fieldset).toHaveAttribute("aria-labelledby", "external-label");
  });

  it("connects helper text and error text through aria-describedby", () => {
    const { fieldset } = renderDateRangePicker({
      id: "booking-range",
      helperText: "Pick the dates for your booking.",
      error: "End date must be after start date.",
      "aria-describedby": "external-description",
    });

    expect(
      screen.getByText("Pick the dates for your booking."),
    ).toHaveAttribute("id", "booking-range-helper");

    expect(
      screen.getByText("End date must be after start date."),
    ).toHaveAttribute("id", "booking-range-error");

    expect(fieldset).toHaveAttribute(
      "aria-describedby",
      "external-description booking-range-helper booking-range-error",
    );
  });

  it("renders error text as an alert", () => {
    renderDateRangePicker({
      error: "Date range is invalid.",
    });

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Date range is invalid.",
    );
  });

  it("marks both inputs as invalid when error is provided", () => {
    const { startInput, endInput } = renderDateRangePicker({
      error: "Date range is invalid.",
    });

    expect(startInput).toHaveAttribute("aria-invalid", "true");
    expect(endInput).toHaveAttribute("aria-invalid", "true");
  });

  it("marks both inputs as invalid when state is error", () => {
    const { startInput, endInput } = renderDateRangePicker({
      state: "error",
    });

    expect(startInput).toHaveAttribute("aria-invalid", "true");
    expect(endInput).toHaveAttribute("aria-invalid", "true");
  });

  it("does not set aria-invalid when there is no error state", () => {
    const { startInput, endInput } = renderDateRangePicker();

    expect(startInput).not.toHaveAttribute("aria-invalid");
    expect(endInput).not.toHaveAttribute("aria-invalid");
  });

  it("calls onChange with the updated start date", () => {
    const { onChange, startInput } = renderDateRangePicker();

    fireEvent.change(startInput, {
      target: { value: "2026-05-03" },
    });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith({
      start: "2026-05-03",
      end: "2026-05-12",
    });
  });

  it("calls onChange with the updated end date", () => {
    const { onChange, endInput } = renderDateRangePicker();

    fireEvent.change(endInput, {
      target: { value: "2026-05-20" },
    });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith({
      start: "2026-05-01",
      end: "2026-05-20",
    });
  });

  it("applies min and max constraints to the start and end inputs", () => {
    const { startInput, endInput } = renderDateRangePicker({
      min: "2026-01-01",
      max: "2026-12-31",
    });

    expect(startInput).toHaveAttribute("min", "2026-01-01");
    expect(startInput).toHaveAttribute("max", "2026-05-12");

    expect(endInput).toHaveAttribute("min", "2026-05-01");
    expect(endInput).toHaveAttribute("max", "2026-12-31");
  });

  it("falls back to the provided min and max when start or end values are empty", () => {
    const { startInput, endInput } = renderDateRangePicker({
      value: {
        start: "",
        end: "",
      },
      min: "2026-01-01",
      max: "2026-12-31",
    });

    expect(startInput).toHaveAttribute("min", "2026-01-01");
    expect(startInput).toHaveAttribute("max", "2026-12-31");

    expect(endInput).toHaveAttribute("min", "2026-01-01");
    expect(endInput).toHaveAttribute("max", "2026-12-31");
  });

  it("applies generated input ids and name suffixes", () => {
    const { startInput, endInput } = renderDateRangePicker({
      id: "project-dates",
      name: "projectDates",
    });

    expect(startInput).toHaveAttribute("id", "project-dates-start");
    expect(endInput).toHaveAttribute("id", "project-dates-end");

    expect(startInput).toHaveAttribute("name", "projectDates-start");
    expect(endInput).toHaveAttribute("name", "projectDates-end");
  });

  it("does not apply name attributes when name is not provided", () => {
    const { startInput, endInput } = renderDateRangePicker();

    expect(startInput).not.toHaveAttribute("name");
    expect(endInput).not.toHaveAttribute("name");
  });

  it("supports disabled inputs and disabled group styling", () => {
    const { startInput, endInput } = renderDateRangePicker({
      disabled: true,
    });

    expect(startInput).toBeDisabled();
    expect(endInput).toBeDisabled();

    expect(
      screen.getByText("Start date").closest(`.${classMap.group}`),
    ).toHaveClass("disabled");
  });

  it("supports required inputs", () => {
    const { startInput, endInput } = renderDateRangePicker({
      required: true,
    });

    expect(startInput).toBeRequired();
    expect(endInput).toBeRequired();
  });

  it("applies label position class to the fieldset", () => {
    const { fieldset } = renderDateRangePicker({
      labelPosition: "left",
    });

    expect(fieldset).toHaveClass("dateRangePicker", "labelLeft");
  });

  it("applies theme, state, outline, glass, shadow, rounding, and custom group classes", () => {
    renderDateRangePicker({
      theme: "secondary",
      state: "success",
      outline: true,
      glass: true,
      shadow: "strong",
      rounding: "large",
      groupClassName: "customGroup",
    });

    const group = screen.getByText("Start date").closest(`.${classMap.group}`);

    expect(group).toHaveClass(
      "group",
      "secondary",
      "success",
      "outline",
      "glass",
      "shadowStrong",
      "roundLarge",
      "customGroup",
    );
  });

  it("does not apply optional visual modifier classes when disabled through props", () => {
    renderDateRangePicker({
      outline: false,
      glass: false,
      shadow: "none",
      rounding: "none",
    });

    const group = screen.getByText("Start date").closest(`.${classMap.group}`);

    expect(group).not.toHaveClass("outline");
    expect(group).not.toHaveClass("glass");
    expect(group).toHaveClass("shadowNone", "roundNone");
  });

  it("applies custom className props to the correct elements", () => {
    const { fieldset, startInput, endInput } = renderDateRangePicker({
      className: "customRoot",
      labelClassName: "customLabel",
      groupClassName: "customGroup",
      inputClassName: "customInput",
      helperText: "Helpful text.",
      helperTextClassName: "customHelper",
      error: "Error text.",
      errorClassName: "customError",
    });

    expect(fieldset).toHaveClass("customRoot");

    const visualLabel = fieldset.querySelector(`.${classMap.label}`);
    expect(visualLabel).toHaveClass("customLabel");
    expect(visualLabel).toHaveTextContent("Date range");

    expect(
      screen.getByText("Start date").closest(`.${classMap.group}`),
    ).toHaveClass("customGroup");

    expect(startInput).toHaveClass("customInput");
    expect(endInput).toHaveClass("customInput");

    expect(screen.getByText("Helpful text.")).toHaveClass("customHelper");
    expect(screen.getByText("Error text.")).toHaveClass("customError");
  });

  it("uses testId before data-testid when both are provided", () => {
    renderDateRangePicker({
      testId: "preferred-id",
      "data-testid": "fallback-id",
    });

    expect(screen.getByTestId("preferred-id")).toBeInTheDocument();
    expect(screen.getByTestId("preferred-id-start")).toBeInTheDocument();
    expect(screen.getByTestId("preferred-id-end")).toBeInTheDocument();

    expect(screen.queryByTestId("fallback-id")).not.toBeInTheDocument();
  });

  it("uses data-testid when testId is not provided", () => {
    renderDateRangePicker({
      "data-testid": "custom-date-range",
    });

    expect(screen.getByTestId("custom-date-range")).toBeInTheDocument();
    expect(screen.getByTestId("custom-date-range-start")).toBeInTheDocument();
    expect(screen.getByTestId("custom-date-range-end")).toBeInTheDocument();
  });

  it("falls back to the default test id", () => {
    renderDateRangePicker();

    expect(screen.getByTestId("date-range-picker")).toBeInTheDocument();
    expect(screen.getByTestId("date-range-picker-start")).toBeInTheDocument();
    expect(screen.getByTestId("date-range-picker-end")).toBeInTheDocument();
  });

  it("renders the separator as aria-hidden", () => {
    renderDateRangePicker();

    expect(screen.getByText("–")).toHaveAttribute("aria-hidden", "true");
  });
});
