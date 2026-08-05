import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { axe, toHaveNoViolations } from "jest-axe";
import FieldSetBase from "@/components/FieldSet/FieldSetBase";

expect.extend(toHaveNoViolations);

const classMap = {
  container: "container",
  label: "label",
  labelTop: "labelTop",
  labelBottom: "labelBottom",
  labelLeft: "labelLeft",
  labelRight: "labelRight",
  root: "root",
  legend: "legend",
  legendText: "legendText",
  legendHidden: "legendHidden",
  required: "required",
  optional: "optional",
  description: "helperText",
  content: "content",
  helperText: "helperText",
  errorText: "error",
  actions: "actions",
  footer: "footer",
  loadingRow: "loadingRow",
  loadingMessage: "loadingMessage",
  loader: "loader",
  srOnly: "srOnly",
  layoutStack: "layoutStack",
  layoutGrid: "layoutGrid",
  layoutInline: "layoutInline",
  spacingNone: "spacingNone",
  spacingXs: "spacingXs",
  spacingSm: "spacingSm",
  spacingMd: "spacingMd",
  spacingLg: "spacingLg",
  primary: "primary",
  secondary: "secondary",
  success: "success",
  error: "error",
  clear: "clear",
  disabled: "disabled",
  loading: "loading",
  shadowLight: "shadowLight",
  shadowStrong: "shadowStrong",
  roundMedium: "roundMedium",
  roundLarge: "roundLarge",
  glass: "glass",
  outline: "outline",
};

const renderFieldSet = (
  props: Partial<React.ComponentProps<typeof FieldSetBase>> = {},
) =>
  render(
    <FieldSetBase legend="Contact preferences" classMap={classMap} {...props}>
      <label htmlFor="email-updates">Email updates</label>
      <input id="email-updates" type="checkbox" />
    </FieldSetBase>,
  );

describe("FieldSetBase", () => {
  it("renders a semantic fieldset with a legend", () => {
    renderFieldSet();

    const group = screen.getByRole("group", {
      name: "Contact preferences",
    });

    expect(group.tagName).toBe("FIELDSET");
    expect(screen.getByTestId("field-set-label")).toHaveTextContent(
      "Contact preferences",
    );
    expect(screen.getByTestId("field-set-content")).toHaveTextContent(
      "Email updates",
    );
  });

  it("uses label as a backward-compatible legend alias", () => {
    renderFieldSet({ legend: undefined, label: "Notification settings" });

    expect(
      screen.getByRole("group", { name: "Notification settings" }),
    ).toBeInTheDocument();
  });

  it("connects helper, error, and sr-only text with aria-describedby", () => {
    renderFieldSet({
      id: "contact-preferences",
      helperText: "You can change these settings later.",
      errorMessage: "Select at least one option.",
      srOnlyText: "Required group.",
    });

    const group = screen.getByRole("group", {
      name: "Contact preferences",
    });

    expect(group).toHaveAttribute(
      "aria-describedby",
      "contact-preferences-helperText contact-preferences-errorMessage contact-preferences-sr-helperText",
    );
    expect(group).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Select at least one option.",
    );
  });

  it("renders required, optional, loading, actions, and footer content", () => {
    renderFieldSet({
      required: true,
      loading: true,
      loadingMessage: "Saving choices",
      actions: <button type="button">Apply</button>,
      footer: "Preference changes apply immediately.",
    });

    expect(
      screen.getByTestId("field-set-required-indicator"),
    ).toHaveTextContent("*");
    expect(screen.getByRole("status")).toHaveTextContent("Saving choices");
    expect(screen.getByRole("button", { name: "Apply" })).toBeInTheDocument();
    expect(screen.getByTestId("field-set-footer")).toHaveTextContent(
      "Preference changes apply immediately.",
    );
  });

  it("renders optional text when the group is not required", () => {
    renderFieldSet({ optionalText: "Optional" });

    expect(screen.getByTestId("field-set-optional-text")).toHaveTextContent(
      "Optional",
    );
  });

  it("applies theme, state, outline, glass, rounding, and shadow classes", () => {
    renderFieldSet({
      theme: "secondary",
      state: "success",
      variant: "glassOutline",
      rounding: "large",
      shadow: "strong",
    });

    const container = screen.getByTestId("field-set");
    const root = screen.getByTestId("field-set-root");

    expect(container).toHaveClass("container");
    expect(container).toHaveClass("secondary");
    expect(container).toHaveClass("success");
    expect(container).toHaveClass("outline");
    expect(container).toHaveClass("glass");
    expect(container).toHaveClass("roundLarge");
    expect(container).toHaveClass("shadowStrong");

    expect(root).toHaveClass("root");
  });

  it("applies layout, spacing, hidden legend, and custom class names", () => {
    renderFieldSet({
      labelPosition: "left",
      layout: "grid",
      spacing: "lg",
      hideLegend: true,
      containerClassName: "customContainer",
      legendClassName: "customLegend",
      bodyClassName: "customBody",
      contentClassName: "customContent",
      descriptionClassName: "customDescription",
      helperText: "Helper",
      helperTextClassName: "customHelper",
      errorMessage: "Error",
      errorClassName: "customError",
      actions: "Actions",
      actionsClassName: "customActions",
      footer: "Footer",
      footerClassName: "customFooter",
    });

    expect(screen.getByTestId("field-set")).toHaveClass("labelLeft");
    expect(screen.getByTestId("field-set")).toHaveClass("customContainer");
    expect(screen.getByTestId("field-set-label")).toHaveClass("legendHidden");
    expect(screen.getByTestId("field-set-label")).toHaveClass("customLegend");
    expect(screen.getByTestId("field-set-content")).toHaveClass("layoutGrid");
    expect(screen.getByTestId("field-set-content")).toHaveClass("spacingLg");
    expect(screen.getByTestId("field-set-content")).toHaveClass("customBody");
    expect(screen.getByTestId("field-set-content")).toHaveClass(
      "customContent",
    );
    expect(screen.getByTestId("field-set-helperText")).toHaveClass(
      "customDescription",
    );
    expect(screen.getByTestId("field-set-helperText")).toHaveClass(
      "customHelper",
    );
    expect(screen.getByTestId("field-set-errorMessage")).toHaveClass(
      "customError",
    );
    expect(screen.getByTestId("field-set-actions")).toHaveClass(
      "customActions",
    );
    expect(screen.getByTestId("field-set-footer")).toHaveClass("customFooter");
  });

  it("disables the fieldset and descendant controls", () => {
    renderFieldSet({ disabled: true });

    const container = screen.getByTestId("field-set");
    const root = screen.getByTestId("field-set-root");

    expect(container).toHaveClass("disabled");
    expect(root).toBeDisabled();

    expect(
      screen.getByRole("checkbox", { name: "Email updates" }),
    ).toBeDisabled();
  });

  it("forwards refs to the fieldset", () => {
    const ref = React.createRef<HTMLFieldSetElement>();
    render(
      <FieldSetBase legend="Field Set" classMap={classMap} ref={ref}>
        Example content
      </FieldSetBase>,
    );

    expect(ref.current).toBe(screen.getByTestId("field-set-root"));
  });

  it("has no accessibility violations", async () => {
    const { container } = renderFieldSet({
      helperText: "You can change these settings later.",
    });

    expect(await axe(container)).toHaveNoViolations();
  });
});
