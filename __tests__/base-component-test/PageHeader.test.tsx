import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { axe, toHaveNoViolations } from "jest-axe";
import PageHeaderBase from "@/components/PageHeader/PageHeaderBase";

expect.extend(toHaveNoViolations);

const classMap = {
  root: "root",
  main: "main",
  content: "content",
  title: "title",
  subtitle: "subtitle",
  eyebrow: "eyebrow",
  actions: "actions",
  footer: "footer",
  loader: "loader",
  fullWidth: "fullWidth",
  compact: "compact",
  secondary: "secondary",
  success: "success",
  disabled: "disabled",
  loading: "loading",
  shadowStrong: "shadowStrong",
  roundLarge: "roundLarge",
  glass: "glass",
  outline: "outline",
};

describe("PageHeaderBase", () => {
  it("renders title, subtitle, eyebrow, actions, and footer", () => {
    render(
      <PageHeaderBase
        classMap={classMap}
        title="Projects"
        subtitle="Track delivery work"
        eyebrow="Workspace"
        actions={<button type="button">Create</button>}
        footer="Updated today"
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Projects" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("page-header-subtitle")).toHaveTextContent(
      "Track delivery work",
    );
    expect(screen.getByTestId("page-header-actions")).toHaveTextContent(
      "Create",
    );
    expect(screen.getByTestId("page-header-footer")).toHaveTextContent(
      "Updated today",
    );
  });

  it("applies visual classes and loading semantics", () => {
    render(
      <PageHeaderBase
        classMap={classMap}
        title="Projects"
        theme="secondary"
        state="success"
        variant="glassOutline"
        compact
        rounding="large"
        shadow="strong"
        loading
        disabled
      />,
    );

    const root = screen.getByTestId("page-header");
    expect(root).toHaveClass(
      "root",
      "secondary",
      "success",
      "outline",
      "glass",
      "compact",
      "roundLarge",
      "shadowStrong",
      "loading",
      "disabled",
    );
    expect(root).toHaveAttribute("aria-busy", "true");
    expect(screen.getByTestId("page-header-loader")).toBeInTheDocument();
  });

  it("forwards refs to the root", () => {
    const ref = React.createRef<HTMLElement>();
    render(<PageHeaderBase classMap={classMap} title="Projects" ref={ref} />);

    expect(ref.current).toBe(screen.getByTestId("page-header"));
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <PageHeaderBase
        classMap={classMap}
        title="Projects"
        subtitle="Overview"
      />,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
