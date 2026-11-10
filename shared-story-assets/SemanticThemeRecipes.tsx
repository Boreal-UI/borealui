import { useContext, useState } from "react";
import { useFormStatus } from "react-dom";
import ThemeProvider, { ThemeContext } from "../src/context/ThemeContext";
import type CoreCard from "../src/components/Card/core/Card";
import type CoreModal from "../src/components/Modal/core/Modal";
import type CoreButton from "../src/components/Button/core/Button";
import type CoreInput from "../src/components/TextInput/core/TextInput";
import type CoreSelect from "../src/components/Select/core/Select";
import type CoreTable from "../src/components/DataTable/core/DataTable";
import type CorePortal from "../src/components/Portal/core/Portal";
import { themeConfig, workspaceTheme, eveningTheme } from "../examples/theme-app/theme";

export type ThemeRecipeKit = {
  Card: typeof CoreCard; Modal: typeof CoreModal; Button: typeof CoreButton;
  TextInput: typeof CoreInput; Select: typeof CoreSelect; DataTable: typeof CoreTable;
  Portal: typeof CorePortal;
};
const panelStyle = {
  padding: "1rem", minWidth: 0, background: "var(--background-color-surface)",
  color: "var(--text-color)", border: "1px solid var(--border-color)",
};

function PendingSubmit({ Button }: Pick<ThemeRecipeKit, "Button">) {
  const { pending } = useFormStatus();
  return <Button wrapLabel fullWidth loading={pending} loadingLabel="Saving publication preferences, please wait" type="submit">Save publication preferences</Button>;
}

function DialogRecipe({ Modal, Button, Portal }: ThemeRecipeKit) {
  const theme = useContext(ThemeContext)!;
  const [open, setOpen] = useState(false);
  const [nested, setNested] = useState(false);
  return <section style={panelStyle} aria-label="Nested application region">
    <h2>Local theme and mobile dialog</h2>
    <p style={{ color: "var(--text-color-light)" }} data-testid="nested-muted">Muted text inherits this region's semantic role.</p>
    <Button onClick={() => setOpen(true)}>Open publication dialog</Button>
    <Portal container="#recipe-portal-target"><span data-testid="explicit-scope">Explicit container inherits the originating theme.</span></Portal>
    <Modal title="Publication preferences" open={open} onClose={() => setOpen(false)}
      footer={<Button wrapLabel fullWidth onClick={() => setOpen(false)}>Save preferences and return to the document list</Button>}>
      <p data-testid="dialog-probe" style={{ color: "var(--text-color-light)" }}>Dialog uses the same semantic variables as its originating region.</p>
      <Button onClick={() => theme.setSelectedSchemeName(theme.selectedSchemeName === eveningTheme.name ? workspaceTheme.name : eveningTheme.name)}>Switch dialog theme</Button>
      <Button onClick={() => setNested(true)}>Open nested confirmation</Button>
      {Array.from({ length: 18 }, (_, index) => <p key={index}>Section {index + 1}. Long publication instructions remain inside the scrolling dialog body. Actions stay reachable without overriding internal selectors.</p>)}
      <Modal title="Confirm publication" open={nested} onClose={() => setNested(false)} footer={<Button onClick={() => setNested(false)}>Confirm</Button>}>
        <p data-testid="nested-dialog-probe">Nested overlay retains the same scope.</p>
      </Modal>
    </Modal>
  </section>;
}

