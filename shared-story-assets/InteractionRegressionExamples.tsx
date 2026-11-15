import { useState } from "react";
import type CoreMultiSelect from "../src/core/MultiSelect";
import type CoreRating from "../src/core/Rating";
import type CoreComboBox from "../src/core/ComboBox";

const options = [{value:"a",label:"Alpha"},{value:"off",label:"Unavailable",disabled:true},{value:"b",label:"Beta"}];
function FormExample({MultiSelect,controlled}: {MultiSelect:typeof CoreMultiSelect; controlled:boolean}) {
    const [disabled,setDisabled]=useState(true);
    const [fieldsetDisabled,setFieldsetDisabled]=useState(false);
    const [formLoading,setFormLoading]=useState(false);
    const [values,setValues]=useState(["a","b"]);
    const [submitted,setSubmitted]=useState<string[]>([]);
    const [submissions,setSubmissions]=useState(0);
    return <section aria-label={controlled ? "Controlled form" : "Uncontrolled form"}>
      <label><input type="checkbox" checked={disabled} onChange={e=>setDisabled(e.target.checked)} />Disabled selection</label>
      <label><input type="checkbox" checked={fieldsetDisabled} onChange={e=>setFieldsetDisabled(e.target.checked)} />Disabled fieldset</label>
      <label><input type="checkbox" checked={formLoading} onChange={e=>setFormLoading(e.target.checked)} />Loading selection</label>
      <form onSubmit={e=>{e.preventDefault();setSubmitted(new FormData(e.currentTarget).getAll("selection").map(String));setSubmissions(n=>n+1);}}>
        <fieldset disabled={fieldsetDisabled}>
          <legend>Selections</legend>
          <MultiSelect label="Form options" name="selection" required options={options} disabled={disabled} loading={formLoading}
            {...(controlled ? {value:values,onChange:setValues} : {defaultValue:["a","b"]})} />
        </fieldset>
        <button type="submit">Submit selection</button>
      </form>
      <output aria-label="Submitted values">{JSON.stringify(submitted)}</output>
      <output aria-label="Submission count">{submissions}</output>
    </section>;
}

export function InteractionRegressionExamples({MultiSelect,Rating,ComboBox}: {
  MultiSelect: typeof CoreMultiSelect; Rating: typeof CoreRating; ComboBox: typeof CoreComboBox;
}) {
  const [searchValues,setSearchValues]=useState<string[]>([]);
  const [rating,setRating]=useState(2);
  const [loading,setLoading]=useState(true);
  const [comboDisabled,setComboDisabled]=useState(false);
  const [empty,setEmpty]=useState(false);
  const [text,setText]=useState("");
  const [selection,setSelection]=useState("");
  return <main>
    <h1>Interaction regression examples</h1>
    <MultiSelect label="Keyboard options" searchable={false} options={options} />
    <MultiSelect label="Searchable options" options={options.map(option=>({...option}))} value={searchValues} onChange={setSearchValues} />
    <MultiSelect label="Limited options" searchable={false} maxSelected={1} options={options} />
    <MultiSelect label="No options" searchable={false} options={[]} />
    <FormExample MultiSelect={MultiSelect} controlled={false} /><FormExample MultiSelect={MultiSelect} controlled />
    <Rating label="Rating probe" value={rating} onChange={setRating} />
    <button onClick={()=>setRating(4)}>Set external rating</button>
    <Rating label="Read-only rating" value={3} readOnly />
    <Rating label="Disabled rating" value={3} state="disabled" />
    <Rating label="Display rating" value={3} interactive={false} />
    <label><input type="checkbox" checked={loading} onChange={e=>setLoading(e.target.checked)} />Load ComboBox</label>
    <label><input type="checkbox" checked={comboDisabled} onChange={e=>setComboDisabled(e.target.checked)} />Disable ComboBox</label>
    <label><input type="checkbox" checked={empty} onChange={e=>setEmpty(e.target.checked)} />Empty ComboBox options</label>
    <ComboBox label="Loading probe" options={empty?[]:options} loading={loading} disabled={comboDisabled}
      inputValue={text} onInputChange={setText} value={selection} onChange={setSelection} />
    <output aria-label="ComboBox selection">{selection || "none"}</output>
  </main>;
}
