import type { Meta, StoryObj } from "@storybook/react-vite";
import { DataTable } from "../src/index.core";
import type { DataTableProps } from "../src/components/DataTable/DataTable.types";
import { StoryGrid } from "../.storybook-core/helpers/StoryGrid";
import {
  roundingOptions,
  shadowOptions,
  stateOptions,
  themeOptions,
} from "../shared-story-assets/OptionTypes";
import {
  renderThemeVariants,
  renderStateVariants,
  renderOutlineVariants,
  renderGlassVariants,
  renderGlassOutlineVariants,
  renderStateOutlineVariants,
} from "../shared-story-assets/VisualVariantStories";

type SampleRow = {
  id: number;
  name: string;
  score: number;
  passed: boolean;
};

type AdminRow = {
  id: string;
  project: string;
  owner: string;
  status: string;
  spend: number;
};

const sampleData: SampleRow[] = [
  { id: 1, name: "Alice", score: 91, passed: true },
  { id: 2, name: "Bob", score: 75, passed: true },
  { id: 3, name: "Charlie", score: 58, passed: false },
  { id: 4, name: "Dana", score: 84, passed: true },
];

const sampleColumns: DataTableProps<SampleRow>["columns"] = [
  {
    key: "id",
    label: "ID",
    sortable: true,
  },
  {
    key: "name",
    label: "Name",
    sortable: true,
  },
  {
    key: "score",
    label: "Score",
    sortable: true,
  },
  {
    key: "passed",
    label: "Status",
    sortable: false,
    render: (value: any) => (value ? "Pass" : "Fail"),
  },
];

const adminData: AdminRow[] = [
  {
    id: "aurora",
    project: "Aurora Console",
    owner: "Ada",
    status: "Ready",
    spend: 12400,
  },
  {
    id: "boreal",
    project: "Boreal Analytics",
    owner: "Grace",
    status: "Stable",
    spend: 9800,
  },
  {
    id: "cascade",
    project: "Cascade Ops",
    owner: "Lin",
    status: "Draft",
    spend: 6200,
  },
  {
    id: "drift",
    project: "Drift Billing",
    owner: "Mina",
    status: "Review",
    spend: 14300,
  },
];

const adminColumns: DataTableProps<AdminRow>["columns"] = [
  {
    key: "project",
    label: "Project",
    sortable: true,
    editable: true,
    width: "180px",
    isRowHeader: true,
  },
  { key: "owner", label: "Owner", sortable: true, width: "120px" },
  { key: "status", label: "Status", sortable: true, width: "120px" },
  {
    key: "spend",
    label: "Spend",
    sortable: true,
    width: "120px",
    render: (value) => `$${Number(value).toLocaleString()}`,
  },
];

type DocumentationRow = {
  name: string;
  type: string;
  defaultValue: string;
  description: string;
  required: boolean;
};

const documentationData: DocumentationRow[] = [
  {
    name: "columns",
    type: "Column<T>[]",
    defaultValue: "[]",
    required: true,
    description:
      "Defines the table structure. Each column can include a key, label, optional render function, sorting support, sizing controls, wrapping behavior, and custom class names for the header, body cells, row header cells, or sort button.",
  },
  {
    name: "data",
    type: "T[]",
    defaultValue: "[]",
    required: true,
    description:
      "The rows rendered by the table. Each item should match the shape expected by the column definitions. The table can optionally use a custom rowKey function when the default index-based key is not preferred.",
  },
  {
    name: "wrapCells",
    type: "boolean",
    defaultValue: "false",
    required: false,
    description:
      "Allows cells to wrap onto multiple lines instead of forcing all content into a single horizontal line. This is useful for documentation tables, descriptions, notes, changelogs, and content-heavy interfaces.",
  },
  {
    name: "rowClassName",
    type: "string | ((row, index) => string | undefined)",
    defaultValue: "undefined",
    required: false,
    description:
      "Adds a custom class name to each table row. Consumers can pass a static class name or a callback to style rows based on row data, status, index, or other conditions.",
  },
];

const documentationColumns: DataTableProps<DocumentationRow>["columns"] = [
  {
    key: "name",
    label: "Prop",
    sortable: true,
    isRowHeader: true,
    width: "11rem",
  },
  {
    key: "type",
    label: "Type",
    sortable: true,
    width: "18rem",
    wrap: true,
  },
  {
    key: "defaultValue",
    label: "Default",
    width: "10rem",
    wrap: true,
  },
  {
    key: "description",
    label: "Description",
    wrap: true,
    minWidth: "18rem",
  },
  {
    key: "required",
    label: "Required",
    width: "8rem",
    render: (value) => (value ? "Yes" : "No"),
  },
];

