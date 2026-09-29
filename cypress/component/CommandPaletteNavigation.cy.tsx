/// <reference types="cypress" />

import { useState } from "react";
import type { KeyboardEventHandler } from "react";
import * as Core from "../../src/index.core";
import * as Next from "../../src/index.next";
import type { CommandItem } from "../../src/components/CommandPalette/CommandPalette.types";
import { __resetModalLayerManagerForTests } from "../../src/utils/modalLayerManager";

type Library = Pick<typeof Core, "CommandPalette">;

type PaletteHarnessProps = {
  library: Library;
  commands: CommandItem[];
  modal?: boolean;
  trapFocus?: boolean;
  onClose?: () => void;
  onKeyDown?: KeyboardEventHandler<HTMLDivElement>;
};

const PaletteHarness = ({
  library,
  commands,
  modal = true,
  trapFocus = false,
  onClose = () => undefined,
  onKeyDown,
}: PaletteHarnessProps) => {
  const { CommandPalette } = library;
  const [open, setOpen] = useState(true);

  return (
    <>
      <button type="button" data-testid="before-palette">
        Before palette
      </button>
      <CommandPalette
        open={open}
        modal={modal}
        trapFocus={trapFocus}
        commands={commands}
        onClose={() => {
          onClose();
          setOpen(false);
        }}
        onKeyDown={onKeyDown}
        inputAriaLabel="Search commands"
        data-testid="command-palette"
      />
      <button type="button" data-testid="after-palette">
        After palette
      </button>
    </>
  );
};

const libraries: Array<["core" | "next", Library]> = [
  ["core", Core],
  ["next", Next],
];

libraries.forEach(([flavor, library]) => {
  describe(`${flavor} CommandPalette navigation`, () => {
    beforeEach(() => {
      __resetModalLayerManagerForTests();
    });

    afterEach(() => {
      __resetModalLayerManagerForTests();
    });

    it("keeps input focus while wrapping through enabled commands", () => {
      const firstAction = cy.stub().as("firstAction");
      const lastAction = cy.stub().as("lastAction");
      const onClose = cy.stub().as("paletteClose");

      cy.mount(
        <PaletteHarness
          library={library}
          onClose={onClose}
          commands={[
            { label: "Disabled first", action: cy.stub(), disabled: true },
            { id: "first", label: "First enabled", action: firstAction },
            { label: "Disabled middle", action: cy.stub(), disabled: true },
            { id: "last", label: "Last enabled", action: lastAction },
            { label: "Disabled last", action: cy.stub(), disabled: true },
          ]}
        />,
      );

      cy.get('[role="combobox"]').as("input").should("be.focused");
      cy.get('[data-testid="command-palette-option-1"]')
        .should("have.attr", "aria-selected", "true")
        .invoke("attr", "id")
        .then((activeId) => {
          cy.get("@input").should("have.attr", "aria-activedescendant", activeId);
        });

      cy.get("@input").type("{downarrow}").should("be.focused");
      cy.get('[data-testid="command-palette-option-3"]').should(
        "have.attr",
        "aria-selected",
        "true",
      );
      cy.get("@input").type("{downarrow}");
      cy.get('[data-testid="command-palette-option-1"]').should(
        "have.attr",
        "aria-selected",
        "true",
      );
      cy.get("@input").type("{uparrow}");
      cy.get('[data-testid="command-palette-option-3"]').should(
        "have.attr",
        "aria-selected",
        "true",
      );
      cy.get("@input").type("{home}");
      cy.get('[data-testid="command-palette-option-1"]').should(
        "have.attr",
        "aria-selected",
        "true",
      );
      cy.get("@input").type("{end}{enter}");

      cy.get("@firstAction").should("not.have.been.called");
      cy.get("@lastAction").should("have.been.calledOnce");
      cy.get("@paletteClose").should("have.been.calledOnce");
      cy.get('[data-testid="command-palette"]').should("not.exist");
    });

    it("preserves index-based filtering recovery and keeps Space as input", () => {
      const action = cy.stub().as("filteredAction");

      cy.mount(
        <PaletteHarness
          library={library}
          commands={[
            { label: "Alpha", action: cy.stub() },
            { label: "Beta", action },
            { label: "Theta", action: cy.stub() },
            { label: "Open project", action: cy.stub() },
          ]}
        />,
      );

      cy.get('[role="combobox"]')
        .as("input")
        .type("{downarrow}ta")
        .should("be.focused");
      cy.contains('[role="option"]', "Theta").should(
        "have.attr",
        "aria-selected",
        "true",
      );
      cy.get("@input").clear().type(" ").should("have.value", " ");
      cy.contains('[role="option"]', "Open project").should("be.visible");
      cy.get("@filteredAction").should("not.have.been.called");
    });

    it("uses modal Tab containment and modal-manager Escape dismissal", () => {
      const onClose = cy.stub().as("modalClose");
      cy.mount(
        <PaletteHarness
          library={library}
          onClose={onClose}
          commands={[{ label: "Open project", action: cy.stub() }]}
        />,
      );

      cy.get('[role="combobox"]')
        .should("be.focused")
        .trigger("keydown", { key: "Tab" })
        .should("be.focused")
        .type("{esc}");

      cy.get("@modalClose").should("have.been.calledOnce");
      cy.get('[role="dialog"]').should("not.exist");
    });

    it("preserves non-modal Tab and local Escape behavior", () => {
      const onClose = cy.stub().as("nonModalClose");
      const tabState = cy.stub().as("tabState");
      cy.mount(
        <PaletteHarness
          library={library}
          modal={false}
          onClose={onClose}
          onKeyDown={(event) => {
            if (event.key === "Tab") {
              queueMicrotask(() => {
                tabState(event.defaultPrevented);
              });
            }
          }}
          commands={[{ label: "Open project", action: cy.stub() }]}
        />,
      );

      cy.get('[role="combobox"]').trigger("keydown", { key: "Tab" });
      cy.get("@tabState").should("have.been.calledWith", false);
      cy.get('[role="combobox"]').type("{esc}");
      cy.get("@nonModalClose").should("have.been.calledOnce");
      cy.get('[role="region"]').should("not.exist");
    });

    it("honors consumer cancellation before internal navigation", () => {
      const onKeyDown = cy.stub().callsFake((event) => {
        event.preventDefault();
      });

      cy.mount(
        <PaletteHarness
          library={library}
          onKeyDown={onKeyDown}
          commands={[
            { label: "First", action: cy.stub() },
            { label: "Second", action: cy.stub() },
          ]}
        />,
      );

      cy.get('[role="combobox"]').type("{downarrow}").should("be.focused");
      cy.wrap(onKeyDown).should("have.been.called");
      cy.get('[data-testid="command-palette-option-0"]').should(
        "have.attr",
        "aria-selected",
        "true",
      );
    });
  });
});
