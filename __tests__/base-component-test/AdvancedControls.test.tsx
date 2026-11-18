import React from "react";
import { render, screen, fireEvent, act, cleanup } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { axe } from "jest-axe";
import CoreRange from "../../src/core/DateRangePicker";
import NextRange from "../../src/next/DateRangePicker";
import CoreTime from "../../src/core/TimePicker";
import NextTime from "../../src/next/TimePicker";
import CorePalette from "../../src/core/CommandPalette";
import NextPalette from "../../src/next/CommandPalette";
import type { CommandItem } from "../../src/components/CommandPalette/CommandPalette.types";

const deferred = () => {
  let resolve!: (items: CommandItem[]) => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<CommandItem[]>((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
};

for (const [name, Range, Time, Palette] of [["core", CoreRange, CoreTime, CorePalette], ["next", NextRange, NextTime, NextPalette]] as const) {
  describe(name, () => {
    afterEach(() => { cleanup(); jest.useRealTimers(); });
    it("names real composed inputs and actions, preserves group naming and descriptions", async () => {
      const { container, rerender } = render(<Range label="Trip dates" value={{ start: "", end: "" }} onChange={() => {}} helperText="Local dates" errorMessage="Choose dates" />);
      expect(screen.getByRole("group", { name: "Trip dates" })).toHaveAccessibleDescription("Local dates Choose dates");
      expect(screen.getByLabelText("Start date", { selector: "input" })).toHaveAccessibleName("Start date");
      expect(screen.getByLabelText("End date", { selector: "input" })).toHaveAccessibleDescription("Local dates Choose dates");
      expect(screen.getByRole("button", { name: "Open date picker for Start date" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Open date picker for End date" })).toBeInTheDocument();
      expect(container.querySelector("label label")).toBeNull();
      expect(await axe(container)).toHaveNoViolations();
      rerender(<><span id="external">Outbound</span><Range label="Trip" aria-label="Schedule" startLabel={<b>Departure</b>} endLabel="Return" startInputProps={{ "aria-labelledby": "external" }} endInputProps={{ "aria-label": "Inbound" }} endPickerButtonAriaLabel="Choose return" value={{ start: "", end: "" }} onChange={() => {}} /></>);
      expect(screen.getByRole("group", { name: "Schedule" })).toBeInTheDocument();
      expect(screen.getByLabelText("Outbound", { selector: "input" })).toBeInTheDocument();
      expect(screen.getByLabelText("Inbound", { selector: "input" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Open date picker for Departure" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Choose return" })).toBeInTheDocument();
    });
    it("retains endpoint label relationships in server-rendered HTML", () => {
      const html = renderToStaticMarkup(<Range id="trip" label="Trip" startLabel="Departure" endLabel="Return" value={{ start: "", end: "" }} onChange={() => {}} />);
      const document = new DOMParser().parseFromString(html, "text/html");
      for (const end of ["start", "end"]) {
        expect(document.querySelector(`#trip-${end}-input`)?.getAttribute("aria-labelledby")).toBe(`trip-${end}-label`);
      }
      expect(document.querySelector("legend")?.textContent).toBe("Trip");
    });
    it.each(["22:00", "23:00", "00:00", "01:59", "02:00"])("accepts overnight %s", value => {
      render(<Time label="Night" value={value} min="22:00" max="02:00" />);
      expect(screen.getByLabelText("Night")).not.toHaveAttribute("aria-invalid");
    });
    it.each(["02:01", "12:00", "21:59"])("rejects daytime %s", value => {
      render(<Time label="Night" defaultValue={value} min="22:00" max="02:00" />);
      expect(screen.getByLabelText("Night")).toHaveAttribute("aria-invalid", "true");
    });
    it("tracks uncontrolled values, required, precision, equal bounds and explicit errors", () => {
      const { unmount } = render(<Time label="Night" defaultValue="23:00" min="22:00" max="02:00" />);
      let input = screen.getByLabelText("Night");
      fireEvent.change(input, { target: { value: "12:00" } });
      expect(input).toHaveAttribute("aria-invalid", "true");
      fireEvent.change(input, { target: { value: "" } });
      expect(input).not.toHaveAttribute("aria-invalid");
      unmount();
      const { rerender } = render(<Time label="Night" required value="" />);
      input = screen.getByTestId("time-picker-input");
      expect(input).toHaveAttribute("aria-invalid", "true");
      rerender(<Time label="Night" value="22:00:00.500" min="22:00" max="02:00" step={0.5} />);
      expect(input).not.toHaveAttribute("aria-invalid");
      rerender(<Time label="Night" value="22:00:00.500" min="22:00" max="02:00" step={1} />);
      expect(input).toHaveAttribute("aria-invalid", "true");
      rerender(<Time label="Night" value="22:00:00.500" min="22:00" step="any" />);
      expect(input).not.toHaveAttribute("aria-invalid");
      rerender(<Time label="Night" value="12:00" min="12:00" max="12:00" />);
      expect(input).not.toHaveAttribute("aria-invalid");
      rerender(<Time label="Night" value="12:01" min="12:00" max="12:00" />);
      expect(input).toHaveAttribute("aria-invalid", "true");
      rerender(<Time label="Night" value="23:00" min="22:00" max="02:00" errorMessage="Unavailable" />);
      expect(input).toHaveAttribute("aria-invalid", "true");
      expect(screen.getByRole("alert")).toHaveTextContent("Unavailable");
    });
    it("preserves uncontrolled values when their reset default changes", () => {
      const { rerender } = render(<Time label="Night" defaultValue="23:00" min="22:00" max="02:00" />);
      const input = screen.getByLabelText("Night");
      rerender(<Time label="Night" defaultValue="12:00" min="22:00" max="02:00" />);
      expect(input).toHaveValue("23:00");
      expect(input).toHaveAttribute("value", "12:00");
      expect(input).not.toHaveAttribute("aria-invalid");
      fireEvent.change(input, { target: { value: "01:00" } });
      rerender(<Time label="Night" defaultValue="13:00" min="22:00" max="02:00" />);
      expect(input).toHaveValue("01:00");
      expect(input).not.toHaveAttribute("aria-invalid");
    });
    it("never activates invisible async results through debounce, requests, rejection or reopen", async () => {
      jest.useFakeTimers();
      const requests = new Map<string, ReturnType<typeof deferred>>();
      const asyncSearch = jest.fn((query: string) => { const request = deferred(); requests.set(query, request); return request.promise; });
      const action = jest.fn(); const onClose = jest.fn();
      const props = { commands: [], open: true, onClose, asyncSearch, debounceMs: 100, inputAriaLabel: "Search", "aria-label": "Commands" };
      const { rerender } = render(<Palette {...props} />);
      let input = screen.getByRole("combobox");
      const search = (query: string) => fireEvent.change(input, { target: { value: query } });
      const tick = async () => { await act(async () => { jest.advanceTimersByTime(100); }); };
      const noActivation = () => {
        fireEvent.keyDown(input, { key: "Enter" });
        expect(action).not.toHaveBeenCalled(); expect(onClose).not.toHaveBeenCalled();
        expect(input).not.toHaveAttribute("aria-activedescendant");
      };
      search("old"); await tick();
      await act(async () => requests.get("old")!.resolve([{ id: "old", label: "Old command", action }]));
      expect(document.getElementById(input.getAttribute("aria-activedescendant")!)).toHaveTextContent("Old command");
      search("new"); noActivation();
      expect(screen.queryByText("Old command")).not.toBeInTheDocument();
      await tick(); noActivation();
      search("latest"); await tick();
      await act(async () => requests.get("new")!.resolve([{ label: "Stale", action }]));
      noActivation();
      await act(async () => requests.get("latest")!.reject(new Error("offline")));
      noActivation();
      search("disabled"); await tick();
      await act(async () => requests.get("disabled")!.resolve([{ label: "Disabled", disabled: true, action }]));
      fireEvent.click(screen.getByText("Disabled")); noActivation();
      search(""); noActivation();
      search("closing"); await tick();
      rerender(<Palette {...props} open={false} />);
      await act(async () => requests.get("closing")!.resolve([{ label: "Late", action }]));
      rerender(<Palette {...props} />); input = screen.getByRole("combobox"); noActivation();
      expect(screen.queryByText("Late")).not.toBeInTheDocument();
      search("fresh"); await tick();
      await act(async () => requests.get("fresh")!.resolve([{ label: "Fresh", action }]));
      fireEvent.keyDown(input, { key: "Enter" });
      expect(action).toHaveBeenCalledTimes(1); expect(onClose).toHaveBeenCalledTimes(1);
    });
  });
}
