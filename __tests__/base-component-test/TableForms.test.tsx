import React, { useState } from "react";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { renderToString } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";
import CoreSearch from "../../src/core/SearchInput";
import NextSearch from "../../src/next/SearchInput";
import CoreColor from "../../src/core/ColorPicker";
import NextColor from "../../src/next/ColorPicker";
import CoreTable from "../../src/core/DataTable";
import NextTable from "../../src/next/DataTable";

const colors = [{ label: "Red", value: "#ff0000" }, { label: "Blue", value: "#0000ff" }];
const rows = Array.from({ length: 200 }, (_, id) => ({ id, name: `Row ${String(id).padStart(3, "0")}` }));

for (const [variant, Search, Color, Table] of [["core", CoreSearch, CoreColor, CoreTable], ["next", NextSearch, NextColor, NextTable]] as const) {
  describe(`${variant} public table and form components`, () => {
    it.each([false, true])("notifies uncontrolled clear once in order (onClear=%s)", async notify => {
      const calls: string[] = [];
      const { container } = render(<Search label="Search" required defaultValue="initial" onChange={(value, event) => calls.push(`change:${value}:${event.type}`)} onClear={notify ? () => calls.push("clear") : undefined} />);
      const user = userEvent.setup();
      screen.getByRole("button", { name: "Clear search" }).focus();
      await user.keyboard("{Enter}");
      expect(calls).toEqual(notify ? ["change::click", "clear"] : ["change::click"]);
      expect(screen.getByRole("searchbox")).toHaveValue("");
      expect(screen.getByRole("searchbox")).toBeInvalid();
      expect(screen.getByRole("searchbox")).toHaveFocus();
      expect(await axe(container)).toHaveNoViolations();
    });
    it.each(["disabled", "readOnly"] as const)("ignores clear while %s", prop => {
      const onChange = jest.fn(); const onClear = jest.fn();
      render(<Search label="Search" value="initial" {...{ [prop]: true }} onChange={onChange} onClear={onClear} />);
      fireEvent.click(screen.getByRole("button", { name: "Clear search" }));
      expect(onChange).not.toHaveBeenCalled(); expect(onClear).not.toHaveBeenCalled();
    });
    it("clears controlled search through onChange without onClear", () => {
      const onChange = jest.fn();
      function Example() {
        const [value, setValue] = useState("initial");
        return <Search label="Search" value={value} onChange={(next, event) => { onChange(next, event.currentTarget.tagName); setValue(next); }} />;
      }
      render(<Example />);
      fireEvent.click(screen.getByRole("button", { name: "Clear search" }));
      expect(screen.getByRole("searchbox")).toHaveValue("");
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith("", "BUTTON");
      expect(screen.getByRole("searchbox")).toHaveFocus();
    });
    it("submits a required custom color exactly once", () => {
      const { container } = render(<form><Color label="Custom" name="chosen-color" required allowCustom value="#123456" onValueChange={() => {}} colors={colors} /></form>);
      const form = container.querySelector("form")!;
      expect(form.checkValidity()).toBe(true);
      expect(Array.from(new FormData(form).entries())).toEqual([["chosen-color", "#123456"]]);
    });
    it("enforces missing/invalid custom selections and resets uncontrolled values", async () => {
      const onValueChange = jest.fn();
      const { container, rerender } = render(<form><Color label="Color" required name="color" allowCustom defaultValue="" onValueChange={onValueChange} colors={colors} /></form>);
      const form = container.querySelector("form")!;
      expect(form.checkValidity()).toBe(false);
      expect(new FormData(form).getAll("color")).toEqual([]);
      fireEvent.change(screen.getByLabelText("Custom color picker"), { target: { value: "#123456" } });
      expect(form.checkValidity()).toBe(true);
      expect(new FormData(form).getAll("color")).toEqual(["#123456"]);
      fireEvent.click(screen.getByRole("radio", { name: "Red" }));
      expect(new FormData(form).getAll("color")).toEqual(["#ff0000"]);
      await act(async () => { form.reset(); await new Promise(resolve => setTimeout(resolve, 5)); });
      expect(form.checkValidity()).toBe(false);
      expect(new FormData(form).getAll("color")).toEqual([]);
      expect(screen.getByLabelText("Custom color picker")).toHaveValue("#000000");
      expect(onValueChange).toHaveBeenCalledTimes(2);
      rerender(<form><Color label="Color" required name="color" allowCustom value="invalid" colors={colors} /></form>);
      expect(form.checkValidity()).toBe(false);
      expect(new FormData(form).getAll("color")).toEqual([]);
    });
    it("preserves controlled values on reset and native fieldset disabling", async () => {
      const { container, rerender } = render(<form><Color label="Color" name="color" required allowCustom value="#123456" colors={colors} /></form>);
      const form = container.querySelector("form")!;
      await act(async () => { form.reset(); await new Promise(resolve => setTimeout(resolve, 5)); });
      expect(new FormData(form).getAll("color")).toEqual(["#123456"]);
      rerender(<form><fieldset disabled><Color label="Color" name="color" required allowCustom value="#123456" colors={colors} /></fieldset></form>);
      expect(form.checkValidity()).toBe(true);
      expect(new FormData(form).getAll("color")).toEqual([]);
    });
    it("keeps SSR/hydration names stable for independent unnamed groups", async () => {
      const example = <form><Color label="First" defaultValue="#ff0000" colors={colors} /><Color label="Second" defaultValue="#0000ff" colors={colors} /></form>;
      const container = document.createElement("div"); document.body.appendChild(container);
      container.innerHTML = renderToString(example);
      const names = Array.from(container.querySelectorAll("input"), input => input.name);
      expect(new Set(names).size).toBe(2);
      const onRecoverableError = jest.fn();
      let root!: ReturnType<typeof hydrateRoot>;
      await act(async () => { root = hydrateRoot(container, example, { onRecoverableError }); });
      expect(Array.from(container.querySelectorAll("input"), input => input.name)).toEqual(names);
      expect(onRecoverableError).not.toHaveBeenCalled();
      await act(async () => root.unmount()); container.remove();
    });
    it("keeps two unnamed controlled radio groups independent", () => {
      render(<form><Color label="First" value="#ff0000" onValueChange={() => {}} colors={colors} /><Color label="Second" value="#0000ff" onValueChange={() => {}} colors={colors} /></form>);
      const first = within(screen.getByRole("group", { name: "First" })).getByRole("radio", { name: "Red" });
      const second = within(screen.getByRole("group", { name: "Second" })).getByRole("radio", { name: "Blue" });
      expect(first.getAttribute("name")).not.toBe(second.getAttribute("name"));
      expect(first).toBeChecked(); expect(second).toBeChecked();
    });
    it("preserves explicit native names in separate form owners", () => {
      const { container } = render(<><form><Color label="First" name="same" value="#ff0000" colors={colors} /></form>
        <form><Color label="Second" name="same" value="#0000ff" colors={colors} /></form></>);
      const forms = container.querySelectorAll("form");
      expect(Array.from(new FormData(forms[0]).entries())).toEqual([["same", "#ff0000"]]);
      expect(Array.from(new FormData(forms[1]).entries())).toEqual([["same", "#0000ff"]]);
      expect(within(screen.getByRole("group", { name: "First" })).getByRole("radio", { name: "Red" })).toBeChecked();
      expect(within(screen.getByRole("group", { name: "Second" })).getByRole("radio", { name: "Blue" })).toBeChecked();
    });
    it("selects the logical filtered scope rather than the mounted virtual slice", () => {
      const onSelectionChange = jest.fn();
      render(<Table data={rows} columns={[{ key: "name", label: "Name" }]} rowKey={row => row.id} selectableRows virtualized virtualRowHeight={48} virtualViewportHeight={192} virtualOverscan={2} onSelectionChange={onSelectionChange} />);
      fireEvent.click(screen.getByRole("checkbox", { name: "Select all rows" }));
      expect(onSelectionChange).toHaveBeenLastCalledWith(rows.map(row => row.id), rows);
    });
    it.each([false, true])("shares selection scope with nonvirtual rendering (virtual=%s)", virtualized => {
      const onSelectionChange = jest.fn();
      const { rerender } = render(<Table data={rows} columns={[{ key: "name", label: "Name" }]} rowKey={row => row.id} selectableRows virtualized={virtualized} filterable filterValue="Row 00" selectedRowKeys={[0]} onSelectionChange={onSelectionChange} pagination itemsPerPage={5} />);
      const all = screen.getByRole("checkbox", { name: "Select all rows" });
      expect(all).toBePartiallyChecked();
      fireEvent.click(all);
      expect(onSelectionChange).toHaveBeenLastCalledWith([0, 1, 2, 3, 4], rows.slice(0, 5));
      rerender(<Table data={rows.slice(5, 10)} columns={[{ key: "name", label: "Name" }]} rowKey={row => row.id} selectableRows virtualized={virtualized} serverPagination pagination totalItems={200} itemsPerPage={5} selectedRowKeys={[5, 6, 7, 8, 9]} onSelectionChange={onSelectionChange} />);
      expect(all).toBeChecked();
      fireEvent.click(all);
      expect(onSelectionChange).toHaveBeenLastCalledWith([], []);
    });
    it("renders the matching record after filtering from a deep virtual scroll", async () => {
      render(<Table data={rows} columns={[{ key: "name", label: "Name" }]} rowKey={row => row.id} filterable virtualized virtualRowHeight={48} virtualViewportHeight={192} virtualOverscan={2} />);
      fireEvent.scroll(screen.getByTestId("data-table-virtual-viewport"), { target: { scrollTop: 4000 } });
      await screen.findByText("Row 081");
      fireEvent.change(screen.getByRole("searchbox", { name: "Filter table rows" }), { target: { value: "Row 000" } });
      expect(screen.getByText("Row 000")).toBeInTheDocument();
      expect(screen.getByTestId("data-table-virtual-viewport").scrollTop).toBe(0);
    });
  });
}
