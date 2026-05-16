import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { axe, toHaveNoViolations } from "jest-axe";
import BreadCrumbPageHeaderBase from "@/components/BreadCrumbPageHeader/BreadCrumbPageHeaderBase";
import { BreadcrumbsProps } from "@/components/Breadcrumbs/Breadcrumbs.types";

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

const MockBreadcrumbs = ({ items }: BreadcrumbsProps) => (
  <nav aria-label="Breadcrumbs">
    <ol>
      {items.map((item) => (
        <li key={item.label}>{item.label}</li>
      ))}
    </ol>
  </nav>
);

const renderHeader = (
  props: Partial<React.ComponentProps<typeof BreadCrumbPageHeaderBase>> = {},
) =>
  render(
    <BreadCrumbPageHeaderBase
      classMap={classMap}
      BreadCrumbsComponent={MockBreadcrumbs}
      {...props}
    />,
  );

describe("BreadCrumbPageHeaderBase", () => {
  it("renders breadcrumbs, title, subtitle, and actions", () => {
    renderHeader({
      breadcrumbs,
      title: "Page header",
      subtitle: "Combines navigation and page context",
      actions: <button type="button">Edit</button>,
    });

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

  it("passes breadcrumb props to the breadcrumb component", () => {
    const BreadcrumbsWithProps = ({ items, maxVisible }: BreadcrumbsProps) => (
      <nav aria-label="Breadcrumbs" data-max-visible={maxVisible}>
        {items.map((item) => item.label).join(" / ")}
      </nav>
    );

    render(
      <BreadCrumbPageHeaderBase
        classMap={classMap}
        BreadCrumbsComponent={BreadcrumbsWithProps}
        breadcrumbs={breadcrumbs}
        breadcrumbProps={{ maxVisible: 2 }}
        title="Page header"
      />,
    );

    expect(screen.getByRole("navigation")).toHaveAttribute(
      "data-max-visible",
      "2",
    );
  });

  it("applies visual classes and loading semantics", () => {
    renderHeader({
      title: "Page header",
      theme: "secondary",
      state: "success",
      outline: true,
      glass: true,
      rounding: "large",
      shadow: "strong",
      loading: true,
      disabled: true,
    });

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
        BreadCrumbsComponent={MockBreadcrumbs}
        title="Page header"
        ref={ref}
      />,
    );

    expect(ref.current).toBe(screen.getByTestId("bread-crumb-page-header"));
  });

  it("has no accessibility violations", async () => {
    const { container } = renderHeader({
      breadcrumbs,
      title: "Page header",
    });

    expect(await axe(container)).toHaveNoViolations();
  });
});
