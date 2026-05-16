import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { axe, toHaveNoViolations } from "jest-axe";
import AppShellBase from "@/components/AppShell/AppShellBase";

expect.extend(toHaveNoViolations);

const classMap = {
  root: "root",
  header: "header",
  body: "body",
  sidebar: "sidebar",
  main: "main",
  aside: "aside",
  footer: "footer",
  sidebarCollapsed: "sidebarCollapsed",
  stickyHeader: "stickyHeader",
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

describe("AppShellBase", () => {
  it("renders shell regions", () => {
    render(
      <AppShellBase
        classMap={classMap}
        header="Header"
        sidebar="Navigation"
        aside="Inspector"
        footer="Footer"
      >
        Main content
      </AppShellBase>,
    );

    expect(screen.getByTestId("app-shell-header")).toHaveTextContent("Header");
    expect(screen.getByTestId("app-shell-sidebar")).toHaveTextContent(
      "Navigation",
    );
    expect(screen.getByTestId("app-shell-main")).toHaveTextContent(
      "Main content",
    );
    expect(screen.getByTestId("app-shell-aside")).toHaveTextContent(
      "Inspector",
    );
    expect(screen.getByTestId("app-shell-footer")).toHaveTextContent("Footer");
  });

  it("applies layout and visual state classes", () => {
    render(
      <AppShellBase
        classMap={classMap}
        header="Header"
        theme="secondary"
        state="success"
        outline
        glass
        stickyHeader
        sidebarCollapsed
        rounding="large"
        shadow="strong"
        loading
        disabled
      />,
    );

    const root = screen.getByTestId("app-shell");
    expect(root).toHaveClass(
      "root",
      "secondary",
      "success",
      "outline",
      "glass",
      "stickyHeader",
      "sidebarCollapsed",
      "roundLarge",
      "shadowStrong",
    );
    expect(root).toHaveAttribute("aria-busy", "true");
    expect(screen.getByTestId("app-shell-loader")).toBeInTheDocument();
  });

  it("forwards refs to the root", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <AppShellBase classMap={classMap} ref={ref}>
        Main
      </AppShellBase>,
    );

    expect(ref.current).toBe(screen.getByTestId("app-shell"));
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <AppShellBase classMap={classMap} header="Header">
        Main content
      </AppShellBase>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
