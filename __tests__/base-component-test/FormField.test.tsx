import React from "react";
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
  errorText: "errorText",

  labelTop: "labelTop",
  labelBottom: "labelBottom",
  labelLeft: "labelLeft",
  labelRight: "labelRight",

  success: "success",
  error: "error",
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
        <input type="email" />
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
        <input type="email" />
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
        <input />
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
        <input id="display-name" />
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
        <input type="password" />
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
        <input />
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
        <input />
      </FormFieldBase>,
    );

    expect(screen.getByText("Phone")).toBeInTheDocument();
    expect(screen.queryByText("Optional")).not.toBeInTheDocument();
  });

  it("renders error text, marks the control invalid, and connects aria-describedby", () => {
    const { container } = render(
      <FormFieldBase
        id="email"
        label="Email"
        helperText="Use a valid email."
        error="Email is required."
        classMap={classMap}
      >
        <input />
      </FormFieldBase>,
    );

    const input = container.querySelector("input") as HTMLInputElement;
    const helper = screen.getByTestId("form-field-helper");
    const error = screen.getByTestId("form-field-error");

    expect(input).toHaveAttribute("id", "email");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute(
      "aria-describedby",
      "email-helper email-error",
    );

    expect(helper).toHaveAttribute("id", "email-helper");
    expect(helper).toHaveTextContent("Use a valid email.");

    expect(error).toHaveAttribute("id", "email-error");
    expect(error).toHaveAttribute("role", "alert");
    expect(error).toHaveClass("errorText");
    expect(error).toHaveTextContent("Email is required.");
  });

  it("preserves an existing aria-describedby value from the child", () => {
    const { container } = render(
      <>
        <p id="existing-description">Existing description</p>

        <FormFieldBase
          id="email"
          label="Email"
          helperText="Helper text"
          error="Error text"
          classMap={classMap}
        >
          <input aria-describedby="existing-description" />
        </FormFieldBase>
      </>,
    );

    const input = container.querySelector("input") as HTMLInputElement;

    expect(input).toHaveAttribute(
      "aria-describedby",
      "existing-description email-helper email-error",
    );
  });

  it("lets child accessibility props override generated required and invalid state", () => {
    const { container } = render(
      <FormFieldBase
        label="Email"
        required
        error="Email is required."
        classMap={classMap}
      >
        <input required={false} aria-required={false} aria-invalid={false} />
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
        error="Search failed."
        labelPosition="left"
        state="error"
        className="customRoot"
        labelClassName="customLabel"
        controlClassName="customControl"
        helperTextClassName="customHelper"
        errorClassName="customError"
        classMap={classMap}
      >
        <input />
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

    expect(screen.getByTestId("form-field-error")).toHaveClass(
      "errorText",
      "customError",
    );
  });

  it("supports custom testId", () => {
    render(
      <FormFieldBase label="Name" testId="name-field" classMap={classMap}>
        <input />
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
        <input />
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
        <input />
      </FormFieldBase>,
    );

    expect(screen.getByTestId("preferred-id")).toBeInTheDocument();
    expect(screen.queryByTestId("fallback-id")).not.toBeInTheDocument();
  });

  it("does not render label, helper, or error elements when omitted", () => {
    render(
      <FormFieldBase classMap={classMap}>
        <input data-testid="plain-input" />
      </FormFieldBase>,
    );

    expect(screen.getByTestId("form-field")).toBeInTheDocument();
    expect(screen.getByTestId("form-field-control")).toBeInTheDocument();
    expect(screen.getByTestId("plain-input")).toBeInTheDocument();

    expect(screen.queryByTestId("form-field-helper")).not.toBeInTheDocument();
    expect(screen.queryByTestId("form-field-error")).not.toBeInTheDocument();
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
        <input type="email" />
      </FormFieldBase>,
    );

    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations when displaying an error", async () => {
    const { container } = render(
      <FormFieldBase
        id="email"
        label="Email"
        helperText="Use your school email address."
        error="Email is required."
        required
        classMap={classMap}
      >
        <input type="email" />
      </FormFieldBase>,
    );

    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});
