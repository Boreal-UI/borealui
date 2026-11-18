import { act, fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";
import DataTable from "@/components/DataTable/core/DataTable";

const data = [{ name: "Aurora" }];
const columns = [{ key: "name" as const, label: "Name" }];

it("renders distinct caption-based region names on the server and hydrates consistently", async () => {
  const tables = <><DataTable data={data} columns={columns} caption="Publications" /><DataTable data={data} columns={columns} caption="Members" /></>;
  const host = document.createElement("div");
  host.innerHTML = renderToString(tables);
  document.body.append(host);
  expect(screen.getByRole("region", { name: "Publications" })).toHaveAttribute("tabindex", "0");
  expect(screen.getByRole("region", { name: "Members" })).toBeInTheDocument();
  const onRecoverableError = jest.fn();
  let root: ReturnType<typeof hydrateRoot>;
  await act(async () => {
    root = hydrateRoot(host, tables, { onRecoverableError });
    await Promise.resolve();
  });
  expect(onRecoverableError).not.toHaveBeenCalled();
  act(() => root!.unmount());
  host.remove();
});

it("applies region overrides and merges classes while preserving the table caption", () => {
  render(<><h2 id="heading">Custom heading</h2><DataTable data={data} columns={columns} caption="Members" scrollRegionProps={{ "aria-label": "Override", "aria-labelledby": "heading", tabIndex: -1, className: "consumer", title: "Scroll here" }} /></>);
  expect(screen.getByRole("region", { name: "Custom heading" })).toHaveClass("consumer", "data_table_wrapper");
  expect(screen.getByRole("region")).toHaveAttribute("tabindex", "-1");
  expect(screen.getByRole("region")).toHaveAttribute("title", "Scroll here");
  expect(screen.getByRole("table", { name: "Members" })).toBeInTheDocument();
});

it("uses explicit region labels ahead of captions, then table naming when no caption exists", () => {
  const view = render(<DataTable data={data} columns={columns} caption="Members" scrollRegionProps={{ "aria-label": "Member directory" }} />);
  expect(screen.getByRole("region", { name: "Member directory" })).not.toHaveAttribute("aria-labelledby");
  view.rerender(<DataTable data={data} columns={columns} caption="" aria-label="Archived members" />);
  expect(screen.getByRole("region", { name: "Archived members" })).toBeInTheDocument();
});

it("does not activate rows for nested interactive content or their keyboard events", () => {
  const onRowClick = jest.fn();
  render(<DataTable data={data} onRowClick={onRowClick} columns={[{ ...columns[0], render: () => <><span>Plain cell</span><a href="#member">Member</a><button>Edit</button><input aria-label="Name" /><select aria-label="Status"><option>Draft</option></select><textarea aria-label="Notes" /><span role="button" tabIndex={0}>Custom</span><span contentEditable suppressContentEditableWarning>Editable</span></> }]} />);
  for (const name of ["Member", "Edit", "Custom", "Editable"]) {
    const target = screen.getByText(name);
    fireEvent.click(target, { ctrlKey: name === "Member" });
    fireEvent.keyDown(target, { key: "Enter" });
    fireEvent.keyDown(target, { key: " " });
  }
  for (const role of ["textbox", "combobox"]) {
    screen.getAllByRole(role).forEach((target) => {
      fireEvent.click(target);
      fireEvent.keyDown(target, { key: " " });
    });
  }
  expect(onRowClick).not.toHaveBeenCalled();
  fireEvent.click(screen.getByText("Plain cell"));
  const row = screen.getByText("Plain cell").closest("tr")!;
  fireEvent.keyDown(row, { key: "Enter" });
  fireEvent.keyDown(row, { key: " " });
  expect(onRowClick).toHaveBeenCalledTimes(3);
});
