/// <reference types="cypress" />

import * as Core from "../../src/index.core";
import * as Next from "../../src/index.next";

type ComponentLibrary = Pick<
  typeof Core,
  | "Accordion"
  | "Chip"
  | "ColorPicker"
  | "DataTable"
  | "FileUpload"
  | "NotificationCenter"
  | "Pager"
  | "ProgressBar"
  | "Sidebar"
  | "Skeleton"
  | "Stepper"
  | "TagInput"
  | "Timeline"
  | "Toolbar"
>;

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

const AffectedComponents = ({ library }: { library: ComponentLibrary }) => {
  const {
    Accordion,
    Chip,
    ColorPicker,
    DataTable,
    FileUpload,
    NotificationCenter,
    Pager,
    ProgressBar,
    Sidebar,
    Skeleton,
    Stepper,
    TagInput,
    Timeline,
    Toolbar,
  } = library;

  return (
    <>
      <Accordion title="Details">Content</Accordion>
      <Chip message="Saved" visible usePortal={false} autoClose={false} />
      <ColorPicker colors={colors} value="#f00" onValueChange={noop} />
      <DataTable columns={columns} data={rows} caption="Projects" />
      <FileUpload label="Upload file" onSubmit={noop} />
      <NotificationCenter
        notifications={notifications}
        onRemove={noop}
        onClearAll={noop}
      />
      <Pager
        totalItems={30}
        itemsPerPage={10}
        currentPage={1}
        onPageChange={noop}
      />
      <ProgressBar value={70} label="Upload" description="In progress" />
      <Sidebar links={sidebarLinks} />
      <Skeleton />
      <Stepper steps={[{ label: "Details" }]} activeStep={0} />
      <TagInput tags={["React"]} onChange={noop} />
      <Timeline
        items={[{ title: "Created", description: "Project created" }]}
      />
      <Toolbar title="Project tools" />
    </>
  );
};

const assertIdentityGraph = ($root: JQuery<HTMLElement>) => {
  const ids = Array.from($root[0].querySelectorAll<HTMLElement>("[id]"), ({
    id,
  }) => id);

  expect(new Set(ids).size, "unique DOM IDs").to.equal(ids.length);

  $root[0]
    .querySelectorAll<HTMLElement>(
      "[aria-labelledby], [aria-describedby], [aria-controls]",
    )
    .forEach((element) => {
      ["aria-labelledby", "aria-describedby", "aria-controls"].forEach(
        (attribute) => {
          const collapsedPopup =
            attribute === "aria-controls" &&
            element.getAttribute("aria-expanded") === "false";

          if (collapsedPopup) return;

          element
            .getAttribute(attribute)
            ?.split(/\s+/u)
            .filter(Boolean)
            .forEach((referencedId) => {
              expect(
                ids.filter((id) => id === referencedId),
                `${attribute}=${referencedId}`,
              ).to.have.length(1);
            });
        },
      );
    });
};

const runIdentityTests = (flavor: "core" | "next", library: ComponentLibrary) => {
  it(`keeps ${flavor} component identities unique across default instances`, () => {
    cy.mount(
      <main data-testid={`${flavor}-identity-root`}>
        <section>
          <AffectedComponents library={library} />
        </section>
        <section>
          <AffectedComponents library={library} />
        </section>
      </main>,
    );

    cy.get(`[data-testid="${flavor}-identity-root"]`).then(assertIdentityGraph);
    cy.get('[data-testid="pager"]').should("have.length", 2);
    cy.get('[data-testid="file-upload"]').should("have.length", 2);
  });
};

describe("unique DOM identity", () => {
  runIdentityTests("core", Core);
  runIdentityTests("next", Next);
});
