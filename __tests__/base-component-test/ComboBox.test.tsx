import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe, toHaveNoViolations } from "jest-axe";
import ComboBoxBase from "../../src/components/ComboBox/ComboBoxBase";
import type { ComboBoxOption } from "../../src/components/ComboBox/ComboBox.types";

expect.extend(toHaveNoViolations);

const options: ComboBoxOption[] = [
  {
    value: "html",
    label: "HTML",
    description: "Markup language",
  },
  {
    value: "css",
    label: "CSS",
    description: "Styling language",
  },
  {
    value: "js",
    label: "JavaScript",
  },
  {
    value: "disabled",
    label: "Disabled option",
    disabled: true,
  },
];

const classMap = {
  layout: "layout",
  labelTop: "labelTop",
  labelBottom: "labelBottom",
  labelLeft: "labelLeft",
  labelRight: "labelRight",
  labelHidden: "labelHidden",

  comboBox: "comboBox",
  input: "input",
  toggle: "toggle",
  listbox: "listbox",
  option: "option",
  active: "active",
  selected: "selected",
  disabled: "disabled",
  status: "status",
  description: "description",
  label: "label",
  helperText: "helperText",
  errorText: "errorText",

  primary: "primary",
  secondary: "secondary",
  tertiary: "tertiary",
  quaternary: "quaternary",
  clear: "clear",

  success: "success",
  warning: "warning",
  error: "error",

  outline: "outline",
  glass: "glass",

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

function renderComboBox(
  props: Partial<React.ComponentProps<typeof ComboBoxBase>> = {},
) {
  return render(
    <ComboBoxBase
      options={options}
      label="Choose technology"
      id="technology"
      testId="combo"
      classMap={classMap}
      {...props}
    />,
  );
}

describe("ComboBoxBase", () => {
  it("renders an accessible combobox with a label and default closed state", async () => {
    const { container } = renderComboBox();

    const input = screen.getByRole("combobox", {
      name: "Choose technology",
    });

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("id", "technology");
    expect(input).toHaveAttribute("aria-autocomplete", "list");
    expect(input).toHaveAttribute("aria-expanded", "false");
    expect(input).toHaveAttribute("aria-controls", "technology-listbox");
    expect(input).toHaveAttribute("autocomplete", "off");
    expect(screen.getByTestId("combo")).toHaveClass("layout", "labelTop");

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("opens the listbox on focus and renders options with descriptions", async () => {
    const user = userEvent.setup();

    renderComboBox();

    const input = screen.getByRole("combobox", {
      name: "Choose technology",
    });

    await user.click(input);

    expect(input).toHaveAttribute("aria-expanded", "true");

    const listbox = screen.getByRole("listbox");
    expect(listbox).toHaveAttribute("id", "technology-listbox");

    expect(
      screen.getByRole("option", { name: /html markup language/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("option", { name: /css styling language/i }),
    ).toHaveAttribute("aria-selected", "false");

    expect(screen.getByText("Markup language")).toBeInTheDocument();
  });

  it("toggles the listbox with the toggle button and keeps focus on the input", async () => {
    const user = userEvent.setup();

    renderComboBox();

    const input = screen.getByRole("combobox", {
      name: "Choose technology",
    });

    const toggle = screen.getByRole("button", { name: "Open options" });

    await user.click(toggle);

    expect(input).toHaveFocus();
    expect(input).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByRole("button", { name: "Close options" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByRole("button", { name: "Close options" }));
    fireEvent.click(screen.getByRole("button", { name: "Close options" }));

    expect(input).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("filters options when typing and calls onInputChange", async () => {
    const user = userEvent.setup();
    const onInputChange = jest.fn();

    renderComboBox({ onInputChange });

    const input = screen.getByRole("combobox", {
      name: "Choose technology",
    });

    await user.type(input, "cs");

    expect(onInputChange).toHaveBeenCalledWith("c");
    expect(onInputChange).toHaveBeenLastCalledWith("cs");

    expect(
      screen.getByRole("option", { name: /css styling language/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("option", { name: /html/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("option", { name: /javascript/i }),
    ).not.toBeInTheDocument();
  });

  it("renders the empty message as a polite status when no options match", async () => {
    const user = userEvent.setup();

    renderComboBox({
      emptyMessage: "Nothing matched your search",
    });

    const input = screen.getByRole("combobox", {
      name: "Choose technology",
    });

    await user.type(input, "python");

    const empty = screen.getByRole("status");

    expect(empty).toHaveTextContent("Nothing matched your search");
    expect(empty).toHaveAttribute("aria-live", "polite");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("renders the loading message as a polite status while open", async () => {
    const user = userEvent.setup();

    renderComboBox({
      loading: true,
      loadingMessage: "Fetching options",
    });

    await user.click(
      screen.getByRole("combobox", {
        name: "Choose technology",
      }),
    );

    const status = screen.getByRole("status");

    expect(status).toHaveTextContent("Fetching options");
    expect(status).toHaveAttribute("aria-live", "polite");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("selects an enabled option by click, updates the input, closes the listbox, and calls onChange", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    const onInputChange = jest.fn();

    renderComboBox({ onChange, onInputChange });

    const input = screen.getByRole("combobox", {
      name: "Choose technology",
    });

    await user.click(input);
    await user.click(screen.getByRole("option", { name: /javascript/i }));

    expect(onInputChange).toHaveBeenCalledWith("JavaScript");
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("js", {
      value: "js",
      label: "JavaScript",
    });

    expect(input).toHaveValue("JavaScript");
    expect(input).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("does not select a disabled option", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    const onInputChange = jest.fn();

    renderComboBox({ onChange, onInputChange });

    await user.click(
      screen.getByRole("combobox", {
        name: "Choose technology",
      }),
    );

    const disabledOption = screen.getByRole("option", {
      name: /disabled option/i,
    });

    expect(disabledOption).toBeDisabled();

    fireEvent.click(disabledOption);

    expect(onChange).not.toHaveBeenCalled();
    expect(onInputChange).not.toHaveBeenCalledWith("Disabled option");
  });

  it("supports keyboard navigation, active descendant, Enter selection, and Escape close", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    renderComboBox({ onChange });

    const input = screen.getByRole("combobox", {
      name: "Choose technology",
    });

    await user.click(input);

    expect(input).toHaveAttribute("aria-expanded", "true");
    expect(input).toHaveAttribute(
      "aria-activedescendant",
      "technology-option-0",
    );

    await user.keyboard("{ArrowDown}");

    expect(input).toHaveAttribute(
      "aria-activedescendant",
      "technology-option-1",
    );

    await user.keyboard("{Enter}");

    expect(onChange).toHaveBeenCalledWith("css", {
      value: "css",
      label: "CSS",
      description: "Styling language",
    });

    expect(input).toHaveValue("CSS");
    expect(input).toHaveAttribute("aria-expanded", "false");

    await user.clear(input);
    await user.keyboard("{ArrowDown}");

    expect(input).toHaveAttribute("aria-expanded", "true");

    await user.keyboard("{Escape}");

    expect(input).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("keeps ArrowUp at the first option and ArrowDown at the last option", async () => {
    const user = userEvent.setup();

    renderComboBox();

    const input = screen.getByRole("combobox", {
      name: "Choose technology",
    });

    await user.click(input);
    await user.keyboard("{ArrowUp}");

    expect(input).toHaveAttribute(
      "aria-activedescendant",
      "technology-option-0",
    );

    await user.keyboard(
      "{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}",
    );

    expect(input).toHaveAttribute(
      "aria-activedescendant",
      "technology-option-3",
    );
  });

  it("uses the selected value label as the uncontrolled input value", () => {
    renderComboBox({ value: "html" });

    expect(
      screen.getByRole("combobox", {
        name: "Choose technology",
      }),
    ).toHaveValue("HTML");
  });

  it("respects controlled inputValue and still calls onInputChange", async () => {
    const user = userEvent.setup();
    const onInputChange = jest.fn();

    renderComboBox({
      inputValue: "Ja",
      onInputChange,
    });

    const input = screen.getByRole("combobox", {
      name: "Choose technology",
    });

    expect(input).toHaveValue("Ja");

    await user.type(input, "v");

    expect(onInputChange).toHaveBeenLastCalledWith("Jav");
    expect(input).toHaveValue("Ja");
  });

  it("renders helper text and error text, links them with aria-describedby, and marks the input invalid", async () => {
    const { container } = renderComboBox({
      helperText: "Start typing to search.",
      error: "Selection is required.",
      state: "error",
    });

    const input = screen.getByRole("combobox", {
      name: "Choose technology",
    });

    expect(screen.getByText("Start typing to search.")).toHaveAttribute(
      "id",
      "technology-helper",
    );
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Selection is required.",
    );
    expect(screen.getByRole("alert")).toHaveAttribute("id", "technology-error");

    expect(input).toHaveAttribute(
      "aria-describedby",
      "technology-helper technology-error",
    );
    expect(input).toHaveAttribute("aria-invalid", "true");

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("combines custom aria-describedby with helper and error ids", () => {
    render(
      <>
        <p id="external-description">External description</p>
        <ComboBoxBase
          options={options}
          id="technology"
          testId="combo"
          label="Choose technology"
          helperText="Helpful text"
          error="Error text"
          aria-describedby="external-description"
          classMap={classMap}
        />
      </>,
    );

    expect(
      screen.getByRole("combobox", {
        name: "Choose technology",
      }),
    ).toHaveAttribute(
      "aria-describedby",
      "external-description technology-helper technology-error",
    );
  });

  it("supports aria-label when no visible label is provided", async () => {
    const { container } = renderComboBox({
      label: undefined,
      "aria-label": "Technology picker",
    });

    expect(
      screen.getByRole("combobox", {
        name: "Technology picker",
      }),
    ).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("supports aria-labelledby", async () => {
    const { container } = render(
      <>
        <span id="combo-label">Technology picker label</span>
        <ComboBoxBase
          options={options}
          id="technology"
          testId="combo"
          aria-labelledby="combo-label"
          classMap={classMap}
        />
      </>,
    );

    expect(
      screen.getByRole("combobox", {
        name: "Technology picker label",
      }),
    ).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("passes common input attributes through correctly", () => {
    renderComboBox({
      name: "technologyName",
      placeholder: "Pick one",
      required: true,
    });

    const input = screen.getByRole("combobox", {
      name: "Choose technology",
    });

    expect(input).toHaveAttribute("name", "technologyName");
    expect(input).toHaveAttribute("placeholder", "Pick one");
    expect(input).toBeRequired();
  });

  it("disables the input and toggle and prevents opening through keyboard interaction", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    renderComboBox({
      disabled: true,
      onChange,
    });

    const input = screen.getByRole("combobox", {
      name: "Choose technology",
    });
    const toggle = screen.getByRole("button", {
      name: "Open options",
    });

    expect(input).toBeDisabled();
    expect(toggle).toBeDisabled();

    fireEvent.keyDown(input, { key: "ArrowDown" });

    expect(input).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

    await user.click(toggle);

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("applies theme, state, visual, layout, and custom class names", () => {
    renderComboBox({
      theme: "secondary",
      state: "success",
      outline: true,
      glass: true,
      shadow: "strong",
      rounding: "large",
      labelPosition: "left",
      className: "custom-root",
      layoutClassName: "custom-layout",
      labelClassName: "custom-label",
      inputClassName: "custom-input",
      helperText: "Helpful",
      helperTextClassName: "custom-helper",
      error: "Error",
      errorClassName: "custom-error",
    });

    expect(screen.getByTestId("combo")).toHaveClass(
      "layout",
      "labelLeft",
      "custom-layout",
    );

    expect(screen.getByText("Choose technology")).toHaveClass(
      "label",
      "custom-label",
    );

    expect(
      screen.getByRole("combobox", {
        name: "Choose technology",
      }),
    ).toHaveClass("input", "custom-input");

    expect(screen.getByTestId("combo").querySelector(".comboBox")).toHaveClass(
      "comboBox",
      "secondary",
      "success",
      "outline",
      "glass",
      "shadowStrong",
      "roundLarge",
      "custom-root",
    );

    expect(screen.getByText("Helpful")).toHaveClass(
      "helperText",
      "custom-helper",
    );
    expect(screen.getByRole("alert")).toHaveClass("errorText", "custom-error");
  });

  it("applies custom listbox and option class names", async () => {
    const user = userEvent.setup();

    renderComboBox({
      listboxClassName: "custom-listbox",
      optionClassName: "custom-option",
      value: "html",
    });

    await user.click(
      screen.getByRole("combobox", {
        name: "Choose technology",
      }),
    );

    expect(screen.getByRole("listbox")).toHaveClass(
      "listbox",
      "custom-listbox",
    );

    expect(
      screen.getByRole("option", { name: /html markup language/i }),
    ).toHaveClass("option", "selected", "custom-option");
  });

  it("uses data-testid when testId is not provided", () => {
    renderComboBox({
      testId: undefined,
      "data-testid": "custom-combobox",
    });

    expect(screen.getByTestId("custom-combobox")).toBeInTheDocument();
    expect(screen.getByTestId("custom-combobox-input")).toBeInTheDocument();
    expect(screen.getByTestId("custom-combobox-toggle")).toBeInTheDocument();
  });
});
