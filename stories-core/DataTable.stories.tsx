import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  DataTable,
  RoundingType,
  ShadowType,
  StateType,
  ThemeType,
} from "../src/index.core";
import type { DataTableProps } from "../src/components/DataTable/DataTable.types";
import { StoryGrid } from "../.storybook-core/helpers/StoryGrid";

const themeOptions: ThemeType[] = [
  "primary",
  "secondary",
  "tertiary",
  "quaternary",
  "clear",
];

const stateOptions: StateType[] = ["success", "error", "warning"];
const roundingOptions: RoundingType[] = ["none", "small", "medium", "large"];
const shadowOptions: ShadowType[] = [
  "none",
  "light",
  "medium",
  "strong",
  "intense",
];

type SampleRow = {
  id: number;
  name: string;
  score: number;
  passed: boolean;
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

export const ThemeVariants = () => {
  return (
    <StoryGrid title="Theme Variants">
      {themeOptions.map((theme) => (
        <div key={theme}>
          <h4 style={{ textTransform: "capitalize", marginBottom: "0.5rem" }}>
            {theme} Theme
          </h4>
          <DataTable
            data={sampleData}
            columns={sampleColumns}
            theme={theme}
            striped={true}
          />
        </div>
      ))}
    </StoryGrid>
  );
};

export const StateVariants = () => {
  return (
    <StoryGrid title="State Variants">
      {stateOptions.map((state) => (
        <div key={state}>
          <h4 style={{ textTransform: "capitalize", marginBottom: "0.5rem" }}>
            {state} state
          </h4>
          <DataTable
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

export const OutlineVariants = () => (
  <StoryGrid title="Outline Variants">
    {themeOptions.map((theme) => (
      <div key={`outline-${theme}`}>
        <h4 style={{ textTransform: "capitalize", marginBottom: "0.5rem" }}>
          {theme} Outline
        </h4>
        <DataTable
          data={sampleData}
          columns={sampleColumns}
          theme={theme}
          outline
          striped
        />
      </div>
    ))}
    {stateOptions.map((state) => (
      <div key={state}>
        <h4 style={{ textTransform: "capitalize", marginBottom: "0.5rem" }}>
          {state} Outline
        </h4>
        <DataTable
          data={sampleData}
          columns={sampleColumns}
          state={state}
          outline
          striped={true}
        />
      </div>
    ))}
  </StoryGrid>
);

export const GlassThemeVariants = () => (
  <StoryGrid title="Glass Theme Variants">
    {themeOptions.map((theme) => (
      <div key={theme}>
        <h4 style={{ textTransform: "capitalize", marginBottom: "0.5rem" }}>
          {theme} Glass
        </h4>
        <DataTable
          data={sampleData}
          columns={sampleColumns}
          theme={theme}
          glass
          striped
        />
      </div>
    ))}
  </StoryGrid>
);

export const GlassStateVariants = () => (
  <StoryGrid title="Glass State Variants">
    {stateOptions.map((state) => (
      <div key={state}>
        <h4 style={{ textTransform: "capitalize", marginBottom: "0.5rem" }}>
          {state} Glass
        </h4>
        <DataTable
          data={sampleData}
          columns={sampleColumns}
          state={state}
          glass
          striped
        />
      </div>
    ))}
  </StoryGrid>
);

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
