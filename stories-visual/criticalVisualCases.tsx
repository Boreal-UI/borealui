import ThemeProvider from "../src/context/ThemeContext";
import * as Core from "../src/index.core";
import * as Next from "../src/index.next";
import type { Column } from "../src/components/DataTable/DataTable.types";
import type { TreeViewNode } from "../src/components/TreeView/TreeView.types";
import {
  FaCheck,
  FaCode,
  FaEdit,
  FaExclamation,
  FaHome,
  FaInfoCircle,
  FaMusic,
} from "../shared-story-assets/icons";
import {
  getCriticalVisualCase,
  visualThemes,
  visualViewports,
  type CriticalVisualCaseId,
  type VisualImplementation,
} from "../visual-regression/criticalVisualMatrix";

const implementations = { core: Core, next: Next } as const;

type DataRow = {
  id: string;
  name: string;
  role: string;
  status: string;
};

const tableRows: DataRow[] = [
  { id: "alpha", name: "Ada Lovelace", role: "Engineer", status: "Active" },
  { id: "beta", name: "Grace Hopper", role: "Admiral", status: "Review" },
  { id: "gamma", name: "Katherine Johnson", role: "Analyst", status: "Active" },
  { id: "delta", name: "Radia Perlman", role: "Architect", status: "Paused" },
];

const tableColumns: Column<DataRow>[] = [
  { key: "name", label: "Name", sortable: true, isRowHeader: true },
  {
    key: "role",
    label: "Role",
    editable: true,
    getEditAriaLabel: (row) => `Edit role for ${row.name}`,
  },
  { key: "status", label: "Status" },
];

const treeItems: TreeViewNode[] = [
  {
    id: "workspace",
    label: "Workspace",
    children: [
      { id: "overview", label: "Overview" },
      { id: "activity", label: "Activity", disabled: true },
      {
        id: "settings",
        label: "Settings",
        children: [
          { id: "members", label: "Members" },
          { id: "billing", label: "Billing" },
        ],
      },
    ],
  },
];

const chartData = [
  { label: "Jan", value: 24 },
  { label: "Feb", value: 42 },
  { label: "Mar", value: 34 },
  { label: "Apr", value: 58 },
  { label: "May", value: 51 },
];

const renderCaseBody = (
  implementation: VisualImplementation,
  id: CriticalVisualCaseId,
) => {
  const Components = implementations[implementation];

  switch (id) {
    case "button-states":
      return (
        <div className="visualParityGrid">
          <Components.Button>Default</Components.Button>
          <Components.Button variant="outline">Outline</Components.Button>
          <Components.Button variant="glass" shadow="strong">
            Glass
          </Components.Button>
          <Components.Button disabled>Disabled</Components.Button>
          <Components.Button loading>Loading</Components.Button>
        </div>
      );

    case "button-focus-forced-colors":
      return (
        <Components.Button testId="visual-focus-target" variant="outline">
          Keyboard focus
        </Components.Button>
      );

    case "card-interaction":
      return (
        <div className="visualParityGrid">
          <Components.Card
            title="Focused action"
            description="Focus remains visible inside this elevated glass card."
            variant="glass"
            shadow="strong"
            actionButtons={[
              {
                label: "Edit card",
                icon: FaEdit,
                onClick: () => undefined,
              },
            ]}
            testId="visual-card-focus"
          />
          <Components.Card
            title="Selected card"
            description="Persistent selection and action styling."
            selectable
            selected
            onClick={() => undefined}
          />
          <Components.Card
            title="Disabled card"
            description="Unavailable content and action."
            selectable
            disabled
            onClick={() => undefined}
          />
        </div>
      );

    case "form-feedback":
      return (
        <div className="visualParityGrid">
          <Components.TextInput
            id="visual-email"
            label="Email address"
            defaultValue="invalid@example"
            helperText="Use a work email address."
            errorMessage="Enter a complete email address."
            invalid
            fullWidth
          />
          <Components.TextArea
            id="visual-notes"
            label="Review notes"
            defaultValue="This value cannot be changed."
            helperText="Notes are locked while review is pending."
            disabled
            height={112}
          />
        </div>
      );

    case "data-table-interaction": {
      const DataTable = Components.DataTable;
      return (
        <div className="visualParityStack">
          <DataTable<DataRow>
            columns={tableColumns}
            data={tableRows}
            rowKey={(row) => row.id}
            toolbarTitle="Team directory"
            selectableRows
            defaultSelectedRowKeys={["beta"]}
            pagination
            itemsPerPage={2}
            testId="visual-table"
          />
          <DataTable<DataRow>
            columns={tableColumns}
            data={tableRows.slice(0, 1)}
            rowKey={(row) => row.id}
            caption="Disabled team directory"
            state="disabled"
            testId="visual-table-disabled"
          />
        </div>
      );
    }

    case "file-upload-drag-rejected":
      return (
        <div className="visualParityGrid">
          <Components.FileUpload
            label="Drag active"
            helperText="Drop a PNG or PDF."
            allowedFileTypes={["image/png", "application/pdf"]}
            onSubmit={() => undefined}
            testId="visual-file-drag"
          />
          <Components.FileUpload
            label="Rejected file"
            helperText="Executable files are not accepted."
            allowedFileTypes={["image/png", "application/pdf"]}
            onSubmit={() => undefined}
            testId="visual-file-rejected"
          />
        </div>
      );

    case "line-chart-accessibility":
      return (
        <div className="visualParityChart">
          <Components.LineChart
            data={chartData}
            label="Monthly reliability"
            aria-label="Monthly reliability from January through May"
            units="%"
            width={480}
            height={240}
            showGrid
            showPoints
          />
        </div>
      );

    case "tree-view-states":
      return (
        <Components.TreeView
          items={treeItems}
          label="Workspace navigation"
          expandedIds={["workspace", "settings"]}
          selectedId="billing"
          testId="visual-tree"
        />
      );

    case "skeleton-reduced-motion":
      return (
        <div className="visualParityStack" aria-label="Loading content">
          <Components.Skeleton width="42%" height="2rem" rounding="medium" />
          <Components.Skeleton width="100%" height="7rem" rounding="large" />
          <Components.Skeleton width="86%" height="1rem" />
          <Components.Skeleton width="72%" height="1rem" />
        </div>
      );

    case "tabs-focus":
      return (
        <Components.Tabs
          tabs={[
            { label: "Code", icon: FaCode },
            { label: "Music", icon: FaMusic },
            { label: "Disabled", disabled: true },
          ]}
          value={1}
          aria-label="Media sections"
          idBase={`visual-tabs-${implementation}`}
          testId="visual-tabs"
        />
      );

    case "feedback-states":
      return (
        <div className="visualParityStack">
          <Components.Alert
            title="Deployment ready"
            state="success"
            icon={<FaCheck />}
          >
            The production build completed successfully.
          </Components.Alert>
          <div className="visualParityGrid">
            <Components.Badge state="warning" icon={FaExclamation}>
              Review required
            </Components.Badge>
            <Components.Badge state="error" icon={FaInfoCircle}>
              Action needed
            </Components.Badge>
          </div>
          <Components.ProgressBar
            value={68}
            label="Release readiness"
            showValue
            state="success"
            animated={false}
          />
        </div>
      );

    case "navigation-narrow":
      return (
        <div className="visualParityStack">
          <Components.NavBar
            items={[
              { icon: <FaHome />, label: "Home", path: "/" },
              { icon: <FaCode />, label: "Components", path: "/components" },
              { icon: <FaInfoCircle />, label: "About", path: "/about" },
            ]}
            isItemActive={(item) => item.path === "/components"}
            variant="glass"
            rounding="large"
            aria-label="Visual navigation"
          />
          <Components.Footer
            layout="columns"
            brandTitle="Boreal UI"
            brandDescription="Accessible components for production interfaces."
            sections={[
              {
                title: "Resources",
                links: [
                  { label: "Documentation", href: "/docs" },
                  { label: "Components", href: "/components" },
                ],
              },
            ]}
            copyright="© 2026 Boreal UI"
            copyrightInBottom
            bottomEnd="Stable channel"
            variant="glass"
          />
        </div>
      );
  }
};

