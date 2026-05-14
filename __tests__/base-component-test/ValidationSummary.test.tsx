import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { axe, toHaveNoViolations } from "jest-axe";
import ValidationSummaryBase from "@/components/ValidationSummary/ValidationSummaryBase";

expect.extend(toHaveNoViolations);

const classMap = {
  container: "container",
  label: "label",
  labelTop: "labelTop",
  labelBottom: "labelBottom",
  labelLeft: "labelLeft",
  labelRight: "labelRight",
  root: "root",
  title: "title",
  description: "description",
  list: "list",
  item: "item",
  link: "link",
  button: "button",
  content: "content",
  empty: "empty",
  emptyMessage: "emptyMessage",
  loadingRow: "loadingRow",
  loadingMessage: "loadingMessage",
  loader: "loader",
  srOnly: "srOnly",
  primary: "primary",
  secondary: "secondary",
  success: "success",
  warning: "warning",
  error: "error",
  clear: "clear",
  outline: "outline",
  glass: "glass",
  disabled: "disabled",
  loading: "loading",
  shadowLight: "shadowLight",
  shadowStrong: "shadowStrong",
  roundMedium: "roundMedium",
  roundLarge: "roundLarge",
};

const issues = [
  { id: "email", message: "Email is required.", fieldId: "email-input" },
  { id: "password", message: "Password must be at least 8 characters." },
];

const renderValidationSummary = (
  props: Partial<React.ComponentProps<typeof ValidationSummaryBase>> = {},
) =>
  render(
    <ValidationSummaryBase
      label="Fix the following"
      items={issues}
      classMap={classMap}
      {...props}
    />,
  );

describe("ValidationSummaryBase", () => {
  it("renders an accessible alert with title, description, and validation links", () => {
    renderValidationSummary({
      id: "checkout-errors",
      description: "Review these fields before submitting.",
      srOnlyText: "Form submission failed.",
    });

    const summary = screen.getByRole("alert", { name: "Fix the following" });
    expect(summary).toHaveAttribute(
      "aria-describedby",
      "checkout-errors-description checkout-errors-list checkout-errors-sr-description",
    );
    expect(screen.getByTestId("validation-summary-label").tagName).toBe("H2");
    expect(screen.getByTestId("validation-summary-list")).toHaveAccessibleName(
      "Validation issues",
    );
    expect(
      screen.getByRole("link", { name: "Email is required." }),
    ).toHaveAttribute("href", "#email-input");
  });

  it("renders callback-only items as buttons", async () => {
    const user = userEvent.setup();
    const onItemClick = jest.fn();
    renderValidationSummary({ onItemClick });

    await user.click(
      screen.getByRole("button", {
        name: "Password must be at least 8 characters.",
      }),
    );

    expect(onItemClick).toHaveBeenCalledWith(issues[1], 1);
  });

  it("supports string items, custom title element, and custom list labels", () => {
    renderValidationSummary({
      title: "Validation failed",
      titleAs: "h3",
      listLabel: "Checkout validation issues",
      items: ["Name is required."],
    });

    expect(screen.getByTestId("validation-summary-label").tagName).toBe("H3");
    expect(screen.getByRole("alert")).toHaveAccessibleName("Validation failed");
    expect(screen.getByTestId("validation-summary-list")).toHaveAccessibleName(
      "Checkout validation issues",
    );
    expect(screen.getByText("Name is required.")).toBeInTheDocument();
  });

  it("hides when empty by default and can render an empty message", () => {
    const { rerender } = render(
      <ValidationSummaryBase classMap={classMap} items={[]} />,
    );

    expect(
      screen.queryByTestId("validation-summary-root"),
    ).not.toBeInTheDocument();

    rerender(
      <ValidationSummaryBase
        classMap={classMap}
        items={[]}
        hideWhenEmpty={false}
        emptyMessage="No validation issues."
      />,
    );

    expect(screen.getByTestId("validation-summary-empty")).toHaveTextContent(
      "No validation issues.",
    );
  });

  it("can focus itself when validation items are present", () => {
    renderValidationSummary({ focusOnMount: true });

    expect(screen.getByTestId("validation-summary-root")).toHaveFocus();
  });

  it("applies theme, state, outline, glass, rounding, and shadow classes", () => {
    renderValidationSummary({
      theme: "secondary",
      state: "warning",
      outline: true,
      glass: true,
      rounding: "large",
      shadow: "strong",
    });

    const root = screen.getByTestId("validation-summary-root");
    expect(root).toHaveClass("root");
    expect(root).toHaveClass("secondary");
    expect(root).toHaveClass("warning");
    expect(root).toHaveClass("outline");
    expect(root).toHaveClass("glass");
    expect(root).toHaveClass("roundLarge");
    expect(root).toHaveClass("shadowStrong");
  });

  it("applies loading, disabled, and custom class names", () => {
    renderValidationSummary({
      loading: true,
      loadingMessage: "Checking fields",
      disabled: true,
      containerClassName: "customContainer",
      className: "customRoot",
      labelClassName: "customLabel",
      titleClassName: "customTitle",
      description: "Description",
      descriptionClassName: "customDescription",
      listClassName: "customList",
      itemClassName: "customItem",
      linkClassName: "customLink",
      contentClassName: "customContent",
      children: "Extra guidance.",
    });

    expect(screen.getByTestId("validation-summary")).toHaveClass(
      "customContainer",
    );
    expect(screen.getByTestId("validation-summary-root")).toHaveClass(
      "disabled",
      "loading",
      "customRoot",
    );
    expect(screen.getByRole("status")).toHaveTextContent("Checking fields");
    expect(screen.getByTestId("validation-summary-label")).toHaveClass(
      "customLabel",
      "customTitle",
    );
    expect(screen.getByTestId("validation-summary-description")).toHaveClass(
      "customDescription",
    );
    expect(screen.getByTestId("validation-summary-list")).toHaveClass(
      "customList",
    );
    expect(screen.getByTestId("validation-summary-item-0")).toHaveClass(
      "customItem",
    );
    expect(screen.getByTestId("validation-summary-item-0-link")).toHaveClass(
      "customLink",
    );
    expect(screen.getByTestId("validation-summary-content")).toHaveClass(
      "customContent",
    );
  });

  it("forwards refs to the root", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <ValidationSummaryBase
        label="Validation Summary"
        items={issues}
        classMap={classMap}
        ref={ref}
      />,
    );

    expect(ref.current).toBe(screen.getByTestId("validation-summary-root"));
  });

  it("has no accessibility violations", async () => {
    const { container } = renderValidationSummary({
      description: "Review these fields before submitting.",
    });

    expect(await axe(container)).toHaveNoViolations();
  });
});