const styledColumns: DataTableProps<DocumentationRow>["columns"] = [
  {
    key: "name",
    label: "Prop",
    sortable: true,
    isRowHeader: true,
    width: "11rem",
    headerClassName: "storyColumnHeader",
    cellClassName: "storyNameCell",
    rowHeaderClassName: "storyRowHeaderCell",
    sortButtonClassName: "storySortButton",
  },
  {
    key: "type",
    label: "Type",
    sortable: true,
    width: "18rem",
    wrap: true,
    headerClassName: "storyColumnHeader",
    cellClassName: "storyCodeCell",
  },
  {
    key: "defaultValue",
    label: "Default",
    width: "10rem",
    wrap: true,
    cellClassName: "storyCodeCell",
  },
  {
    key: "description",
    label: "Description",
    wrap: true,
    minWidth: "18rem",
    cellClassName: "storyDescriptionCell",
  },
  {
    key: "required",
    label: "Required",
    width: "8rem",
    render: (value) => (value ? "Yes" : "No"),
    cellClassName: "storyRequiredCell",
  },
];

const meta: Meta<DataTableProps<SampleRow>> = {
  title: "Components/DataTable",
  component: DataTable,
  tags: ["autodocs"],
  args: {
    data: sampleData,
    columns: sampleColumns,
    theme: "primary",
    striped: true,
  },
};

export default meta;

type Story = StoryObj<DataTableProps<SampleRow>>;

export const Default: Story = {};

export const ThemeVariantsWithToolbarSelectionAndFilter = () => {
  return (
    <StoryGrid title="Theme Variants">
      {themeOptions.map((theme) => (
        <div key={theme}>
          <DataTable
            toolbarTitle={theme}
            filterable={true}
            selectableRows={true}
            rowKey={(row) => String(row.name)}
            toolbarActions={<button type="button">Export</button>}
            data={sampleData}
            columns={sampleColumns}
            theme={theme}
            striped={true}
          />
        </div>
      ))}

      {stateOptions.map((state) => (
        <div key={state}>
          <DataTable
            toolbarTitle={state}
            filterable={true}
            selectableRows={true}
            rowKey={(row) => String(row.name)}
            toolbarActions={<button type="button">Export</button>}
            data={sampleData}
            columns={sampleColumns}
            state={state}
            striped={true}
          />
        </div>
      ))}
    </StoryGrid>
  );
};

export const GlassThemeVariantsWithToolbarSelectionAndFilter = () => {
  return (
    <StoryGrid title="Theme Variants">
      {themeOptions.map((theme) => (
        <div key={theme}>
          <DataTable
            toolbarTitle={theme}
            filterable={true}
            glass
            selectableRows={true}
            rowKey={(row) => String(row.name)}
            toolbarActions={<button type="button">Export</button>}
            data={sampleData}
            columns={sampleColumns}
            theme={theme}
            striped={true}
          />
        </div>
      ))}

      {stateOptions.map((state) => (
        <div key={state}>
          <DataTable
            toolbarTitle={state}
            filterable={true}
            glass
            selectableRows={true}
            rowKey={(row) => String(row.name)}
            toolbarActions={<button type="button">Export</button>}
            data={sampleData}
            columns={sampleColumns}
            state={state}
            striped={true}
          />
        </div>
      ))}
    </StoryGrid>
  );
};

export const WithRowClick: Story = {
  args: {
    onRowClick: (row) => alert(`You clicked: ${row.name}`),
  },
};

export const SortedByScore: Story = {
  args: {
    defaultSortKey: "score",
    defaultSortOrder: "desc",
  },
};

export const CustomRowKey: Story = {
  args: {
    rowKey: (row) => `row-${row.id}`,
  },
};

export const NoStripedTheme: Story = {
  args: {
    striped: false,
    theme: "primary",
  },
};

export const RoundingVariants = () => (
  <StoryGrid title="Rounding Variants">
    {roundingOptions.map((rounding) => (
      <DataTable
        key={rounding}
        rounding={rounding}
        data={sampleData}
        columns={sampleColumns}
      />
    ))}
  </StoryGrid>
);

export const ShadowVariants = () => (
  <StoryGrid title="Shadow Variants">
    {shadowOptions.map((shadow) => (
      <DataTable
        key={shadow}
        shadow={shadow}
        data={sampleData}
        columns={sampleColumns}
      />
    ))}
  </StoryGrid>
);

export const WithWrappedCells: StoryObj<DataTableProps<DocumentationRow>> = {
  render: () => (
    <DataTable
      data={documentationData}
      columns={documentationColumns}
      wrapCells
      caption="DataTable props with wrapped cells"
      theme="primary"
      striped
    />
  ),
};

export const WithColumnAndRowClassNames: StoryObj<
  DataTableProps<DocumentationRow>
