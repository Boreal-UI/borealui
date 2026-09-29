/// <reference types="cypress" />

import { useState } from "react";
import * as Core from "../../src/index.core";
import * as Next from "../../src/index.next";
import { __resetModalLayerManagerForTests } from "../../src/utils/modalLayerManager";

type Library = Pick<
  typeof Core,
  | "Chip"
  | "ChipGroup"
  | "Modal"
  | "NotificationCenter"
  | "ScrollToTop"
  | "ToastProvider"
  | "useToast"
>;

const elementAtCenter = ($element: JQuery<HTMLElement>) => {
  const rect = $element[0].getBoundingClientRect();
  return $element[0].ownerDocument.elementFromPoint(
    rect.left + rect.width / 2,
    rect.top + rect.height / 2,
  );
};

const expectModalAtSurfaceCenter = (selector: string) => {
  cy.get(selector).should("exist").then(($surface) => {
    expect(
      elementAtCenter($surface)?.closest('[data-testid="policy-modal"]'),
      "the active modal should own the surface overlap point",
    ).not.to.equal(null);
  });
};

const ChipHarness = ({ library }: { library: Library }) => {
  const [visible, setVisible] = useState(false);
  const [closeCount, setCloseCount] = useState(0);

  return (
    <>
      <library.Modal
        open
        title="Elevation policy"
      testId="policy-modal"
      onClose={() => undefined}
    >
        <div>
          <button type="button" onClick={() => setVisible(true)}>
            Show chip
          </button>
          <output data-testid="chip-close-count">{closeCount}</output>
        </div>
      </library.Modal>
      <library.Chip
        visible={visible}
        message="Background chip"
        autoClose={false}
        testId="policy-chip"
        onClose={() => setCloseCount((count) => count + 1)}
      />
    </>
  );
};

const ChipGroupHarness = ({ library }: { library: Library }) => (
  <>
    <library.ChipGroup
      testId="policy-chip-group"
      chips={[
        {
          id: "group-chip",
          message: "Background group chip",
          visible: true,
          autoClose: false,
          "data-testid": "group-chip",
        },
      ]}
    />
    <library.Modal
      open
      title="Elevation policy"
      testId="policy-modal"
      onClose={() => undefined}
    >
      <button type="button">Modal action</button>
    </library.Modal>
  </>
);

const ToastTrigger = ({ library }: { library: Library }) => {
  const { addToast } = library.useToast();
  return (
    <library.Modal
      open
      title="Elevation policy"
      testId="policy-modal"
      onClose={() => undefined}
    >
      <button
        type="button"
        onClick={() =>
          addToast({ id: "policy", message: "Background toast", duration: 0 })
        }
      >
        Show toast
      </button>
    </library.Modal>
  );
};

const ToastHarness = ({ library }: { library: Library }) => (
  <library.ToastProvider placement="topCenter" testId="policy-toast-provider">
    <ToastTrigger library={library} />
  </library.ToastProvider>
);

const NotificationCenterHarness = ({ library }: { library: Library }) => (
  <>
    <library.NotificationCenter
      notifications={[{ id: "one", message: "Background notification" }]}
      onRemove={() => undefined}
      testId="policy-notification-center"
    />
    <library.Modal
      open
      title="Elevation policy"
      testId="policy-modal"
      onClose={() => undefined}
    >
      <button type="button" data-testid="modal-action">
        Modal action
      </button>
    </library.Modal>
  </>
);

const ScrollToTopHarness = ({ library }: { library: Library }) => (
  <>
    <div style={{ height: 1200 }} />
    <library.ScrollToTop offset={-1} testId="policy-scroll-top" />
    <library.Modal
      open
      title="Elevation policy"
      testId="policy-modal"
      onClose={() => undefined}
    >
      <button type="button" data-testid="modal-action">
        Modal action
      </button>
    </library.Modal>
  </>
);

const libraries: Array<["core" | "next", Library]> = [
  ["core", Core],
  ["next", Next],
];

libraries.forEach(([flavor, library]) => {
  describe(`${flavor} transient surface elevation policy`, () => {
    beforeEach(() => {
      __resetModalLayerManagerForTests();
      cy.document().then((documentRef) => {
        const host = documentRef.createElement("div");
        host.id = "widget-portal";
        documentRef.body.appendChild(host);
      });
    });

    afterEach(() => {
      __resetModalLayerManagerForTests();
      cy.document().then((documentRef) => {
        documentRef.getElementById("widget-portal")?.remove();
      });
    });

    it("keeps a late portaled Chip below and non-interactive through a Modal", () => {
      cy.mount(<ChipHarness library={library} />);
      cy.contains("Show chip").click();
      expectModalAtSurfaceCenter('[data-testid="policy-chip"]');

      cy.get('[data-testid="policy-chip-chip-close"]').then(($button) => {
        const painted = elementAtCenter($button);
        painted?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      });
      cy.get('[data-testid="chip-close-count"]').should("have.text", "0");
    });

    it("keeps ChipGroup notifications isolated below a Modal", () => {
      cy.mount(<ChipGroupHarness library={library} />);
      expectModalAtSurfaceCenter('[data-testid="group-chip"]');
      cy.get('[data-testid="policy-chip-group"]').parents("[inert]").should("exist");
    });

    it("keeps Toast notifications in the isolated application layer", () => {
      cy.mount(<ToastHarness library={library} />);
      cy.contains("Show toast").click();
      const toastSelector = '[data-testid="policy-toast-provider-toast-policy"]';
      expectModalAtSurfaceCenter(toastSelector);
      cy.get(toastSelector).parents("[inert]").should("exist");
      cy.get(toastSelector).parents('[aria-hidden="true"]').should("exist");
    });

    it("keeps NotificationCenter controls in the isolated application layer", () => {
      cy.mount(<NotificationCenterHarness library={library} />);
      const dismissSelector =
        '[data-testid="policy-notification-center-item-one-dismiss"]';
      expectModalAtSurfaceCenter(dismissSelector);
      cy.get(dismissSelector).parents("[inert]").should("exist");
      cy.get(dismissSelector).then(($button) => $button[0].focus());
      cy.get('[data-testid="policy-modal-content"]').then(($modal) => {
        expect($modal[0].contains(document.activeElement)).to.equal(true);
      });
    });

    it("keeps ScrollToTop below and focus-isolated by a Modal", () => {
      cy.mount(<ScrollToTopHarness library={library} />);
      const buttonSelector = '[data-testid="policy-scroll-top-button"]';
      expectModalAtSurfaceCenter(buttonSelector);
      cy.get(buttonSelector).parents("[inert]").should("exist");
      cy.get(buttonSelector).then(($button) => $button[0].focus());
      cy.get('[data-testid="policy-modal-content"]').then(($modal) => {
        expect($modal[0].contains(document.activeElement)).to.equal(true);
      });
    });
  });
});
