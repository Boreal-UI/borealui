import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
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
  large: "large",
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
  disabled: "disabled",
  loading: "loading",
  open: "open",
  shadowLight: "shadowLight",
  shadowStrong: "shadowStrong",
  roundMedium: "roundMedium",
  roundLarge: "roundLarge",
  glass: "glass",
  outline: "outline",
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
  it("applies the selected size class", () => {
    renderMultiSelect({ size: "large" });
    expect(screen.getByTestId("multi-select-root")).toHaveClass("large");
  });

  it("renders a labelled trigger with placeholder text", () => {
    renderMultiSelect();

    expect(screen.getByTestId("multi-select-label")).toHaveTextContent(
      "Components",
    );
    expect(screen.getByRole("button", { name: "Components" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
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
    expect(
      screen.queryByTestId("multi-select-chip-button"),
    ).not.toBeInTheDocument();
  });

  it("filters options with the search input", () => {
    renderMultiSelect();

    fireEvent.click(screen.getByTestId("multi-select-trigger"));
    fireEvent.change(screen.getByTestId("multi-select-search"), {
      target: { value: "car" },
    });

    expect(screen.getByTestId("multi-select-option-card")).toBeInTheDocument();
    expect(
      screen.queryByTestId("multi-select-option-button"),
    ).not.toBeInTheDocument();
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
    expect(
      screen.queryByTestId("multi-select-chip-button"),
    ).not.toBeInTheDocument();
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

  it("keeps DOM focus on the search input while the active option changes", async () => {
    renderMultiSelect();

    fireEvent.keyDown(screen.getByTestId("multi-select-trigger"), {
      key: "ArrowDown",
    });

    const search = screen.getByTestId("multi-select-search");
    await waitFor(() => expect(search).toHaveFocus());

    fireEvent.keyDown(search, { key: "ArrowDown" });

    expect(search).toHaveFocus();
    expect(screen.getByTestId("multi-select-option-card")).toHaveClass(
      "active",
    );
    expect(search).not.toHaveAttribute("aria-activedescendant");
  });

  it("clamps at boundaries and preserves disabled options in the active sequence", () => {
    const onChange = jest.fn();
    renderMultiSelect({ onChange });

    fireEvent.click(screen.getByTestId("multi-select-trigger"));
    const search = screen.getByTestId("multi-select-search");

    fireEvent.keyDown(search, { key: "ArrowUp" });
    expect(screen.getByTestId("multi-select-option-button")).toHaveClass(
      "active",
    );

    fireEvent.keyDown(search, { key: "ArrowDown" });
    fireEvent.keyDown(search, { key: "ArrowDown" });
    expect(screen.getByTestId("multi-select-option-modal")).toHaveClass(
      "active",
    );
    fireEvent.keyDown(search, { key: "Enter" });
    expect(onChange).not.toHaveBeenCalled();

    fireEvent.keyDown(search, { key: "ArrowDown" });
    fireEvent.keyDown(search, { key: "ArrowDown" });
    expect(screen.getByTestId("multi-select-option-tabs")).toHaveClass(
      "active",
    );
    fireEvent.keyDown(search, { key: "Enter" });
    expect(onChange).toHaveBeenCalledWith(
      ["tabs"],
      [expect.objectContaining({ value: "tabs" })],
    );
  });

  it("resets the active option when filtering removes it", () => {
    renderMultiSelect();

    fireEvent.click(screen.getByTestId("multi-select-trigger"));
    const search = screen.getByTestId("multi-select-search");
    fireEvent.keyDown(search, { key: "ArrowDown" });
    expect(screen.getByTestId("multi-select-option-card")).toHaveClass(
      "active",
    );

    fireEvent.change(search, { target: { value: "but" } });

    expect(screen.getByTestId("multi-select-option-button")).toHaveClass(
      "active",
    );
    expect(screen.queryByTestId("multi-select-option-card")).not.toBeInTheDocument();
  });

  it("keeps empty and all-disabled results stable under keyboard input", () => {
    const onChange = jest.fn();
    const { rerender } = renderMultiSelect({ onChange });

    fireEvent.click(screen.getByTestId("multi-select-trigger"));
    const search = screen.getByTestId("multi-select-search");
    fireEvent.change(search, { target: { value: "no match" } });
    fireEvent.keyDown(search, { key: "ArrowDown" });
    fireEvent.keyDown(search, { key: "ArrowUp" });
    fireEvent.keyDown(search, { key: "Enter" });
    expect(screen.getByTestId("multi-select-empty")).toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();

    rerender(
      <MultiSelectBase
        label="Components"
        options={[
          { value: "first", label: "First", disabled: true },
          { value: "second", label: "Second", disabled: true },
        ]}
        onChange={onChange}
        classMap={classMap}
      />,
    );

    const disabledSearch = screen.getByTestId("multi-select-search");
    fireEvent.change(disabledSearch, { target: { value: "" } });
    fireEvent.keyDown(disabledSearch, { key: "ArrowDown" });
    expect(screen.getByTestId("multi-select-option-second")).toHaveClass(
      "active",
    );
    fireEvent.keyDown(disabledSearch, { key: "Enter" });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("leaves Space and Tab to their native input behavior", () => {
    renderMultiSelect();

    fireEvent.click(screen.getByTestId("multi-select-trigger"));
    const search = screen.getByTestId("multi-select-search");

    expect(fireEvent.keyDown(search, { key: " " })).toBe(true);
    expect(screen.getByTestId("multi-select-popover")).toBeInTheDocument();

    expect(fireEvent.keyDown(search, { key: "Tab" })).toBe(true);
    expect(screen.getByTestId("multi-select-popover")).toBeInTheDocument();

    fireEvent.focusIn(document.body);
    expect(screen.queryByTestId("multi-select-popover")).not.toBeInTheDocument();
  });

  it("closes on Escape without changing selected values", () => {
    const onChange = jest.fn();
    renderMultiSelect({ defaultValue: ["button"], onChange });

    fireEvent.click(screen.getByTestId("multi-select-trigger"));
    const escapeWasNotCancelled = fireEvent.keyDown(
      screen.getByTestId("multi-select-search"),
      { key: "Escape" },
    );

    expect(escapeWasNotCancelled).toBe(false);
    expect(screen.queryByTestId("multi-select-popover")).not.toBeInTheDocument();
    expect(screen.getByTestId("multi-select-chip-button")).toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("allows a consumer keyboard handler to cancel internal behavior", () => {
    const onChange = jest.fn();
    const onKeyDown = jest.fn((event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowDown" || event.key === "Enter") {
        event.preventDefault();
      }
    });
    renderMultiSelect({ onChange, onKeyDown });

    fireEvent.keyDown(screen.getByTestId("multi-select-trigger"), {
      key: "ArrowDown",
    });
    expect(screen.queryByTestId("multi-select-popover")).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId("multi-select-trigger"));
    fireEvent.keyDown(screen.getByTestId("multi-select-search"), {
      key: "Enter",
    });

    expect(onKeyDown).toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
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

  it("generates unique trigger and listbox relationships across instances", () => {
    render(
      <>
        <MultiSelectBase
          aria-label="First picker"
          options={options}
          classMap={classMap}
        />
        <MultiSelectBase
          aria-label="Second picker"
          options={options}
          classMap={classMap}
        />
      </>,
    );

    const [firstTrigger, secondTrigger] = screen.getAllByTestId(
      "multi-select-trigger",
    );
    expect(firstTrigger.getAttribute("aria-controls")).toBeTruthy();
    expect(firstTrigger).not.toHaveAttribute(
      "aria-controls",
      secondTrigger.getAttribute("aria-controls"),
    );

    fireEvent.click(firstTrigger);
    fireEvent.click(secondTrigger);
    const listboxIds = screen.getAllByRole("listbox").map(({ id }) => id);
    expect(new Set(listboxIds).size).toBe(2);
    expect(listboxIds).toEqual([
      firstTrigger.getAttribute("aria-controls"),
      secondTrigger.getAttribute("aria-controls"),
    ]);
  });

  it("applies theme, state, outline, glass, rounding, and shadow classes", () => {
    renderMultiSelect({
      theme: "secondary",
      state: "success",
      variant: "glassOutline",
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
