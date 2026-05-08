# Component API Patterns

Boreal UI components are typed React components with a consistent API shape across the core and Next builds.

## Accessibility Props

Components use semantic HTML first and expose ARIA props where they are useful.

```tsx
import { IconButton } from "boreal-ui/core";

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M9 3h6l1 2h4v2H4V5h4l1-2Zm-2 6h10l-.7 11H7.7L7 9Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function DeleteAction() {
  return (
    <IconButton
      icon={TrashIcon}
      aria-label="Delete project"
      theme="secondary"
      state="warning"
    />
  );
}
```

Form components should receive visible labels when possible.

```tsx
import { TextInput } from "boreal-ui/core";

<TextInput
  id="email"
  name="email"
  label="Email"
  helperText="Use your work email address."
  required
/>;
```

If a visible label is not appropriate, provide `aria-label` or `aria-labelledby`.

## Buttons and Links

`Button` can render as a native button, a link through `href`, or a custom element through `as`.

```tsx
import { Button } from "boreal-ui/core";

export function ButtonExamples() {
  return (
    <>
      <Button type="submit">Save</Button>
      <Button href="/settings" theme="secondary">
        Open settings
      </Button>
      <Button href="https://example.com" isExternal>
        External docs
      </Button>
    </>
  );
}
```

For icon-only actions, use `IconButton` or provide an accessible label.

## Forms

Text inputs, text areas, selects, checkboxes, radio controls, toggles, sliders, date/time pickers, file uploads, and tag inputs expose normal controlled and uncontrolled React patterns.

```tsx
import { useState } from "react";
import { Select, TextArea, TextInput } from "boreal-ui/core";

export function ContactFields() {
  const [priority, setPriority] = useState("low");

  return (
    <>
      <TextInput label="Name" name="name" autoComplete="name" />
      <Select
        label="Priority"
        name="priority"
        value={priority}
        onChange={setPriority}
        options={[
          { label: "Low", value: "low" },
          { label: "High", value: "high" },
        ]}
      />
      <TextArea label="Notes" name="notes" helperText="Add useful context." />
    </>
  );
}
```

Use `error`, `helperText`, `required`, and disabled props where supported so the component can connect labels and descriptions correctly.

## DataTable

`DataTable` is generic. Define a row type, create typed columns, and pass row data.

```tsx
import { DataTable } from "boreal-ui/core";
import type { Column } from "boreal-ui/core/DataTable";

type Invoice = {
  id: string;
  customer: string;
  total: number;
  status: "paid" | "open";
};

const columns: Column<Invoice>[] = [
  { key: "customer", label: "Customer", sortable: true, isRowHeader: true },
  {
    key: "total",
    label: "Total",
    sortable: true,
    render: (value) => `$${Number(value).toFixed(2)}`,
  },
  { key: "status", label: "Status" },
];

const rows: Invoice[] = [
  { id: "inv-1", customer: "Northwind", total: 420, status: "paid" },
];

export function InvoiceTable() {
  return (
    <DataTable
      caption="Invoices"
      columns={columns}
      data={rows}
      rowKey={(row) => row.id}
      defaultSortKey="customer"
      striped
      wrapCells
    />
  );
}
```

Use `serverSort` with `onSortChange` when sorting is handled by your API.

```tsx
<DataTable
  aria-label="Invoices"
  columns={columns}
  data={rows}
  serverSort
  onSortChange={(key, order) => {
    fetchInvoices({ sortBy: String(key), order });
  }}
/>;
```

## Overlays and Interactive Components

Components such as `Modal`, `Dropdown`, `PopOver`, `Tooltip`, `Tabs`, `Accordion`, `CommandPalette`, and `NotificationCenter` include keyboard and ARIA behavior. Prefer their public props instead of rebuilding focus or disclosure state around their internals.

```tsx
import { Modal, Button } from "boreal-ui/core";

export function ConfirmDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Delete project"
      aria-describedby="delete-project-description"
    >
      <div>
        <p id="delete-project-description">
          This action cannot be undone.
        </p>
        <Button state="warning">Delete</Button>
      </div>
    </Modal>
  );
}
```

## Test IDs

Components support stable test IDs. Prefer role and accessible-name queries first, then use `data-testid` where a stable selector is needed.

```tsx
import { render, screen } from "@testing-library/react";
import { Button } from "boreal-ui/core";

it("submits the form", () => {
  render(<Button data-testid="save-action">Save</Button>);

  expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
  expect(screen.getByTestId("save-action")).toBeInTheDocument();
});
```

## Consumer Styling Hooks

Use root and section class props for local styling.

```tsx
<DataTable
  columns={columns}
  data={rows}
  className="invoice-table-shell"
  tableClassName="invoice-table"
  rowClassName={(row) => (row.status === "open" ? "invoice-row-open" : undefined)}
/>;
```

Do not rely on generated SCSS Module class names from the Next build. Use the component's public class props and test IDs instead.
