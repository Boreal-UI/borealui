import { useState } from "react";
import { useFormStatus } from "react-dom";
import type TextInputComponent from "../src/components/TextInput/core/TextInput";
import type TextAreaComponent from "../src/components/TextArea/core/TextArea";
import type SelectComponent from "../src/components/Select/core/Select";
import type ButtonComponent from "../src/components/Button/core/Button";
import type DataTableComponent from "../src/components/DataTable/core/DataTable";
import { ArrowRightIcon } from "../src/Icons";
import type { SizeType } from "../src/types/types";

export type CompositionComponents = {
  TextInput: typeof TextInputComponent;
  TextArea: typeof TextAreaComponent;
  Select: typeof SelectComponent;
  Button: typeof ButtonComponent;
  DataTable: typeof DataTableComponent;
};
const formats = [{ value: "print", label: "Print" }, { value: "digital", label: "Digital" }];
const longFilename = "quarterly_report_with_a_very_long_unbroken_document_filename_2026_final_revision.pdf";

function SubmitButton({ Button }: Pick<CompositionComponents, "Button">) {
  const { pending } = useFormStatus();
  return <Button fullWidth wrapLabel type="submit" loading={pending}
    loadingLabel="Saving automation settings and retaining your email address">Save automation settings and return to the project</Button>;
}

export function FieldCompositionExamples({ TextInput, TextArea, Select, Button, DataTable }: CompositionComponents) {
  const [email, setEmail] = useState("reader@example.com");
  const [serverError, setServerError] = useState("");
  const [touched, setTouched] = useState(false);
  const [contact, setContact] = useState("");
  const [rowAction, setRowAction] = useState("");
  const [actionCount, setActionCount] = useState(0);
  const contactError = touched && !contact.includes("@") ? "Enter an email address with an @ sign." : undefined;
  return <main style={{ display: "grid", gap: "2rem", minWidth: 0, maxWidth: "100%" }}>
    <section aria-label="Aligned controls" style={{ display: "grid", gap: "1rem", minWidth: 0 }}>
      <h2>Aligned single-line controls</h2>
      {(["xs", "small", "medium", "large", "xl"] as SizeType[]).map((size) => (
        <div key={size} data-testid={`toolbar-${size}`} style={{ display: "flex", alignItems: "end", gap: "0.5rem", flexWrap: "wrap", minWidth: 0 }}>
          <TextInput rootClassName="toolbar-item" className="toolbar-surface" size={size} aria-label={`${size} search`} defaultValue="Search" />
          <TextInput rootClassName="toolbar-item" className="toolbar-surface" size={size} type="date" aria-label={`${size} date`} />
          <Select rootClassName="toolbar-item" className="toolbar-surface" size={size} aria-label={`${size} status`} defaultValue="print" options={formats} />
          <Button className="toolbar-surface toolbar-item" size={size}>Search</Button>
        </div>
      ))}
    </section>

    <section aria-label="Validation examples" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 18rem), 1fr))", alignItems: "start", gap: "1rem", minWidth: 0 }}>
      <form aria-label="Server validation" action={async () => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        setServerError("This address is already registered. Your entered address is retained; use another address or contact support.");
      }} style={{ display: "grid", gap: "0.75rem", minWidth: 0 }}>
        <TextInput rootClassName="composition-field" label="Email address" name="email" type="email" fullWidth
          value={email} onChange={setEmail} helperText="We will send publication notifications here."
          errorMessage={serverError || undefined} />
        <SubmitButton Button={Button} />
        <output aria-live="polite">{serverError ? "Could not save. Review the email address." : ""}</output>
        <output aria-label="Entered email">{email}</output>
      </form>
      <form aria-label="Blur validation" style={{ display: "grid", gap: "0.75rem", minWidth: 0 }}>
        <TextInput rootClassName="composition-field" label="Contact email" fullWidth value={contact}
          onChange={setContact} onBlur={() => setTouched(true)} errorMessage={contactError}
          helperText="This example validates on blur and then while correcting a touched field." />
        <Select rootClassName="composition-field" label="Publication format" fullWidth required placeholder="Choose a publication format" options={formats}
          helperText="Choose print or digital." errorMessage="Choose a publication format before continuing." />
        <span id="editorial-policy">Editorial policy applies to publication notes.</span>
        <TextArea rootClassName="composition-field" fullWidth rows={4} label="Publication notes with a long multiline label that wraps naturally in a narrow panel"
          name="notes" defaultValue="These notes are retained when server feedback changes."
          aria-describedby="editorial-policy" helperText="Explain any context the editors should consider when reviewing this publication."
          errorMessage="Add a specific editorial contact. This long feedback wraps beneath the control without overlapping the label." />
        <TextInput rootClassName="composition-field" fullWidth disabled label="Disabled reference" defaultValue={longFilename} />
      </form>
    </section>

    <section aria-label="Responsive actions" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 12rem), 1fr))", gap: "0.75rem", minWidth: 0 }}>
      <Button wrapLabel fullWidth onClick={() => setActionCount((count) => count + 1)}>Save automation settings and return to the project</Button>
      <Button wrapLabel fullWidth icon={ArrowRightIcon}>Save automation settings with a leading icon</Button>
      <Button wrapLabel fullWidth icon={ArrowRightIcon} iconPosition="right">{longFilename}</Button>
      <Button wrapLabel fullWidth disabled>Unavailable action with a long descriptive label</Button>
      <Button fullWidth>Single-line compatibility: this long action remains one line</Button>
      <output aria-label="Action count">{actionCount}</output>
    </section>

    <section aria-label="Documents panel" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: "0.75rem", minWidth: 0 }}>
      <DataTable caption="Documents" hideCaption={false} minWidth={0} tableLayout="fixed"
        rowKey={(row) => row.id} onRowClick={(row) => setRowAction(`Open ${row.id}`)} selectableRows
        data={[{ id: "document-1", filename: longFilename, action: "Edit" }]}
        columns={[
          { key: "filename", label: "Filename", wrap: true, sortable: true, isRowHeader: true,
            render: (value) => <a href="#document-details">{String(value)}</a> },
          { key: "action", label: "Actions", width: "38%", wrap: true,
            render: () => <Button fullWidth wrapLabel onClick={() => setRowAction("Edit document")}>Edit document and review publication settings</Button> },
        ]} />
      <output aria-label="Document action">{rowAction}</output>
      <div id="document-details">Document details destination</div>
    </section>

    <section aria-label="Financial panel" style={{ display: "flex", minWidth: 0, maxWidth: "100%" }}>
      <DataTable caption="Financial transactions" hideCaption={false} minWidth="60rem"
        columns={[
          { key: "description", label: "Transaction", minWidth: "28rem", wrap: true },
          { key: "amount", label: "Amount", width: "12rem" },
          { key: "reference", label: "Reference", minWidth: "20rem", wrap: true },
        ]}
        data={[{ description: "Quarterly publication production and distribution", amount: "$12,400.00", reference: "https://example.com/transactions/long-unbroken-reference-2026" }]} />
    </section>
  </main>;
}
