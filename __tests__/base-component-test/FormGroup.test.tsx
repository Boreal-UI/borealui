import { render, screen } from "@testing-library/react";
import BaseFormGroup from "@/components/FormGroup/FormGroupBase";
import { axe, toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

const classNames = {
  wrapper: "formWrapper",
  label: "formLabel",
  srOnly: "srOnly",
  required: "formRequired",
  inputWrapper: "inputWrapper",
  inputField: "inputField",
  controller: "controller",
  helperText: "helperText",
  error: "error",
  errorText: "errorText",
  vertical: "layoutVertical",
  horizontal: "layoutHorizontal",
  xs: "spacingXs",
  medium: "spacingMedium",
  large: "spacingLarge",
  errorMessage: "hasError",
};

describe("BaseFormGroup", () => {
  const renderBasicGroup = (props = {}) =>
    render(
      <BaseFormGroup
        id="login"
        label="Login Info"
        helperText="Enter your email and password"
        classMap={classNames}
        spacing="medium"
        layout="vertical"
        {...props}
      >
        <>
          <input type="email" title="test input 1" />
          <input type="password" title="test input 2" />
        </>
      </BaseFormGroup>,
    );

  it("renders the group with label, helperText, and children", () => {
    renderBasicGroup();

    const group = screen.getByRole("group");
    expect(group).toBeInTheDocument();

    expect(screen.getByTestId("form-group-label")).toHaveTextContent(
      "Login Info",
    );
    expect(screen.getByTestId("form-group-helperText")).toHaveTextContent(
      "Enter your email and password",
    );

    expect(screen.getByTestId("form-group-wrapper-0")).toBeInTheDocument();
    expect(screen.getByTestId("form-group-input-field-0")).toBeInTheDocument();
    expect(
      screen.queryByTestId("form-group-input-field-1"),
    ).not.toBeInTheDocument();

    const inputField = screen.getByTestId("form-group-input-field-0");
    expect(inputField.querySelector('input[type="email"]')).toBeInTheDocument();
    expect(
      inputField.querySelector('input[type="password"]'),
    ).toBeInTheDocument();
  });

  it("sets aria-labelledby and aria-describedby correctly when label and helperText exist", () => {
    renderBasicGroup();

    const group = screen.getByRole("group");
    expect(group).toHaveAttribute("aria-labelledby", "login-label");
    expect(group).toHaveAttribute("aria-describedby", "login-helperText");
  });

  it("applies generated accessibility props to the first child control", () => {
    render(
      <BaseFormGroup
        id="contact"
        label="Contact Info"
        helperText="Enter your contact info"
        required
        classMap={classNames}
      >
        <input type="text" title="test input" />
      </BaseFormGroup>,
    );

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("id", "contact");
    expect(input).toHaveAttribute("aria-labelledby", "contact-label");
    expect(input).toHaveAttribute("aria-describedby", "contact-helperText");
    expect(input).toHaveAttribute("aria-required", "true");
    expect(input).toBeRequired();
  });

  it("renders the required indicator when required is true", () => {
    render(
      <BaseFormGroup
        id="contact"
        label="Contact Info"
        required
        classMap={classNames}
      >
        <input type="text" title="test input" />
      </BaseFormGroup>,
    );

    const required = screen.getByTestId("form-group-required");
    expect(required).toBeInTheDocument();
    expect(required).toHaveTextContent("*");
    expect(required).toHaveAttribute("aria-hidden", "true");
  });

  it("renders errorMessage message and alert role when errorMessage is provided", () => {
    render(
      <BaseFormGroup
        id="contact"
        label="Contact Info"
        errorMessage="This field is required"
        required
        classMap={classNames}
      >
        <input type="text" title="test input" />
      </BaseFormGroup>,
    );

    const errorMessage = screen.getByTestId("form-group-errorMessage");
    const input = screen.getByRole("textbox");

    expect(errorMessage).toHaveTextContent("This field is required");
    expect(errorMessage).toHaveAttribute("role", "alert");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-errormessage", "contact-errorMessage");
    expect(input).toHaveAttribute("aria-describedby", "contact-errorMessage");
  });

  it("uses errorMessage id in wrapper aria-describedby when errorMessage is present", () => {
    render(
      <BaseFormGroup
        id="contact"
        label="Contact Info"
        errorMessage="This field is required"
        classMap={classNames}
      >
        <input type="text" title="test input" />
      </BaseFormGroup>,
    );

    const group = screen.getByRole("group");
    expect(group).toHaveAttribute("aria-describedby", "contact-errorMessage");
  });

  it("uses both errorMessage and helperText ids in wrapper aria-describedby when both are present", () => {
    render(
      <BaseFormGroup
        id="account"
        label="Account Info"
        helperText="Use your primary email"
        errorMessage="Email is invalid"
        classMap={classNames}
      >
        <input type="email" title="test input" />
      </BaseFormGroup>,
    );

    const group = screen.getByRole("group");
    expect(group).toHaveAttribute(
      "aria-describedby",
      "account-errorMessage account-helperText",
    );
  });

  it("uses both errorMessage and helperText ids in child aria-describedby when both are present", () => {
    render(
      <BaseFormGroup
        id="account"
        label="Account Info"
        helperText="Use your primary email"
        errorMessage="Email is invalid"
        classMap={classNames}
      >
        <input type="email" title="test input" />
      </BaseFormGroup>,
    );

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute(
      "aria-describedby",
      "account-errorMessage account-helperText",
    );
    expect(input).toHaveAttribute("aria-errormessage", "account-errorMessage");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("does not render helperText when errorMessage is present", () => {
    render(
      <BaseFormGroup
        id="profile"
        label="Profile"
        helperText="Helpful helperText"
        errorMessage="Something went wrong"
        classMap={classNames}
      >
        <input type="text" title="test input" />
      </BaseFormGroup>,
    );

    expect(
      screen.queryByTestId("form-group-helperText"),
    ).not.toBeInTheDocument();
    expect(screen.getByTestId("form-group-errorMessage")).toBeInTheDocument();
  });

  it("applies wrapper, layout, and spacing classes", () => {
    render(
      <BaseFormGroup
        id="settings"
        label="Settings"
        classMap={classNames}
        layout="horizontal"
        spacing="large"
      >
        <input type="text" title="test input" />
      </BaseFormGroup>,
    );

    const group = screen.getByTestId("form-group");
    expect(group).toHaveClass("formWrapper");
    expect(group).toHaveClass("layoutHorizontal");
    expect(group).toHaveClass("spacingLarge");
  });

  it("applies errorMessage class to wrapper when errorMessage exists", () => {
    render(
      <BaseFormGroup
        id="profile"
        label="Profile"
        errorMessage="Required field"
        classMap={classNames}
      >
        <input type="text" title="test input" />
      </BaseFormGroup>,
    );

    expect(screen.getByTestId("form-group")).toHaveClass("hasError");
  });

  it("merges custom className into wrapper classes", () => {
    render(
      <BaseFormGroup
        id="custom"
        label="Custom"
        classMap={classNames}
        className="myCustomClass"
      >
        <input type="text" title="test input" />
      </BaseFormGroup>,
    );

    expect(screen.getByTestId("form-group")).toHaveClass("myCustomClass");
  });

  it("applies custom class names to form group sections", () => {
    render(
      <BaseFormGroup
        id="custom-sections"
        label="Custom Sections"
        helperText="Helpful detail"
        required
        classMap={classNames}
        labelClassName="custom-label"
        requiredClassName="custom-required"
        inputWrapperClassName="custom-input-wrapper"
        inputFieldClassName="custom-input-field"
        controllerClassName="custom-controller"
        descriptionClassName="custom-helperText"
        controller={<button type="button">Reset</button>}
      >
        <input type="text" title="test input" />
      </BaseFormGroup>,
    );

    expect(screen.getByTestId("form-group-label")).toHaveClass(
      "formLabel",
      "custom-label",
    );
    expect(screen.getByTestId("form-group-required")).toHaveClass(
      "formRequired",
      "custom-required",
    );
    expect(screen.getByTestId("form-group-wrapper-0")).toHaveClass(
      "inputWrapper",
      "custom-input-wrapper",
    );
    expect(screen.getByTestId("form-group-input-field-0")).toHaveClass(
      "inputField",
      "custom-input-field",
    );
    expect(screen.getByTestId("form-group-controller")).toHaveClass(
      "controller",
      "custom-controller",
    );
    expect(screen.getByTestId("form-group-helperText")).toHaveClass(
      "helperText",
      "custom-helperText",
    );
  });

  it("applies custom class names to form group errorMessage messages", () => {
    render(
      <BaseFormGroup
        id="custom-errorMessage"
        label="Custom Error"
        errorMessage="Required"
        classMap={classNames}
        errorMessageClassName="custom-errorMessage-message"
      >
        <input type="text" title="test input" />
      </BaseFormGroup>,
    );

    expect(screen.getByTestId("form-group-errorMessage")).toHaveClass(
      "errorText",
      "custom-errorMessage-message",
    );
  });

  it("renders one wrapper and one input field container per direct child", () => {
    render(
      <BaseFormGroup id="multi" label="Multiple" classMap={classNames}>
        <input type="text" title="test input 1" />
        <input type="text" title="test input 2" />
        <input type="text" title="test input 3" />
      </BaseFormGroup>,
    );

    expect(screen.getByTestId("form-group-wrapper-0")).toBeInTheDocument();
    expect(screen.getByTestId("form-group-wrapper-1")).toBeInTheDocument();
    expect(screen.getByTestId("form-group-wrapper-2")).toBeInTheDocument();

    expect(screen.getByTestId("form-group-input-field-0")).toBeInTheDocument();
    expect(screen.getByTestId("form-group-input-field-1")).toBeInTheDocument();
    expect(screen.getByTestId("form-group-input-field-2")).toBeInTheDocument();
  });

  it("assigns indexed ids to multiple child controls", () => {
    render(
      <BaseFormGroup id="multi" label="Multiple" classMap={classNames}>
        <input type="text" title="test input 1" />
        <input type="text" title="test input 2" />
        <input type="text" title="test input 3" />
      </BaseFormGroup>,
    );

    const inputs = screen.getAllByRole("textbox");
    expect(inputs[0]).toHaveAttribute("id", "multi");
    expect(inputs[1]).toHaveAttribute("id", "multi-1");
    expect(inputs[2]).toHaveAttribute("id", "multi-2");
  });

  it("renders controller only once and only beside the first child", () => {
    render(
      <BaseFormGroup
        id="search"
        label="Search"
        classMap={classNames}
        controller={<button type="button">Clear</button>}
      >
        <>
          <input type="text" title="test input 1" />
          <input type="text" title="test input 2" />
        </>
      </BaseFormGroup>,
    );

    const controller = screen.getByTestId("form-group-controller");
    expect(controller).toBeInTheDocument();
    expect(controller).toHaveTextContent("Clear");
    expect(screen.getAllByText("Clear")).toHaveLength(1);
  });

  it("does not render controller when controller prop is not provided", () => {
    render(
      <BaseFormGroup id="plain" label="Plain" classMap={classNames}>
        <input type="text" title="test input" />
      </BaseFormGroup>,
    );

    expect(
      screen.queryByTestId("form-group-controller"),
    ).not.toBeInTheDocument();
  });

  it("renders label pointing to the generated control id", () => {
    render(
      <BaseFormGroup id="username" label="Username" classMap={classNames}>
        <input type="text" title="test input" />
      </BaseFormGroup>,
    );

    expect(screen.getByTestId("form-group-label")).toHaveAttribute(
      "for",
      "username",
    );
  });

  it("still sets htmlFor on label when component id is auto-generated", () => {
    render(
      <BaseFormGroup label="Anonymous Field" classMap={classNames}>
        <input type="text" title="test input" />
      </BaseFormGroup>,
    );

    const label = screen.getByTestId("form-group-label");
    const input = screen.getByRole("textbox");

    expect(label).toHaveAttribute("for", input.getAttribute("id"));
  });

  it("generates accessible ids when no id is provided", () => {
    render(
      <BaseFormGroup
        label="Generated"
        helperText="Generated helperText"
        data-testid="generated-group"
        classMap={classNames}
      >
        <input type="text" title="test input" />
      </BaseFormGroup>,
    );

    const group = screen.getByTestId("generated-group");
    const label = screen.getByTestId("generated-group-label");
    const helperText = screen.getByTestId("generated-group-helperText");
    const input = screen.getByRole("textbox");

    expect(label.id).toMatch(/^generated-group-.*-label$/);
    expect(helperText.id).toMatch(/^generated-group-.*-helperText$/);
    expect(input.id).toMatch(/^generated-group-.*$/);
    expect(label).toHaveAttribute("for", input.id);
    expect(group).toHaveAttribute("aria-labelledby", label.id);
    expect(group).toHaveAttribute("aria-describedby", helperText.id);
  });

  it("supports a custom data-testid prefix", () => {
    render(
      <BaseFormGroup
        id="custom-test"
        label="Custom Test"
        helperText="Testing ids"
        data-testid="custom-form-group"
        classMap={classNames}
      >
        <input type="text" title="test input" />
      </BaseFormGroup>,
    );

    expect(screen.getByTestId("custom-form-group")).toBeInTheDocument();
    expect(screen.getByTestId("custom-form-group-label")).toBeInTheDocument();
    expect(
      screen.getByTestId("custom-form-group-helperText"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("custom-form-group-wrapper-0"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("custom-form-group-input-field-0"),
    ).toBeInTheDocument();
  });

  it("renders without a label", () => {
    render(
      <BaseFormGroup id="nolabel" classMap={classNames}>
        <input type="text" title="test input" />
      </BaseFormGroup>,
    );

    const group = screen.getByRole("group");
    expect(group).not.toHaveAttribute("aria-labelledby");
    expect(screen.queryByTestId("form-group-label")).not.toBeInTheDocument();
  });

  it("renders without helperText or errorMessage and omits wrapper aria-describedby", () => {
    render(
      <BaseFormGroup id="simple" label="Simple" classMap={classNames}>
        <input type="text" title="test input" />
      </BaseFormGroup>,
    );

    const group = screen.getByRole("group");
    expect(group).not.toHaveAttribute("aria-describedby");
  });

  it("renders children inside input field containers", () => {
    render(
      <BaseFormGroup id="nested" label="Nested" classMap={classNames}>
        <input type="text" title="test input" />
      </BaseFormGroup>,
    );

    const inputField = screen.getByTestId("form-group-input-field-0");
    expect(inputField).toContainElement(screen.getByRole("textbox"));
  });

  it("applies label class", () => {
    render(
      <BaseFormGroup
        id="styled-label"
        label="Styled Label"
        classMap={classNames}
      >
        <input type="text" title="test input" />
      </BaseFormGroup>,
    );

    expect(screen.getByTestId("form-group-label")).toHaveClass("formLabel");
  });

  it("applies helperText class", () => {
    render(
      <BaseFormGroup
        id="desc"
        label="Description"
        helperText="Extra info"
        classMap={classNames}
      >
        <input type="text" title="test input" />
      </BaseFormGroup>,
    );

    expect(screen.getByTestId("form-group-helperText")).toHaveClass(
      "helperText",
    );
  });

  it("applies errorMessage message class", () => {
    render(
      <BaseFormGroup
        id="error"
        label="Error"
        errorMessage="Invalid value"
        classMap={classNames}
      >
        <input type="text" title="test input" />
      </BaseFormGroup>,
    );

    expect(screen.getByTestId("form-group-errorMessage")).toHaveClass(
      "errorText",
    );
  });

  it("supports wrapper aria-label override", () => {
    render(
      <BaseFormGroup
        id="search"
        label="Search"
        aria-label="Search group"
        classMap={classNames}
      >
        <input type="text" title="test input" />
      </BaseFormGroup>,
    );

    const group = screen.getByRole("group");
    expect(group).toHaveAttribute("aria-label", "Search group");
  });

  it("supports wrapper aria-labelledby override", () => {
    render(
      <>
        <span id="external-label">External group label</span>
        <BaseFormGroup
          id="search"
          label="Search"
          aria-labelledby="external-label"
          classMap={classNames}
        >
          <input type="text" title="test input" />
        </BaseFormGroup>
      </>,
    );

    const group = screen.getByRole("group");
    expect(group).toHaveAttribute("aria-labelledby", "external-label");
  });

  it("supports wrapper aria-describedby override", () => {
    render(
      <>
        <span id="external-helperText">External group helperText</span>
        <BaseFormGroup
          id="search"
          label="Search"
          aria-describedby="external-helperText"
          classMap={classNames}
        >
          <input type="text" title="test input" />
        </BaseFormGroup>
      </>,
    );

    const group = screen.getByRole("group");
    expect(group).toHaveAttribute("aria-describedby", "external-helperText");
  });

  it("supports custom role", () => {
    render(
      <BaseFormGroup
        id="custom-role"
        label="Custom Role"
        role="region"
        classMap={classNames}
      >
        <input type="text" title="test input" />
      </BaseFormGroup>,
    );

    expect(screen.getByRole("region")).toBeInTheDocument();
  });

  it("supports labelProps", () => {
    render(
      <BaseFormGroup
        id="with-label-props"
        label="With Label Props"
        labelProps={{ title: "Label title", "aria-live": "polite" }}
        classMap={classNames}
      >
        <input type="text" title="test input" />
      </BaseFormGroup>,
    );

    const label = screen.getByTestId("form-group-label");
    expect(label).toHaveAttribute("title", "Label title");
    expect(label).toHaveAttribute("aria-live", "polite");
  });

  it("supports descriptionProps", () => {
    render(
      <BaseFormGroup
        id="with-helperText-props"
        label="With Description Props"
        helperText="Helpful text"
        descriptionProps={{ title: "Description title" }}
        classMap={classNames}
      >
        <input type="text" title="test input" />
      </BaseFormGroup>,
    );

    const helperText = screen.getByTestId("form-group-helperText");
    expect(helperText).toHaveAttribute("title", "Description title");
  });

  it("supports errorProps", () => {
    render(
      <BaseFormGroup
        id="with-errorMessage-props"
        label="With Error Props"
        errorMessage="Something is wrong"
        errorProps={{ title: "Error title", "aria-live": "assertive" }}
        classMap={classNames}
      >
        <input type="text" title="test input" />
      </BaseFormGroup>,
    );

    const errorMessage = screen.getByTestId("form-group-errorMessage");
    expect(errorMessage).toHaveAttribute("title", "Error title");
    expect(errorMessage).toHaveAttribute("aria-live", "assertive");
  });

  it("supports controlProps overrides", () => {
    render(
      <BaseFormGroup
        id="email"
        label="Email"
        helperText="Helpful text"
        classMap={classNames}
        controlProps={{
          id: "custom-email",
          "aria-label": "Custom email field",
          "aria-describedby": "custom-helperText",
          "aria-labelledby": "custom-label",
        }}
      >
        <input type="email" title="test input" />
      </BaseFormGroup>,
    );

    const input = screen.getByLabelText("Custom email field");
    expect(input).toHaveAttribute("id", "custom-email");
    expect(input).toHaveAttribute("aria-describedby", "custom-helperText");
    expect(input).toHaveAttribute("aria-labelledby", "custom-label");
    expect(screen.getByTestId("form-group-label")).toHaveAttribute(
      "for",
      "custom-email",
    );
  });

  it("preserves an existing child id when controlProps.id is not provided", () => {
    render(
      <BaseFormGroup id="group-id" label="Grouped" classMap={classNames}>
        <input id="child-id" type="text" title="test input" />
      </BaseFormGroup>,
    );

    expect(screen.getByRole("textbox")).toHaveAttribute("id", "child-id");
    expect(screen.getByTestId("form-group-label")).toHaveAttribute(
      "for",
      "group-id",
    );
  });

  it("has no accessibility violations in normal state", async () => {
    const { container } = render(
      <BaseFormGroup
        id="signup"
        label="Signup Info"
        helperText="Enter a valid email and password"
        classMap={classNames}
        spacing="medium"
        layout="vertical"
      >
        <>
          <div>Email field placeholder</div>
          <div>Password field placeholder</div>
        </>
      </BaseFormGroup>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations in errorMessage state", async () => {
    const { container } = render(
      <BaseFormGroup
        id="email"
        label="Email"
        errorMessage="Email is required"
        required
        classMap={classNames}
      >
        <input type="email" title="test input" />
      </BaseFormGroup>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations with controller", async () => {
    const { container } = render(
      <BaseFormGroup
        id="search"
        label="Search"
        helperText="Search for a record"
        classMap={classNames}
        controller={<button type="button">Go</button>}
      >
        <input type="text" title="test input" />
      </BaseFormGroup>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
