/// <reference types="cypress" />

import { useState } from "react";
import * as Core from "../../src/index.core";
import * as Next from "../../src/index.next";
import { __resetModalLayerManagerForTests } from "../../src/utils/modalLayerManager";

type Library = Pick<
  typeof Core,
  | "CommandPalette"
  | "Drawer"
  | "Dropdown"
  | "MessagePopup"
  | "Modal"
  | "PopOver"
  | "Tooltip"
>;

const TestIcon = () => <span aria-hidden="true">•••</span>;

const expectPaintedOnTop = (selector: string) => {
  cy.get(selector)
    .should("be.visible")
    .then(($element) => {
      const rect = $element[0].getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      cy.document().then((documentRef) => {
        const painted = documentRef.elementFromPoint(x, y);
        expect(
          painted?.closest(selector),
          `${selector} should own the overlap point`,
        ).not.to.equal(null);
      });
    });
};

const ModalToModal = ({ library }: { library: Library }) => {
  const [topOpen, setTopOpen] = useState(false);
  return (
    <>
      <library.Modal open title="Lower modal" testId="lower-modal" onClose={() => undefined}>
        <button type="button" onClick={() => setTopOpen(true)}>
          Open upper modal
        </button>
      </library.Modal>
      {topOpen ? (
        <library.Modal open title="Upper modal" testId="upper-modal" onClose={() => setTopOpen(false)}>
          <button type="button" data-testid="upper-action">Upper action</button>
        </library.Modal>
      ) : null}
    </>
  );
};

const ModalPopupOrder = ({
  library,
  popupFirst = false,
}: {
  library: Library;
  popupFirst?: boolean;
}) => {
  const [modalOpen, setModalOpen] = useState(!popupFirst);
  const [popupOpen, setPopupOpen] = useState(popupFirst);

  return (
    <>
      {modalOpen ? (
        <library.Modal open title="Layer modal" testId="layer-modal" onClose={() => setModalOpen(false)}>
          <button type="button" onClick={() => setPopupOpen(true)}>
            Open popup
          </button>
        </library.Modal>
      ) : null}
      {popupOpen ? (
        <library.MessagePopup
          title="Layer popup"
          message="Confirm visual order"
          testId="layer-popup"
          onClose={() => setPopupOpen(false)}
          onConfirm={() => undefined}
        />
      ) : null}
      {popupFirst ? (
        <button data-testid="open-modal-after-popup" type="button" onClick={() => setModalOpen(true)}>
          Open modal
        </button>
      ) : null}
    </>
  );
};

