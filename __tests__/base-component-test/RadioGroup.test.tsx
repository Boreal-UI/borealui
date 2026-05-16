import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import BaseRadioGroup from "@/components/RadioButton/RadioGroupBase";

expect.extend(toHaveNoViolations);

const classMap = {
  group: "radio_group",
  legend: "radio_legend",
  options: "radio_options",
  vertical: "radio_vertical",
  horizontal: "radio_horizontal",
  description: "radio_description",
  errorMessage: "radio_errorMessage",
  invalid: "radio_invalid",

  wrapper: "radio_wrapper",
  labelWrapper: "radio_labelWrapper",
  input: "radio_input",
  circle: "radio_circle",
  label: "radio_label",

  primary: "radio_primary",
  secondary: "radio_secondary",
  tertiary: "radio_tertiary",
  quaternary: "radio_quaternary",
  clear: "radio_clear",

  success: "radio_success",
  error: "radio_error",
  warning: "radio_warning",

  glass: "radio_glass",
  glassCircle: "radio_glassCircle",
  disabled: "radio_disabled",

  roundNone: "radio_round-none",
  roundSmall: "radio_round-small",
  roundMedium: "radio_round-medium",
  roundLarge: "radio_round-large",
  roundFull: "radio_round-full",

  shadowNone: "radio_shadow-none",
  shadowLight: "radio_shadow-light",
  shadowMedium: "radio_shadow-medium",
  shadowStrong: "radio_shadow-strong",
  shadowIntense: "radio_shadow-intense",
};

const options = [
  { label: "Option One", value: "one" },
  { label: "Option Two", value: "two" },
  { label: "Option Three", value: "three", disabled: true },
];

const renderRadioGroup = (
  props: Partial<React.ComponentProps<typeof BaseRadioGroup>> = {},
) => {
  const onChange = jest.fn();

  render(
    <BaseRadioGroup
      legend="Choose an option"
      name="example-options"
      options={options}
      value="one"
      onChange={onChange}
      classMap={classMap}
      data-testid="radio-group"
      {...props}
    />,
  );

  return { onChange };
};

