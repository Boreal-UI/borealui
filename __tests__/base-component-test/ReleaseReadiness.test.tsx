import React from "react";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import CoreDate from "../../src/core/DatePicker";
import NextDate from "../../src/next/DatePicker";
import CoreTime from "../../src/core/TimePicker";
import NextTime from "../../src/next/TimePicker";
import CoreRange from "../../src/core/DateRangePicker";
import NextRange from "../../src/next/DateRangePicker";
import CorePalette from "../../src/core/CommandPalette";
import NextPalette from "../../src/next/CommandPalette";

afterEach(() => { cleanup(); jest.useRealTimers(); });

for (const [variant, Date, Time, Range, Palette] of [
  ["core", CoreDate, CoreTime, CoreRange, CorePalette],
  ["next", NextDate, NextTime, NextRange, NextPalette],
] as const) {
  describe(variant, () => {
    for (const [name, Picker] of [["date", Date], ["time", Time]] as const) {
      it(`${name}: forwards public ARIA to the actual input and preserves overrides`, async () => {
        const { container, rerender } = render(<><span id="external-name">Reservation</span><span id="external-help">Ask reception</span><span id="external-error" role="alert">Unavailable</span>
          <span id="nested-help">Use local time</span><Picker aria-label="Arrival" aria-invalid="true" aria-required="true" aria-describedby="external-help" aria-errormessage="external-error" inputProps={{ "aria-describedby": "nested-help" }} />
        </>);
        let input = screen.getByTestId(`${name}-picker-input`);
        expect(input).toHaveAccessibleName("Arrival");
        expect(input).toHaveAccessibleDescription("Ask reception Use local time");
        expect(input).toHaveAttribute("aria-invalid", "true");
        expect(input).toHaveAttribute("aria-required", "true");
        expect(input).toHaveAttribute("aria-errormessage", "external-error");
        expect(await axe(container)).toHaveNoViolations();
        rerender(<><span id="external-name">Reservation</span><Picker aria-labelledby="external-name" state="error" /></>);
        input = screen.getByTestId(`${name}-picker-input`);
        expect(input).toHaveAccessibleName("Reservation");
        expect(input).toHaveAttribute("aria-invalid", "true");
        rerender(<Picker label="Arrival" errorMessage="Unavailable" aria-invalid={false} inputProps={{ "aria-label": "Custom arrival" }} />);
        input = screen.getByTestId(`${name}-picker-input`);
        expect(input).toHaveAccessibleName("Custom arrival");
        expect(input).toHaveAttribute("aria-invalid", "false");
      });
    }
    it("propagates range errors to both real inputs", () => {
      render(<Range id="trip" label="Trip" value={{ start: "", end: "" }} onChange={() => {}} errorMessage="Unavailable" />);
      for (const end of ["start", "end"]) {
        const input = screen.getByTestId(`date-range-picker-${end}-input`);
        expect(input).toHaveAttribute("aria-invalid", "true");
        expect(input).toHaveAttribute("aria-errormessage", "trip-errorMessage");
      }
    });
    it("intersects endpoint ordering with global bounds even for invalid controlled values", () => {
      render(<Range label="Trip" min="2026-11-01" max="2026-11-30" value={{ start: "2026-10-20", end: "2026-12-20" }} onChange={() => {}} />);
      expect(screen.getByTestId("date-range-picker-start-input")).toHaveAttribute("max", "2026-11-30");
      expect(screen.getByTestId("date-range-picker-end-input")).toHaveAttribute("min", "2026-11-01");
    });
    it("keeps active-descendant metadata aligned with the command Enter executes", () => {
      const first = jest.fn(); const second = jest.fn();
      render(<Palette open aria-label="Commands" inputAriaLabel="Search" listboxId="commands" aria-activedescendant="commands-option-second" onClose={() => {}}
        commands={[{ id: "first", label: "First", action: first }, { id: "second", label: "Second", action: second }]} />);
      const input = screen.getByRole("combobox");
      const selected = screen.getByRole("option", { selected: true });
      expect(input).toHaveAttribute("aria-activedescendant", selected.id);
      fireEvent.keyDown(input, { key: "Enter" });
      expect(first).toHaveBeenCalledTimes(1); expect(second).not.toHaveBeenCalled();
      fireEvent.keyDown(input, { key: "ArrowDown" });
      expect(input).toHaveAttribute("aria-activedescendant", "commands-option-second");
      fireEvent.keyDown(input, { key: "Enter" });
      expect(second).toHaveBeenCalledTimes(1);
    });
    it("recovers from synchronous search-provider failures just like rejected promises", async () => {
      jest.useFakeTimers();
      const provider = jest.fn(() => { throw new Error("Provider unavailable"); });
      const onClose = jest.fn();
      render(<Palette open commands={[]} onClose={onClose} asyncSearch={provider} debounceMs={10} aria-label="Commands" inputAriaLabel="Search" />);
      const input = screen.getByRole("combobox");
      fireEvent.change(input, { target: { value: "broken" } });
      await act(async () => { jest.advanceTimersByTime(10); });
      expect(screen.queryByText("Searching…")).not.toBeInTheDocument();
      expect(screen.getByRole("option", { name: "No matching results" })).toBeInTheDocument();
      expect(input).not.toHaveAttribute("aria-activedescendant");
      fireEvent.keyDown(input, { key: "Enter" }); expect(onClose).not.toHaveBeenCalled();
    });
  });
}
