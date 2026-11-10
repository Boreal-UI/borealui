import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import CoreButton from "@/components/Button/core/Button";
import NextButton from "@/components/Button/next/Button";
import ServerButton from "@/components/Button/server/Button";
import DataTable from "@/components/DataTable/core/DataTable";

jest.mock("identity-obj-proxy", () => ({
  __esModule: true,
  default: {
    button: "button", fullWidth: "fullWidth", wrapLabel: "wrapLabel",
    buttonLabel: "buttonLabel", loader: "loader",
  },
}));

describe.each([["core", CoreButton], ["next", NextButton]] as const)("%s responsive Button", (_name, Button) => {
  it("supports wrapping/fullWidth and native activation, and retains visible accessible loading text", async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    const view = render(<Button wrapLabel fullWidth labelClassName="action-label" loaderClassName="action-spinner" onClick={onClick}>Save settings and return to the project</Button>);
    const button = screen.getByRole("button", { name: "Save settings and return to the project" });
    expect(button.className).toMatch(/wrapLabel/);
    expect(button.querySelector(".action-label")).toHaveTextContent("Save settings");
    button.focus();
    await user.keyboard("{Enter} ");
    expect(onClick).toHaveBeenCalledTimes(2);
    view.rerender(<Button wrapLabel fullWidth loading loadingLabel="Saving settings and returning to the project" loaderClassName="action-spinner" onClick={onClick}>Save</Button>);
    expect(button).toHaveAccessibleName("Saving settings and returning to the project");
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toBeDisabled();
    expect(button.querySelector(".action-spinner")).toHaveAttribute("aria-hidden", "true");
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(2);
    expect(await axe(view.container)).toHaveNoViolations();
    view.rerender(<Button>Single line</Button>);
    expect(button.className).not.toMatch(/wrapLabel/);
  });
});

it("server Button shares wrapping and visible pending presentation", () => {
  render(<ServerButton wrapLabel fullWidth loading loadingLabel="Saving all publication settings">Save</ServerButton>);
  const button = screen.getByRole("button", { name: "Saving all publication settings" });
  expect(button).toHaveClass("wrapLabel", "fullWidth");
  expect(button).toBeDisabled();
  expect(button).toHaveAttribute("aria-busy", "true");
});

it("DataTable configures the native table algorithm without replacing region naming or header relationships", () => {
  render(<DataTable caption="Documents" minWidth="60rem" tableLayout="fixed" scrollRegionProps={{ title: "Scroll for columns" }}
    data={[{ id: "file", filename: "document.pdf" }]} rowKey={(row) => row.id}
    columns={[{ key: "id", label: "ID", width: "8rem" }, { key: "filename", label: "Filename", wrap: true }]} />);
  const region = screen.getByRole("region", { name: "Documents" });
  const table = screen.getByRole("table", { name: "Documents" });
  expect(region).toHaveAttribute("tabindex", "0");
  expect(region).toHaveAttribute("title", "Scroll for columns");
  expect(table).toHaveStyle({ minWidth: "60rem", tableLayout: "fixed" });
  const header = screen.getByRole("columnheader", { name: "Filename" });
  expect(screen.getByRole("cell", { name: "document.pdf" })).toHaveAttribute("headers", header.id);
});