describe("BaseRadioGroup", () => {
  it("renders the fieldset, legend, and options", () => {
    renderRadioGroup();

    expect(screen.getByTestId("radio-group")).toBeInTheDocument();
    expect(screen.getByTestId("radio-group-legend")).toHaveTextContent(
      "Choose an option",
    );
    expect(screen.getByTestId("radio-group-options")).toBeInTheDocument();

    expect(screen.getByTestId("radio-group-one")).toBeInTheDocument();
    expect(screen.getByTestId("radio-group-two")).toBeInTheDocument();
    expect(screen.getByTestId("radio-group-three")).toBeInTheDocument();
  });

  it("renders as a fieldset with the correct id", () => {
    renderRadioGroup({ id: "custom-radio-group-id" });

    const group = screen.getByTestId("radio-group");

    expect(group.tagName).toBe("FIELDSET");
    expect(group).toHaveAttribute("id", "custom-radio-group-id");
  });

  it("generates an id when no id is provided", () => {
    renderRadioGroup();

    expect(screen.getByTestId("radio-group")).toHaveAttribute("id");
    expect(screen.getByTestId("radio-group").id).toContain("radio-group-");
  });

  it("applies base group class", () => {
    renderRadioGroup();

    expect(screen.getByTestId("radio-group")).toHaveClass("radio_group");
  });

  it("applies state, disabled, invalid, and custom classes to the group", () => {
    renderRadioGroup({
      state: "error",
      disabled: true,
      invalid: true,
      className: "custom-group-class",
    });

    expect(screen.getByTestId("radio-group")).toHaveClass(
      "radio_group",
      "radio_error",
      "radio_disabled",
      "radio_invalid",
      "custom-group-class",
    );
  });

  it("applies vertical orientation by default", () => {
    renderRadioGroup();

    expect(screen.getByTestId("radio-group-options")).toHaveClass(
      "radio_options",
      "radio_vertical",
    );
  });

  it("applies horizontal orientation when provided", () => {
    renderRadioGroup({ orientation: "horizontal" });

    expect(screen.getByTestId("radio-group-options")).toHaveClass(
      "radio_options",
      "radio_horizontal",
    );
  });

  it("applies custom optionsClassName", () => {
    renderRadioGroup({ optionsClassName: "custom-options-class" });

    expect(screen.getByTestId("radio-group-options")).toHaveClass(
      "radio_options",
      "custom-options-class",
    );
  });

  it("checks the radio option that matches the group value", () => {
    renderRadioGroup({ value: "two" });

    expect(screen.getByTestId("radio-group-one")).not.toBeChecked();
    expect(screen.getByTestId("radio-group-two")).toBeChecked();
    expect(screen.getByTestId("radio-group-three")).not.toBeChecked();
  });

  it("calls onChange with the selected option value", () => {
    const { onChange } = renderRadioGroup({ value: "one" });

    fireEvent.click(screen.getByTestId("radio-group-two"));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("two");
  });

  it("does not call onChange for disabled option", () => {
    const { onChange } = renderRadioGroup({ value: "one" });

    fireEvent.click(screen.getByTestId("radio-group-three"));

    expect(onChange).not.toHaveBeenCalled();
  });

  it("disables the entire fieldset when disabled is true", () => {
    renderRadioGroup({ disabled: true });

    expect(screen.getByTestId("radio-group")).toBeDisabled();
    expect(screen.getByTestId("radio-group-one")).toBeDisabled();
    expect(screen.getByTestId("radio-group-two")).toBeDisabled();
    expect(screen.getByTestId("radio-group-three")).toBeDisabled();
  });

  it("does not call onChange when the group is disabled", () => {
    const { onChange } = renderRadioGroup({ disabled: true });

    fireEvent.click(screen.getByTestId("radio-group-two"));

    expect(onChange).not.toHaveBeenCalled();
  });

  it("marks every radio as required when required is true", () => {
    renderRadioGroup({ required: true });

    expect(screen.getByTestId("radio-group-one")).toBeRequired();
    expect(screen.getByTestId("radio-group-two")).toBeRequired();
    expect(screen.getByTestId("radio-group-three")).toBeRequired();

    expect(screen.getByTestId("radio-group-one")).not.toHaveAttribute(
      "aria-required",
    );
  });

  it("sets aria-invalid on the fieldset when invalid is true", () => {
    renderRadioGroup({ invalid: true });

    expect(screen.getByTestId("radio-group")).toHaveAttribute(
      "aria-invalid",
      "true",
    );

    expect(screen.getByTestId("radio-group-one")).toHaveAttribute(
      "data-invalid",
      "true",
    );
  });

  it("sets aria-invalid when state is error", () => {
    renderRadioGroup({ state: "error" });

    expect(screen.getByTestId("radio-group")).toHaveAttribute(
      "aria-invalid",
      "true",
    );

    expect(screen.getByTestId("radio-group-one")).toHaveAttribute(
      "data-invalid",
      "true",
    );
  });

  it("does not set aria-invalid when invalid is false and state is not error", () => {
    renderRadioGroup({ invalid: false, state: "success" });

    expect(screen.getByTestId("radio-group")).not.toHaveAttribute(
      "aria-invalid",
    );

    expect(screen.getByTestId("radio-group-one")).not.toHaveAttribute(
      "aria-invalid",
    );
  });

  it("renders description when provided", () => {
    renderRadioGroup({
      id: "preferences",
      description: "Pick the option that best fits your preference.",
    });

    expect(screen.getByTestId("radio-group-description")).toHaveTextContent(
      "Pick the option that best fits your preference.",
    );

    expect(screen.getByTestId("radio-group-description")).toHaveAttribute(
      "id",
      "preferences-description",
    );
  });

  it("renders error message when provided", () => {
    renderRadioGroup({
      id: "preferences",
      errorMessage: "Please choose an option.",
    });

    expect(screen.getByTestId("radio-group-error")).toHaveTextContent(
      "Please choose an option.",
    );

    expect(screen.getByTestId("radio-group-error")).toHaveAttribute(
      "id",
      "preferences-error",
    );
  });

  it("combines external aria-describedby with description and error ids", () => {
    renderRadioGroup({
      id: "preferences",
      "aria-describedby": "external-help",
      description: "Helpful description.",
      errorMessage: "Error message.",
    });

    expect(screen.getByTestId("radio-group")).toHaveAttribute(
      "aria-describedby",
      "external-help preferences-description preferences-error",
    );
  });

  it("sets aria-describedby to only the description id when only description is provided", () => {
    renderRadioGroup({
      id: "preferences",
      description: "Helpful description.",
    });

    expect(screen.getByTestId("radio-group")).toHaveAttribute(
      "aria-describedby",
      "preferences-description",
    );
  });

  it("sets aria-describedby to only the error id when only error message is provided", () => {
    renderRadioGroup({
      id: "preferences",
      errorMessage: "Error message.",
    });

    expect(screen.getByTestId("radio-group")).toHaveAttribute(
      "aria-describedby",
      "preferences-error",
    );
  });

  it("does not set aria-describedby when no description, error, or aria-describedby is provided", () => {
    renderRadioGroup();

    expect(screen.getByTestId("radio-group")).not.toHaveAttribute(
      "aria-describedby",
    );
  });

  it("passes the same name to every radio option", () => {
    renderRadioGroup({ name: "shared-radio-name" });

    expect(screen.getByTestId("radio-group-one")).toHaveAttribute(
      "name",
      "shared-radio-name",
    );

    expect(screen.getByTestId("radio-group-two")).toHaveAttribute(
      "name",
      "shared-radio-name",
    );

    expect(screen.getByTestId("radio-group-three")).toHaveAttribute(
      "name",
      "shared-radio-name",
    );
  });

  it("passes theme, state, glass, rounding, and shadow props to radio buttons", () => {
    renderRadioGroup({
      theme: "secondary",
      state: "success",
      glass: true,
      rounding: "large",
      shadow: "medium",
    });

    expect(screen.getByTestId("radio-group-one-root")).toHaveClass(
      "radio_wrapper",
      "radio_secondary",
      "radio_success",
      "radio_glass",
    );

    expect(screen.getByTestId("radio-group-one-circle")).toHaveClass(
      "radio_circle",
      "radio_glassCircle",
      "radio_round-large",
      "radio_shadow-medium",
    );
  });

  it("uses custom option test ids when provided", () => {
    renderRadioGroup({
      options: [
        {
          label: "Custom Option",
          value: "custom",
          "data-testid": "custom-radio-option",
        },
      ],
      value: "custom",
    });

    expect(screen.getByTestId("custom-radio-option")).toBeInTheDocument();
    expect(screen.getByTestId("custom-radio-option-root")).toBeInTheDocument();
    expect(
      screen.getByTestId("custom-radio-option-circle"),
    ).toBeInTheDocument();
  });

  it("passes aria-label to individual options", () => {
    renderRadioGroup({
      options: [
        {
          label: "Visual Label",
          value: "visual",
          "aria-label": "Accessible radio label",
        },
      ],
      value: "visual",
    });

    expect(screen.getByTestId("radio-group-visual")).toHaveAttribute(
      "aria-label",
      "Accessible radio label",
    );
  });

  it("does not render a legend when legend is not provided", () => {
    renderRadioGroup({ legend: undefined });

    expect(screen.queryByTestId("radio-group-legend")).not.toBeInTheDocument();
  });

  it("supports extra fieldset props", () => {
    renderRadioGroup({
      title: "Radio group title",
    });

    expect(screen.getByTestId("radio-group")).toHaveAttribute(
      "title",
      "Radio group title",
    );
  });

  it("is discoverable by role and accessible option names", () => {
    renderRadioGroup();

    expect(
      screen.getByRole("group", { name: "Choose an option" }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("radio", { name: "Option One" }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("radio", { name: "Option Two" }),
    ).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <BaseRadioGroup
        legend="Choose an option"
        name="example-options"
        options={options}
        value="one"
        onChange={jest.fn()}
        classMap={classMap}
        data-testid="radio-group"
        description="Choose one available option."
      />,
    );

    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});
