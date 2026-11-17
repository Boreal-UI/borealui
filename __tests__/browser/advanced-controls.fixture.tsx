import React, { useCallback, useMemo, useState } from "react";
import CoreRange from "../../src/core/DateRangePicker";
import NextRange from "../../src/next/DateRangePicker";
import CoreTime from "../../src/core/TimePicker";
import NextTime from "../../src/next/TimePicker";
import CorePalette from "../../src/core/CommandPalette";
import NextPalette from "../../src/next/CommandPalette";

export function AdvancedControls() {
  const query = new URLSearchParams(location.search);
  const next = query.get("variant") === "next";
  const Range = next ? NextRange : CoreRange;
  const Time = next ? NextTime : CoreTime;
  const Palette = next ? NextPalette : CorePalette;
  const [open, setOpen] = useState(true);
  const [count, setCount] = useState(0);
  const [renderCount, setRenderCount] = useState(0);
  const action = useCallback(() => setCount(count => count + 1), []);
  const commands = useMemo(() => Array.from({ length: 40 }, (_, index) => ({ id: String(index), label: `Command ${index}`, disabled: index === 38, action })), [action]);
  const asyncSearch = useCallback((text: string) => new Promise<{ id: string; label: string; action: () => void }[]>(resolve => {
    if (text === "pending") return;
    setTimeout(() => resolve(Array.from({ length: 40 }, (_, index) => ({ id: String(index), label: `${text} command ${index}`, action }))), 50);
  }), [action]);
  return <main>
    <Range label="Trip dates" startLabel="Departure" endLabel="Return" value={{ start: "2026-11-01", end: "2026-11-15" }} onChange={() => {}} />
    <form><Time label="Night" value={query.has("controlled") ? query.get("value") ?? "23:00" : undefined} defaultValue={query.get("value") ?? "23:00"} min={query.get("min") ?? "22:00"} max={query.get("max") ?? "02:00"} step={Number(query.get("step") ?? 60)} required={query.has("required")} /><button type="reset">Reset time</button></form>
    <button onClick={() => setOpen(true)}>Reopen</button>
    <output data-testid="actions">{count}</output>
    <Palette open={open} onClose={() => setOpen(false)} aria-label="Commands" inputAriaLabel="Search"
      data-render-count={renderCount}
      onKeyDown={event => { if (event.key === "F2") setRenderCount(count => count + 1); }}
      asyncSearch={query.has("async") ? asyncSearch : undefined} debounceMs={100}
      commands={[...commands]} />
  </main>;
}
