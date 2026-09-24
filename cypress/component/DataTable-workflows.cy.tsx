/// <reference types="cypress" />

import { DataTable as CoreDataTable } from "../../src/index.core";
import { DataTable as NextDataTable } from "../../src/index.next";
import type { DataTableProps } from "../../src/components/DataTable/DataTable.types";

type Row = {
  id: string;
  name: string;
  status: string;
  owner: string;
};

const data: Row[] = [
  { id: "one", name: "Aurora", status: "Ready", owner: "Ada" },
  { id: "two", name: "Boreal", status: "Stable", owner: "Grace" },
  { id: "three", name: "Cascade", status: "Draft", owner: "Lin" },
];

const columns: DataTableProps<Row>["columns"] = [
  { key: "name", label: "Name", sortable: true, editable: true, width: "120px" },
  { key: "status", label: "Status", sortable: true },
  { key: "owner", label: "Owner" },
];

const implementations = [
  { name: "core", DataTable: CoreDataTable },
  { name: "next", DataTable: NextDataTable },
];

implementations.forEach(({ name, DataTable }) => {
  describe(`${name} DataTable data-heavy workflows`, () => {
    beforeEach(() => {
      cy.viewport(900, 620);
    });

    it("supports pagination, visibility, reordering, pinning, resizing, expansion, bulk actions, and editing", () => {
      const onPageChange = cy.stub().as("pageChange");
      const onColumnOrderChange = cy.stub().as("columnOrder");
      const onColumnWidthsChange = cy.stub().as("columnWidths");
      const onPinnedColumnKeysChange = cy.stub().as("pinnedColumns");
      const onCellEdit = cy.stub().as("cellEdit");

      cy.mount(
        <div style={{ padding: 24, maxWidth: 900 }}>
          <DataTable<Row>
            data={data}
            columns={columns}
            rowKey={(row) => row.id}
            selectableRows
            pagination
            itemsPerPage={1}
            onPageChange={onPageChange}
            columnVisibility
            columnReorder
            columnResize
            columnPinning
            onColumnOrderChange={onColumnOrderChange}
            onColumnWidthsChange={onColumnWidthsChange}
            onPinnedColumnKeysChange={onPinnedColumnKeysChange}
            renderExpandedRow={(row) => <div>{row.name} workflow details</div>}
            bulkActions={(keys) => (
              <button type="button">Archive {keys.length}</button>
            )}
            onCellEdit={onCellEdit}
            data-testid="workflow-table"
          />
        </div>,
      );

      cy.contains("Aurora").should("exist");
      cy.contains("Boreal").should("not.exist");
      cy.get('[data-testid="workflow-table-pagination-next"]').click();
      cy.get("@pageChange").should("have.been.calledWithMatch", 2);
      cy.contains("Boreal").should("exist");

      cy.get('[data-testid="workflow-table-column-menu"] summary').click();
      cy.get('[data-testid="workflow-table-toggle-column-owner"]').click({
        force: true,
      });
      cy.get("thead").contains("Owner").should("not.exist");
      cy.get('[data-testid="workflow-table-column-menu"] summary').click();

      cy.get('[data-testid="workflow-table-move-status-left"]').click();
      cy.get("@columnOrder").should("have.been.calledWith", [
        "status",
        "name",
        "owner",
      ]);

      cy.get('[data-testid="workflow-table-resize-status-wider"]').click();
      cy.get("@columnWidths").should("have.been.called");

      cy.get('[data-testid="workflow-table-pin-status"]').click();
      cy.get("@pinnedColumns").should("have.been.calledWith", ["status"]);

      cy.get('[data-testid="workflow-table-expand-row-two"]').click();
      cy.contains("Boreal workflow details").should("exist");

      cy.get('[data-testid="workflow-table-select-row-two"]').check({
        force: true,
      });
      cy.get('[data-testid="workflow-table-bulk-toolbar"]').should(
        "contain.text",
        "1 selected",
      );
      cy.contains("button", "Archive 1").should("exist");

      cy.get('[data-testid="workflow-table-edit-two-name"]').click();
      cy.get('[data-testid="workflow-table-editor-two-name"]')
        .clear()
        .type("Boreal Pro{enter}");
      cy.get("@cellEdit").should("have.been.calledWithMatch", "Boreal Pro");
    });

    it("renders a virtualized viewport for large data sets", () => {
      const rows = Array.from({ length: 100 }, (_, index) => ({
        id: `row-${index}`,
        name: `Row ${index}`,
        status: index % 2 ? "Ready" : "Draft",
        owner: "Ops",
      }));

      cy.mount(
        <div style={{ padding: 24, maxWidth: 900 }}>
          <DataTable<Row>
            data={rows}
            columns={columns}
            rowKey={(row) => row.id}
            virtualized
            virtualRowHeight={40}
            virtualViewportHeight={120}
            data-testid="virtual-table"
          />
        </div>,
      );

      cy.get('[data-testid="virtual-table-virtual-viewport"]').should("exist");
      cy.contains("Row 0").should("exist");
      cy.contains("Row 99").should("not.exist");
      cy.get('[data-testid="virtual-table-virtual-bottom"]').should("exist");
    });

    it("preserves fallback row identity across sorting and filtering", () => {
      const identityData: Row[] = [
        { id: "three", name: "Cascade", status: "Draft", owner: "Lin" },
        { id: "one", name: "Aurora", status: "Ready", owner: "Ada" },
        { id: "two", name: "Boreal", status: "Stable", owner: "Grace" },
      ];

      cy.mount(
        <div style={{ padding: 24, maxWidth: 900 }}>
          <DataTable<Row>
            data={identityData}
            columns={columns}
            selectableRows
            filterable
            renderExpandedRow={(row) => <div>{row.name} identity details</div>}
            bulkActions={(_keys, rows) => (
              <span data-testid="identity-selected-rows">
                {rows.map((row) => row.name).join(",")}
              </span>
            )}
            data-testid="identity-table"
          />
        </div>,
      );

      cy.get('[data-testid="identity-table-select-row-0"]').check({
        force: true,
      });
      cy.get('[data-testid="identity-table-expand-row-0"]').click();
      cy.get('[data-testid="identity-table-sort-name"]').click();

      cy.get('[data-testid="identity-table-row-0"]')
        .should("contain.text", "Cascade")
        .find('input[type="checkbox"]')
        .should("be.checked");
      cy.get('[data-testid="identity-table-expanded-row-0"]').should(
        "contain.text",
        "Cascade identity details",
      );
      cy.get('[data-testid="identity-selected-rows"]').should(
        "have.text",
        "Cascade",
      );

      cy.get('[data-testid="identity-table-filter"]').type("Cascade");
      cy.get('[data-testid="identity-table-row-0"]')
        .should("contain.text", "Cascade")
        .find('input[type="checkbox"]')
        .should("be.checked");
    });
  });
});
