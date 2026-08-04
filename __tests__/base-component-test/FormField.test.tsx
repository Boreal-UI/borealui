import { render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import "@testing-library/jest-dom";

import FormFieldBase from "../../src/components/FormField/FormFieldBase";

expect.extend(toHaveNoViolations);

const classMap = {
  formField: "formField",
  label: "label",
  optional: "optional",
  control: "control",
  helperText: "helperText",

  labelTop: "labelTop",
  labelBottom: "labelBottom",
  labelLeft: "labelLeft",
  labelRight: "labelRight",

  success: "success",
  error: "error",
  errorText: "errorText",
  warning: "warning",
} satisfies Record<string, string>;

describe("FormFieldBase", () => {
  it("renders a labelled control with helper text and optional text", () => {
    const { container } = render(
      <FormFieldBase
        label="Email"
        helperText="Use your school email address."
        classMap={classMap}
      >
        <input title="email" type="email" />
      </FormFieldBase>,
    );

    const field = screen.getByTestId("form-field");
    const controlWrapper = screen.getByTestId("form-field-control");
    const input = container.querySelector("input") as HTMLInputElement;
    const helper = screen.getByTestId("form-field-helper");

    expect(field).toHaveClass("formField", "labelTop");
    expect(controlWrapper).toHaveClass("control");

    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Optional")).toHaveClass("optional");

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("id");
    expect(input).toHaveAttribute("aria-describedby", `${input.id}-helper`);

    expect(helper).toHaveAttribute("id", `${input.id}-helper`);
    expect(helper).toHaveTextContent("Use your school email address.");
  });

  it("connects the label to the input using the generated id", () => {
    const { container } = render(
      <FormFieldBase label="Email" classMap={classMap}>
        <input title="email" type="email" />
      </FormFieldBase>,
    );

    const label = screen.getByText("Email").closest("label");
    const input = container.querySelector("input") as HTMLInputElement;

    expect(input).toHaveAttribute("id");
    expect(label).toHaveAttribute("for", input.id);
  });

  it("uses the provided id when available", () => {
    const { container } = render(
      <FormFieldBase id="username" label="Username" classMap={classMap}>
        <input title="username" id="username" />
      </FormFieldBase>,
    );

    const input = container.querySelector("input") as HTMLInputElement;
    const label = screen.getByText("Username").closest("label");

    expect(input).toHaveAttribute("id", "username");
    expect(label).toHaveAttribute("for", "username");
  });

  it("uses the child id when no explicit id is provided", () => {
    const { container } = render(
      <FormFieldBase label="Display name" classMap={classMap}>
        <input title="display name" id="display-name" />
      </FormFieldBase>,
    );

    const input = container.querySelector("input") as HTMLInputElement;
    const label = screen.getByText("Display name").closest("label");

    expect(input).toHaveAttribute("id", "display-name");
    expect(label).toHaveAttribute("for", "display-name");
  });

  it("adds required attributes and hides optional text when required", () => {
    const { container } = render(
      <FormFieldBase label="Password" required classMap={classMap}>
        <input title="password" type="password" />
      </FormFieldBase>,
    );

    const input = container.querySelector("input") as HTMLInputElement;

    expect(input).toBeRequired();
    expect(input).toHaveAttribute("aria-required", "true");
    expect(screen.queryByText("Optional")).not.toBeInTheDocument();
  });

  it("renders custom optional text when not required", () => {
    const { container } = render(
      <FormFieldBase
        label="Phone"
        optionalText="Not required"
        classMap={classMap}
      >
        <input title="phone" />
      </FormFieldBase>,
    );

    const input = container.querySelector("input") as HTMLInputElement;
    const label = screen.getByText("Phone").closest("label");

    expect(input).toBeInTheDocument();
    expect(label).toHaveAttribute("for", input.id);
    expect(screen.getByText("Not required")).toHaveClass("optional");
  });

  it("does not render optional text when optionalText is empty", () => {
    render(
      <FormFieldBase label="Phone" optionalText="" classMap={classMap}>
        <input title="phone" />
      </FormFieldBase>,
    );

    expect(screen.getByText("Phone")).toBeInTheDocument();
    expect(screen.queryByText("Optional")).not.toBeInTheDocument();
  });

  it("renders errorMessage text, marks the control invalid, and connects aria-describedby", () => {
    const { container } = render(
      <FormFieldBase
        id="email"
        label="Email"
        helperText="Use a valid email."
        errorMessage="Email is required."
        classMap={classMap}
      >
        <input title="email" />
      </FormFieldBase>,
    );

    const input = container.querySelector("input") as HTMLInputElement;
    const helper = screen.getByTestId("form-field-helper");
    const errorMessage = screen.getByTestId("form-field-errorMessage");

    expect(input).toHaveAttribute("id", "email");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute(
      "aria-describedby",
      "email-helper email-errorMessage",
    );

    expect(helper).toHaveAttribute("id", "email-helper");
    expect(helper).toHaveTextContent("Use a valid email.");

    expect(errorMessage).toHaveAttribute("id", "email-errorMessage");
    expect(errorMessage).toHaveAttribute("role", "alert");
    expect(errorMessage).toHaveClass("errorText");
    expect(errorMessage).toHaveTextContent("Email is required.");
  });

  it("preserves an existing aria-describedby value from the child", () => {
    const { container } = render(
      <>
        <p id="existing-helperText">Existing helperText</p>

        <FormFieldBase
          id="email"
          label="Email"
          helperText="Helper text"
          errorMessage="Error text"
          classMap={classMap}
        >
          <input title="email" aria-describedby="existing-helperText" />
        </FormFieldBase>
      </>,
    );

    const input = container.querySelector("input") as HTMLInputElement;

    expect(input).toHaveAttribute(
      "aria-describedby",
      "existing-helperText email-helper email-errorMessage",
    );
  });

  it("lets child accessibility props override generated required and invalid state", () => {
    const { container } = render(
      <FormFieldBase
        label="Email"
        required
        errorMessage="Email is required."
        classMap={classMap}
      >
        <input
          title="email"
          required={false}
          aria-required={false}
          aria-invalid={false}
        />
      </FormFieldBase>,
    );

    const input = container.querySelector("input") as HTMLInputElement;

    expect(input).not.toBeRequired();
    expect(input).toHaveAttribute("aria-required", "false");
    expect(input).toHaveAttribute("aria-invalid", "false");
  });

  it("applies label position, state, and custom class names", () => {
    render(
      <FormFieldBase
        label="Search"
        helperText="Search by keyword."
        errorMessage="Search failed."
        labelPosition="left"
        state="error"
        className="customRoot"
        labelClassName="customLabel"
        controlClassName="customControl"
        helperTextClassName="customHelper"
        errorClassName="customError"
        classMap={classMap}
      >
        <input title="search" />
      </FormFieldBase>,
    );

    expect(screen.getByTestId("form-field")).toHaveClass(
      "formField",
      "labelLeft",
      "error",
      "customRoot",
    );

    expect(screen.getByText("Search").closest("label")).toHaveClass(
      "label",
      "customLabel",
    );

    expect(screen.getByTestId("form-field-control")).toHaveClass(
      "control",
      "customControl",
    );

    expect(screen.getByTestId("form-field-helper")).toHaveClass(
      "helperText",
      "customHelper",
    );

    expect(screen.getByTestId("form-field-errorMessage")).toHaveClass(
      "errorText",
      "customError",
    );
  });

  it("supports custom testId", () => {
    render(
      <FormFieldBase label="Name" testId="name-field" classMap={classMap}>
        <input title="name" />
      </FormFieldBase>,
    );

    expect(screen.getByTestId("name-field")).toBeInTheDocument();
    expect(screen.getByTestId("name-field-control")).toBeInTheDocument();
  });

  it("supports data-testid as a fallback test id", () => {
    render(
      <FormFieldBase
        label="Name"
        data-testid="profile-name"
        classMap={classMap}
      >
        <input title="profile name" />
      </FormFieldBase>,
    );

    expect(screen.getByTestId("profile-name")).toBeInTheDocument();
    expect(screen.getByTestId("profile-name-control")).toBeInTheDocument();
  });

  it("prefers testId over data-testid", () => {
    render(
      <FormFieldBase
        label="Name"
        testId="preferred-id"
        data-testid="fallback-id"
        classMap={classMap}
      >
        <input title="name" />
      </FormFieldBase>,
    );

    expect(screen.getByTestId("preferred-id")).toBeInTheDocument();
    expect(screen.queryByTestId("fallback-id")).not.toBeInTheDocument();
  });

  it("does not render label, helper, or errorMessage elements when omitted", () => {
    render(
      <FormFieldBase classMap={classMap}>
        <input title="plain input" data-testid="plain-input" />
      </FormFieldBase>,
    );

    expect(screen.getByTestId("form-field")).toBeInTheDocument();
    expect(screen.getByTestId("form-field-control")).toBeInTheDocument();
    expect(screen.getByTestId("plain-input")).toBeInTheDocument();

    expect(screen.queryByTestId("form-field-helper")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("form-field-errorMessage"),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Optional")).not.toBeInTheDocument();
  });

  it("has no accessibility violations in the default labelled state", async () => {
    const { container } = render(
      <FormFieldBase
        id="email"
        label="Email"
        helperText="Use your school email address."
        classMap={classMap}
      >
        <input title="email" type="email" />
      </FormFieldBase>,
    );

    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations when displaying an errorMessage", async () => {
    const { container } = render(
      <FormFieldBase
        id="email"
        label="Email"
        helperText="Use your school email address."
        errorMessage="Email is required."
        required
        classMap={classMap}
      >
        <input title="email" type="email" />
      </FormFieldBase>,
    );

    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});
