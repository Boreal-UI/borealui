import React, { useEffect, useState } from "react";
import CoreTag from "../../src/core/TagInput";
import NextTag from "../../src/next/TagInput";
import CoreSlider from "../../src/core/Slider";
import NextSlider from "../../src/next/Slider";
import CoreSegments from "../../src/core/SegmentedControl";
import NextSegments from "../../src/next/SegmentedControl";
import CoreNumber from "../../src/core/NumberInput";
import NextNumber from "../../src/next/NumberInput";
import CoreSearch from "../../src/core/SearchInput";
import NextSearch from "../../src/next/SearchInput";
import CoreMulti from "../../src/core/MultiSelect";
import NextMulti from "../../src/next/MultiSelect";
import CoreUpload from "../../src/core/FileUpload";
import NextUpload from "../../src/next/FileUpload";
import CoreAccordion from "../../src/core/Accordion";
import NextAccordion from "../../src/next/Accordion";
import CoreToast from "../../src/core/ToastProvider";
import NextToast from "../../src/next/ToastProvider";
import { useToast } from "../../src/components/ToastProvider/ToastProviderBase";

type Config = {
  value?: string | number; defaultValue?: string | number; min?: number; max?: number;
  step?: number; disabled?: boolean; fieldset?: boolean; loading?: boolean;
  controlled?: boolean; required?: boolean; empty?: boolean; allDisabled?: boolean;
  disableA?: boolean; removeA?: boolean; reverse?: boolean; expanded?: boolean;
  preventReset?: boolean; external?: boolean; lazy?: boolean; legend?: boolean;
  debounce?: number; types?: string[]; maxSize?: number;
};
declare global {
  interface Window {
    controlConfig: (config: Config) => void;
    resolveTags: (query: string, result: string[] | null) => void;
    toastAction: (action: string) => void;
  }
}
const pending = new Map<string, { resolve: (value: string[]) => void; reject: () => void }>();
const fetchTags = (query: string) => new Promise<string[]>((resolve, reject) => {
  pending.set(query, { resolve, reject });
});
function ToastActions() {
  const toast = useToast();
  useEffect(() => {
    window.toastAction = action => {
      if (action === "clear") toast.clearToasts();
      else if (action === "remove") toast.removeToast("sample");
      else toast.addToast({ id: "sample", message: <button>Toast action</button>, duration: action === "persistent" ? 0 : 500 });
    };
  }, [toast]);
  return <button onClick={() => window.toastAction("add")}>Add toast</button>;
}
export function ControlContracts() {
  const query = new URLSearchParams(location.search);
  const next = query.get("variant") === "next";
  const kind = query.get("control") ?? "forms";
  const Tag = next ? NextTag : CoreTag, Slider = next ? NextSlider : CoreSlider;
  const Segments = next ? NextSegments : CoreSegments, NumberInput = next ? NextNumber : CoreNumber;
  const Search = next ? NextSearch : CoreSearch, Multi = next ? NextMulti : CoreMulti;
  const Upload = next ? NextUpload : CoreUpload, Accordion = next ? NextAccordion : CoreAccordion;
  const Toast = next ? NextToast : CoreToast;
  const [config, setConfig] = useState<Config>(() => JSON.parse(query.get("config") ?? "{}"));
  const [events, setEvents] = useState<unknown[]>([]);
  const [submits, setSubmits] = useState(0);
  const [mounted, setMounted] = useState(true);
  const record = (value: unknown) => setEvents(old => [...old, value]);
  useEffect(() => {
    window.controlConfig = change => setConfig(old => ({ ...old, ...change }));
    window.resolveTags = (key, result) => {
      const request = pending.get(key);
      if (!request) throw new Error("No request for " + key);
      if (result === null) request.reject(); else request.resolve(result);
      pending.delete(key);
    };
  }, []);
  let options = config.empty ? [] : [
    { value: "a", label: "Alpha", disabled: config.disableA || config.allDisabled },
    { value: "b", label: "Beta", disabled: config.allDisabled },
  ];
  if (config.removeA) options = options.filter(option => option.value !== "a");
  if (config.reverse) options.reverse();
  const upload = <Upload required inputProps={{ name: "file" }} disabled={config.disabled}
    allowedFileTypes={config.types ?? ["image/*"]} maxFileSizeBytes={config.maxSize}
    onFilesChange={files => record(files.map(file => file.name))} onSubmit={() => record("upload")} />;
  const controls = <>
    <NumberInput label="Number" name="number" defaultValue={Number.isFinite(Number(config.defaultValue ?? 2)) ? Number(config.defaultValue ?? 2) : ""}
      value={config.controlled ? Number(config.value ?? 8) : undefined}
      form={config.external ? "contract-form" : undefined}
      min={config.min} max={config.max} step={config.step} onChange={(v, e) => record([v, e.type])} />
    <Search label="Search" name="search" defaultValue={String(config.defaultValue ?? "original")}
      value={config.controlled ? String(config.value ?? "owned") : undefined}
      form={config.external ? "contract-form" : undefined} onChange={v => record(v)} />
    {!config.external &&
      <Segments label="Segments" name="segment" options={options} defaultValue={String(config.defaultValue ?? "a")}
        value={config.controlled ? String(config.value ?? "a") : undefined} onValueChange={record} />
    }
      <Multi label="Multiple" name="multi" options={options} defaultValue={[String(config.defaultValue ?? "a")]}
        form={config.external ? "contract-form" : undefined}
        value={config.controlled ? ["b"] : undefined} onChange={record} />
  </>;
  return <main style={{ padding: 32 }}>
    <button onClick={() => setMounted(value => !value)}>Toggle mount</button>
    <button>Before</button>
    {mounted && <>
      {kind === "tags" && <Tag debounceMs={config.debounce ?? 0} fetchSuggestions={fetchTags} onChange={record} />}
      {kind === "toast" && <Toast><ToastActions /></Toast>}
      {kind === "accordion" && <Accordion title="Section" lazyLoad={config.lazy} expanded={config.expanded}>
        <div><button>Inside section</button><a href="#end">Inside link</a></div>
      </Accordion>}
      {kind === "forms" && config.external && controls}
      <form id="contract-form" data-testid="contract-form"
        onReset={event => { if (config.preventReset) event.preventDefault(); }}
        onSubmit={event => { event.preventDefault(); setSubmits(value => value + 1); }}>
        {kind === "forms" && !config.external && controls}
        {kind === "slider" && <Slider name="amount" label="Amount" value={Number(config.value ?? 3)}
          onChange={() => {}}
          min={config.min ?? 0} max={config.max ?? 10} step={config.step ?? 2}
          onValueChange={value => { record(value); setConfig(old => ({ ...old, value })); }} />}
        {kind === "number" && <NumberInput label="Number" name="number"
          defaultValue={config.defaultValue === "" ? "" : Number(config.defaultValue ?? 3)}
          min={config.min} max={config.max} step={config.step}
          onChange={(value, event) => record([value, event.type, event.currentTarget.tagName])} />}
        {kind === "segments" && <fieldset disabled={config.fieldset}>
          <Segments label="Segments" name="segment" options={options}
            defaultValue={String(config.defaultValue ?? "")} value={config.controlled ? String(config.value ?? "") : undefined}
            disabled={config.disabled} loading={config.loading} required={config.required ?? true} onValueChange={record} />
        </fieldset>}
        {kind === "files" && <fieldset disabled={config.fieldset}>
          {config.legend ? <legend>{upload}</legend> : upload}
        </fieldset>}
        <button type="submit">Submit</button><button type="reset">Reset</button>
      </form>
    </>}
    <button id="end">After</button>
    <output data-testid="events">{JSON.stringify(events)}</output>
    <output data-testid="submits">{submits}</output>
  </main>;
}
