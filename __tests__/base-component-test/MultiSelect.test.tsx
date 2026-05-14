import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { axe, toHaveNoViolations } from "jest-axe";
import MultiSelectBase from "@/components/MultiSelect/MultiSelectBase";

expect.extend(toHaveNoViolations);

const options = [
  { value: "button", label: "Button", description: "Actions" },
  { value: "card", label: "Card", description: "Surfaces" },
  { value: "modal", label: "Modal", disabled: true },
  { value: "tabs", label: "Tabs" },
];

const classMap = {
  container: "container",
  label: "label",
  labelTop: "labelTop",
  labelBottom: "labelBottom",
  labelLeft: "labelLeft",
  labelRight: "labelRight",
  root: "root",
  trigger: "trigger",
  valueList: "valueList",
  chip: "chip",
  chipLabel: "chipLabel",
  placeholder: "placeholder",
  summary: "summary",
  icon: "icon",
  clearButton: "clearButton",
  popover: "popover",
  searchInput: "searchInput",
  listbox: "listbox",
  option: "option",
  optionText: "optionText",
  description: "description",
  checkbox: "checkbox",
  status: "status",
  selected: "selected",
  active: "active",
  optionDisabled: "optionDisabled",
  loader: "loader",
  nativeRequired: "nativeRequired",
  srOnly: "srOnly",
  primary: "primary",
  secondary: "secondary",
  success: "success",
  error: "error",
  clear: "clear",
  outline: "outline",
  glass: "glass",
  disabled: "disabled",
  loading: "loading",
  open: "open",
  shadowLight: "shadowLight",
  shadowStrong: "shadowStrong",
  roundMedium: "roundMedium",
  roundLarge: "roundLarge",
};

const renderMultiSelect = (
  props: Partial<React.ComponentProps<typeof MultiSelectBase>> = {},
) =>
  render(
    <MultiSelectBase
      label="Components"
      options={options}
      classMap={classMap}
      {...props}
    />,
  );

