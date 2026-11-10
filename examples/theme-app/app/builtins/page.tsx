import { defaultColorSchemes } from "../../../../src/styles/Themes";
import { getThemeAttributes } from "../../../../src/context/themeRuntime";
import Select from "../../../../src/components/Select/next/Select";
import FieldSamples from "./field-samples";

export default function Builtins() {
  return <main><h1>Built-in semantic contrast samples</h1>{defaultColorSchemes.map((scheme) => (
    <section key={scheme.name} {...getThemeAttributes(scheme)} data-scheme={scheme.name}>
      <h2 style={{ color: "var(--text-color)", background: "var(--background-color)" }}>{scheme.name}</h2>
      {["--background-color", "--background-color-surface", "--background-color-subtle", "--hover-background", "--active-background", "--selected-background"].map((surface) => (
        <div key={surface} data-role={surface} style={{ background: `var(${surface})`, color: "var(--text-color)", padding: "0.5rem", border: "1px solid var(--border-color)" }}>
          Primary text <span data-muted style={{ color: "var(--text-color-light)" }}>Muted text remains readable.</span>
          <button style={{ background: `var(${surface})`, color: "var(--text-color)", outline: "2px solid var(--focus-outline-color)" }}>Focus sample</button>
        </div>
      ))}
      <button disabled data-disabled style={{ background: "var(--disabled-background)", color: "var(--disabled-text-color)" }}>Disabled sample</button>
      <Select label="Invalid format" className="invalid-surface" defaultValue="print" state="error"
        options={[{ value: "print", label: "Print" }]} errorMessage="Review the publication format." />
      <Select label="Disabled format" className="disabled-surface" disabled defaultValue="print" options={[{ value: "print", label: "Print" }]} />
      <FieldSamples />
    </section>
  ))}</main>;
}
