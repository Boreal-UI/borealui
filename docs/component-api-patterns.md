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

<>
  <TextInput
    id="email"
    name="email"
    label="Email"
    aria-describedby="email-help"
    required
  />
  <p id="email-help">Use your work email address.</p>
</>;
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

Text inputs, search inputs, number inputs, text areas, selects, multi-selects, segmented controls, checkboxes, radio controls, toggles, sliders, date/time pickers, file uploads, and tag inputs expose normal controlled and uncontrolled React patterns.

```tsx
import { useState } from "react";
import {
  NumberInput,
  SearchInput,
  Select,
  TextArea,
  TextInput,
} from "boreal-ui/core";

export function ContactFields() {
  const [priority, setPriority] = useState("low");

  return (
    <>
      <TextInput label="Name" name="name" autoComplete="name" />
      <SearchInput label="Search contacts" name="search" />
      <NumberInput label="Budget" name="budget" min={0} step={100} />
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

Use `helperText`, `errorMessage`, `required`, and disabled props where supported. When a component does not render helper or error text itself, connect external text with `aria-describedby`.

Use `InputGroup` to compose prefixes, suffixes, addons, and custom controls around form content. Use `FieldSet` for grouped controls with a semantic legend, and `ValidationSummary` to list form-level errors with accessible navigation targets.

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

`DataTable` also supports pagination with `Pager`, column visibility, column resize/reorder/pinning, row expansion panels, bulk actions, inline editing, server pagination contracts, and virtualization for larger datasets. Use the controlled callbacks when table state is owned by your app or server API.

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
/>
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
        <p id="delete-project-description">This action cannot be undone.</p>
        <Button state="warning">Delete</Button>
      </div>
    </Modal>
  );
}
```

## Layout and Shells

Use `AppShell`, `PageHeader`, `BreadCrumbPageHeader`, `Sidebar`, `SplitPane`, and the layout primitives to compose application pages without rebuilding common structure.

```tsx
import { AppShell, PageHeader, SplitPane, TreeView } from "boreal-ui/core";

export function ProjectWorkspace() {
  return (
    <AppShell
      header={<PageHeader title="Projects" subtitle="Delivery workspace" />}
      sidebar={
        <TreeView
          label="Project navigation"
          items={[
            { id: "active", label: "Active projects" },
            { id: "archive", label: "Archive" },
          ]}
        />
      }
    >
      <SplitPane startPane="List" endPane="Details" />
    </AppShell>
  );
}
```

`Portal` is a structural utility for rendering content into another DOM container. It keeps a deliberately small API: target container, inline fallback behavior, custom class name, screen-reader-only context, and test IDs.

## Charts and Metrics

Use chart components for compact dashboard visuals and status summaries.

```tsx
import {
  BarChart,
  DonutChart,
  Legend,
  Sparkline,
} from "boreal-ui/core";

export function RevenueSnapshot() {
  return (
    <>
      <Sparkline data={[12, 18, 16, 24, 28]} label="Revenue trend" />
      <BarChart
        label="Quarterly revenue"
        data={[
          { label: "Q1", value: 12 },
          { label: "Q2", value: 18 },
        ]}
      />
      <DonutChart
        label="Pipeline mix"
        data={[
          { label: "New", value: 45 },
          { label: "Expansion", value: 30 },
        ]}
      />
      <Legend items={[{ label: "New", color: "var(--primary-color)" }]} />
    </>
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
  rowClassName={(row) =>
    row.status === "open" ? "invoice-row-open" : undefined
  }
/>
```

Do not rely on generated SCSS Module class names from the Next build. Use the component's public class props and test IDs instead.
