/// <reference types="cypress" />

import { useState } from "react";
import * as Core from "../../src/index.core";
import * as Next from "../../src/index.next";

type Library = Pick<
  typeof Core,
  "CommandPalette" | "Drawer" | "MessagePopup" | "Modal"
>;

const SingleModalHarness = ({ library }: { library: Library }) => {
  const { Modal } = library;
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        data-testid="background"
        type="button"
        onClick={(event) => {
          event.currentTarget.focus();
          setOpen(true);
        }}
      >
        Open modal
      </button>
      {open ? (
        <Modal open title="Keyboard modal" onClose={() => setOpen(false)}>
          <div>
            <button type="button" data-testid="modal-first">First action</button>
            <button type="button" data-testid="modal-last">Last action</button>
          </div>
        </Modal>
      ) : null}
    </>
  );
};

const DrawerHarness = ({ library }: { library: Library }) => {
  const { Drawer } = library;
  const [open, setOpen] = useState(false);

  return (
    <>
      <button data-testid="drawer-trigger" type="button" onClick={() => setOpen(true)}>
        Open drawer
      </button>
      <button data-testid="drawer-background" type="button">Background</button>
      <Drawer open={open} title="Navigation" onClose={() => setOpen(false)}>
        <button type="button" data-testid="drawer-last">Drawer action</button>
      </Drawer>
    </>
  );
};

const PaletteHarness = ({ library, modal = true }: { library: Library; modal?: boolean }) => {
  const { CommandPalette } = library;
  const [open, setOpen] = useState(false);

  return (
    <>
      <button data-testid="palette-trigger" type="button" onClick={() => setOpen(true)}>
        Open palette
      </button>
      <button data-testid="palette-background" type="button">Background</button>
      <CommandPalette
        open={open}
        modal={modal}
        trapFocus={false}
        aria-label={modal ? "Modal commands" : "Inline commands"}
        inputAriaLabel="Search commands"
        onClose={() => setOpen(false)}
        commands={[{ label: "Open project", action: () => undefined }]}
      />
    </>
  );
};

const ModalPopupStack = ({ library }: { library: Library }) => {
  const { MessagePopup, Modal } = library;
  const [modalOpen, setModalOpen] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);

  return (
    <>
      <button data-testid="stack-trigger" type="button" onClick={() => setModalOpen(true)}>
        Open base modal
      </button>
      {modalOpen ? (
        <Modal open title="Base modal" onClose={() => setModalOpen(false)}>
          <button data-testid="popup-trigger" type="button" onClick={() => setPopupOpen(true)}>
            Open popup
          </button>
        </Modal>
      ) : null}
      {popupOpen ? (
        <MessagePopup
          title="Top popup"
          message="Stacked confirmation"
          onClose={() => setPopupOpen(false)}
          onConfirm={() => undefined}
        />
      ) : null}
    </>
  );
};

const ModalModalStack = ({ library }: { library: Library }) => {
  const { Modal } = library;
  const [firstOpen, setFirstOpen] = useState(true);
  const [secondOpen, setSecondOpen] = useState(false);

  return (
    <>
      {firstOpen ? (
        <Modal open title="First modal" onClose={() => setFirstOpen(false)}>
          <button data-testid="second-modal-trigger" type="button" onClick={() => setSecondOpen(true)}>
            Open second modal
          </button>
        </Modal>
      ) : null}
      {secondOpen ? (
        <Modal open title="Second modal" onClose={() => setSecondOpen(false)}>
          <button type="button">Second action</button>
        </Modal>
      ) : null}
    </>
  );
};

const CrossComponentStack = ({ library, base }: { library: Library; base: "drawer" | "palette" }) => {
  const { CommandPalette, Drawer, Modal } = library;
  const [baseOpen, setBaseOpen] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const openTop = (
    <button data-testid="cross-modal-trigger" type="button" onClick={() => setModalOpen(true)}>
      Open top modal
    </button>
  );

  return (
    <>
      {base === "drawer" ? (
        <Drawer open={baseOpen} title="Base drawer" onClose={() => setBaseOpen(false)}>
          {openTop}
        </Drawer>
      ) : (
        <CommandPalette
          open={baseOpen}
          aria-label="Base palette"
          inputAriaLabel="Search commands"
          onClose={() => setBaseOpen(false)}
          commands={[]}
        />
      )}
      {base === "palette" ? openTop : null}
      {modalOpen ? (
        <Modal open title="Top modal" onClose={() => setModalOpen(false)}>
          <button type="button">Top action</button>
        </Modal>
      ) : null}
    </>
  );
};

const libraries: Array<["core" | "next", Library]> = [
  ["core", Core],
  ["next", Next],
];

