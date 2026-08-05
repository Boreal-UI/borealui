import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe, toHaveNoViolations } from "jest-axe";
import { FaUser } from "react-icons/fa";
import TextInputBase from "@/components/TextInput/TextInputBase";
import IconButton from "@/components/IconButton/core/IconButton";

expect.extend(toHaveNoViolations);

const mockStyles = {
  large: "large",
  container: "container",
  label: "label",
  labelTop: "labelTop",
  labelLeft: "labelLeft",
  labelRight: "labelRight",
  labelBottom: "labelBottom",
  fullWidth: "fullWidth",
  textInput: "textInput",
  input: "input",
  iconContainer: "iconContainer",
  togglePassword: "togglePassword",
  helperText: "helperText",
  errorMessage: "errorMessage",
  srOnly: "srOnly",
  primary: "primary",
  secondary: "secondary",
  error: "error",
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
  glass: "glass",
  outline: "outline",
};

describe("TextInputBase", () => {
  it("applies the selected size class", () => {
    render(
      <TextInputBase
        classMap={mockStyles}
        IconButton={IconButton}
        size="large"
      />,
    );
    expect(screen.getByTestId("text-input-wrapper")).toHaveClass("large");
  });

  it("renders a standard text input with icon and placeholder", async () => {
    const { container } = render(
      <TextInputBase
        classMap={mockStyles}
        placeholder="Username"
        IconButton={IconButton}
        icon={FaUser}
      />,
    );

    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByTestId("text-input-icon")).toBeInTheDocument();
    expect(screen.getByTestId("text-input-input")).toHaveAttribute(
      "aria-label",
      "Username",
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders a visible label and uses it instead of aria-label", () => {
    render(
      <TextInputBase
        classMap={mockStyles}
        label="Username"
        placeholder="Enter username"
        IconButton={IconButton}
      />,
    );

    const input = screen.getByTestId("text-input-input");
    const label = screen.getByTestId("text-input-label");

    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute("for", input.getAttribute("id"));
    expect(input).not.toHaveAttribute("aria-label");
    expect(input).toHaveAttribute("placeholder", " ");
  });

  it("uses an explicit aria-label when no visible label is provided", () => {
    render(
      <TextInputBase
        classMap={mockStyles}
        placeholder="Enter username"
        IconButton={IconButton}
        aria-label="Username field"
      />,
    );

    expect(
      screen.getByRole("textbox", { name: "Username field" }),
    ).toBeInTheDocument();
  });

  it("prefers the visible label over aria-label when label exists", () => {
    render(
      <TextInputBase
        classMap={mockStyles}
        label="Email"
        placeholder="Enter email"
        IconButton={IconButton}
        aria-label="Hidden email field"
      />,
    );

    const input = screen.getByLabelText("Email");
    expect(input).toBeInTheDocument();
    expect(input).not.toHaveAttribute("aria-label");
  });

  it("calls onChange with the current value and original event", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(
      <TextInputBase
        classMap={mockStyles}
        placeholder="Type here"
        IconButton={IconButton}
        onChange={handleChange}
      />,
    );

    const input = screen.getByTestId("text-input-input");
    await user.type(input, "abc");

    expect(handleChange).toHaveBeenCalled();
    expect(handleChange).toHaveBeenLastCalledWith(
      "abc",
      expect.objectContaining({
        target: expect.any(HTMLInputElement),
      }),
    );
  });

  it("renders a password input and toggles visibility", async () => {
    const user = userEvent.setup();

    render(
      <TextInputBase
        classMap={mockStyles}
        password
        IconButton={IconButton}
        placeholder="Password"
      />,
    );

    const input = screen.getByTestId("text-input-input") as HTMLInputElement;
    const toggle = screen.getByTestId("text-input-password-toggle");

    expect(input.type).toBe("password");
    expect(toggle).toHaveAttribute("aria-label", "Show password");
    expect(toggle).toHaveAttribute("aria-pressed", "false");

    await user.click(toggle);
    expect(input.type).toBe("text");
    expect(toggle).toHaveAttribute("aria-label", "Hide password");
    expect(toggle).toHaveAttribute("aria-pressed", "true");

    await user.click(toggle);
    expect(input.type).toBe("password");
    expect(toggle).toHaveAttribute("aria-label", "Show password");
    expect(toggle).toHaveAttribute("aria-pressed", "false");
  });

  it("respects disabled and readonly props", () => {
    render(
      <TextInputBase
        classMap={mockStyles}
        placeholder="Disabled field"
        IconButton={IconButton}
        disabled
        readOnly
      />,
    );

    const input = screen.getByTestId("text-input-input");
    expect(input).toBeDisabled();
    expect(input).toHaveAttribute("readonly");
    expect(input).toHaveAttribute("aria-disabled", "true");
    expect(input).toHaveAttribute("aria-readonly", "true");
  });

  it("renders screen-reader-only text and attaches it through aria-describedby", () => {
    render(
      <TextInputBase
        classMap={mockStyles}
        placeholder="With help"
        IconButton={IconButton}
        srOnlyText="This field is required for login"
      />,
    );

    const input = screen.getByTestId("text-input-input");
    const srText = screen.getByTestId("text-input-sr-only-text");

    expect(srText).toBeInTheDocument();
    expect(srText).toHaveTextContent("This field is required for login");
    expect(input).toHaveAttribute("aria-describedby", srText.id);
  });

  it("merges external aria-describedby with generated srOnlyText description", () => {
    render(
      <>
        <p id="external-help">External helper text</p>
        <TextInputBase
          classMap={mockStyles}
          placeholder="Username"
          IconButton={IconButton}
          aria-describedby="external-help"
          srOnlyText="Internal hidden helper"
        />
      </>,
    );

    const input = screen.getByTestId("text-input-input");
    const srText = screen.getByTestId("text-input-sr-only-text");

    expect(input).toHaveAttribute(
      "aria-describedby",
      `external-help ${srText.id}`,
    );
  });

  it("supports aria-labelledby", () => {
    render(
      <>
        <span id="custom-label">Custom external label</span>
        <TextInputBase
          classMap={mockStyles}
          IconButton={IconButton}
          aria-labelledby="custom-label"
        />
      </>,
    );

    expect(
      screen.getByRole("textbox", { name: "Custom external label" }),
    ).toBeInTheDocument();
  });

  it("applies aria-invalid automatically when state is error", () => {
    render(
      <TextInputBase
        classMap={mockStyles}
        placeholder="Email"
        IconButton={IconButton}
        state="error"
      />,
    );

    expect(screen.getByTestId("text-input-input")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("allows explicit aria-invalid to override computed state", () => {
    render(
      <TextInputBase
        classMap={mockStyles}
        placeholder="Email"
        IconButton={IconButton}
        state="error"
        aria-invalid={false}
      />,
    );

    expect(screen.getByTestId("text-input-input")).toHaveAttribute(
      "aria-invalid",
      "false",
    );
  });

  it("applies required and aria-required correctly", () => {
    render(
      <TextInputBase
        classMap={mockStyles}
        placeholder="Required input"
        IconButton={IconButton}
        required
      />,
    );

    const input = screen.getByTestId("text-input-input");
    expect(input).toBeRequired();
    expect(input).toHaveAttribute("aria-required", "true");
  });

  it("allows explicit aria-required to override required mapping", () => {
    render(
      <TextInputBase
        classMap={mockStyles}
        placeholder="Optional input"
        IconButton={IconButton}
        required
        aria-required={false}
      />,
    );

    expect(screen.getByTestId("text-input-input")).toHaveAttribute(
      "aria-required",
      "false",
    );
  });

  it("supports advanced ARIA props for composite widgets", () => {
    render(
      <TextInputBase
        classMap={mockStyles}
        IconButton={IconButton}
        role="combobox"
        aria-controls="suggestions-list"
        aria-expanded={true}
        aria-haspopup="listbox"
        aria-activedescendant="option-1"
        aria-description="Choose a suggested username"
      />,
    );

    const input = screen.getByTestId("text-input-input");

    expect(input).toHaveAttribute("role", "combobox");
    expect(input).toHaveAttribute("aria-controls", "suggestions-list");
    expect(input).toHaveAttribute("aria-expanded", "true");
    expect(input).toHaveAttribute("aria-haspopup", "listbox");
    expect(input).toHaveAttribute("aria-activedescendant", "option-1");
    expect(input).toHaveAttribute(
      "aria-description",
      "Choose a suggested username",
    );
  });

  it("passes native password autocomplete values through", () => {
    render(
      <TextInputBase
        classMap={mockStyles}
        password
        autoComplete="current-password"
        IconButton={IconButton}
      />,
    );

    expect(screen.getByTestId("text-input-input")).toHaveAttribute(
      "autoComplete",
      "current-password",
    );
  });

  it("passes native autocomplete values through", () => {
    render(
      <TextInputBase
        classMap={mockStyles}
        autoComplete="on"
        IconButton={IconButton}
      />,
    );

    expect(screen.getByTestId("text-input-input")).toHaveAttribute(
      "autoComplete",
      "on",
    );
  });

  it("does not force an autocomplete value by default", () => {
    render(<TextInputBase classMap={mockStyles} IconButton={IconButton} />);

    expect(screen.getByTestId("text-input-input")).not.toHaveAttribute(
      "autocomplete",
    );
  });

  it("supports explicit autocomplete tokens", () => {
    render(
      <TextInputBase
        classMap={mockStyles}
        autoComplete="email"
        IconButton={IconButton}
      />,
    );

    expect(screen.getByTestId("text-input-input")).toHaveAttribute(
      "autoComplete",
      "email",
    );
  });

  it("applies custom id to both label and input association", () => {
    render(
      <TextInputBase
        id="custom-input-id"
        classMap={mockStyles}
        label="First name"
        IconButton={IconButton}
      />,
    );

    const label = screen.getByTestId("text-input-label");
    const input = screen.getByTestId("text-input-input");

    expect(input).toHaveAttribute("id", "custom-input-id");
    expect(label).toHaveAttribute("for", "custom-input-id");
  });

  it("applies wrapper, outline, theme, rounding, shadow, and disabled classes", () => {
    render(
      <TextInputBase
        classMap={mockStyles}
        IconButton={IconButton}
        variant="glassOutline"
        theme="primary"
        rounding="medium"
        shadow="light"
        disabled
      />,
    );

    const wrapper = screen.getByTestId("text-input-wrapper");

    expect(wrapper).toHaveClass("textInput");
    expect(wrapper).toHaveClass("primary");
    expect(wrapper).toHaveClass("glass");
    expect(wrapper).toHaveClass("outline");
    expect(wrapper).toHaveClass("disabled");
    expect(wrapper).toHaveClass("roundMedium");
    expect(wrapper).toHaveClass("shadowLight");
  });

  it("applies the correct label position class to the container", () => {
    render(
      <TextInputBase
        classMap={mockStyles}
        label="Username"
        labelPosition="left"
        IconButton={IconButton}
      />,
    );

    expect(screen.getByTestId("text-input")).toHaveClass("labelLeft");
  });

  it("applies full-width styling to the container and wrapper when enabled", () => {
    render(
      <TextInputBase classMap={mockStyles} IconButton={IconButton} fullWidth />,
    );

    expect(screen.getByTestId("text-input")).toHaveClass("fullWidth");
    expect(screen.getByTestId("text-input-wrapper")).toHaveClass("fullWidth");
  });

  it("does not apply full-width styling by default", () => {
    render(<TextInputBase classMap={mockStyles} IconButton={IconButton} />);

    expect(screen.getByTestId("text-input")).not.toHaveClass("fullWidth");
    expect(screen.getByTestId("text-input-wrapper")).not.toHaveClass(
      "fullWidth",
    );
  });

  it("applies custom class names to text input sections", () => {
    render(
      <TextInputBase
        classMap={mockStyles}
        label="Password"
        password
        icon={FaUser}
        srOnlyText="Private field"
        IconButton={IconButton}
        containerClassName="custom-container"
        labelClassName="custom-label"
        iconClassName="custom-icon"
        inputClassName="custom-input"
        togglePasswordClassName="custom-toggle"
        srOnlyClassName="custom-sr-only"
      />,
    );

    expect(screen.getByTestId("text-input")).toHaveClass(
      "container",
      "custom-container",
    );
    expect(screen.getByTestId("text-input-label")).toHaveClass(
      "label",
      "custom-label",
    );
    expect(screen.getByTestId("text-input-icon")).toHaveClass(
      "iconContainer",
      "custom-icon",
    );
    expect(screen.getByTestId("text-input-input")).toHaveClass(
      "input",
      "custom-input",
    );
    expect(screen.getByTestId("text-input-password-toggle")).toHaveClass(
      "togglePassword",
      "custom-toggle",
    );
    expect(screen.getByTestId("text-input-sr-only-text")).toHaveClass(
      "sr_only",
      "custom-sr-only",
    );
  });

  it("renders FormField-style helper and error content with custom classes", () => {
    render(
      <TextInputBase
        classMap={mockStyles}
        IconButton={IconButton}
        helperText="Use your work email"
        errorMessage="Email is required"
        helperTextClassName="custom-helper"
        errorMessageClassName="custom-error"
      />,
    );

    const input = screen.getByTestId("text-input-input");
    const helper = screen.getByTestId("text-input-helper-text");
    const error = screen.getByTestId("text-input-error-message");

    expect(helper).toHaveClass("helperText", "custom-helper");
    expect(error).toHaveClass("errorMessage", "custom-error");
    expect(error).toHaveAttribute("role", "alert");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute(
      "aria-describedby",
      `${helper.id} ${error.id}`,
    );
  });

  it("passes through native input attributes", () => {
    render(
      <TextInputBase
        classMap={mockStyles}
        IconButton={IconButton}
        name="username"
        value="davin"
        maxLength={20}
        inputMode="text"
      />,
    );

    const input = screen.getByTestId("text-input-input");
    expect(input).toHaveAttribute("name", "username");
    expect(input).toHaveValue("davin");
    expect(input).toHaveAttribute("maxlength", "20");
    expect(input).toHaveAttribute("inputmode", "text");
  });

  it("renders no password toggle when password is false", () => {
    render(
      <TextInputBase
        classMap={mockStyles}
        IconButton={IconButton}
        placeholder="Regular input"
      />,
    );

    expect(
      screen.queryByTestId("text-input-password-toggle"),
    ).not.toBeInTheDocument();
  });

  it("has no accessibility violations in a labeled password configuration", async () => {
    const { container } = render(
      <TextInputBase
        classMap={mockStyles}
        label="Password"
        password
        srOnlyText="Password must be at least 8 characters"
        IconButton={IconButton}
        required
        state="error"
      />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