describe("MultiSelectBase", () => {
  it("renders a labelled trigger with placeholder text", () => {
    renderMultiSelect();

    expect(screen.getByTestId("multi-select-label")).toHaveTextContent(
      "Components",
    );
    expect(
      screen.getByRole("button", { name: "Components" }),
    ).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByTestId("multi-select-values")).toHaveTextContent(
      "Select options",
    );
  });

  it("opens the listbox and selects multiple options", () => {
    const onChange = jest.fn();
    renderMultiSelect({ onChange });

    fireEvent.click(screen.getByTestId("multi-select-trigger"));
    expect(screen.getByRole("listbox")).toHaveAttribute(
      "aria-multiselectable",
      "true",
    );

    fireEvent.click(screen.getByTestId("multi-select-option-button"));
    expect(onChange).toHaveBeenLastCalledWith(
      ["button"],
      [expect.objectContaining({ value: "button" })],
    );

    fireEvent.click(screen.getByTestId("multi-select-option-card"));
    expect(onChange).toHaveBeenLastCalledWith(
      ["button", "card"],
      [
        expect.objectContaining({ value: "button" }),
        expect.objectContaining({ value: "card" }),
      ],
    );
    expect(screen.getByTestId("multi-select-chip-button")).toHaveTextContent(
      "Button",
    );
    expect(screen.getByTestId("multi-select-chip-card")).toHaveTextContent(
      "Card",
    );
  });

  it("supports controlled selected values", () => {
    const onChange = jest.fn();
    renderMultiSelect({ value: ["tabs"], onChange });

    expect(screen.getByTestId("multi-select-chip-tabs")).toHaveTextContent(
      "Tabs",
    );
    fireEvent.click(screen.getByTestId("multi-select-trigger"));
    fireEvent.click(screen.getByTestId("multi-select-option-button"));

    expect(onChange).toHaveBeenCalledWith(
      ["tabs", "button"],
      [
        expect.objectContaining({ value: "tabs" }),
        expect.objectContaining({ value: "button" }),
      ],
    );
    expect(screen.queryByTestId("multi-select-chip-button")).not.toBeInTheDocument();
  });

  it("filters options with the search input", () => {
    renderMultiSelect();

    fireEvent.click(screen.getByTestId("multi-select-trigger"));
    fireEvent.change(screen.getByTestId("multi-select-search"), {
      target: { value: "car" },
    });

    expect(screen.getByTestId("multi-select-option-card")).toBeInTheDocument();
    expect(screen.queryByTestId("multi-select-option-button")).not.toBeInTheDocument();
  });

  it("shows an empty message when filtering has no matches", () => {
    renderMultiSelect({ emptyMessage: "Nothing matches" });

    fireEvent.click(screen.getByTestId("multi-select-trigger"));
    fireEvent.change(screen.getByTestId("multi-select-search"), {
      target: { value: "zzz" },
    });

    expect(screen.getByTestId("multi-select-empty")).toHaveTextContent(
      "Nothing matches",
    );
  });

  it("clears selected values", () => {
    const onChange = jest.fn();
    renderMultiSelect({ defaultValue: ["button", "card"], onChange });

    fireEvent.click(screen.getByTestId("multi-select-clear"));

    expect(onChange).toHaveBeenCalledWith([], []);
    expect(screen.queryByTestId("multi-select-chip-button")).not.toBeInTheDocument();
  });

  it("enforces max selected options", () => {
    renderMultiSelect({ defaultValue: ["button"], maxSelected: 1 });

    fireEvent.click(screen.getByTestId("multi-select-trigger"));

    expect(screen.getByTestId("multi-select-option-card")).toBeDisabled();
    expect(screen.getByTestId("multi-select-option-button")).not.toBeDisabled();
  });

  it("supports keyboard selection", () => {
    const onChange = jest.fn();
    renderMultiSelect({ onChange });

    fireEvent.keyDown(screen.getByTestId("multi-select-trigger"), {
      key: "ArrowDown",
    });
    fireEvent.keyDown(screen.getByTestId("multi-select-search"), {
      key: "Enter",
    });

    expect(onChange).toHaveBeenCalledWith(
      ["button"],
      [expect.objectContaining({ value: "button" })],
    );
  });

  it("renders hidden inputs for form submission", () => {
    renderMultiSelect({ name: "components", defaultValue: ["button", "tabs"] });

    expect(screen.getByTestId("multi-select-hidden-button")).toHaveAttribute(
      "name",
      "components",
    );
    expect(screen.getByTestId("multi-select-hidden-tabs")).toHaveValue("tabs");
  });

  it("connects screen-reader-only text with aria-describedby", () => {
    renderMultiSelect({
      id: "component-picker",
      srOnlyText: "Choose one or more components",
    });

    expect(screen.getByTestId("multi-select-sr-only-text")).toHaveTextContent(
      "Choose one or more components",
    );
    expect(screen.getByTestId("multi-select-trigger")).toHaveAttribute(
      "aria-describedby",
      "component-picker-sr-description",
    );
  });

  it("applies theme, state, outline, glass, rounding, and shadow classes", () => {
    renderMultiSelect({
      theme: "secondary",
      state: "success",
      outline: true,
      glass: true,
      rounding: "large",
      shadow: "strong",
    });

    const root = screen.getByTestId("multi-select-root");
    expect(root).toHaveClass("root");
    expect(root).toHaveClass("secondary");
    expect(root).toHaveClass("success");
    expect(root).toHaveClass("outline");
    expect(root).toHaveClass("glass");
    expect(root).toHaveClass("roundLarge");
    expect(root).toHaveClass("shadowStrong");
  });

  it("applies label position and custom class names", () => {
    renderMultiSelect({
      labelPosition: "left",
      containerClassName: "customContainer",
      labelClassName: "customLabel",
      triggerClassName: "customTrigger",
      chipClassName: "customChip",
      defaultValue: ["button"],
    });

    expect(screen.getByTestId("multi-select")).toHaveClass("labelLeft");
    expect(screen.getByTestId("multi-select")).toHaveClass("customContainer");
    expect(screen.getByTestId("multi-select-label")).toHaveClass("customLabel");
    expect(screen.getByTestId("multi-select-trigger")).toHaveClass(
      "customTrigger",
    );
    expect(screen.getByTestId("multi-select-chip-button")).toHaveClass(
      "customChip",
    );
  });

  it("disables trigger actions when disabled", () => {
    renderMultiSelect({ disabled: true, defaultValue: ["button"] });

    expect(screen.getByTestId("multi-select-root")).toHaveClass("disabled");
    expect(screen.getByTestId("multi-select-trigger")).toBeDisabled();
    expect(screen.getByTestId("multi-select-clear")).toBeDisabled();
  });

  it("shows loading semantics", () => {
    renderMultiSelect({ loading: true, defaultValue: ["button"] });

    expect(screen.getByTestId("multi-select-root")).toHaveAttribute(
      "aria-busy",
      "true",
    );
    expect(screen.getByTestId("multi-select-loader")).toBeInTheDocument();
  });

  it("forwards refs to the root", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <MultiSelectBase
        label="Components"
        options={options}
        classMap={classMap}
        ref={ref}
      />,
    );

    expect(ref.current).toBe(screen.getByTestId("multi-select-root"));
  });

  it("has no accessibility violations", async () => {
    const { container } = renderMultiSelect({
      defaultValue: ["button"],
      srOnlyText: "Choose one or more components",
    });

    expect(await axe(container)).toHaveNoViolations();
  });
});
