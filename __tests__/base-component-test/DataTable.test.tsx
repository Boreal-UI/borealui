import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { axe, toHaveNoViolations } from "jest-axe";
import DataTableBase from "@/components/DataTable/DataTableBase";
import { Column } from "@/components/DataTable/DataTable.types";

expect.extend(toHaveNoViolations);

type Row = {
  id?: string;
  name: string;
  age: number | null;
  status?: string;
  meta?: { city: string };
};

const baseColumns: Column<Row>[] = [
  { key: "name", label: "Name", sortable: true },
  { key: "age", label: "Age", sortable: true },
];

const baseData: Row[] = [
  { id: "a1", name: "Alice", age: 28 },
  { id: "b2", name: "Bob", age: 34 },
];

const classMap = {
  wrapper: "tableWrapper",
  scrollArea: "scrollArea",
  table: "table",
  striped: "striped",
  headerCell: "headerCell",
  sortIcon: "sortIcon",
  sortable: "sortable",
  sortButton: "sortButton",
  clickable: "clickable",
  cell: "cell",
  wrapCell: "wrapCell",
  emptyCell: "emptyCell",
  toolbar: "toolbar",
  toolbarTitle: "toolbarTitle",
  toolbarActions: "toolbarActions",
  filterInput: "filterInput",
  bulkToolbar: "bulkToolbar",
  pagination: "pagination",
  paginationButton: "paginationButton",
  paginationStatus: "paginationStatus",
  columnMenu: "columnMenu",
  columnMenuTrigger: "columnMenuTrigger",
  columnMenuPanel: "columnMenuPanel",
  columnMenuItem: "columnMenuItem",
  viewport: "viewport",
  headerContent: "headerContent",
  columnControls: "columnControls",
  columnControlButton: "columnControlButton",
  pinnedCell: "pinnedCell",
  expandedRow: "expandedRow",
  expandedCell: "expandedCell",
  expandButton: "expandButton",
  virtualized: "virtualized",
  editableCell: "editableCell",
  editButton: "editButton",
  cellEditor: "cellEditor",
  selectionCell: "selectionCell",
  primary: "primary",
  success: "success",
  roundMedium: "roundMedium",
  shadowLight: "shadowLight",
  srOnly: "srOnly",
  glass: "glass",
  outline: "outline",
};

const renderTable = (
  props: Partial<React.ComponentProps<typeof DataTableBase<Row>>> = {},
) =>
  render(
    <DataTableBase<Row>
      columns={baseColumns}
      data={baseData}
      classMap={classMap}
      {...props}
    />,
  );

