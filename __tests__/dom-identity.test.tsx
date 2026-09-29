import { act } from "react";
import { render, screen } from "@testing-library/react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import * as Core from "@/index.core";
import {
  CheckBox as ServerCheckBox,
  EmptyState as ServerEmptyState,
  MetricBox as ServerMetricBox,
  RadioButton as ServerRadioButton,
  RadioGroup as ServerRadioGroup,
  Select as ServerSelect,
  TextArea as ServerTextArea,
  TextInput as ServerTextInput,
  ValidationSummary as ServerValidationSummary,
} from "@/next/server";
import {
  expectResolvedIdReferences,
  expectUniqueDomIds,
} from "./test-utils/domIdentity";

const noop = () => undefined;
const colors = [
  { label: "Red", value: "#f00" },
  { label: "Blue", value: "#00f" },
];
const columns = [{ key: "name" as const, label: "Name" }];
const rows = [{ name: "Aurora" }];
const notifications = [{ id: "build", message: "Build complete" }];
const sidebarLinks = [
  {
    label: "Projects",
    children: [{ label: "Aurora", href: "/aurora" }],
  },
];
const timelineItems = [
  { title: "Created", date: "June 8", description: "Project created" },
];
const radioOptions = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
];

const AffectedCoreComponents = () => (
  <>
    <Core.Accordion title="Details">Content</Core.Accordion>
    <Core.Chip message="Saved" visible usePortal={false} autoClose={false} />
    <Core.ColorPicker colors={colors} value="#f00" onValueChange={noop} />
    <Core.DataTable columns={columns} data={rows} caption="Projects" />
    <Core.FileUpload label="Upload file" onSubmit={noop} />
    <Core.NotificationCenter
      notifications={notifications}
      onRemove={noop}
      onClearAll={noop}
    />
    <Core.Pager
      totalItems={30}
      itemsPerPage={10}
      currentPage={1}
      onPageChange={noop}
    />
    <Core.ProgressBar value={70} label="Upload" description="In progress" />
    <Core.Sidebar links={sidebarLinks} />
    <Core.Skeleton />
    <Core.Stepper steps={[{ label: "Details" }]} activeStep={0} />
    <Core.TagInput tags={["React"]} onChange={noop} />
    <Core.Timeline items={timelineItems} />
    <Core.Toolbar title="Project tools" />
  </>
);

const AffectedServerComponents = () => (
  <>
    <ServerCheckBox label="Enabled" defaultChecked />
    <ServerEmptyState title="No results" message="Try another query" />
    <ServerMetricBox title="Coverage" value="100%" subtext="Statements" />
    <ServerRadioButton label="Solo" name="solo" value="solo" />
    <ServerRadioGroup
      legend="Theme"
      name="theme"
      value="dark"
      options={radioOptions}
    />
    <ServerSelect label="Plan" options={radioOptions} />
    <ServerTextArea label="Notes" helperText="Optional" />
    <ServerTextInput label="Name" helperText="Required" />
    <ServerValidationSummary
      label="Fix these issues"
      items={[{ message: "Name is required" }]}
    />
  </>
);

const IdentityFixture = () => (
  <>
    <section data-instance="core-one">
      <AffectedCoreComponents />
    </section>
    <section data-instance="core-two">
      <AffectedCoreComponents />
    </section>
    <section data-instance="server-one">
      <AffectedServerComponents />
    </section>
    <section data-instance="server-two">
      <AffectedServerComponents />
    </section>
  </>
);

describe("unique DOM identity", () => {
  it("keeps generated IDs unique and every local ID reference resolvable", () => {
    const { container } = render(<IdentityFixture />);

    expectUniqueDomIds(container);
    expectResolvedIdReferences(container);

    expect(screen.getAllByTestId("pager")).toHaveLength(2);
    expect(screen.getAllByTestId("file-upload")).toHaveLength(2);
    expect(screen.getAllByTestId("tag-input")).toHaveLength(2);
  });

  it("preserves supported explicit ID overrides", () => {
    const { container } = render(
      <>
        <Core.Accordion id="custom-accordion" title="Details">
          Content
        </Core.Accordion>
        <Core.Chip
          id="custom-chip"
          messageId="custom-chip-message"
          message="Saved"
          visible
          usePortal={false}
          autoClose={false}
        />
        <Core.DataTable
          columns={[{ ...columns[0], id: "custom-column" }]}
          data={rows}
        />
        <Core.FileUpload id="custom-upload" label="Upload" onSubmit={noop} />
        <Core.ProgressBar
          value={50}
          label="Upload"
          labelId="custom-progress-label"
          description="Halfway"
          descriptionId="custom-progress-description"
        />
        <Core.TagInput idBase="custom-tags" tags={[]} onChange={noop} />
        <Core.Toolbar title="Tools" titleId="custom-toolbar-title" />
        <ServerTextInput id="custom-server-input" label="Name" />
        <ServerValidationSummary
          id="custom-validation"
          items={[{ message: "Invalid" }]}
        />
      </>,
    );

    const expectedIds = [
      "custom-accordion-button",
      "custom-accordion-content",
      "custom-chip-message",
      "custom-column",
      "custom-upload-input",
      "custom-progress-label",
      "custom-progress-description",
      "custom-tags-input",
      "custom-toolbar-title",
      "custom-server-input",
      "custom-validation",
    ];
    const missingIds = expectedIds.filter((id) => !document.getElementById(id));

    expect(missingIds).toEqual([]);

    expectUniqueDomIds(container);
    expectResolvedIdReferences(container);
  });

  it("hydrates the affected component tree without changing its identity graph", async () => {
    const host = document.createElement("div");
    host.innerHTML = renderToString(<IdentityFixture />);
    document.body.appendChild(host);

    const readIdentityGraph = () =>
      Array.from(host.querySelectorAll<HTMLElement>("[id]"), (element) => ({
        id: element.id,
        labelledby: element.getAttribute("aria-labelledby"),
        describedby: element.getAttribute("aria-describedby"),
        controls: element.getAttribute("aria-controls"),
      }));
    const serverGraph = readIdentityGraph();
    let root: ReturnType<typeof hydrateRoot> | undefined;

    await act(async () => {
      root = hydrateRoot(host, <IdentityFixture />);
    });

    expect(readIdentityGraph()).toEqual(serverGraph);
    expectUniqueDomIds(host);
    expectResolvedIdReferences(host);

    await act(async () => root?.unmount());
    host.remove();
  });
});
