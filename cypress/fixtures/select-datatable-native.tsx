import { createRoot } from "react-dom/client";
import { useState } from "react";
import CoreDataTable from "../../src/components/DataTable/core/DataTable";
import NextDataTable from "../../src/components/DataTable/next/DataTable";
import CoreSelect from "../../src/components/Select/core/Select";
import NextSelect from "../../src/components/Select/next/Select";
import { SelectNativeExamples } from "../../shared-story-assets/SelectNativeExamples";
import "../../src/styles/globals.scss";

function Fixture() {
  const isNext = new URLSearchParams(location.search).get("implementation") === "next";
  const DataTable = isNext ? NextDataTable : CoreDataTable;
  const Select = isNext ? NextSelect : CoreSelect;
  const [activations, setActivations] = useState(0);
  return <main style={{ padding: "1rem" }}>
    <button type="button">Before table</button>
    <div style={{ width: "300px" }}>
      <DataTable caption="Publications" hideCaption={false} data={[{ name: "Aurora" }]}
        onRowClick={() => setActivations((count) => count + 1)}
        columns={[{ key: "name", label: "Name", minWidth: "1200px", render: () => <>
          <span>Row content</span> <a href="?destination=member">Member details</a> <button type="button">Edit</button>
        </> }]} />
    </div>
    <output aria-label="Row activations">{activations}</output>
    <div style={{ width: "900px" }}>
      <DataTable caption="Small table" data={[{ name: "Aurora" }]} columns={[{ key: "name", label: "Name" }]} />
    </div>
    <SelectNativeExamples Select={Select} />
  </main>;
}

createRoot(document.getElementById("root")!).render(<Fixture />);
