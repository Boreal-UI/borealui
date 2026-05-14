import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { axe, toHaveNoViolations } from "jest-axe";
import SegmentedControlBase from "@/components/SegmentedControl/SegmentedControlBase";

expect.extend(toHaveNoViolations);

const classMap = {
  container: "container",
  label: "label",
  labelTop: "labelTop",
  labelBottom: "labelBottom",
  labelLeft: "labelLeft",
  labelRight: "labelRight",
  root: "root",
  content: "content",
  option: "option",
  optionSelected: "optionSelected",
  optionDisabled: "optionDisabled",
  optionIcon: "optionIcon",
  optionLabel: "optionLabel",
  loader: "loader",
  srOnly: "srOnly",
  vertical: "vertical",
  fullWidth: "fullWidth",
  equalWidth: "equalWidth",
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

const options = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month", disabled: true },
];

const renderSegmentedControl = (
  props: Partial<React.ComponentProps<typeof SegmentedControlBase>> = {},
) =>
  render(
    <SegmentedControlBase
      label="View"
      options={options}
      classMap={classMap}
      {...props}
    />,
  );

describe("SegmentedControlBase", () => {
  it("renders options as a labelled radiogroup", () => {
    renderSegmentedControl({ id: "view-control", defaultValue: "week" });

    const group = screen.getByRole("radiogroup", { name: "View" });
    expect(group).toHaveAttribute("id", "view-control");
    expect(group).toHaveAttribute("aria-orientation", "horizontal");

    expect(screen.getByRole("radio", { name: "Day" })).toHaveAttribute(
      "aria-checked",
      "false",
    );
    expect(screen.getByRole("radio", { name: "Week" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(screen.getByRole("radio", { name: "Month" })).toBeDisabled();
  });

  it("selects options in uncontrolled mode", () => {
    const onValueChange = jest.fn();
    renderSegmentedControl({ defaultValue: "day", onValueChange });

    fireEvent.click(screen.getByRole("radio", { name: "Week" }));

    expect(screen.getByRole("radio", { name: "Week" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(onValueChange).toHaveBeenCalledWith("week", options[1]);
  });

  it("honors controlled value", () => {
    const onValueChange = jest.fn();
    renderSegmentedControl({ value: "day", onValueChange });

    fireEvent.click(screen.getByRole("radio", { name: "Week" }));

    expect(screen.getByRole("radio", { name: "Day" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(onValueChange).toHaveBeenCalledWith("week", options[1]);
  });

  it("supports arrow, home, and end keyboard selection", () => {
    const onValueChange = jest.fn();
    renderSegmentedControl({
      defaultValue: "day",
      onValueChange,
      options: [
        { value: "day", label: "Day" },
        { value: "week", label: "Week" },
        { value: "month", label: "Month" },
      ],
    });

    const day = screen.getByRole("radio", { name: "Day" });
    day.focus();

    fireEvent.keyDown(day, { key: "ArrowRight" });
    expect(screen.getByRole("radio", { name: "Week" })).toHaveFocus();
    expect(screen.getByRole("radio", { name: "Week" })).toHaveAttribute(
      "aria-checked",
      "true",
    );

    fireEvent.keyDown(screen.getByRole("radio", { name: "Week" }), {
      key: "End",
    });
    expect(screen.getByRole("radio", { name: "Month" })).toHaveFocus();

    fireEvent.keyDown(screen.getByRole("radio", { name: "Month" }), {
      key: "Home",
    });
    expect(screen.getByRole("radio", { name: "Day" })).toHaveFocus();
    expect(onValueChange).toHaveBeenLastCalledWith("day", {
      value: "day",
      label: "Day",
    });
  });

  it("renders a hidden form input when name is provided", () => {
    renderSegmentedControl({
      name: "view",
      defaultValue: "week",
      required: true,
    });

    expect(screen.getByTestId("segmented-control-input")).toHaveAttribute(
      "name",
      "view",
    );
    expect(screen.getByTestId("segmented-control-input")).toHaveValue("week");
    expect(screen.getByTestId("segmented-control-input")).toHaveAttribute(
      "required",
    );
  });

  it("connects screen-reader-only text with aria-describedby", () => {
    renderSegmentedControl({
      id: "segmented-control-custom",
      srOnlyText: "Choose a dashboard density",
    });

    expect(
      screen.getByTestId("segmented-control-sr-only-text"),
    ).toHaveTextContent("Choose a dashboard density");
    expect(screen.getByTestId("segmented-control-root")).toHaveAttribute(
      "aria-describedby",
      "segmented-control-custom-sr-description",
    );
  });

  it("applies style, layout, disabled, loading, and custom classes", () => {
    renderSegmentedControl({
      theme: "secondary",
      state: "success",
      outline: true,
      glass: true,
      rounding: "large",
      shadow: "strong",
      orientation: "vertical",
      fullWidth: true,
      equalWidth: true,
      disabled: true,
      loading: true,
      containerClassName: "customContainer",
      labelClassName: "customLabel",
      contentClassName: "customContent",
      optionClassName: "customOption",
      selectedOptionClassName: "customSelected",
    });

    const root = screen.getByTestId("segmented-control-root");
    expect(screen.getByTestId("segmented-control")).toHaveClass(
      "customContainer",
    );
    expect(screen.getByTestId("segmented-control-label")).toHaveClass(
      "customLabel",
    );
    expect(screen.getByTestId("segmented-control-content")).toHaveClass(
      "customContent",
    );
    expect(root).toHaveClass(
      "secondary",
      "success",
      "outline",
      "glass",
      "roundLarge",
      "shadowStrong",
      "vertical",
      "fullWidth",
      "equalWidth",
      "disabled",
      "loading",
    );
    expect(root).toHaveAttribute("aria-busy", "true");
    expect(root).toHaveAttribute("aria-disabled", "true");
    expect(screen.getByTestId("segmented-control-loader")).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Day" })).toHaveClass(
      "customOption",
      "customSelected",
    );
  });

  it("forwards refs to the root", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <SegmentedControlBase
        label="View"
        options={options}
        classMap={classMap}
        ref={ref}
      />,
    );

    expect(ref.current).toBe(screen.getByTestId("segmented-control-root"));
  });

  it("has no accessibility violations", async () => {
    const { container } = renderSegmentedControl({
      srOnlyText: "Choose the current dashboard range",
    });

    expect(await axe(container)).toHaveNoViolations();
  });
});