export function SemanticThemeRecipes(kit: ThemeRecipeKit & {
  submitPreferences?: (data: FormData) => Promise<{ ok: boolean; message: string }>;
}) {
  const { Card, Button, TextInput, Select, DataTable, Portal } = kit;
  const [email, setEmail] = useState("reader@example.com");
  const [reference, setReference] = useState("Aurora");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [rowAction, setRowAction] = useState("");
  const rows = [{ id: "aurora", name: "quarterly_publication_report_with_a_very_long_unbroken_filename_2026.pdf", status: "published", action: "Edit" }];
  const filtered = rows.filter((row) => row.name.includes(query) && (!status || row.status === status));
  return <main style={{ display: "grid", gap: "1rem", minWidth: 0, padding: "1rem", color: "var(--text-color)", background: "var(--background-color)" }}>
    <h1>Semantic theme composition recipes</h1>
    <Card theme="clear" padding="none" align="start" title="Validated form" bodyClassName="recipe-card-body"
      footer={<p style={{ color: "var(--text-color-light)" }}>Application code owns validation and submission results.</p>}>
      <form style={{ display: "grid", gap: "0.75rem", minWidth: 0 }} action={async (data) => {
        const result = kit.submitPreferences ? await kit.submitPreferences(data) : await (async () => {
          await new Promise((resolve) => setTimeout(resolve, 300));
          const ok = data.get("outcome") === "success";
          return { ok, message: ok ? "Preferences saved." : "The server could not save these preferences. Your email is retained. Try again or contact the editorial team." };
        })();
        setSuccess(result.ok);
        setMessage(result.message);
      }}>
        <TextInput fullWidth label="Notification email" name="email" type="email" required value={email} onChange={setEmail}
          helperText="Publication updates are sent to this address." errorMessage={!success ? message || undefined : undefined} />
        <TextInput fullWidth label="Editorial reference" name="reference" value={reference} onChange={setReference} />
        <PendingSubmit Button={Button} />
        <Button wrapLabel type="submit" name="outcome" value="success">Save successfully in this demo</Button>
        <output aria-live="polite">{success ? message : message ? "Submission failed; review the email field." : ""}</output>
      </form>
    </Card>
    <section aria-label="Filter toolbar" style={panelStyle}>
      <form style={{ display: "flex", flexWrap: "wrap", alignItems: "end", gap: "0.5rem", minWidth: 0 }} onSubmit={(event) => event.preventDefault()}
        onReset={() => { setQuery(""); setStatus(""); }}>
        <TextInput aria-label="Filter filenames" value={query} onChange={setQuery} />
        <TextInput label="View name (uncontrolled)" name="viewName" defaultValue="All publications" />
        <Select aria-label="Filter publication status" name="status" value={status} onChange={setStatus}
          options={[{ value: "", label: "All statuses" }, { value: "published", label: "Published" }, { value: "draft", label: "Draft" }]} />
        <Button type="reset">Clear filters</Button>
      </form>
    </section>
    <DataTable caption="Publication documents" hideCaption={false} minWidth="48rem" selectableRows rowKey={(row) => row.id}
      onRowClick={(row) => setRowAction(`Open ${row.id}`)} data={filtered}
      columns={[
        { key: "name", label: "Filename", wrap: true, sortable: true, minWidth: "24rem", isRowHeader: true,
          render: (value) => <a href="#document-detail">{String(value)}</a> },
        { key: "status", label: "Status", width: "8rem" },
        { key: "action", label: "Action", width: "16rem", wrap: true,
          render: () => <Button fullWidth wrapLabel onClick={() => setRowAction("Edit publication")}>Edit publication and review delivery settings</Button> },
      ]} />
    <output id="document-detail" aria-label="Document action">{rowAction}</output>
    <Button disabled>Unavailable action</Button>
    <div id="recipe-portal-target" />
    <ThemeProvider {...themeConfig} initialSchemeName={eveningTheme.name}>
      <DialogRecipe {...kit} />
    </ThemeProvider>
    <ThemeProvider {...themeConfig} initialSchemeName={workspaceTheme.name}>
      <section style={panelStyle} aria-label="Independent light region"><p data-testid="independent-probe">This region remains independent when an open dialog changes its theme.</p>
        <Portal><span data-testid="independent-portal">Independent light overlay</span></Portal>
      </section>
    </ThemeProvider>
  </main>;
}
