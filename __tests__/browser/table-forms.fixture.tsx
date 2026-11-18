import React, { useState } from "react";
import CoreSearch from "../../src/core/SearchInput";
import NextSearch from "../../src/next/SearchInput";
import CoreColor from "../../src/core/ColorPicker";
import NextColor from "../../src/next/ColorPicker";
import CoreTable from "../../src/core/DataTable";
import NextTable from "../../src/next/DataTable";

const colors = [{ label: "Red", value: "#ff0000" }, { label: "Blue", value: "#0000ff" }, { label: "Green", value: "#00ff00", disabled: true }];
const initialRows = Array.from({ length: 200 }, (_, id) => ({ id, name: `Row ${String(id).padStart(3, "0")}` }));

export function TableForms() {
  const query = new URLSearchParams(location.search);
  const next = query.get("variant") === "next";
  const Search = next ? NextSearch : CoreSearch;
  const Color = next ? NextColor : CoreColor;
  const Table = next ? NextTable : CoreTable;
  const [search, setSearch] = useState("initial");
  const [calls, setCalls] = useState<string[]>([]);
  const [color, setColor] = useState(query.get("color") ?? "#123456");
  const [first, setFirst] = useState("#ff0000");
  const [second, setSecond] = useState("#0000ff");
  const [rows, setRows] = useState(initialRows);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const [filter, setFilter] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Array<string | number>>([]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [edits, setEdits] = useState(0);
  const server = query.has("server");
  const uncontrolled = query.has("uncontrolled");
  const loaded = server ? rows.slice((page - 1) * 8, page * 8) : rows;
  return <main>
    <h1>Public forms and table examples</h1>
    <Search label="Search" value={search} onChange={(value, event) => { setCalls(calls => [...calls, `change:${value}:${event.type}`]); setSearch(value); }}
      onClear={query.has("notify") ? () => setCalls(calls => [...calls, "clear"]) : undefined} required disabled={query.has("disabled")} readOnly={query.has("readonly")} />
    <output data-testid="search-calls">{JSON.stringify(calls)}</output>
    <form data-testid="color-form">
      <fieldset disabled={query.has("disabled-fieldset")}><legend>Palette</legend>
        <Color label="Chosen color" name="chosen-color" colors={colors} allowCustom required disabled={query.has("disabled")}
          value={uncontrolled ? undefined : color} defaultValue={uncontrolled ? query.get("color") ?? "#123456" : undefined} onValueChange={setColor} />
      </fieldset>
      <Color label="First palette" testId="first-color" colors={colors} value={uncontrolled ? undefined : first} defaultValue={uncontrolled ? "#ff0000" : undefined} onValueChange={setFirst} />
      <Color label="Second palette" testId="second-color" colors={colors} value={uncontrolled ? undefined : second} defaultValue={uncontrolled ? "#0000ff" : undefined} onValueChange={setSecond} />
      <button type="reset">Reset colors</button>
    </form>
    <button onClick={() => setColor("#0000ff")}>Set preset</button>
    <button onClick={() => setColor("#654321")}>Set custom</button>
    <button onClick={() => setColor("")}>Clear color</button>
    <button onClick={() => setColor("invalid")}>Set invalid color</button>
    <button onClick={() => setRows(initialRows.slice(0, 3))}>Shorten rows</button>
    <button onClick={() => setRows(initialRows.slice(0, 100))}>Trim to 100 rows</button>
    <button onClick={() => setTimeout(() => setRows(initialRows.slice(0, 3)), 10)}>Load shorter rows</button>
    <button onClick={() => setRows(initialRows)}>Restore rows</button>
    <button onClick={() => setSize(5)}>Use five rows per page</button>
    <button onClick={() => setFilter("Row 000")}>Set external filter</button>
    <Table caption="Records" data={loaded} columns={[{ key: "name", label: "Name", editable: true }, { key: "id", label: "ID" }]} rowKey={row => row.id}
      filterable filterValue={query.has("controlled-filter") ? filter : undefined} onFilterChange={setFilter}
      virtualized={!query.has("nonvirtual")} virtualRowHeight={48} virtualViewportHeight={192} virtualOverscan={2}
      selectableRows selectedRowKeys={query.has("controlled-selection") ? selectedKeys : undefined}
      onSelectionChange={(keys, selected) => { setSelectedKeys(keys); setSelectedRows(selected.map(row => row.id)); }}
      bulkActions={(keys, selected) => <output data-testid="bulk-scope">{JSON.stringify({ keys: keys.length, rows: selected.length })}</output>}
      pagination={query.has("pagination") || server} serverPagination={server} totalItems={server ? 200 : undefined}
      itemsPerPage={server ? 8 : size} currentPage={page} onPageChange={setPage}
      columnReorder onCellEdit={() => setEdits(edits => edits + 1)} />
    <output data-testid="selection-keys">{JSON.stringify(selectedKeys)}</output>
    <output data-testid="selection-rows">{JSON.stringify(selectedRows)}</output>
    <output data-testid="edits">{edits}</output>
  </main>;
}