libraries.forEach(([flavor, library]) => {
  describe(`${flavor} modal layers`, () => {
    afterEach(() => {
      cy.document().then((documentRef) => {
        documentRef.body.classList.remove("noScroll", "no-scroll");
        documentRef
          .querySelectorAll("#widget-portal, #popup-portal")
          .forEach((portal) => portal.remove());
      });
    });

    it("contains focus, closes with Escape, and restores focus", () => {
      cy.mount(<SingleModalHarness library={library} />);
      cy.get('[data-testid="background"]').click();
      cy.get('[data-testid="modal-close"]').should("be.focused");
      cy.get('[data-testid="modal-last"]')
        .focus()
        .trigger("keydown", { key: "Tab" });
      cy.get('[data-testid="modal-close"]').should("be.focused");
      cy.get('[data-testid="modal-close"]').trigger("keydown", {
        key: "Tab",
        shiftKey: true,
      });
      cy.get('[data-testid="modal-last"]').should("be.focused");
      cy.get('[data-testid="background"]').then(($background) => {
        ($background[0] as HTMLButtonElement).focus();
      });
      cy.get('[data-testid="modal-close"]').should("be.focused");
      cy.get("body").trigger("keydown", { key: "Escape" });
      cy.get('[data-testid="modal-content"]').should("not.exist");
      cy.get('[data-testid="background"]').should("be.focused");
      cy.get("body").should("not.have.class", "noScroll");
    });

    it("contains focus in a modal Drawer", () => {
      cy.mount(<DrawerHarness library={library} />);
      cy.get('[data-testid="drawer-trigger"]').click();
      cy.get('[data-testid="drawer-close"]').should("be.focused");
      cy.get('[data-testid="drawer-last"]')
        .focus()
        .trigger("keydown", { key: "Tab" });
      cy.get('[data-testid="drawer-close"]').should("be.focused");
      cy.get('[data-testid="drawer-background"]').should("have.attr", "inert");
    });

    it("matches modal and explicit non-modal CommandPalette semantics", () => {
      cy.mount(<PaletteHarness library={library} />);
      cy.get('[data-testid="palette-trigger"]').click();
      cy.get('[role="dialog"]').should("have.attr", "aria-modal", "true");
      cy.get('[data-testid="palette-background"]')
        .parents("[inert]")
        .should("exist");
      cy.get('[data-testid="palette-background"]').then(($background) => {
        ($background[0] as HTMLButtonElement).focus();
      });
      cy.get('[role="combobox"]').should("be.focused");

      cy.mount(<PaletteHarness library={library} modal={false} />);
      cy.get('[data-testid="palette-trigger"]').click();
      cy.get('[role="region"]').should("not.have.attr", "aria-modal");
      cy.get('[data-testid="palette-background"]').should("not.have.attr", "inert");
      cy.get("body").should("not.have.class", "noScroll");
      cy.get('[data-testid="palette-background"]').focus().should("be.focused");
    });

    it("keeps the lower Modal active when a MessagePopup closes", () => {
      cy.mount(<ModalPopupStack library={library} />);
      cy.get('[data-testid="stack-trigger"]').click();
      cy.get('[data-testid="popup-trigger"]').click();
      cy.get('[data-testid="message-popup-confirm"]').should("be.focused");
      cy.get("body").trigger("keydown", { key: "Escape" });
      cy.get('[data-testid="message-popup-dialog"]').should("not.exist");
      cy.get('[data-testid="modal-content"]').should("exist");
      cy.get('[data-testid="popup-trigger"]').should("be.focused");
      cy.get("body").should("have.class", "noScroll");
      cy.get("#widget-portal").should("not.have.attr", "inert");
    });
  });
});

describe("cross-component modal stacks", () => {
  it("returns ownership to the lower Modal after the top Modal closes", () => {
    cy.mount(<ModalModalStack library={Core} />);
    cy.get('[data-testid="second-modal-trigger"]').click();
    cy.get('[data-testid="modal"]')
      .first()
      .should("have.attr", "inert");
    cy.get("body").trigger("keydown", { key: "Escape" });
    cy.get('[data-testid="modal-content"]').should("have.length", 1);
    cy.get('[data-testid="second-modal-trigger"]').should("be.focused");
    cy.get("body").should("have.class", "noScroll");
  });

  it("keeps Drawer ownership coordinated when Modal is above it", () => {
    cy.mount(<CrossComponentStack library={Core} base="drawer" />);
    cy.get('[data-testid="cross-modal-trigger"]').click();
    cy.get('[data-testid="drawer"]').parents("[inert]").should("exist");
    cy.get("body").trigger("keydown", { key: "Escape" });
    cy.get('[data-testid="modal-content"]').should("not.exist");
    cy.get('[data-testid="drawer-panel"]').should("exist");
    cy.get('[data-testid="cross-modal-trigger"]').should("be.focused");
    cy.get("body").should("have.class", "noScroll");
  });

  it("keeps modal CommandPalette ownership coordinated when Modal is above it", () => {
    cy.mount(<CrossComponentStack library={Core} base="palette" />);
    cy.get('[data-testid="cross-modal-trigger"]').click({ force: true });
    cy.get('[data-testid="command-palette-overlay"]').should("have.attr", "inert");
    cy.get("body").trigger("keydown", { key: "Escape" });
    cy.get('[data-testid="modal-content"]').should("not.exist");
    cy.get('[data-testid="command-palette"]').should("exist");
    cy.get("body").should("have.class", "noScroll");
  });
});