const ModalPair = ({
  library,
  lower,
  paletteModal = true,
}: {
  library: Library;
  lower: "drawer" | "palette";
  paletteModal?: boolean;
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = (
    <button type="button" data-testid="open-pair-modal" onClick={() => setModalOpen(true)}>
      Open modal
    </button>
  );

  return (
    <>
      {lower === "drawer" ? (
        <library.Drawer open title="Layer drawer" testId="layer-drawer" onClose={() => undefined}>
          {openModal}
        </library.Drawer>
      ) : (
        <library.CommandPalette
          open
          modal={paletteModal}
          testId="layer-palette"
          aria-label="Layer palette"
          inputAriaLabel="Search layers"
          commands={[]}
          onClose={() => undefined}
        />
      )}
      {lower === "palette" ? openModal : null}
      {modalOpen ? (
        <library.Modal open title="Upper modal" testId="pair-modal" onClose={() => setModalOpen(false)}>
          <button type="button">Upper action</button>
        </library.Modal>
      ) : null}
    </>
  );
};

const ModalToPalette = ({ library }: { library: Library }) => {
  const [paletteOpen, setPaletteOpen] = useState(false);
  return (
    <library.Modal open title="Lower modal" testId="palette-owner-modal" onClose={() => undefined}>
      <div>
        <button type="button" onClick={() => setPaletteOpen(true)}>
          Open upper palette
        </button>
        <library.CommandPalette
          open={paletteOpen}
          testId="upper-palette"
          aria-label="Upper command palette"
          inputAriaLabel="Search upper commands"
          commands={[]}
          onClose={() => setPaletteOpen(false)}
        />
      </div>
    </library.Modal>
  );
};

const ModalFloatingChild = ({
  library,
  child,
}: {
  library: Library;
  child: "dropdown" | "popover" | "tooltip";
}) => (
  <library.Modal open title="Floating child" testId="floating-modal" onClose={() => undefined}>
    <div>
      {child === "dropdown" ? (
        <library.Dropdown
          triggerIcon={TestIcon}
          aria-label="Open nested dropdown"
          testId="nested-dropdown"
          focusFirstItemOnOpen={false}
          items={[{ label: "Nested action" }]}
        />
      ) : null}
      {child === "popover" ? (
        <library.PopOver trigger="Open nested popover" content="Nested popover content" testId="nested-popover" />
      ) : null}
      {child === "tooltip" ? (
        <library.Tooltip content="Nested tooltip content" testId="nested-tooltip">
          <button type="button">Hover nested tooltip</button>
        </library.Tooltip>
      ) : null}
    </div>
  </library.Modal>
);

const libraries: Array<["core" | "next", Library]> = [
  ["core", Core],
  ["next", Next],
];

libraries.forEach(([flavor, library]) => {
  describe(`${flavor} visual layer order`, () => {
    beforeEach(() => __resetModalLayerManagerForTests());
    afterEach(() => {
      __resetModalLayerManagerForTests();
      cy.document().then((documentRef) => {
        documentRef.documentElement.style.removeProperty("--z-index-modal");
        documentRef
          .querySelectorAll("#widget-portal, #popup-portal")
          .forEach((portal) => portal.remove());
      });
    });

    it("paints the later Modal above the earlier Modal", () => {
      cy.mount(<ModalToModal library={library} />);
      cy.contains("Open upper modal").click();
      expectPaintedOnTop('[data-testid="upper-modal-content"]');
      cy.get('[data-testid="lower-modal"]').should("have.attr", "inert");
    });

    it("paints MessagePopup above Modal across consumer-owned portal roots", () => {
      cy.document().then((documentRef) => {
        documentRef.documentElement.style.setProperty("--z-index-modal", "12000");
        const popupHost = documentRef.createElement("div");
        popupHost.id = "popup-portal";
        documentRef.body.appendChild(popupHost);
        const widgetHost = documentRef.createElement("div");
        widgetHost.id = "widget-portal";
        documentRef.body.appendChild(widgetHost);
      });
      cy.mount(<ModalPopupOrder library={library} />);
      cy.contains("Open popup").click();
      cy.get('[data-testid="layer-popup"]').then(($popup) => {
        $popup[0].style.setProperty("--boreal-modal-layer-index", "0");
        const popupDialog = $popup[0].querySelector<HTMLElement>(
          '[data-testid="layer-popup-dialog"]',
        );
        const rect = popupDialog?.getBoundingClientRect();
        expect(rect).not.to.equal(undefined);

        cy.document().then((documentRef) => {
          const widgetHost = documentRef.getElementById("widget-portal");
          widgetHost?.removeAttribute("inert");
          const painted = documentRef.elementFromPoint(
            rect!.left + rect!.width / 2,
            rect!.top + rect!.height / 2,
          );
          expect(
            painted?.closest('[data-testid="layer-modal-content"]'),
            "equal cross-root z-index should reproduce the former DOM-order defect",
          ).not.to.equal(null);
          widgetHost?.setAttribute("inert", "");
          $popup[0].style.setProperty("--boreal-modal-layer-index", "1");
        });
      });
      cy.get('[data-testid="layer-modal"]').should("have.css", "z-index", "12000");
      cy.get('[data-testid="layer-popup"]').should("have.css", "z-index", "12001");
      cy.get('[data-testid="layer-modal"]').parents("[inert]").should("exist");
      expectPaintedOnTop('[data-testid="layer-popup-dialog"]');
      cy.get('[data-testid="layer-popup-confirm"]').click();
    });

    it("paints Modal above an earlier MessagePopup", () => {
      cy.mount(<ModalPopupOrder library={library} popupFirst />);
      cy.get('[data-testid="open-modal-after-popup"]').click({ force: true });
      expectPaintedOnTop('[data-testid="layer-modal-content"]');
    });

    it("paints Modal above Drawer", () => {
      cy.mount(<ModalPair library={library} lower="drawer" />);
      cy.get('[data-testid="open-pair-modal"]').click();
      expectPaintedOnTop('[data-testid="pair-modal-content"]');
    });

    it("paints Modal above modal CommandPalette", () => {
      cy.mount(<ModalPair library={library} lower="palette" />);
      cy.get('[data-testid="open-pair-modal"]').click({ force: true });
      expectPaintedOnTop('[data-testid="pair-modal-content"]');
    });

    it("keeps a background non-modal CommandPalette below an active Modal", () => {
      cy.mount(
        <ModalPair library={library} lower="palette" paletteModal={false} />,
      );
      cy.get('[data-testid="open-pair-modal"]').click({ force: true });
      expectPaintedOnTop('[data-testid="pair-modal-content"]');
    });

    it("paints modal CommandPalette above its owning Modal", () => {
      cy.mount(<ModalToPalette library={library} />);
      cy.contains("Open upper palette").click();
      expectPaintedOnTop('[data-testid="upper-palette"]');
    });

    it("keeps Dropdown visible over its owning Modal", () => {
      cy.mount(<ModalFloatingChild library={library} child="dropdown" />);
      cy.get('[data-testid="nested-dropdown-trigger"]').click();
      expectPaintedOnTop('[data-testid="nested-dropdown-menu"]');
    });

    it("keeps PopOver visible over its owning Modal", () => {
      cy.mount(<ModalFloatingChild library={library} child="popover" />);
      cy.get('[data-testid="nested-popover-trigger"]').click();
      expectPaintedOnTop('[data-testid="nested-popover-content"]');
    });

    it("keeps Tooltip visible over its owning Modal", () => {
      cy.mount(<ModalFloatingChild library={library} child="tooltip" />);
      cy.get('[data-testid="nested-tooltip-trigger"]').trigger("mouseover");
      expectPaintedOnTop('[data-testid="nested-tooltip"]');
    });
  });
});
