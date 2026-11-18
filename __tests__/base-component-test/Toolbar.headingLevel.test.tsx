import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import CoreToolbar from "../../src/core/Toolbar";
import NextToolbar from "../../src/next/Toolbar";
import ServerToolbar from "../../src/next/server/Toolbar";

// expandClassMap enumerates module keys, so use an enumerable module mock.
jest.mock("../../src/components/Toolbar/next/Toolbar.module.scss", () => ({
  toolbar: "module-toolbar",
  title: "module-title",
}));

describe.each([
  ["Core", CoreToolbar],
  ["Next", NextToolbar],
  ["server", ServerToolbar],
] as const)("%s Toolbar public heading level", (_name, Toolbar) => {
  it("defaults to H1 and generates a title ID", () => {
    render(<Toolbar title="Boreal Admin" />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveAttribute("id");
  });

  it.each([1, 2, 3, 4, 5, 6] as const)("renders H%i without changing styling or semantics", (level) => {
    const { container } = render(
      <Toolbar title="Boreal Admin" headingLevel={level} titleId="admin-title"
        titleClassName="custom-title" className="custom-toolbar"
        aria-labelledby="admin-title" testId="admin" />,
    );
    const heading = screen.getByRole("heading", { level, name: "Boreal Admin" });
    expect(heading).toHaveAttribute("id", "admin-title");
    expect(heading).toHaveAttribute("data-testid", "admin-title");
    expect(heading).toHaveClass("custom-title");
    expect(heading).toHaveClass(_name === "Core" ? "toolbar_title" : "module-title");
    const toolbar = screen.getByRole("toolbar", { name: "Boreal Admin" });
    expect(toolbar.tagName).toBe("DIV");
    expect(toolbar).toHaveClass("custom-toolbar");
    expect(toolbar).toHaveAttribute("aria-orientation", "horizontal");
    expect(toolbar).not.toHaveAttribute("aria-label");
    expect(container.querySelector("[headinglevel]")).toBeNull();
  });

  it("renders no heading without a title and preserves explicit naming", () => {
    const { container } = render(<Toolbar headingLevel={2} aria-label="Actions" center="Content" />);
    expect(screen.queryByRole("heading")).toBeNull();
    expect(screen.getByRole("toolbar", { name: "Actions" })).toHaveTextContent("Content");
    expect(container.querySelector("[headinglevel]")).toBeNull();
  });

  it("composes with one page H1 without accessibility violations", async () => {
    const { container } = render(<main><h1>Admin Dashboard</h1><Toolbar title="Boreal Admin" headingLevel={2} /></main>);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Admin Dashboard");
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Boreal Admin");
    expect(await axe(container)).toHaveNoViolations();
  });
});
