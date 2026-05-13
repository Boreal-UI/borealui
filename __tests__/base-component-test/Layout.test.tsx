import React from "react";
import { render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import LayoutBase from "../../src/components/Layout/LayoutBase";
import type { LayoutBaseProps } from "../../src/components/Layout/Layout.types";

expect.extend(toHaveNoViolations);

const classMap = {
  container: "layout_container",
  section: "layout_section",
  stack: "layout_stack",
  inline: "layout_inline",
  grid: "layout_grid",
  cluster: "layout_cluster",

  gapNone: "layout_gap_none",
  gapXs: "layout_gap_xs",
  gapSm: "layout_gap_sm",
  gapMd: "layout_gap_md",
  gapLg: "layout_gap_lg",
  gapXl: "layout_gap_xl",

  alignStart: "layout_align_start",
  alignCenter: "layout_align_center",
  alignEnd: "layout_align_end",
  alignStretch: "layout_align_stretch",

  justifyStart: "layout_justify_start",
  justifyCenter: "layout_justify_center",
  justifyEnd: "layout_justify_end",
  justifyBetween: "layout_justify_between",
  justifyAround: "layout_justify_around",
  justifyEvenly: "layout_justify_evenly",

  sizeSm: "layout_size_sm",
  sizeMd: "layout_size_md",
  sizeLg: "layout_size_lg",
  sizeXl: "layout_size_xl",

  padded: "layout_padded",
  wrap: "layout_wrap",

  toneDefault: "layout_tone_default",
  toneMuted: "layout_tone_muted",
  toneAccent: "layout_tone_accent",
} satisfies LayoutBaseProps["classMap"];

function renderLayout(props: Partial<LayoutBaseProps> = {}) {
  return render(
    <LayoutBase variant="container" classMap={classMap} {...props}>
      <span>Layout content</span>
    </LayoutBase>,
  );
}

describe("LayoutBase", () => {
  it("renders children", () => {
    renderLayout();

    expect(screen.getByText("Layout content")).toBeInTheDocument();
  });

  it("renders a div by default for non-section variants", () => {
    renderLayout({ variant: "container" });

    const layout = screen.getByTestId("container");

    expect(layout.tagName).toBe("DIV");
  });

  it("renders a section element by default when variant is section", () => {
    renderLayout({ variant: "section" });

    const layout = screen.getByTestId("section");

    expect(layout.tagName).toBe("SECTION");
  });

  it("uses the custom `as` element when provided", () => {
    renderLayout({
      as: "main",
      variant: "container",
      testId: "custom-layout",
    });

    const layout = screen.getByTestId("custom-layout");

    expect(layout.tagName).toBe("MAIN");
  });

  it("uses testId before data-testid before variant for the resolved test id", () => {
    renderLayout({
      variant: "container",
      testId: "from-test-id",
      "data-testid": "from-data-testid",
    });

    expect(screen.getByTestId("from-test-id")).toBeInTheDocument();
    expect(screen.queryByTestId("from-data-testid")).not.toBeInTheDocument();
    expect(screen.queryByTestId("container")).not.toBeInTheDocument();
  });

  it("uses data-testid when testId is not provided", () => {
    renderLayout({
      variant: "container",
      "data-testid": "from-data-testid",
    });

    expect(screen.getByTestId("from-data-testid")).toBeInTheDocument();
  });

  it("falls back to the variant as the test id", () => {
    renderLayout({ variant: "stack" });

    expect(screen.getByTestId("stack")).toBeInTheDocument();
  });

  it("applies the base variant class", () => {
    renderLayout({ variant: "stack" });

    expect(screen.getByTestId("stack")).toHaveClass("layout_stack");
  });

  it("applies the default gap, size, and wrap classes", () => {
    renderLayout({ variant: "container" });

    const layout = screen.getByTestId("container");

    expect(layout).toHaveClass("layout_container");
    expect(layout).toHaveClass("layout_gap_md");
    expect(layout).toHaveClass("layout_size_lg");
    expect(layout).toHaveClass("layout_wrap");
  });

  it("applies gap, align, and justify classes", () => {
    renderLayout({
      variant: "inline",
      gap: "xl",
      align: "center",
      justify: "between",
    });

    const layout = screen.getByTestId("inline");

    expect(layout).toHaveClass("layout_inline");
    expect(layout).toHaveClass("layout_gap_xl");
    expect(layout).toHaveClass("layout_align_center");
    expect(layout).toHaveClass("layout_justify_between");
  });

  it("does not apply a container size class to non-container variants", () => {
    renderLayout({
      variant: "stack",
      size: "xl",
    });

    const layout = screen.getByTestId("stack");

    expect(layout).not.toHaveClass("layout_size_xl");
  });

  it("applies size class only for container variants", () => {
    renderLayout({
      variant: "container",
      size: "xl",
    });

    expect(screen.getByTestId("container")).toHaveClass("layout_size_xl");
  });

  it("applies padded class when padded is true", () => {
    renderLayout({
      variant: "container",
      padded: true,
    });

    expect(screen.getByTestId("container")).toHaveClass("layout_padded");
  });

  it("does not apply wrap class when wrap is false", () => {
    renderLayout({
      variant: "container",
      wrap: false,
    });

    expect(screen.getByTestId("container")).not.toHaveClass("layout_wrap");
  });

  it("applies tone class only for section variants", () => {
    renderLayout({
      variant: "section",
      tone: "muted",
    });

    expect(screen.getByTestId("section")).toHaveClass("layout_tone_muted");
  });

  it("does not apply tone class to non-section variants", () => {
    renderLayout({
      variant: "container",
      tone: "muted",
    });

    expect(screen.getByTestId("container")).not.toHaveClass(
      "layout_tone_muted",
    );
  });

  it("includes custom className", () => {
    renderLayout({
      variant: "container",
      className: "custom-layout-class",
    });

    expect(screen.getByTestId("container")).toHaveClass("custom-layout-class");
  });

  it("passes through rest props", () => {
    renderLayout({
      variant: "container",
      id: "layout-id",
      "aria-label": "Main layout area",
    });

    const layout = screen.getByLabelText("Main layout area");

    expect(layout).toHaveAttribute("id", "layout-id");
  });

  it("passes through regular styles for non-grid variants", () => {
    renderLayout({
      variant: "container",
      style: { marginTop: "12px" },
    });

    expect(screen.getByTestId("container")).toHaveStyle({
      marginTop: "12px",
    });
  });

  it("adds the grid min-column CSS variable for grid variants", () => {
    renderLayout({
      variant: "grid",
      minColumnWidth: "20rem",
    });

    expect(screen.getByTestId("grid")).toHaveStyle({
      "--layout-min-column-width": "20rem",
    });
  });

  it("preserves provided styles when adding the grid min-column CSS variable", () => {
    renderLayout({
      variant: "grid",
      minColumnWidth: "18rem",
      style: { padding: "24px" },
    });

    const layout = screen.getByTestId("grid");

    expect(layout).toHaveStyle({
      padding: "24px",
      "--layout-min-column-width": "18rem",
    });
  });

  it("uses the default grid min-column width when none is provided", () => {
    renderLayout({
      variant: "grid",
    });

    expect(screen.getByTestId("grid")).toHaveStyle({
      "--layout-min-column-width": "16rem",
    });
  });

  it("has no accessibility violations", async () => {
    const { container } = renderLayout({
      as: "section",
      variant: "section",
      "aria-label": "Featured content",
      tone: "muted",
      padded: true,
    });

    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});
