import React from "react";
import { render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import DividerBase from "@/components/Divider/DividerBase";

expect.extend(toHaveNoViolations);

const styles = {
  divider: "divider",
  horizontal: "horizontal",
  vertical: "vertical",
  dashed: "dashed",
  primary: "themePrimary",
  success: "stateSuccess",
  glass: "glass",
};

describe("DividerBase", () => {
  const renderDivider = (
    props: Partial<React.ComponentProps<typeof DividerBase>> = {},
  ) =>
    render(<DividerBase classMap={styles} data-testid="divider" {...props} />);

  it("renders with default props as a decorative horizontal divider", () => {
    renderDivider();

    const divider = screen.getByTestId("divider");

    expect(divider).toBeInTheDocument();
    expect(divider.tagName).toBe("DIV");
    expect(divider).toHaveClass("divider");
    expect(divider).toHaveClass("horizontal");
    expect(divider).not.toHaveClass("vertical");
    expect(divider).not.toHaveAttribute("role");
    expect(divider).not.toHaveAttribute("aria-orientation");
    expect(divider).toHaveAttribute("aria-hidden", "true");
    expect(divider).toHaveAttribute("data-orientation", "horizontal");
    expect(divider).toHaveStyle({
      width: "100%",
      height: "1px",
    });
  });

  it("renders a decorative vertical divider by default", () => {
    renderDivider({ orientation: "vertical" });

    const divider = screen.getByTestId("divider");

    expect(divider).toHaveClass("divider");
    expect(divider).toHaveClass("vertical");
    expect(divider).not.toHaveClass("horizontal");
    expect(divider).not.toHaveAttribute("role");
    expect(divider).not.toHaveAttribute("aria-orientation");
    expect(divider).toHaveAttribute("aria-hidden", "true");
    expect(divider).toHaveAttribute("data-orientation", "vertical");
    expect(divider).toHaveStyle({
      width: "1px",
      height: "100%",
    });
  });

  it("applies separator semantics for a non-decorative horizontal divider", () => {
    renderDivider({ decorative: false });

    const divider = screen.getByTestId("divider");

    expect(divider).toHaveAttribute("role", "separator");
    expect(divider).not.toHaveAttribute("aria-hidden");
    expect(divider).not.toHaveAttribute("aria-orientation");
  });

  it("applies separator semantics and aria-orientation for a non-decorative vertical divider", () => {
    renderDivider({ decorative: false, orientation: "vertical" });

    const divider = screen.getByTestId("divider");

    expect(divider).toHaveAttribute("role", "separator");
    expect(divider).toHaveAttribute("aria-orientation", "vertical");
    expect(divider).not.toHaveAttribute("aria-hidden");
  });

  it("applies aria-label when provided for a non-decorative divider", () => {
    renderDivider({ decorative: false, label: "Section separator" });

    const divider = screen.getByTestId("divider");

    expect(divider).toHaveAttribute("role", "separator");
    expect(divider).toHaveAttribute("aria-label", "Section separator");
  });

  it("applies aria-labelledby when provided for a non-decorative divider", () => {
    render(
      <>
        <span id="divider-label">Grouped content</span>
        <DividerBase
          classMap={styles}
          data-testid="divider"
          decorative={false}
          labelledBy="divider-label"
        />
      </>,
    );

    const divider = screen.getByTestId("divider");

    expect(divider).toHaveAttribute("role", "separator");
    expect(divider).toHaveAttribute("aria-labelledby", "divider-label");
  });

  it("does not apply aria-label when decorative is true", () => {
    renderDivider({ decorative: true, label: "Hidden separator" });

    const divider = screen.getByTestId("divider");

    expect(divider).toHaveAttribute("aria-hidden", "true");
    expect(divider).not.toHaveAttribute("aria-label");
  });

  it("does not apply aria-labelledby when decorative is true", () => {
    renderDivider({ decorative: true, labelledBy: "some-id" });

    const divider = screen.getByTestId("divider");

    expect(divider).toHaveAttribute("aria-hidden", "true");
    expect(divider).not.toHaveAttribute("aria-labelledby");
  });

  it("applies custom thickness and length for a horizontal divider", () => {
    renderDivider({ thickness: "4px", length: "60%" });

    const divider = screen.getByTestId("divider");

    expect(divider).toHaveStyle({
      width: "60%",
      height: "4px",
    });
  });

  it("applies custom thickness and length for a vertical divider", () => {
    renderDivider({
      orientation: "vertical",
      thickness: "6px",
      length: "120px",
    });

    const divider = screen.getByTestId("divider");

    expect(divider).toHaveStyle({
      width: "6px",
      height: "120px",
    });
  });

  it("applies dashed class and transparent background for non-hr elements", () => {
    renderDivider({ dashed: true });

    const divider = screen.getByTestId("divider");

    expect(divider).toHaveClass("dashed");
    expect(divider).toHaveStyle({
      backgroundColor: "transparent",
    });
  });

  it("does not apply dashed class when dashed is false", () => {
    renderDivider({ dashed: false });

    const divider = screen.getByTestId("divider");

    expect(divider).not.toHaveClass("dashed");
  });

  it("applies theme and state classes when provided", () => {
    renderDivider({ theme: "primary", state: "success" });

    const divider = screen.getByTestId("divider");

    expect(divider).toHaveClass("themePrimary");
    expect(divider).toHaveClass("stateSuccess");
  });

  it("applies the glass class when requested", () => {
    renderDivider({ variant: "glassOutline", theme: "primary" });

    const divider = screen.getByTestId("divider");

    expect(divider).toHaveClass("themePrimary");
    expect(divider).toHaveClass("glass");
  });

  it("applies a custom className alongside mapped classes", () => {
    renderDivider({ className: "customDividerClass" });

    const divider = screen.getByTestId("divider");

    expect(divider).toHaveClass("divider");
    expect(divider).toHaveClass("horizontal");
    expect(divider).toHaveClass("customDividerClass");
  });

  it("passes through arbitrary html attributes", () => {
    renderDivider({
      id: "main-divider",
      title: "Section divider",
    });

    const divider = screen.getByTestId("divider");

    expect(divider).toHaveAttribute("id", "main-divider");
    expect(divider).toHaveAttribute("title", "Section divider");
  });

  it("forwards ref to a div element", () => {
    const ref = React.createRef<HTMLElement>();

    render(<DividerBase ref={ref} classMap={styles} data-testid="divider" />);

    expect(ref.current).toBe(screen.getByTestId("divider"));
    expect(ref.current?.tagName).toBe("DIV");
  });

  it("renders as a decorative horizontal hr element when requested", () => {
    renderDivider({ as: "hr" });

    const divider = screen.getByTestId("divider");

    expect(divider.tagName).toBe("HR");
    expect(divider).toHaveClass("divider");
    expect(divider).toHaveClass("horizontal");
    expect(divider).not.toHaveAttribute("role");
    expect(divider).not.toHaveAttribute("aria-orientation");
    expect(divider).toHaveAttribute("aria-hidden", "true");
    expect(divider).toHaveAttribute("data-orientation", "horizontal");
    expect(divider).toHaveStyle({
      border: "0px",
      margin: "0px",
      width: "100%",
      height: "0px",
      borderTop: "1px solid currentColor",
    });
  });

  it("keeps native hr semantics for a non-decorative horizontal hr", () => {
    renderDivider({ as: "hr", decorative: false });

    const divider = screen.getByTestId("divider");

    expect(divider.tagName).toBe("HR");
    expect(divider).not.toHaveAttribute("role");
    expect(divider).not.toHaveAttribute("aria-hidden");
    expect(divider).not.toHaveAttribute("aria-orientation");
  });

  it("renders a non-decorative vertical hr with separator semantics", () => {
    renderDivider({ as: "hr", orientation: "vertical", decorative: false });

    const divider = screen.getByTestId("divider");

    expect(divider.tagName).toBe("HR");
    expect(divider).toHaveAttribute("role", "separator");
    expect(divider).toHaveAttribute("aria-orientation", "vertical");
    expect(divider).not.toHaveAttribute("aria-hidden");
  });

  it("renders a vertical hr with custom sizing and separator semantics", () => {
    renderDivider({
      as: "hr",
      orientation: "vertical",
      decorative: false,
      thickness: "2px",
      length: "48px",
    });

    const divider = screen.getByTestId("divider");

    expect(divider.tagName).toBe("HR");
    expect(divider).toHaveAttribute("role", "separator");
    expect(divider).toHaveAttribute("aria-orientation", "vertical");
    expect(divider).toHaveAttribute("data-orientation", "vertical");
    expect(divider).toHaveStyle({
      border: "0px",
      margin: "0px",
      width: "0px",
      height: "48px",
      borderLeft: "2px solid currentColor",
    });
  });

  it("renders a dashed horizontal hr using borderTop", () => {
    renderDivider({
      as: "hr",
      dashed: true,
      thickness: "3px",
      length: "75%",
    });

    const divider = screen.getByTestId("divider");

    expect(divider.tagName).toBe("HR");
    expect(divider).toHaveStyle({
      width: "75%",
      height: "0px",
      borderTop: "3px dashed currentColor",
    });
  });

  it("renders a dashed vertical hr using borderLeft", () => {
    renderDivider({
      as: "hr",
      orientation: "vertical",
      dashed: true,
      thickness: "5px",
      length: "80px",
    });

    const divider = screen.getByTestId("divider");

    expect(divider.tagName).toBe("HR");
    expect(divider).toHaveStyle({
      width: "0px",
      height: "80px",
      borderLeft: "5px dashed currentColor",
    });
  });

  it("supports a custom test id", () => {
    render(
      <DividerBase classMap={styles} data-testid="custom-divider-testid" />,
    );

    expect(screen.getByTestId("custom-divider-testid")).toBeInTheDocument();
  });

  it("does not apply aria-orientation for horizontal dividers", () => {
    renderDivider({ decorative: false, orientation: "horizontal" });

    const divider = screen.getByTestId("divider");

    expect(divider).not.toHaveAttribute("aria-orientation");
  });

  it("merges inline style with computed styles", () => {
    renderDivider({
      style: { opacity: 0.5 },
      thickness: "2px",
      length: "40%",
    });

    const divider = screen.getByTestId("divider");

    expect(divider).toHaveStyle({
      width: "40%",
      height: "2px",
      opacity: "0.5",
    });
  });

  it("has no accessibility violations for default decorative divider", async () => {
    const { container } = renderDivider();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations for non-decorative vertical divider", async () => {
    const { container } = renderDivider({
      decorative: false,
      orientation: "vertical",
      label: "Content separator",
    });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations for decorative hr divider", async () => {
    const { container } = renderDivider({ as: "hr" });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations for labelled non-decorative hr divider", async () => {
    const { container } = renderDivider({
      as: "hr",
      decorative: false,
      label: "Section break",
    });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