export const renderCriticalVisualCase = (
  implementation: VisualImplementation,
  id: CriticalVisualCaseId,
) => {
  const visualCase = getCriticalVisualCase(id);

  return (
    <ThemeProvider
      enableThemeScript={false}
      initialSchemeName={visualThemes[visualCase.theme]}
    >
      <main className="visualParityCanvas" data-visual-case={id}>
        <h1 className="visualParityHeading">
          {implementation} · {visualCase.exportName}
        </h1>
        {renderCaseBody(implementation, id)}
      </main>
    </ThemeProvider>
  );
};

export const getVisualParameters = (id: CriticalVisualCaseId) => {
  const visualCase = getCriticalVisualCase(id);
  const modes = Object.fromEntries(
    visualCase.viewports.map((viewport) => [
      viewport,
      { viewport: visualViewports[viewport] },
    ]),
  );

  return {
    layout: "fullscreen",
    chromatic: {
      cropToViewport: true,
      modes,
      ...(visualCase.forcedColors ? { forcedColors: "active" } : {}),
      ...(visualCase.reducedMotion
        ? { prefersReducedMotion: "reduce" }
        : {}),
    },
  };
};

export const runVisualPlay = async (
  canvasElement: HTMLElement,
  id: CriticalVisualCaseId,
) => {
  if (id === "button-focus-forced-colors") {
    canvasElement
      .querySelector<HTMLElement>("[data-testid='visual-focus-target']")
      ?.focus();
  }

  if (id === "card-interaction") {
    canvasElement
      .querySelector<HTMLElement>("[aria-label='Edit card']")
      ?.focus();
  }

  if (id === "data-table-interaction") {
    canvasElement
      .querySelector<HTMLButtonElement>(
        "[data-testid='visual-table-edit-alpha-role']",
      )
      ?.click();
  }

  if (id === "file-upload-drag-rejected") {
    const rejectedInput = canvasElement.querySelector<HTMLInputElement>(
      "[data-testid='visual-file-rejected-input']",
    );
    const rejectedFile = new File(["deterministic fixture"], "blocked.exe", {
      type: "application/x-msdownload",
    });

    if (rejectedInput) {
      const transfer = new DataTransfer();
      transfer.items.add(rejectedFile);
      Object.defineProperty(rejectedInput, "files", {
        configurable: true,
        value: transfer.files,
      });
      rejectedInput.dispatchEvent(new Event("change", { bubbles: true }));
    }

    const dragTarget = canvasElement.querySelector<HTMLElement>(
      "[data-testid='visual-file-drag-wrapper']",
    );
    dragTarget?.dispatchEvent(
      new DragEvent("dragover", {
        bubbles: true,
        cancelable: true,
        dataTransfer: new DataTransfer(),
      }),
    );
  }

  if (id === "tree-view-states") {
    canvasElement.querySelector<HTMLElement>("[role='treeitem']")?.focus();
  }

  if (id === "tabs-focus") {
    canvasElement.querySelector<HTMLElement>("[role='tab']")?.focus();
  }

  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
};
