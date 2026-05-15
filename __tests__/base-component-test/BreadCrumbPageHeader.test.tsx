import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { axe, toHaveNoViolations } from "jest-axe";
import BreadCrumbPageHeaderBase from "@/components/BreadCrumbPageHeader/BreadCrumbPageHeaderBase";

expect.extend(toHaveNoViolations);

const classMap = {
  root: "root",
  breadcrumbs: "breadcrumbs",
  breadcrumbList: "breadcrumbList",
  breadcrumbItem: "breadcrumbItem",
  breadcrumbLink: "breadcrumbLink",
  breadcrumbCurrent: "breadcrumbCurrent",
  current: "current",
  separator: "separator",
  main: "main",
  content: "content",
  title: "title",
  subtitle: "subtitle",
  actions: "actions",
  loader: "loader",
  secondary: "secondary",
  success: "success",
  outline: "outline",
  glass: "glass",
  disabled: "disabled",
  loading: "loading",
  shadowStrong: "shadowStrong",
  roundLarge: "roundLarge",
};

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Components", href: "/components" },
  { label: "Page header" },
];

describe("BreadCrumbPageHeaderBase", () => {
  it("renders breadcrumbs, title, subtitle, and actions", () => {
    render(
      <BreadCrumbPageHeaderBase
        classMap={classMap}
        breadcrumbs={breadcrumbs}
        title="Page header"
        subtitle="Combines navigation and page context"
        actions={<button type="button">Edit</button>}
      />,
    );

    expect(
      screen.getByRole("navigation", { name: "Breadcrumbs" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Page header" }),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("bread-crumb-page-header-subtitle"),
    ).toHaveTextContent("Combines navigation and page context");
    expect(
      screen.getByTestId("bread-crumb-page-header-actions"),
    ).toHaveTextContent("Edit");
  });

  it("collapses breadcrumbs when maxVisibleBreadcrumbs is set", () => {
    render(
      <BreadCrumbPageHeaderBase
        classMap={classMap}
        breadcrumbs={breadcrumbs}
        maxVisibleBreadcrumbs={2}
        title="Page header"
      />,
    );

    expect(screen.getByText("...")).toBeInTheDocument();
  });

  it("applies visual classes and loading semantics", () => {
    render(
      <BreadCrumbPageHeaderBase
        classMap={classMap}
        title="Page header"
        theme="secondary"
        state="success"
        outline
        glass
        rounding="large"
        shadow="strong"
        loading
        disabled
      />,
    );

    const root = screen.getByTestId("bread-crumb-page-header");
    expect(root).toHaveClass(
      "root",
      "secondary",
      "success",
      "outline",
      "glass",
      "roundLarge",
      "shadowStrong",
      "loading",
      "disabled",
    );
    expect(root).toHaveAttribute("aria-busy", "true");
  });

  it("forwards refs to the root", () => {
    const ref = React.createRef<HTMLElement>();
    render(
      <BreadCrumbPageHeaderBase
        classMap={classMap}
        title="Page header"
        ref={ref}
      />,
    );

    expect(ref.current).toBe(screen.getByTestId("bread-crumb-page-header"));
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <BreadCrumbPageHeaderBase
        classMap={classMap}
        breadcrumbs={breadcrumbs}
        title="Page header"
      />,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
