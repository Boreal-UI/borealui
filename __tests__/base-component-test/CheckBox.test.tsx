import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe, toHaveNoViolations } from "jest-axe";
import CheckboxBase from "@/components/Checkbox/CheckboxBase";

expect.extend(toHaveNoViolations);

const classMap = {
  checkbox: "checkbox",
  labelWrapper: "labelWrapper",
  input: "checkboxInput",
  box: "checkboxBox",
  label: "checkboxLabel",
  description: "checkboxDescription",
  errorMessage: "checkboxErrorMessage",
  invalid: "invalid",

  primary: "themePrimary",
  secondary: "themeSecondary",

  success: "stateSuccess",
  warning: "stateWarning",
  error: "stateError",

  left: "labelLeft",
  right: "labelRight",

  xs: "sizeXs",
  small: "sizeSmall",
  medium: "sizeMedium",
  large: "sizeLarge",
  xl: "sizeXl",

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

  disabled: "disabled",
  indeterminate: "indeterminate",
  glass: "glass",
};

describe("CheckboxBase", () => {
  const renderCheckbox = (
    props: Partial<React.ComponentProps<typeof CheckboxBase>> = {},
  ) =>
    render(
      <CheckboxBase
        checked={false}
        onChange={jest.fn()}
        classMap={classMap}
        data-testid="checkbox"
        {...props}
      />,
    );

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders with label on right and wires accessible label attributes", () => {
    renderCheckbox({
      checked: true,
      label: "Accept Terms",
      labelPosition: "right",
    });

    const wrapper = screen.getByTestId("checkbox-wrapper");
    const input = screen.getByLabelText("Accept Terms");
    const label = screen.getByTestId("checkbox-label");
    const box = screen.getByTestId("checkbox-box");

    expect(wrapper).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(label).toHaveTextContent("Accept Terms");
    expect(box).toBeInTheDocument();

    expect(input).toHaveAttribute("type", "checkbox");
    expect(input).toBeChecked();
    expect(input).toHaveAttribute(
      "aria-labelledby",
      expect.stringContaining("label"),
    );
    expect(input).toHaveAttribute("aria-checked", "true");
  });

  it("renders with label on left", () => {
    renderCheckbox({
      label: "Enable Notifications",
      labelPosition: "left",
    });

    const wrapper = screen.getByTestId("checkbox-wrapper");
    const label = screen.getByTestId("checkbox-label");
    const input = screen.getByLabelText("Enable Notifications");

    expect(wrapper).toBeInTheDocument();
    expect(label).toHaveTextContent("Enable Notifications");
    expect(input).toBeInTheDocument();

    const labelWrapper = label.parentElement;
    expect(labelWrapper).toBeInTheDocument();
    expect(labelWrapper?.firstChild).toBe(label);
  });

  it("fires onChange with true when toggled from unchecked", () => {
    const onChange = jest.fn();

    render(
      <CheckboxBase
        label="I agree"
        classMap={classMap}
        data-testid="checkbox-toggle"
        onChange={onChange}
        checked={false}
      />,
    );

    fireEvent.click(screen.getByLabelText("I agree"));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("fires onChange with false when toggled from checked", () => {
    const onChange = jest.fn();

    render(
      <CheckboxBase
        label="Subscribed"
        classMap={classMap}
        data-testid="checkbox-toggle"
        onChange={onChange}
        checked={true}
      />,
    );

    fireEvent.click(screen.getByLabelText("Subscribed"));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it("handles indeterminate state", () => {
    renderCheckbox({
      label: "Indeterminate",
      indeterminate: true,
      checked: false,
    });

    const input = screen.getByLabelText("Indeterminate");
    const box = screen.getByTestId("checkbox-box");

    expect(input).toHaveAttribute("aria-checked", "mixed");
    expect(box).toHaveClass("indeterminate");
  });

  it("sets the native indeterminate property on the input", () => {
    renderCheckbox({
      label: "Partially selected",
      indeterminate: true,
    });

    const input = screen.getByLabelText(
      "Partially selected",
    ) as HTMLInputElement;

    expect(input.indeterminate).toBe(true);
  });

  it("sets aria-checked to false when not indeterminate and unchecked", () => {
    renderCheckbox({
      label: "Normal checkbox",
      indeterminate: false,
      checked: false,
    });

    const input = screen.getByLabelText("Normal checkbox");
    expect(input).toHaveAttribute("aria-checked", "false");
  });

  it("sets aria-checked to true when checked", () => {
    renderCheckbox({
      label: "Checked checkbox",
      checked: true,
    });

    const input = screen.getByLabelText("Checked checkbox");
    expect(input).toHaveAttribute("aria-checked", "true");
  });

  it("respects disabled state", async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();

    render(
      <CheckboxBase
        checked={false}
        onChange={onChange}
        disabled
        label="Disabled checkbox"
        classMap={classMap}
        data-testid="checkbox-disabled"
      />,
    );

    const input = screen.getByLabelText("Disabled checkbox");
    const wrapper = screen.getByTestId("checkbox-disabled-wrapper");

    expect(input).toBeDisabled();
    expect(wrapper).toHaveClass("disabled");
    expect(input).not.toBeChecked();

    await user.click(input);

    expect(onChange).not.toHaveBeenCalled();
    expect(input).not.toBeChecked();
  });

  it("renders without a label", () => {
    renderCheckbox({
      "aria-label": "Standalone checkbox",
    });

    const wrapper = screen.getByTestId("checkbox-wrapper");
    const input = screen.getByRole("checkbox", {
      name: "Standalone checkbox",
    });

    expect(wrapper).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(screen.queryByTestId("checkbox-label")).not.toBeInTheDocument();
  });

  it("does not set aria-labelledby when label is absent and aria-label is used", () => {
    renderCheckbox({
      "aria-label": "Checkbox without visible label",
    });

    const input = screen.getByRole("checkbox", {
      name: "Checkbox without visible label",
    });

    expect(input).toHaveAttribute(
      "aria-label",
      "Checkbox without visible label",
    );
    expect(input).not.toHaveAttribute("aria-labelledby");
  });

  it("uses a custom id when provided", () => {
    renderCheckbox({
      id: "custom-checkbox-id",
      label: "Custom ID",
    });

    const input = screen.getByLabelText("Custom ID");
    const label = screen.getByTestId("checkbox-label");

    expect(input).toHaveAttribute("id", "custom-checkbox-id");
    expect(label).toHaveAttribute("id", "custom-checkbox-id-label");
  });

  it("forwards extra props to the input element", () => {
    renderCheckbox({
      label: "Forward props",
      name: "preferences",
      value: "email",
      required: true,
    });

    const input = screen.getByLabelText("Forward props");

    expect(input).toHaveAttribute("name", "preferences");
    expect(input).toHaveAttribute("value", "email");
    expect(input).toBeRequired();
  });

  it.each([
    ["xs", "sizeXs"],
    ["small", "sizeSmall"],
    ["medium", "sizeMedium"],
    ["large", "sizeLarge"],
    ["xl", "sizeXl"],
  ] as const)(
    "applies the %s size class used for checkbox box sizing",
    (size, expectedClass) => {
      renderCheckbox({
        label: `${size} checkbox`,
        size,
      });

      const wrapper = screen.getByTestId("checkbox-wrapper");
      const box = screen.getByTestId("checkbox-box");

      expect(wrapper).toHaveClass(expectedClass);
      expect(box).toHaveClass("checkboxBox");
    },
  );

  it("uses the native checked state for the filled checkbox indicator", () => {
    renderCheckbox({
      label: "Filled checkbox",
      checked: true,
    });

    const input = screen.getByLabelText("Filled checkbox");
    const box = screen.getByTestId("checkbox-box");

    expect(input).toBeChecked();
    expect(input).toHaveAttribute("aria-checked", "true");
    expect(box).toHaveClass("checkboxBox");
    expect(box).not.toHaveClass("indeterminate");
  });

  it("does not apply the indeterminate box class when unchecked normally", () => {
    renderCheckbox({
      label: "Unchecked checkbox",
      checked: false,
      indeterminate: false,
    });

    const input = screen.getByLabelText("Unchecked checkbox");
    const box = screen.getByTestId("checkbox-box");

    expect(input).not.toBeChecked();
    expect(input).toHaveAttribute("aria-checked", "false");
    expect(box).not.toHaveClass("indeterminate");
  });

  it("handles indeterminate state", () => {
    renderCheckbox({
      label: "Indeterminate",
      indeterminate: true,
      checked: false,
    });

    const input = screen.getByLabelText("Indeterminate") as HTMLInputElement;
    const box = screen.getByTestId("checkbox-box");

    expect(input).toHaveAttribute("aria-checked", "mixed");
    expect(input.indeterminate).toBe(true);
    expect(box).toHaveClass("checkboxBox");
    expect(box).toHaveClass("indeterminate");
  });

  it("applies all visual classes needed by the checkbox styling system", () => {
    renderCheckbox({
      label: "Visual checkbox",
      theme: "secondary",
      state: "warning",
      size: "large",
      shadow: "medium",
      rounding: "large",
      labelPosition: "right",
    });

    const wrapper = screen.getByTestId("checkbox-wrapper");
    const input = screen.getByLabelText("Visual checkbox");
    const box = screen.getByTestId("checkbox-box");
    const label = screen.getByTestId("checkbox-label");

    expect(wrapper).toHaveClass("checkbox");
    expect(wrapper).toHaveClass("themeSecondary");
    expect(wrapper).toHaveClass("stateWarning");
    expect(wrapper).toHaveClass("sizeLarge");
    expect(wrapper).toHaveClass("shadowMedium");
    expect(wrapper).toHaveClass("roundLarge");
    expect(wrapper).toHaveClass("labelRight");

    expect(input).toHaveClass("checkboxInput");
    expect(box).toHaveClass("checkboxBox");
    expect(label).toHaveClass("checkboxLabel");
  });

  it("applies theme, state, label position, size, shadow, rounding, disabled, invalid, glass, and custom className to wrapper", () => {
    renderCheckbox({
      label: "Styled checkbox",
      theme: "primary",
      state: "success",
      labelPosition: "left",
      size: "medium",
      shadow: "light",
      rounding: "small",
      disabled: true,
      invalid: true,
      glass: true,
      className: "custom-checkbox-class",
    });

    const wrapper = screen.getByTestId("checkbox-wrapper");

    expect(wrapper).toHaveClass("checkbox");
    expect(wrapper).toHaveClass("themePrimary");
    expect(wrapper).toHaveClass("stateSuccess");
    expect(wrapper).toHaveClass("labelLeft");
    expect(wrapper).toHaveClass("sizeMedium");
    expect(wrapper).toHaveClass("shadowLight");
    expect(wrapper).toHaveClass("roundSmall");
    expect(wrapper).toHaveClass("disabled");
    expect(wrapper).toHaveClass("invalid");
    expect(wrapper).toHaveClass("glass");
    expect(wrapper).toHaveClass("custom-checkbox-class");
  });

  it("applies input, box, and label classes", () => {
    renderCheckbox({
      label: "Styled parts",
    });

    const wrapper = screen.getByTestId("checkbox-wrapper");
    const input = screen.getByLabelText("Styled parts");
    const box = screen.getByTestId("checkbox-box");
    const label = screen.getByTestId("checkbox-label");

    expect(wrapper).toHaveClass("checkbox");
    expect(input).toHaveClass("checkboxInput");
    expect(box).toHaveClass("checkboxBox");
    expect(label).toHaveClass("checkboxLabel");
  });

  it("uses the default test id when none is provided", () => {
    render(
      <CheckboxBase
        checked={false}
        onChange={jest.fn()}
        label="Default test id"
        classMap={classMap}
      />,
    );

    expect(screen.getByTestId("checkbox-wrapper")).toBeInTheDocument();
    expect(screen.getByTestId("checkbox-label")).toBeInTheDocument();
    expect(screen.getByTestId("checkbox-box")).toBeInTheDocument();
  });

  it("renders description and connects it with aria-describedby", () => {
    renderCheckbox({
      label: "Email updates",
      description: "Receive occasional product news.",
    });

    const input = screen.getByLabelText("Email updates");
    const description = screen.getByTestId("checkbox-description");

    expect(description).toBeInTheDocument();
    expect(description).toHaveTextContent("Receive occasional product news.");
    expect(description).toHaveClass("checkboxDescription");
    expect(input).toHaveAttribute(
      "aria-describedby",
      description.getAttribute("id"),
    );
  });

  it("renders error message and connects it with aria-describedby and aria-errormessage when invalid", () => {
    renderCheckbox({
      label: "Terms agreement",
      invalid: true,
      errorMessage: "You must accept the terms.",
    });

    const input = screen.getByLabelText("Terms agreement");
    const error = screen.getByTestId("checkbox-error");

    expect(error).toBeInTheDocument();
    expect(error).toHaveTextContent("You must accept the terms.");
    expect(error).toHaveClass("checkboxErrorMessage");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute(
      "aria-errormessage",
      error.getAttribute("id"),
    );
    expect(input).toHaveAttribute(
      "aria-describedby",
      expect.stringContaining(error.getAttribute("id") as string),
    );
  });

  it("sets aria-invalid and aria-errormessage when state is error", () => {
    renderCheckbox({
      label: "Error state checkbox",
      state: "error",
      errorMessage: "Selection required.",
    });

    const input = screen.getByLabelText("Error state checkbox");
    const error = screen.getByTestId("checkbox-error");

    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute(
      "aria-errormessage",
      error.getAttribute("id"),
    );
  });

  it("combines external aria-describedby with generated description and error ids", () => {
    renderCheckbox({
      label: "Combined descriptions",
      description: "Helper text",
      errorMessage: "Error text",
      invalid: true,
      "aria-describedby": "external-help",
    });

    const input = screen.getByLabelText("Combined descriptions");
    const description = screen.getByTestId("checkbox-description");
    const error = screen.getByTestId("checkbox-error");

    expect(input).toHaveAttribute(
      "aria-describedby",
      expect.stringContaining("external-help"),
    );
    expect(input).toHaveAttribute(
      "aria-describedby",
      expect.stringContaining(description.getAttribute("id") as string),
    );
    expect(input).toHaveAttribute(
      "aria-describedby",
      expect.stringContaining(error.getAttribute("id") as string),
    );
  });

  it("uses external aria-labelledby instead of the internal label id when provided", () => {
    render(
      <>
        <span id="external-checkbox-label">External checkbox label</span>
        <CheckboxBase
          checked={false}
          onChange={jest.fn()}
          label="Internal checkbox label"
          aria-labelledby="external-checkbox-label"
          classMap={classMap}
          data-testid="checkbox"
        />
      </>,
    );

    const input = screen.getByRole("checkbox", {
      name: "External checkbox label",
    });

    expect(input).toHaveAttribute("aria-labelledby", "external-checkbox-label");
    expect(screen.getByTestId("checkbox-label")).toBeInTheDocument();
  });

  it("uses aria-label when explicitly provided", () => {
    renderCheckbox({
      label: "Visible label",
      "aria-label": "Explicit checkbox label",
    });

    const input = screen.getByRole("checkbox", {
      name: "Explicit checkbox label",
    });

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("aria-label", "Explicit checkbox label");
    expect(input).not.toHaveAttribute("aria-labelledby");
  });

  it("forwards ref to the native input", () => {
    const ref = { current: null as HTMLInputElement | null };

    render(
      <CheckboxBase
        checked={false}
        onChange={jest.fn()}
        label="Ref checkbox"
        classMap={classMap}
        ref={ref}
      />,
    );

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current?.type).toBe("checkbox");
  });

  it("has no accessibility violations in normal state", async () => {
    const { container } = render(
      <CheckboxBase
        checked={false}
        onChange={jest.fn()}
        label="Accessible checkbox"
        classMap={classMap}
        data-testid="checkbox"
      />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations in checked state", async () => {
    const { container } = render(
      <CheckboxBase
        checked={true}
        onChange={jest.fn()}
        label="Checked accessible checkbox"
        classMap={classMap}
        data-testid="checkbox"
      />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations in indeterminate state", async () => {
    const { container } = render(
      <CheckboxBase
        checked={false}
        indeterminate
        onChange={jest.fn()}
        label="Indeterminate accessible checkbox"
        classMap={classMap}
        data-testid="checkbox"
      />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations in disabled state", async () => {
    const { container } = render(
      <CheckboxBase
        checked={false}
        disabled
        onChange={jest.fn()}
        label="Disabled accessible checkbox"
        classMap={classMap}
        data-testid="checkbox"
      />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations with description and error content", async () => {
    const { container } = render(
      <CheckboxBase
        checked={false}
        onChange={jest.fn()}
        label="Accessible checkbox with help"
        description="Extra guidance text"
        errorMessage="An error occurred"
        invalid
        classMap={classMap}
        data-testid="checkbox"
      />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