describe("DataTableBase", () => {
  it("renders a table with headers and rows", () => {
    renderTable();

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getAllByRole("columnheader")).toHaveLength(2);
    expect(screen.getAllByRole("row")).toHaveLength(3);

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("28")).toBeInTheDocument();
    expect(screen.getByText("34")).toBeInTheDocument();
  });

  it("filters rows with the toolbar search input", () => {
    renderTable({ filterable: true, toolbarTitle: "People" });

    fireEvent.change(screen.getByRole("searchbox", { name: /filter table/i }), {
      target: { value: "Alice" },
    });

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.queryByText("Bob")).not.toBeInTheDocument();
  });

  it("supports row selection", () => {
    const onSelectionChange = jest.fn();
    renderTable({
      selectableRows: true,
      rowKey: (row) => row.id ?? row.name,
      onSelectionChange,
    });

    fireEvent.click(screen.getByRole("checkbox", { name: /select row 1/i }));

    expect(onSelectionChange).toHaveBeenCalledWith(
      ["a1"],
      [{ id: "a1", name: "Alice", age: 28 }],
    );
  });

  it("renders the wrapper with default structural classes", () => {
    renderTable();

    const wrapper = screen.getByTestId("data-table");
    expect(wrapper).toHaveClass("tableWrapper");
    expect(wrapper).toHaveClass("striped");
    expect(wrapper).toHaveClass("roundMedium");
    expect(wrapper).toHaveClass("shadowLight");
  });

  it("applies custom className to the wrapper", () => {
    renderTable({ className: "customWrapper" });

    expect(screen.getByTestId("data-table")).toHaveClass("customWrapper");
  });

  it("applies table, thead, and tbody class names", () => {
    renderTable({
      tableClassName: "customTable",
      theadClassName: "customThead",
      tbodyClassName: "customTbody",
    });

    const table = screen.getByRole("table");

    expect(table).toHaveClass("table");
    expect(table).toHaveClass("customTable");

    expect(table.querySelector("thead")).toHaveClass("customThead");
    expect(table.querySelector("tbody")).toHaveClass("customTbody");
  });

  it("applies theme, state, outline, and glass classes to the table and wrapper", () => {
    renderTable({
      theme: "primary",
      state: "success",
      variant: "glassOutline",
    });

    const table = screen.getByRole("table");
    const wrapper = screen.getByTestId("data-table");
    expect(wrapper).toHaveClass("primary");
    expect(wrapper).toHaveClass("success");
    expect(wrapper).toHaveClass("glass");
    expect(table).toHaveClass("table");
    expect(table).toHaveClass("primary");
    expect(table).toHaveClass("success");
    expect(table).toHaveClass("outline");
    expect(table).toHaveClass("glass");
  });

  it("applies wrapCell class to headers and cells when wrapCells is true", () => {
    renderTable({
      wrapCells: true,
    });

    const headers = screen.getAllByRole("columnheader");
    const cells = screen.getAllByRole("cell");

    headers.forEach((header) => {
      expect(header).toHaveClass("wrapCell");
    });

    cells.forEach((cell) => {
      expect(cell).toHaveClass("wrapCell");
    });
  });

  it("applies column-level header, cell, row header, and sort button class names", () => {
    renderTable({
      columns: [
        {
          key: "name",
          label: "Name",
          sortable: true,
          isRowHeader: true,
          headerClassName: "customNameHeader",
          cellClassName: "customNameCell",
          rowHeaderClassName: "customRowHeader",
          sortButtonClassName: "customSortButton",
        },
        {
          key: "age",
          label: "Age",
          sortable: true,
          headerClassName: "customAgeHeader",
          cellClassName: "customAgeCell",
        },
      ],
    });

    const nameHeader = screen.getByRole("columnheader", { name: /name/i });
    const ageHeader = screen.getByRole("columnheader", { name: /age/i });

    expect(nameHeader).toHaveClass("customNameHeader");
    expect(ageHeader).toHaveClass("customAgeHeader");

    const nameSortButton = within(nameHeader).getByRole("button");
    expect(nameSortButton).toHaveClass("customSortButton");

    const rowHeaders = screen.getAllByRole("rowheader");

    expect(rowHeaders[0]).toHaveClass("cell");
    expect(rowHeaders[0]).toHaveClass("customNameCell");
    expect(rowHeaders[0]).toHaveClass("customRowHeader");
    expect(rowHeaders[0]).toHaveTextContent("Alice");

    const ageCell = screen.getByText("28");
    expect(ageCell).toHaveClass("customAgeCell");
  });

  it("applies a static rowClassName to every data row", () => {
    renderTable({
      rowClassName: "customRow",
    });

    const firstRow = screen.getByTestId("data-table-row-0");
    const secondRow = screen.getByTestId("data-table-row-1");

    expect(firstRow).toHaveClass("customRow");
    expect(secondRow).toHaveClass("customRow");
  });

  it("applies a dynamic cellClassName callback based on value, row, column, and row index", () => {
    renderTable({
      cellClassName: (value, row, column, rowIndex) => {
        if (column.key === "age" && value === 34) {
          return "seniorAgeCell";
        }

        if (column.key === "name" && row.name === "Alice" && rowIndex === 0) {
          return "aliceNameCell";
        }

        return undefined;
      },
    });

    const aliceCell = screen.getByText("Alice");
    const bobAgeCell = screen.getByText("34");

    expect(aliceCell).toHaveClass("aliceNameCell");
    expect(bobAgeCell).toHaveClass("seniorAgeCell");
  });

  it("combines column cellClassName with the table-level cellClassName callback", () => {
    renderTable({
      columns: [
        {
          key: "name",
          label: "Name",
          cellClassName: "columnNameCell",
        },
        {
          key: "age",
          label: "Age",
          cellClassName: "columnAgeCell",
        },
      ],
      cellClassName: (_, __, column) =>
        column.key === "name" ? "dynamicNameCell" : undefined,
    });

    const aliceCell = screen.getByText("Alice");
    const ageCell = screen.getByText("28");

    expect(aliceCell).toHaveClass("cell");
    expect(aliceCell).toHaveClass("columnNameCell");
    expect(aliceCell).toHaveClass("dynamicNameCell");

    expect(ageCell).toHaveClass("cell");
    expect(ageCell).toHaveClass("columnAgeCell");
    expect(ageCell).not.toHaveClass("dynamicNameCell");
  });

  it("applies data-label attributes to regular cells and row header cells", () => {
    renderTable({
      columns: [
        {
          key: "name",
          label: "Name",
          isRowHeader: true,
        },
        {
          key: "age",
          label: "Age",
        },
      ],
    });

    const rowHeader = screen.getByRole("rowheader", { name: "Alice" });
    const ageCell = screen.getByText("28");

    expect(rowHeader).toHaveAttribute("data-label", "Name");
    expect(ageCell).toHaveAttribute("data-label", "Age");
  });

  it("applies a dynamic rowClassName callback based on row data and index", () => {
    renderTable({
      rowClassName: (row, index) => {
        if (row.name === "Alice") return "aliceRow";
        if (index === 1) return "secondRow";
        return undefined;
      },
    });

    const firstRow = screen.getByTestId("data-table-row-0");
    const secondRow = screen.getByTestId("data-table-row-1");

    expect(firstRow).toHaveClass("aliceRow");
    expect(secondRow).toHaveClass("secondRow");
  });

  it("allows column wrap to override global wrapCells", () => {
    renderTable({
      wrapCells: true,
      columns: [
        {
          key: "name",
          label: "Name",
          sortable: true,
          wrap: false,
        },
        {
          key: "age",
          label: "Age",
          sortable: true,
          wrap: true,
        },
      ],
    });

    const nameHeader = screen.getByRole("columnheader", { name: /name/i });
    const ageHeader = screen.getByRole("columnheader", { name: /age/i });

    expect(nameHeader).not.toHaveClass("wrapCell");
    expect(ageHeader).toHaveClass("wrapCell");

    const rows = screen.getAllByRole("row");
    const firstBodyRow = rows[1];

    const nameCell = within(firstBodyRow).getByText("Alice");
    const ageCell = within(firstBodyRow).getByText("28");

    expect(nameCell).not.toHaveClass("wrapCell");
    expect(ageCell).toHaveClass("wrapCell");
  });

  it("applies column width, minWidth, and maxWidth styles to headers and body cells", () => {
    renderTable({
      columns: [
        {
          key: "name",
          label: "Name",
          width: "12rem",
          minWidth: "10rem",
          maxWidth: "20rem",
        },
        {
          key: "age",
          label: "Age",
          width: "8rem",
        },
      ],
    });

    const nameHeader = screen.getByRole("columnheader", { name: /name/i });
    const ageHeader = screen.getByRole("columnheader", { name: /age/i });

    expect(nameHeader).toHaveStyle({
      width: "12rem",
      minWidth: "10rem",
      maxWidth: "20rem",
    });

    expect(ageHeader).toHaveStyle({
      width: "8rem",
    });

    const aliceCell = screen.getByText("Alice");
    const ageCell = screen.getByText("28");

    expect(aliceCell).toHaveStyle({
      width: "12rem",
      minWidth: "10rem",
      maxWidth: "20rem",
    });

    expect(ageCell).toHaveStyle({
      width: "8rem",
    });
  });

  it("uses the provided aria-label on the table", () => {
    renderTable({ "aria-label": "User data table" });

    expect(
      screen.getByRole("table", { name: "User data table" }),
    ).toBeInTheDocument();
  });

  it("uses aria-labelledby on the table when provided", () => {
    render(
      <>
        <h2 id="users-heading">Users</h2>
        <DataTableBase<Row>
          columns={baseColumns}
          data={baseData}
          classMap={classMap}
          aria-labelledby="users-heading"
        />
      </>,
    );

    const table = screen.getByRole("table", { name: "Users" });
    expect(table).toHaveAttribute("aria-labelledby", "users-heading");
  });

  it("renders a custom caption and associates it with the table", () => {
    renderTable({
      "data-testid": "users-table",
      caption: "User records",
    });

    const table = screen.getByRole("table");
    const caption = screen.getByText("User records");

    expect(caption).toBeInTheDocument();
    expect(caption).toHaveAttribute("id", "users-table-caption");
    expect(caption).toHaveClass("srOnly");
    expect(table).toHaveAttribute(
      "aria-describedby",
      expect.stringContaining("users-table-caption"),
    );
  });

  it("renders a visible caption when hideCaption is false", () => {
    renderTable({
      caption: "Visible table caption",
      hideCaption: false,
    });

    const caption = screen.getByText("Visible table caption");
    expect(caption).toBeInTheDocument();
    expect(caption).not.toHaveClass("srOnly");
  });

  it("merges custom aria-describedby with the generated caption and live region ids", () => {
    renderTable({
      "data-testid": "users-table",
      "aria-describedby": "external-description",
      caption: "User records",
    });

    const table = screen.getByRole("table");
    expect(table).toHaveAttribute(
      "aria-describedby",
      expect.stringContaining("external-description"),
    );
    expect(table).toHaveAttribute(
      "aria-describedby",
      expect.stringContaining("users-table-caption"),
    );
    expect(table).toHaveAttribute(
      "aria-describedby",
      expect.stringContaining("users-table-live-region"),
    );
  });

  it("applies aria-colcount and aria-rowcount when provided", () => {
    renderTable({
      colCount: 5,
      rowCount: 20,
    });

    const table = screen.getByRole("table");
    expect(table).toHaveAttribute("aria-colcount", "5");
    expect(table).toHaveAttribute("aria-rowcount", "20");
  });

  it("sorts by defaultSortKey and defaultSortOrder on mount", () => {
    renderTable({
      defaultSortKey: "age",
      defaultSortOrder: "desc",
    });

    const rows = screen.getAllByRole("row");
    expect(rows[1]).toHaveTextContent("Bob");
    expect(rows[2]).toHaveTextContent("Alice");
  });

  it("renders sortable headers with buttons", () => {
    renderTable();

    const nameSortButton = screen.getByRole("button", { name: /name/i });
    const ageSortButton = screen.getByRole("button", { name: /age/i });

    expect(nameSortButton).toBeInTheDocument();
    expect(ageSortButton).toBeInTheDocument();
    expect(nameSortButton).toHaveClass("sortButton");
    expect(ageSortButton).toHaveClass("sortButton");
  });

  it("sorts ascending on first sortable header button click", () => {
    renderTable({
      data: [
        { name: "Bob", age: 34 },
        { name: "Alice", age: 28 },
      ],
    });

    const ageHeader = screen.getByRole("columnheader", { name: /age/i });
    const ageButton = within(ageHeader).getByRole("button");

    fireEvent.click(ageButton);

    const rows = screen.getAllByRole("row");
    expect(ageHeader).toHaveAttribute("aria-sort", "ascending");
    expect(rows[1]).toHaveTextContent("Alice");
    expect(rows[2]).toHaveTextContent("Bob");
  });

  it("toggles to descending when the same sortable header button is clicked again", () => {
    renderTable();

    const ageHeader = screen.getByRole("columnheader", { name: /age/i });
    const ageButton = within(ageHeader).getByRole("button");

    fireEvent.click(ageButton);
    expect(ageHeader).toHaveAttribute("aria-sort", "ascending");

    fireEvent.click(ageButton);
    expect(ageHeader).toHaveAttribute("aria-sort", "descending");
  });

  it("supports keyboard sorting with Enter on the sort button", () => {
    renderTable({
      data: [
        { name: "Bob", age: 34 },
        { name: "Alice", age: 28 },
      ],
    });

    const nameHeader = screen.getByRole("columnheader", { name: /name/i });
    const nameButton = within(nameHeader).getByRole("button");

    fireEvent.keyDown(nameButton, { key: "Enter" });

    expect(nameHeader).toHaveAttribute("aria-sort", "ascending");
    const rows = screen.getAllByRole("row");
    expect(rows[1]).toHaveTextContent("Alice");
    expect(rows[2]).toHaveTextContent("Bob");
  });

  it("supports keyboard sorting with Space on the sort button", () => {
    renderTable();

    const nameHeader = screen.getByRole("columnheader", { name: /name/i });
    const nameButton = within(nameHeader).getByRole("button");

    fireEvent.keyDown(nameButton, { key: " " });
    expect(nameHeader).toHaveAttribute("aria-sort", "ascending");

    fireEvent.keyDown(nameButton, { key: " " });
    expect(nameHeader).toHaveAttribute("aria-sort", "descending");
  });

  it("does not sort when an unrelated key is pressed on a sort button", () => {
    renderTable();

    const nameHeader = screen.getByRole("columnheader", { name: /name/i });
    const nameButton = within(nameHeader).getByRole("button");

    fireEvent.keyDown(nameButton, { key: "Escape" });

    expect(nameHeader).toHaveAttribute("aria-sort", "none");
  });

  it("renders aria-sort='none' on sortable columns before they become active", () => {
    renderTable();

    const nameHeader = screen.getByRole("columnheader", { name: /name/i });
    const ageHeader = screen.getByRole("columnheader", { name: /age/i });

    expect(nameHeader).toHaveAttribute("aria-sort", "none");
    expect(ageHeader).toHaveAttribute("aria-sort", "none");
  });

  it("renders sort icons and marks them aria-hidden", () => {
    renderTable();

    const headers = screen.getAllByRole("columnheader");
    const firstHeaderIcon = within(headers[0]).getByText("⇅");
    const secondHeaderIcon = within(headers[1]).getByText("⇅");

    expect(firstHeaderIcon).toHaveAttribute("aria-hidden", "true");
    expect(secondHeaderIcon).toHaveAttribute("aria-hidden", "true");
    expect(firstHeaderIcon).toHaveClass("sortIcon");
    expect(secondHeaderIcon).toHaveClass("sortIcon");
  });

  it("updates sort icon when a column is sorted ascending then descending", () => {
    renderTable();

    const nameHeader = screen.getByRole("columnheader", { name: /name/i });
    const nameButton = within(nameHeader).getByRole("button");

    fireEvent.click(nameButton);
    expect(within(nameHeader).getByText("▲")).toBeInTheDocument();

    fireEvent.click(nameButton);
    expect(within(nameHeader).getByText("▼")).toBeInTheDocument();
  });

  it("uses custom sort button aria labels when getSortAriaLabel is provided", () => {
    renderTable({
      getSortAriaLabel: (column, order, isActive) =>
        `${column.label} custom label ${order} ${String(isActive)}`,
    });

    const nameButton = screen.getByRole("button", {
      name: "Name custom label asc false",
    });

    expect(nameButton).toBeInTheDocument();
  });

  it("announces sort changes in the live region", () => {
    renderTable({
      "data-testid": "users-table",
    });

    const liveRegion = screen.getByText("", {
      selector: "#users-table-live-region",
    });
    const nameHeader = screen.getByRole("columnheader", { name: /name/i });
    const nameButton = within(nameHeader).getByRole("button");

    fireEvent.click(nameButton);

    expect(liveRegion).toHaveTextContent("Name sorted ascending");
  });

  it("uses a custom sort announcement when getSortAnnouncement is provided", () => {
    renderTable({
      "data-testid": "users-table",
      getSortAnnouncement: (column, order) =>
        `Sorted ${column.label} in ${order} order`,
    });

    const liveRegion = screen.getByText("", {
      selector: "#users-table-live-region",
    });
    const ageHeader = screen.getByRole("columnheader", { name: /age/i });
    const ageButton = within(ageHeader).getByRole("button");

    fireEvent.click(ageButton);

    expect(liveRegion).toHaveTextContent("Sorted Age in asc order");
  });

  it("supports server-side sorting without reordering the visible data", () => {
    const onSortChange = jest.fn();

    renderTable({
      data: [
        { name: "Bob", age: 34 },
        { name: "Alice", age: 28 },
      ],
      serverSort: true,
      onSortChange,
    });

    const nameHeader = screen.getByRole("columnheader", { name: /name/i });
    const nameButton = within(nameHeader).getByRole("button");

    fireEvent.click(nameButton);

    expect(onSortChange).toHaveBeenCalledWith("name", "asc");

    const rows = screen.getAllByRole("row");
    expect(rows[1]).toHaveTextContent("Bob");
    expect(rows[2]).toHaveTextContent("Alice");
  });

  it("toggles server-side sort order across repeated clicks", () => {
    const onSortChange = jest.fn();

    renderTable({
      serverSort: true,
      onSortChange,
    });

    const nameHeader = screen.getByRole("columnheader", { name: /name/i });
    const nameButton = within(nameHeader).getByRole("button");

    fireEvent.click(nameButton);
    fireEvent.click(nameButton);

    expect(onSortChange).toHaveBeenNthCalledWith(1, "name", "asc");
    expect(onSortChange).toHaveBeenNthCalledWith(2, "name", "desc");
  });

  it("triggers onRowClick when a row is clicked", () => {
    const handleClick = jest.fn();

    renderTable({ onRowClick: handleClick });

    const row = screen.getAllByRole("row")[1];
    fireEvent.click(row);

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledWith(baseData[0]);
  });

  it("makes body rows keyboard-focusable when onRowClick is provided", () => {
    const handleClick = jest.fn();

    renderTable({ onRowClick: handleClick });

    const bodyRows = screen.getAllByRole("row").slice(1);
    expect(bodyRows[0]).toHaveAttribute("tabIndex", "0");
    expect(bodyRows[1]).toHaveAttribute("tabIndex", "0");
    expect(bodyRows[0]).toHaveClass("clickable");
  });

  it("does not make rows keyboard-focusable when onRowClick is not provided", () => {
    renderTable();

    const bodyRows = screen.getAllByRole("row").slice(1);
    expect(bodyRows[0]).not.toHaveAttribute("tabIndex");
    expect(bodyRows[1]).not.toHaveClass("clickable");
  });

  it("applies row aria-label and aria-description when provided for interactive rows", () => {
    const handleClick = jest.fn();

    renderTable({
      onRowClick: handleClick,
      rowKey: (row) => row.id ?? row.name,
      getRowAriaLabel: (row) => `Open ${row.name}`,
      getRowAriaDescription: (row) => `${row.name} details row`,
    });

    const firstRow = screen.getByTestId("data-table-row-a1");
    expect(firstRow).toHaveAttribute("aria-label", "Open Alice");
    expect(firstRow).toHaveAttribute("aria-description", "Alice details row");
  });

  it("does not apply row aria-label when rows are not interactive", () => {
    renderTable({
      rowKey: (row) => row.id ?? row.name,
      getRowAriaLabel: (row) => `Open ${row.name}`,
    });

    const firstRow = screen.getByTestId("data-table-row-a1");
    expect(firstRow).not.toHaveAttribute("aria-label");
  });

  it("triggers onRowClick with Enter on a row", () => {
    const handleClick = jest.fn();

    renderTable({ onRowClick: handleClick });

    const row = screen.getAllByRole("row")[1];
    fireEvent.keyDown(row, { key: "Enter" });

    expect(handleClick).toHaveBeenCalledWith(baseData[0]);
  });

  it("triggers onRowClick with Space on a row", () => {
    const handleClick = jest.fn();

    renderTable({ onRowClick: handleClick });

    const row = screen.getAllByRole("row")[1];
    fireEvent.keyDown(row, { key: " " });

    expect(handleClick).toHaveBeenCalledWith(baseData[0]);
  });

  it("does not trigger onRowClick for unrelated row key presses", () => {
    const handleClick = jest.fn();

    renderTable({ onRowClick: handleClick });

    const row = screen.getAllByRole("row")[1];
    fireEvent.keyDown(row, { key: "Tab" });

    expect(handleClick).not.toHaveBeenCalled();
  });

  it("renders a loading row when loading is true", () => {
    renderTable({ loading: true, loadingMessage: "Loading users" });

    const liveRegion = document.getElementById("data-table-live-region");
    const loadingCell = screen.getByRole("cell", { name: "Loading users" });

    expect(liveRegion).toBeInTheDocument();
    expect(liveRegion).toHaveTextContent("Loading users");
    expect(liveRegion).toHaveAttribute("aria-live", "polite");

    expect(loadingCell).toBeInTheDocument();
    expect(loadingCell).toHaveAttribute("aria-live", "polite");
  });

  it("renders a no-data row when data is empty", () => {
    renderTable({ data: [] });

    expect(screen.getByText("No data available")).toBeInTheDocument();
    expect(screen.getByText("No data available")).toHaveAttribute(
      "aria-live",
      "polite",
    );
  });

  it("renders a custom empty message when provided", () => {
    renderTable({ data: [], emptyMessage: "Nothing to display" });

    expect(screen.getByText("Nothing to display")).toBeInTheDocument();
  });

  it("renders the empty cell with the correct colSpan and class", () => {
    renderTable({ data: [] });

    const emptyCell = screen.getByText("No data available");
    expect(emptyCell).toHaveAttribute("colSpan", String(baseColumns.length));
    expect(emptyCell).toHaveClass("emptyCell");
  });

  it("renders striped row class on alternating body rows when striped is true", () => {
    renderTable({
      data: [
        { name: "Alice", age: 28 },
        { name: "Bob", age: 34 },
        { name: "Cara", age: 22 },
      ],
      striped: true,
    });

    const bodyRows = screen.getAllByRole("row").slice(1);
    expect(bodyRows[0]).not.toHaveClass("striped");
    expect(bodyRows[1]).toHaveClass("striped");
    expect(bodyRows[2]).not.toHaveClass("striped");
  });

  it("does not apply striped classes when striped is false", () => {
    renderTable({
      striped: false,
      data: [
        { name: "Alice", age: 28 },
        { name: "Bob", age: 34 },
      ],
    });

    const wrapper = screen.getByTestId("data-table");
    const bodyRows = screen.getAllByRole("row").slice(1);

    expect(wrapper).not.toHaveClass("striped");
    expect(bodyRows[0]).not.toHaveClass("striped");
    expect(bodyRows[1]).not.toHaveClass("striped");
  });

  it("renders custom cell content when a column render function is provided", () => {
    const columns: Column<Row>[] = [
      {
        key: "name",
        label: "Name",
        sortable: true,
        render: (value) => <strong>{String(value)}</strong>,
      },
      { key: "age", label: "Age", sortable: true },
    ];

    render(
      <DataTableBase<Row>
        columns={columns}
        data={baseData}
        classMap={classMap}
      />,
    );

    expect(screen.getByText("Alice").tagName).toBe("STRONG");
    expect(screen.getByText("Bob").tagName).toBe("STRONG");
  });

  it("stringifies object values when no render function is provided", () => {
    const columns: Column<Row>[] = [
      { key: "name", label: "Name", sortable: true },
      { key: "meta", label: "Meta" },
    ];

    const data: Row[] = [{ name: "Alice", age: 28, meta: { city: "Kenora" } }];

    render(
      <DataTableBase<Row> columns={columns} data={data} classMap={classMap} />,
    );

    expect(screen.getByText('{"city":"Kenora"}')).toBeInTheDocument();
  });

  it("renders empty string for nullish cell values", () => {
    const columns: Column<Row>[] = [
      { key: "name", label: "Name" },
      { key: "status", label: "Status" },
    ];

    const data: Row[] = [{ name: "Alice", age: 28, status: undefined }];

    render(
      <DataTableBase<Row> columns={columns} data={data} classMap={classMap} />,
    );

    const bodyRow = screen.getAllByRole("row")[1];
    const cells = within(bodyRow).getAllByRole("cell");

    expect(cells[0]).toHaveTextContent("Alice");
    expect(cells[1]).toHaveTextContent("");
  });

  it("adds data-label attributes to body cells", () => {
    renderTable();

    const bodyRow = screen.getAllByRole("row")[1];
    const cells = within(bodyRow).getAllByRole("cell");

    expect(cells[0]).toHaveAttribute("data-label", "Name");
    expect(cells[1]).toHaveAttribute("data-label", "Age");
  });

  it("applies the cell class to all body cells", () => {
    renderTable();

    const cells = screen.getAllByRole("cell");
    cells.forEach((cell) => {
      expect(cell).toHaveClass("cell");
    });
  });

  it("renders row header cells when a column is marked as isRowHeader", () => {
    const columns: Column<Row>[] = [
      { key: "name", label: "Name", isRowHeader: true },
      { key: "age", label: "Age" },
    ];

    render(
      <DataTableBase<Row>
        columns={columns}
        data={baseData}
        classMap={classMap}
      />,
    );

    const rowHeaders = screen.getAllByRole("rowheader");
    expect(rowHeaders).toHaveLength(2);
    expect(rowHeaders[0]).toHaveTextContent("Alice");
    expect(rowHeaders[1]).toHaveTextContent("Bob");
  });

  it("uses custom header ids and associates body cells through headers", () => {
    const columns: Column<Row>[] = [
      { key: "name", label: "Name", id: "name-col" },
      { key: "age", label: "Age", id: "age-col" },
    ];

    render(
      <DataTableBase<Row>
        columns={columns}
        data={baseData}
        classMap={classMap}
      />,
    );

    const bodyRow = screen.getAllByRole("row")[1];
    const cells = within(bodyRow).getAllByRole("cell");

    expect(cells[0]).toHaveAttribute("headers", "name-col");
    expect(cells[1]).toHaveAttribute("headers", "age-col");
  });

  it("sorts null values after non-null values in ascending order", () => {
    renderTable({
      data: [
        { name: "Null Age", age: null },
        { name: "Young", age: 22 },
        { name: "Older", age: 40 },
      ],
    });

    const ageHeader = screen.getByRole("columnheader", { name: /age/i });
    const ageButton = within(ageHeader).getByRole("button");
    fireEvent.click(ageButton);

    const rows = screen.getAllByRole("row");
    expect(rows[1]).toHaveTextContent("Young");
    expect(rows[2]).toHaveTextContent("Older");
    expect(rows[3]).toHaveTextContent("Null Age");
  });

  it("sorts string values using localeCompare", () => {
    renderTable({
      data: [
        { name: "Charlie", age: 30 },
        { name: "Alice", age: 28 },
        { name: "Bob", age: 34 },
      ],
    });

    const nameHeader = screen.getByRole("columnheader", { name: /name/i });
    const nameButton = within(nameHeader).getByRole("button");
    fireEvent.click(nameButton);

    const rows = screen.getAllByRole("row");
    expect(rows[1]).toHaveTextContent("Alice");
    expect(rows[2]).toHaveTextContent("Bob");
    expect(rows[3]).toHaveTextContent("Charlie");
  });

  it("accepts a rowKey prop and uses it in the row test id", () => {
    const rowKey = jest.fn((row: Row) => row.id ?? row.name);

    render(
      <DataTableBase<Row>
        columns={baseColumns}
        data={baseData}
        classMap={classMap}
        rowKey={rowKey}
      />,
    );

    expect(rowKey).toHaveBeenCalled();
    expect(rowKey).toHaveBeenNthCalledWith(1, baseData[0]);
    expect(rowKey).toHaveBeenNthCalledWith(2, baseData[1]);

    expect(screen.getByTestId("data-table-row-a1")).toBeInTheDocument();
    expect(screen.getByTestId("data-table-row-b2")).toBeInTheDocument();
  });

  it("paginates rows and reports page metadata", () => {
    const onPageChange = jest.fn();

    renderTable({
      pagination: true,
      itemsPerPage: 1,
      onPageChange,
      rowKey: (row) => row.id ?? row.name,
    });

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.queryByText("Bob")).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId("data-table-pagination-next"));

    expect(onPageChange).toHaveBeenCalledWith(2, {
      page: 2,
      itemsPerPage: 1,
      offset: 1,
      pageCount: 2,
    });
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("keeps index-based selection keys distinct across client pages", () => {
    const onSelectionChange = jest.fn();
    renderTable({
      pagination: true,
      itemsPerPage: 1,
      selectableRows: true,
      onSelectionChange,
    });

    fireEvent.click(screen.getByRole("checkbox", { name: "Select row 1" }));
    fireEvent.click(screen.getByTestId("data-table-pagination-next"));
    fireEvent.click(screen.getByRole("checkbox", { name: "Select row 2" }));

    expect(onSelectionChange).toHaveBeenLastCalledWith([0, 1], baseData);
  });

  it("supports server pagination without slicing provided data", () => {
    const onPageChange = jest.fn();

    renderTable({
      pagination: true,
      serverPagination: true,
      currentPage: 2,
      itemsPerPage: 2,
      totalItems: 6,
      onPageChange,
    });

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(
      screen.getByTestId("data-table-pagination-status"),
    ).toHaveTextContent("Page 2 of 3");

    fireEvent.click(screen.getByTestId("data-table-pagination-next"));
    expect(onPageChange).toHaveBeenCalledWith(
      3,
      expect.objectContaining({ page: 3, offset: 4, pageCount: 3 }),
    );
  });

  it("toggles column visibility from the column menu", () => {
    renderTable({ columnVisibility: true });

    expect(
      screen.getByRole("columnheader", { name: /age/i }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("data-table-toggle-column-age"));

    expect(
      screen.queryByRole("columnheader", { name: /age/i }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("28")).not.toBeInTheDocument();
  });

  it("reorders columns with header controls", () => {
    const onColumnOrderChange = jest.fn();

    renderTable({
      columnReorder: true,
      onColumnOrderChange,
    });

    fireEvent.click(screen.getByTestId("data-table-move-age-left"));

    const headers = screen.getAllByRole("columnheader");
    expect(headers[0]).toHaveTextContent("Age");
    expect(headers[1]).toHaveTextContent("Name");
    expect(onColumnOrderChange).toHaveBeenCalledWith(["age", "name"]);
  });

  it("resizes and pins columns with header controls", () => {
    const onColumnWidthsChange = jest.fn();
    const onPinnedColumnKeysChange = jest.fn();

    renderTable({
      columnResize: true,
      columnPinning: true,
      columns: [
        { key: "name", label: "Name", width: "120px" },
        { key: "age", label: "Age" },
      ],
      onColumnWidthsChange,
      onPinnedColumnKeysChange,
    });

    fireEvent.click(screen.getByTestId("data-table-resize-name-wider"));
    expect(onColumnWidthsChange).toHaveBeenCalledWith({ name: "144px" });

    fireEvent.click(screen.getByTestId("data-table-pin-name"));
    expect(onPinnedColumnKeysChange).toHaveBeenCalledWith(["name"]);
    expect(screen.getByRole("columnheader", { name: /name/i })).toHaveClass(
      "pinnedCell",
    );
  });

  it("precomputes cumulative offsets for pinned columns", () => {
    renderTable({
      selectableRows: true,
      columnPinning: true,
      defaultPinnedColumnKeys: ["name", "age"],
      columns: [
        { key: "name", label: "Name", width: "120px" },
        { key: "age", label: "Age", width: "80px" },
      ],
    });

    expect(screen.getByRole("columnheader", { name: /Name/ })).toHaveStyle({
      left: "48px",
    });
    expect(screen.getByRole("columnheader", { name: /Age/ })).toHaveStyle({
      left: "168px",
    });
  });

  it("renders row expansion panels", () => {
    renderTable({
      rowKey: (row) => row.id ?? row.name,
      renderExpandedRow: (row) => <div>{row.name} details</div>,
    });

    fireEvent.click(screen.getByTestId("data-table-expand-row-a1"));

    expect(screen.getByTestId("data-table-expanded-row-a1")).toHaveTextContent(
      "Alice details",
    );
  });

  it("renders bulk actions when rows are selected", () => {
    renderTable({
      selectableRows: true,
      rowKey: (row) => row.id ?? row.name,
      bulkActions: (keys) => (
        <button type="button">Archive {keys.length}</button>
      ),
    });

    fireEvent.click(screen.getByTestId("data-table-select-row-a1"));

    expect(screen.getByTestId("data-table-bulk-toolbar")).toHaveTextContent(
      "1 selected",
    );
    expect(
      screen.getByRole("button", { name: "Archive 1" }),
    ).toBeInTheDocument();
  });

  it("commits inline cell edits", () => {
    const onCellEdit = jest.fn();

    renderTable({
      rowKey: (row) => row.id ?? row.name,
      columns: [
        { key: "name", label: "Name", editable: true },
        { key: "age", label: "Age" },
      ],
      onCellEdit,
    });

    fireEvent.click(screen.getByTestId("data-table-edit-a1-name"));
    const editor = screen.getByTestId("data-table-editor-a1-name");
    fireEvent.change(editor, { target: { value: "Alicia" } });
    fireEvent.keyDown(editor, { key: "Enter" });

    expect(onCellEdit).toHaveBeenCalledWith(
      "Alicia",
      expect.objectContaining({
        row: baseData[0],
        rowIndex: 0,
        rowKey: "a1",
      }),
    );
  });

  it("virtualizes large data sets", () => {
    const rows = Array.from({ length: 100 }, (_, index) => ({
      name: `User ${index}`,
      age: index,
    }));

    renderTable({
      data: rows,
      virtualized: true,
      virtualRowHeight: 40,
      virtualViewportHeight: 120,
      virtualOverscan: 1,
    });

    expect(
      screen.getByTestId("data-table-virtual-viewport"),
    ).toBeInTheDocument();
    expect(screen.getByText("User 0")).toBeInTheDocument();
    expect(screen.queryByText("User 99")).not.toBeInTheDocument();
    expect(screen.getByTestId("data-table-virtual-bottom")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = renderTable();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations when empty", async () => {
    const { container } = renderTable({ data: [] });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations when rows are interactive", async () => {
    const { container } = renderTable({
      onRowClick: jest.fn(),
      getRowAriaLabel: (row) => `Open ${row.name}`,
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations when loading", async () => {
    const { container } = renderTable({
      loading: true,
      loadingMessage: "Loading users",
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
