import React, { useCallback, useMemo, useState } from "react";
import CoreRange from "../../src/core/DateRangePicker";
import NextRange from "../../src/next/DateRangePicker";
import CoreTime from "../../src/core/TimePicker";
import NextTime from "../../src/next/TimePicker";
import CoreDate from "../../src/core/DatePicker";
import NextDate from "../../src/next/DatePicker";
import CorePalette from "../../src/core/CommandPalette";
import NextPalette from "../../src/next/CommandPalette";

export function AdvancedControls() {
  const query = new URLSearchParams(location.search);
  const next = query.get("variant") === "next";
  const Range = next ? NextRange : CoreRange;
  const Time = next ? NextTime : CoreTime;
  const Date = next ? NextDate : CoreDate;
  const Palette = next ? NextPalette : CorePalette;
  const [open, setOpen] = useState(true);
  const [count, setCount] = useState(0);
  const [selected, setSelected] = useState("");
  const [renderCount, setRenderCount] = useState(0);
  const action = useCallback(() => setCount(count => count + 1), []);
  const commands = useMemo(() => Array.from({ length: 40 }, (_, index) => ({ id: String(index), label: `Command ${index}`, disabled: index === 38, action: () => { action(); setSelected(String(index)); } })), [action]);
  const asyncSearch = useCallback((text: string) => {
    if (text === "throw") throw new Error("Provider unavailable");
    return new Promise<{ id: string; label: string; action: () => void }[]>(resolve => {
    if (text === "pending") return;
    setTimeout(() => resolve(Array.from({ length: 40 }, (_, index) => ({ id: String(index), label: `${text} command ${index}`, action }))), 50);
    });
  }, [action]);
  return <main>
    <Range id="trip" label="Trip dates" startLabel="Departure" endLabel="Return" min="2026-11-01" max="2026-11-30" errorMessage={query.has("range-error") ? "Unavailable dates" : undefined} value={query.has("range-bounds") ? { start: "2026-10-20", end: "2026-12-20" } : { start: "2026-11-01", end: "2026-11-15" }} onChange={() => {}} />
    {query.has("external-aria") && <><p id="external-error" role="alert">Unavailable</p><Date aria-label="External date" aria-invalid="true" aria-errormessage="external-error" /><Time testId="external-time" aria-label="External time" aria-invalid="true" aria-errormessage="external-error" /></>}
    <form><Time label="Night" value={query.has("controlled") ? query.get("value") ?? "23:00" : undefined} defaultValue={query.get("value") ?? "23:00"} min={query.get("min") ?? "22:00"} max={query.get("max") ?? "02:00"} step={Number(query.get("step") ?? 60)} required={query.has("required")} /><button type="reset">Reset time</button></form>
    <button onClick={() => setOpen(true)}>Reopen</button>
    <output data-testid="actions">{count}</output>
    <output data-testid="selected-command">{selected}</output>
    <Palette open={open} onClose={() => setOpen(false)} aria-label="Commands" inputAriaLabel="Search"
      listboxId="probe" aria-activedescendant={query.has("override") ? "probe-option-39" : undefined}
      data-render-count={renderCount}
      onKeyDown={event => { if (event.key === "F2") setRenderCount(count => count + 1); }}
      asyncSearch={query.has("async") ? asyncSearch : undefined} debounceMs={100}
      commands={[...commands]} />
  </main>;
}
