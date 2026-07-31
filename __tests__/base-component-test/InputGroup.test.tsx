import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { axe, toHaveNoViolations } from "jest-axe";
import InputGroupBase from "@/components/InputGroup/InputGroupBase";

expect.extend(toHaveNoViolations);

const classMap = {
  container: "container",
  label: "label",
  labelTop: "labelTop",
  labelBottom: "labelBottom",
  labelLeft: "labelLeft",
  labelRight: "labelRight",
  root: "root",
  frame: "frame",
  content: "content",
  description: "helperText",
  helperText: "helperText",
  errorText: "error",
  optional: "optional",
  prefix: "prefix",
  suffix: "suffix",
  addon: "addon",
  startAddon: "startAddon",
  endAddon: "endAddon",
  loadingMessage: "loadingMessage",
  loader: "loader",
  srOnly: "srOnly",
  fullWidth: "fullWidth",
  withAddons: "withAddons",
  withInlineAddons: "withInlineAddons",
  primary: "primary",
  secondary: "secondary",
  success: "success",
  warning: "warning",
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

const renderInputGroup = (
  props: Partial<React.ComponentProps<typeof InputGroupBase>> = {},
) =>
  render(
    <InputGroupBase label="Amount" classMap={classMap} {...props}>
      <input />
    </InputGroupBase>,
  );

describe("InputGroupBase", () => {
  it("renders a labelled primary control with helper and errorMessage descriptions", () => {
    renderInputGroup({
      id: "amount",
      helperText: "Use whole dollars.",
      errorMessage: "Amount is required.",
      required: true,
      srOnlyText: "Billing amount field.",
    });

    const input = screen.getByLabelText("Amount");
    expect(input).toHaveAttribute("id", "amount");
    expect(input).toHaveAttribute("required");
    expect(input).toHaveAttribute("aria-required", "true");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute(
      "aria-describedby",
      "amount-helperText amount-helper amount-errorMessage amount-sr-helperText",
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Amount is required.");
  });

  it("uses the child id when no id prop is provided", () => {
    render(
      <InputGroupBase label="Email" classMap={classMap}>
        <input id="email" />
      </InputGroupBase>,
    );

    expect(screen.getByLabelText(/Email/)).toHaveAttribute("id", "email");
  });

  it("renders prefix, suffix, addons, optional text, and loading state", () => {
    renderInputGroup({
      prefix: "$",
      suffix: "USD",
      startAddon: "Invoice",
      endAddon: <button type="button">Apply</button>,
      optionalText: "Optional",
      loading: true,
      loadingMessage: "Checking amount",
    });

    expect(screen.getByTestId("input-group-prefix")).toHaveTextContent("$");
    expect(screen.getByTestId("input-group-suffix")).toHaveTextContent("USD");
    expect(screen.getByTestId("input-group-start-addon")).toHaveTextContent(
      "Invoice",
    );
    expect(screen.getByRole("button", { name: "Apply" })).toBeInTheDocument();
    expect(screen.getByTestId("input-group-optional")).toHaveTextContent(
      "Optional",
    );
    expect(screen.getByRole("status")).toHaveTextContent("Checking amount");
    expect(screen.getByTestId("input-group-loader")).toBeInTheDocument();
  });

  it("applies disabled state to descendant controls", () => {
    renderInputGroup({ disabled: true });

    expect(screen.getByTestId("input-group-root")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("applies theme, state, outline, glass, rounding, and shadow classes", () => {
    renderInputGroup({
      theme: "secondary",
      state: "success",
      variant: "glassOutline",
      rounding: "large",
      shadow: "strong",
    });

    const root = screen.getByTestId("input-group-root");
    expect(root).toHaveClass("root");
    expect(root).toHaveClass("secondary");
    expect(root).toHaveClass("success");
    expect(root).toHaveClass("outline");
    expect(root).toHaveClass("glass");
    expect(root).toHaveClass("roundLarge");
    expect(root).toHaveClass("shadowStrong");
  });

  it("applies label position and custom class names", () => {
    renderInputGroup({
      labelPosition: "left",
      fullWidth: false,
      containerClassName: "customContainer",
      labelClassName: "customLabel",
      descriptionClassName: "customDescription",
      frameClassName: "customFrame",
      contentClassName: "customContent",
      prefix: "$",
      prefixClassName: "customPrefix",
      suffix: "USD",
      suffixClassName: "customSuffix",
      startAddon: "Start",
      startAddonClassName: "customStart",
      endAddon: "End",
      endAddonClassName: "customEnd",
      helperText: "Helper",
      helperTextClassName: "customHelper",
      errorMessage: "Error",
      errorClassName: "customError",
    });

    expect(screen.getByTestId("input-group")).toHaveClass("labelLeft");
    expect(screen.getByTestId("input-group")).toHaveClass("customContainer");
    expect(screen.getByTestId("input-group")).not.toHaveClass("fullWidth");
    expect(screen.getByTestId("input-group-label")).toHaveClass("customLabel");
    expect(screen.getByTestId("input-group-helperText")).toHaveClass(
      "customDescription",
    );
    expect(screen.getByTestId("input-group-frame")).toHaveClass("customFrame");
    expect(screen.getByTestId("input-group-content")).toHaveClass(
      "customContent",
    );
    expect(screen.getByTestId("input-group-prefix")).toHaveClass(
      "customPrefix",
    );
    expect(screen.getByTestId("input-group-suffix")).toHaveClass(
      "customSuffix",
    );
    expect(screen.getByTestId("input-group-start-addon")).toHaveClass(
      "customStart",
    );
    expect(screen.getByTestId("input-group-end-addon")).toHaveClass(
      "customEnd",
    );
    expect(screen.getByTestId("input-group-helper")).toHaveClass(
      "customHelper",
    );
    expect(screen.getByTestId("input-group-errorMessage")).toHaveClass(
      "customError",
    );
  });

  it("forwards refs to the root", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <InputGroupBase label="Input Group" classMap={classMap} ref={ref}>
        <input />
      </InputGroupBase>,
    );

    expect(ref.current).toBe(screen.getByTestId("input-group-root"));
  });

  it("has no accessibility violations", async () => {
    const { container } = renderInputGroup({
      id: "amount",
      helperText: "Use whole dollars.",
    });

    expect(await axe(container)).toHaveNoViolations();
  });
});
