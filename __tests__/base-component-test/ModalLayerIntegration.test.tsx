import React from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import BaseModal from "@/components/Modal/ModalBase";
import BaseMessagePopup from "@/components/MessagePopup/MessagePopupBase";
import DrawerBase from "@/components/Drawer/DrawerBase";
import { DummyButton, DummyIconButton } from "../test-utils/dummyComponents";

const modalClasses = {
  overlay: "modalOverlay",
  visible: "modalVisible",
  hidden: "modalHidden",
  content: "modalContent",
  closeButton: "modalClose",
  header: "modalHeader",
  headerContent: "modalHeaderContent",
  title: "modalTitle",
  body: "modalBody",
  footer: "modalFooter",
};

const popupClasses = {
  wrapper: "popupWrapper",
  content: "popupContent",
  header: "popupHeader",
  title: "popupTitle",
  body: "popupBody",
  close: "popupClose",
  message: "popupMessage",
  actions: "popupActions",
  confirm: "popupConfirm",
  cancel: "popupCancel",
};

const drawerClasses = {
  drawer: "drawer",
  open: "drawerOpen",
  overlay: "drawerOverlay",
  panel: "drawerPanel",
  header: "drawerHeader",
  headerContent: "drawerHeaderContent",
  title: "drawerTitle",
  body: "drawerBody",
  footer: "drawerFooter",
  closeButton: "drawerClose",
  right: "drawerRight",
  primary: "drawerPrimary",
};

describe("modal layer component integration", () => {
  let originalRequestAnimationFrame: typeof window.requestAnimationFrame;

  beforeEach(() => {
    jest.useFakeTimers();
    document.body.innerHTML =
      '<div id="app-root"></div><div id="widget-portal"></div><div id="popup-portal"></div>';
    originalRequestAnimationFrame = window.requestAnimationFrame;
    window.requestAnimationFrame = (callback: FrameRequestCallback) => {
      callback(0);
      return 0;
    };
  });

  afterEach(() => {
    act(() => jest.runOnlyPendingTimers());
    jest.useRealTimers();
    window.requestAnimationFrame = originalRequestAnimationFrame;
    document.body.innerHTML = "";
  });

  it("keeps a Modal isolated when a stacked MessagePopup closes", async () => {
    const closeModal = jest.fn();
    const closePopup = jest.fn();
    const trigger = document.createElement("button");
    trigger.textContent = "Open modal";
    document.getElementById("app-root")?.appendChild(trigger);
    trigger.focus();

    const modal = (
      <BaseModal
        open
        title="Base layer"
        onClose={closeModal}
        IconButton={DummyIconButton}
        classMap={modalClasses}
      >
        <button type="button">Open confirmation</button>
      </BaseModal>
    );

    const { rerender, unmount } = render(modal);
    const innerTrigger = await screen.findByRole("button", {
      name: "Open confirmation",
    });
    innerTrigger.focus();

    rerender(
      <>
        {modal}
        <BaseMessagePopup
          title="Confirmation"
          message="Continue?"
          onClose={closePopup}
          onConfirm={jest.fn()}
          Button={DummyButton}
          IconButton={DummyIconButton}
          classMap={popupClasses}
        />
      </>,
    );

    expect(
      await screen.findByRole("dialog", { name: "Confirmation" }),
    ).toBeInTheDocument();
    expect(document.getElementById("widget-portal")).toHaveAttribute("inert");
    expect(document.body).toHaveClass("noScroll");

    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    expect(closePopup).toHaveBeenCalledTimes(1);
    expect(closeModal).not.toHaveBeenCalled();

    rerender(modal);
    await waitFor(() => expect(innerTrigger).toHaveFocus());
    expect(document.getElementById("widget-portal")).not.toHaveAttribute(
      "inert",
    );
    expect(document.body).toHaveClass("noScroll");
    expect(document.getElementById("app-root")).toHaveAttribute("inert");

    unmount();
    await Promise.resolve();
    expect(document.body).not.toHaveClass("noScroll");
    expect(document.getElementById("app-root")).not.toHaveAttribute("inert");
  });

  it("balances shared registration and cleanup under React Strict Mode", async () => {
    const background = document.getElementById("app-root");
    const trigger = document.createElement("button");
    background?.appendChild(trigger);
    trigger.focus();
    const { unmount } = render(
      <React.StrictMode>
        <DrawerBase open title="Strict drawer" onClose={jest.fn()} classMap={drawerClasses}>
          <button type="button">Drawer action</button>
        </DrawerBase>
      </React.StrictMode>,
    );

    expect(document.body).toHaveClass("noScroll");
    expect(background).toHaveAttribute("inert");
    expect(screen.getByTestId("drawer-close")).toHaveFocus();

    unmount();
    expect(document.body).not.toHaveClass("noScroll");
    expect(background).not.toHaveAttribute("inert");
    await waitFor(() => expect(trigger).toHaveFocus());
  });
});