> = {
  render: () => (
    <>
      <style>
        {`
          .storyTable {
            table-layout: fixed;
          }

          .storyTableHead {
            letter-spacing: 0.02em;
            text-transform: uppercase;
          }

          .storyTableBody {
            font-size: 0.95rem;
          }

          .storyColumnHeader {
            white-space: normal;
          }

          .storySortButton {
            justify-content: flex-start;
            width: 100%;
          }

          .storyNameCell,
          .storyRowHeaderCell {
            font-weight: 800;
            color: var(--primary-color);
          }

          .storyCodeCell {
            font-family: var(--font-family-code, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace);
            font-size: 0.875rem;
            white-space: normal;
            overflow-wrap: anywhere;
          }

          .storyDescriptionCell {
            line-height: 1.6;
            white-space: normal;
            overflow-wrap: anywhere;
          }

          .storyRequiredCell {
            font-weight: 700;
          }

          .storyRequiredRow {
            background: color-mix(in srgb, var(--primary-color) 10%, transparent);
          }

          .storyOptionalRow {
            opacity: 0.88;
          }

          .storyLongTextCell {
            max-width: 36rem;
          }
        `}
      </style>

      <DataTable
        data={documentationData}
        columns={styledColumns}
        wrapCells
        caption="DataTable with custom table, row, column, and cell classes"
        theme="secondary"
        tableClassName="storyTable"
        theadClassName="storyTableHead"
        tbodyClassName="storyTableBody"
        rowClassName={(row) =>
          row.required ? "storyRequiredRow" : "storyOptionalRow"
        }
        cellClassName={(_, __, column) =>
          column.key === "description" ? "storyLongTextCell" : undefined
        }
        striped
      />
    </>
  ),
};

export const WithClassName: Story = {
  args: {
    className: "storybook-datatable-custom",
  },
};

export const WithDataTestid: Story = {
  args: {
    "data-testid": "datatable-storybook",
  },
};

export const AdminWorkflow: StoryObj<DataTableProps<AdminRow>> = {
  render: () => (
    <DataTable
      data={adminData}
      columns={adminColumns}
      rowKey={(row) => row.id}
      toolbarTitle="Projects"
      filterable
      selectableRows
      pagination
      itemsPerPage={2}
      columnVisibility
      columnReorder
      columnResize
      columnPinning
      bulkActions={(keys) => (
        <button type="button">Archive {keys.length}</button>
      )}
      renderExpandedRow={(row) => (
        <div>
          Owner: {row.owner}. Status: {row.status}. Current monthly spend is $
          {row.spend.toLocaleString()}.
        </div>
      )}
      onCellEdit={(value, meta) =>
        console.log("Edited", meta.rowKey, String(meta.column.key), value)
      }
      caption="Admin workflow table"
      theme="primary"
      striped
    />
  ),
};

export const ServerPaginationWorkflow: StoryObj<DataTableProps<AdminRow>> = {
  render: () => (
    <DataTable
      data={adminData.slice(0, 2)}
      columns={adminColumns}
      rowKey={(row) => row.id}
      toolbarTitle="Server controlled projects"
      pagination
      serverPagination
      currentPage={2}
      itemsPerPage={2}
      totalItems={24}
      serverSort
      onPageChange={(page, meta) => console.log("Load page", page, meta)}
      onSortChange={(key, order) => console.log("Load sort", key, order)}
      caption="Server paginated admin table"
      theme="secondary"
    />
  ),
};

export const VirtualizedLargeDataset: StoryObj<DataTableProps<AdminRow>> = {
  render: () => (
    <DataTable
      data={Array.from({ length: 250 }, (_, index) => ({
        id: `row-${index}`,
        project: `Project ${index + 1}`,
        owner: ["Ada", "Grace", "Lin", "Mina"][index % 4],
        status: ["Ready", "Stable", "Draft", "Review"][index % 4],
        spend: 4000 + index * 75,
      }))}
      columns={adminColumns}
      rowKey={(row) => row.id}
      toolbarTitle="Virtualized projects"
      virtualized
      virtualRowHeight={48}
      virtualViewportHeight={320}
      caption="Virtualized project table"
      theme="tertiary"
      striped
    />
  ),
};

export const ThemeVariants: Story = {
  render: (args) => renderThemeVariants({ component: DataTable, args }),
};

export const StateVariants: Story = {
  render: (args) => renderStateVariants({ component: DataTable, args }),
};

export const OutlineVariants: Story = {
  render: (args) => renderOutlineVariants({ component: DataTable, args }),
};

export const GlassVariants: Story = {
  render: (args) => renderGlassVariants({ component: DataTable, args }),
};

export const GlassOutlineVariants: Story = {
  render: (args) => renderGlassOutlineVariants({ component: DataTable, args }),
};

export const StateOutlineVariants: Story = {
  render: (args) => renderStateOutlineVariants({ component: DataTable, args }),
};
