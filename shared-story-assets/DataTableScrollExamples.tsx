import type CoreDataTable from "../src/components/DataTable/core/DataTable";
import { useState } from "react";

export function DataTableScrollExamples({ DataTable }: { DataTable: typeof CoreDataTable }) {
  const [action, setAction] = useState("");
  const data = [{ name: "Aurora", description: "Publication details" }];
  const columns = [
    { key: "name" as const, label: "Name", minWidth: "20rem" },
    { key: "description" as const, label: "Description", minWidth: "30rem" },
  ];
  return <div style={{ maxWidth: "24rem" }}>
    <DataTable data={data} columns={columns} caption="Publications" hideCaption={false}
      toolbarTitle="Publications" filterable pagination itemsPerPage={5} />
    <DataTable data={data} caption="Members" hideCaption={false}
      onRowClick={(row) => setAction(`Open ${row.name}`)}
      columns={[
        columns[0],
        { ...columns[1], render: () => <><a href="#publication-details">Publication details</a> <button type="button" onClick={() => setAction("Edit publication")}>Edit</button></> },
      ]} />
    <DataTable data={data} columns={columns} caption="Archive"
      scrollRegionProps={{ "aria-label": "Archived publications, scroll for details", tabIndex: 0, title: "Use arrow keys to scroll" }} />
    <div id="publication-details">Publication details destination</div>
    <output aria-live="polite">{action}</output>
  </div>;
}
