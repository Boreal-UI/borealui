import { useState, type ComponentType } from "react";
import type { SelectProps } from "../src/components/Select/Select.types";

export function SelectNativeExamples({ Select }: { Select: ComponentType<SelectProps> }) {
  const [format, setFormat] = useState("print");
  const [submitted, setSubmitted] = useState<string[]>([]);
  return <div style={{ display: "grid", gap: "1rem" }}>
    <form>
      <Select label="Status filter" name="status" defaultValue="" options={[
        { value: "", label: "All statuses" }, { value: "published", label: "Published" },
      ]} />
    </form>
    <form>
      <Select label="Required format" name="requiredFormat" required placeholder="Choose format" options={[
        { value: "print", label: "Print" }, { value: "digital", label: "Digital" },
      ]} />
      <button type="submit">Validate</button>
    </form>
    <form action={async (data) => {
      const submittedFormat = await Promise.resolve(data.get("format"));
      if (typeof submittedFormat === "string") {
        setSubmitted((previous) => [...previous, submittedFormat]);
      }
      if (data.get("resetFormat") === "print") setFormat("print");
    }}>
      <Select label="Publication format" name="format" value={format} onChange={setFormat} options={[
        { value: "print", label: "Print" }, { value: "digital", label: "Digital" },
        { value: "unavailable", label: "Unavailable", disabled: true },
      ]} />
      <button type="submit">Publish</button>
      <button type="submit" name="resetFormat" value="print">Publish and reset format</button>
      <button type="reset">Reset controlled</button>
      <button type="button" onClick={() => setFormat("print")}>Use print</button>
      <output aria-label="Current format">{format}</output>
      <output aria-label="Submitted formats">{submitted.join(",")}</output>
    </form>
    <form>
      <Select label="Uncontrolled format" name="format" defaultValue="print" options={[
        { value: "print", label: "Print" }, { value: "digital", label: "Digital" },
      ]} />
      <button type="reset">Reset uncontrolled</button>
    </form>
  </div>;
}
