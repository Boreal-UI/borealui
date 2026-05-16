import React from "react";
import {
  act,
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import BaseModal from "@/components/Modal/ModalBase";
import { axe, toHaveNoViolations } from "jest-axe";
import { DummyIconButton } from "../test-utils/dummyComponents";

expect.extend(toHaveNoViolations);

const classMap = {
  overlay: "modalOverlay",
  visible: "modalVisible",
  hidden: "modalHidden",
  content: "modalContent",
  closeButton: "closeButton",
  closeButtonFloating: "closeButtonFloating",
  header: "modalHeader",
  headerContent: "modalHeaderContent",
  title: "modalTitle",
  body: "modalBody",
  footer: "modalFooter",
  srOnly: "sr_only",
  shadowLight: "shadowLight",
  shadowMedium: "shadowMedium",
  roundSmall: "roundSmall",
  roundMedium: "roundMedium",
};

describe("BaseModal", () => {
  const onClose = jest.fn();
  let portal: HTMLDivElement;
  let rootSibling: HTMLDivElement;
  let opener: HTMLButtonElement;
  let originalRequestAnimationFrame: typeof window.requestAnimationFrame;
  let fakeTimersActive = false;

  beforeAll(() => {
    originalRequestAnimationFrame = window.requestAnimationFrame;
    window.requestAnimationFrame = (cb: FrameRequestCallback): number => {
      cb(0);
      return 0;
    };
  });

  afterAll(() => {
    window.requestAnimationFrame = originalRequestAnimationFrame;
  });

  beforeEach(() => {
    jest.useFakeTimers();
    fakeTimersActive = true;

    onClose.mockClear();

    document.body.innerHTML = "";

    rootSibling = document.createElement("div");
    rootSibling.setAttribute("data-testid", "app-root");
    document.body.appendChild(rootSibling);

    opener = document.createElement("button");
    opener.textContent = "Open modal";
    opener.setAttribute("data-testid", "opener");
    document.body.appendChild(opener);
    opener.focus();

    portal = document.createElement("div");
    portal.setAttribute("id", "widget-portal");
    document.body.appendChild(portal);
  });

  afterEach(() => {
    if (fakeTimersActive) {
      act(() => {
        jest.runOnlyPendingTimers();
      });
      jest.useRealTimers();
      fakeTimersActive = false;
    }
    document.body.innerHTML = "";
  });

  const renderModal = (
    props: Partial<React.ComponentProps<typeof BaseModal>> = {},
  ) =>
    render(
      <BaseModal
        onClose={onClose}
        IconButton={DummyIconButton}
        classMap={classMap}
        {...props}
      >
        {props.children ?? <p>Modal content</p>}
      </BaseModal>,
    );

  it("renders the dialog with default fallback accessible name and content", async () => {
    renderModal();

    const dialog = await screen.findByRole("dialog", { name: "Modal Dialog" });

    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby");
    expect(dialog).not.toHaveAttribute("aria-label");

    const srHeading = screen.getByRole("heading", { name: "Modal Dialog" });
    expect(srHeading).toBeInTheDocument();
    expect(srHeading).toHaveClass("sr_only");

    expect(screen.getByText("Modal content")).toBeInTheDocument();
    expect(screen.getByTestId("modal")).toBeInTheDocument();
    expect(screen.getByTestId("modal-content")).toBeInTheDocument();
    expect(screen.getByTestId("modal-body")).toBeInTheDocument();
    expect(screen.getByTestId("modal-header")).toBeInTheDocument();
    expect(screen.queryByTestId("modal-footer")).not.toBeInTheDocument();
  });

  it("uses the provided title as the accessible dialog name", async () => {
    renderModal({ title: "Delete Project" });

    const dialog = await screen.findByRole("dialog", {
      name: "Delete Project",
    });
    expect(dialog).toBeInTheDocument();

    const srHeading = screen.getByRole("heading", { name: "Delete Project" });
    expect(srHeading).toBeInTheDocument();
    expect(srHeading).toHaveClass("sr_only");
  });

  it("uses ariaLabel when provided and does not require fallback heading labelling", async () => {
    renderModal({
      "aria-label": "Custom Modal Label",
    });

    const dialog = await screen.findByRole("dialog", {
      name: "Custom Modal Label",
    });

    expect(dialog).toHaveAttribute("aria-label", "Custom Modal Label");
    expect(dialog).not.toHaveAttribute("aria-labelledby");
    expect(
      screen.queryByRole("heading", { name: "Modal Dialog" }),
    ).not.toBeInTheDocument();

    expect(screen.getByTestId("modal-header")).toBeInTheDocument();
    expect(screen.getByText("Modal Dialog")).toBeInTheDocument();
  });

  it("uses aria-labelledby when provided", async () => {
    renderModal({
      "aria-labelledby": "external-modal-title",
      header: <h2 id="external-modal-title">External Header Title</h2>,
      title: undefined,
    });

    const dialog = await screen.findByRole("dialog", {
      name: "External Header Title",
    });

    expect(dialog).toHaveAttribute("aria-labelledby", "external-modal-title");
    expect(dialog).not.toHaveAttribute("aria-label");
    expect(screen.getByText("External Header Title")).toBeInTheDocument();
  });

  it("applies aria-describedby when provided", async () => {
    renderModal({
      "aria-describedby": "modal-description",
      children: (
        <>
          <p id="modal-description">This action cannot be undone.</p>
          <button>Confirm</button>
        </>
      ),
    });

    const dialog = await screen.findByRole("dialog", { name: "Modal Dialog" });
    expect(dialog).toHaveAttribute("aria-describedby", "modal-description");
    expect(
      screen.getByText("This action cannot be undone."),
    ).toBeInTheDocument();
  });

  it("uses the custom close button aria label", async () => {
    renderModal({ closeButtonAriaLabel: "Dismiss dialog" });

    const closeButton = await screen.findByRole("button", {
      name: "Dismiss dialog",
    });
    expect(closeButton).toBeInTheDocument();
    expect(closeButton).toHaveAttribute("title", "Close");
  });

  it("renders custom header and footer content", async () => {
    renderModal({
      header: <div>Custom Header Area</div>,
      footer: <button>Footer Action</button>,
    });

    expect(await screen.findByTestId("modal-header")).toBeInTheDocument();
    expect(screen.getByText("Custom Header Area")).toBeInTheDocument();
    expect(screen.getByTestId("modal-footer")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Footer Action" }),
    ).toBeInTheDocument();
  });

  it("does not render when controlled open is false", () => {
    renderModal({ open: false });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders when controlled open is true", async () => {
    renderModal({ open: true });
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  });

  it("applies rounding and shadow classes when provided", async () => {
    renderModal({
      rounding: "medium",
      shadow: "light",
      className: "customModalClass",
    });

    const content = await screen.findByTestId("modal-content");
    expect(content).toHaveClass("modalContent");
    expect(content).toHaveClass("roundMedium");
    expect(content).toHaveClass("shadowLight");
    expect(content).toHaveClass("customModalClass");
  });

  it("applies custom class names to modal sections", async () => {
    renderModal({
      footer: <button>Done</button>,
      overlayClassName: "custom-overlay",
      headerClassName: "custom-header",
      headerContentClassName: "custom-header-content",
      titleClassName: "custom-title",
      closeButtonClassName: "custom-close",
      bodyClassName: "custom-body",
      footerClassName: "custom-footer",
    });

    const overlay = await screen.findByTestId("modal");
    const header = screen.getByTestId("modal-header");
    const closeButton = screen.getByTestId("modal-close");
    const body = screen.getByTestId("modal-body");
    const footer = screen.getByTestId("modal-footer");

    expect(overlay).toHaveClass("modalOverlay", "custom-overlay");
    expect(header).toHaveClass("modalHeader", "custom-header");
    const visibleTitle = screen
      .getAllByText("Modal Dialog")
      .find((element) => element.classList.contains("modalTitle"));

    expect(visibleTitle?.parentElement).toHaveClass(
      "modalHeaderContent",
      "custom-header-content",
    );
    expect(visibleTitle).toHaveClass(
      "modalTitle",
      "custom-title",
    );
    expect(closeButton).toHaveClass("closeButton", "custom-close");
    expect(body).toHaveClass("modalBody", "custom-body");
    expect(footer).toHaveClass("modalFooter", "custom-footer");
  });

  it("calls onClose when the close button is clicked", async () => {
    renderModal();

    const closeButton = await screen.findByTestId("modal-close");
    fireEvent.click(closeButton);

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when pressing the overlay", async () => {
    renderModal();

    const overlay = await screen.findByTestId("modal");
    fireEvent.mouseDown(overlay);

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not call onClose when clicking inside modal content", async () => {
    renderModal();

    const content = await screen.findByTestId("modal-content");
    fireEvent.click(content);

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(onClose).not.toHaveBeenCalled();
  });

  it("calls onClose when Escape is pressed", async () => {
    renderModal();

    await screen.findByRole("dialog");
    fireEvent.keyDown(document, { key: "Escape" });

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("moves focus into the modal on mount", async () => {
    renderModal({
      children: (
        <>
          <button>First Action</button>
          <button>Second Action</button>
        </>
      ),
    });

    const firstButton = await screen.findByRole("button", {
      name: "Close modal",
    });
    await waitFor(() => {
      expect(firstButton).toHaveFocus();
    });
  });

  it("traps focus forward from the last focusable element to the first", async () => {
    renderModal({
      children: (
        <>
          <button>Action One</button>
          <button>Action Two</button>
        </>
      ),
    });

    const dialog = await screen.findByTestId("modal-content");
    const closeButton = await screen.findByRole("button", {
      name: "Close modal",
    });
    const actionTwo = screen.getByRole("button", { name: "Action Two" });

    actionTwo.focus();
    expect(actionTwo).toHaveFocus();

    act(() => {
      fireEvent.keyDown(dialog, {
        key: "Tab",
        code: "Tab",
        bubbles: true,
      });
    });

    await waitFor(() => {
      expect(closeButton).toHaveFocus();
    });
  });

  it("traps focus forward from the last focusable element to the first", async () => {
    renderModal({
      children: (
        <>
          <button>Action One</button>
          <button>Action Two</button>
        </>
      ),
    });

    const closeButton = await screen.findByRole("button", {
      name: "Close modal",
    });
    const actionTwo = screen.getByRole("button", { name: "Action Two" });

    actionTwo.focus();
    expect(actionTwo).toHaveFocus();

    act(() => {
      fireEvent.keyDown(actionTwo, {
        key: "Tab",
        code: "Tab",
        bubbles: true,
      });
    });

    await waitFor(() => {
      expect(closeButton).toHaveFocus();
    });
  });

  it("restores focus to the opener when the modal unmounts", async () => {
    const { rerender } = render(
      <BaseModal
        open
        onClose={onClose}
        IconButton={DummyIconButton}
        classMap={classMap}
      >
        <p>Modal content</p>
      </BaseModal>,
    );

    await screen.findByRole("dialog");
    expect(document.body.classList.contains("noScroll")).toBe(true);

    rerender(
      <BaseModal
        open={false}
        onClose={onClose}
        IconButton={DummyIconButton}
        classMap={classMap}
      >
        <p>Modal content</p>
      </BaseModal>,
    );

    act(() => {
      jest.advanceTimersByTime(200);
    });

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    expect(opener).toHaveFocus();
  });

  it("adds noScroll to the body while open and removes it on unmount", async () => {
    const { unmount } = renderModal();

    await screen.findByRole("dialog");
    expect(document.body).toHaveClass("noScroll");

    unmount();

    expect(document.body).not.toHaveClass("noScroll");
  });

  it("sets aria-hidden on body siblings while open and removes it on cleanup", async () => {
    const { unmount } = renderModal();

    await screen.findByRole("dialog");

    expect(rootSibling).toHaveAttribute("aria-hidden", "true");
    expect(opener).toHaveAttribute("aria-hidden", "true");
    expect(portal).not.toHaveAttribute("aria-hidden");

    unmount();

    expect(rootSibling).not.toHaveAttribute("aria-hidden");
    expect(opener).not.toHaveAttribute("aria-hidden");
  });

  it("renders the standard close button when aria-label is provided but the default title still creates a header", async () => {
    renderModal({
      "aria-label": "Floating Close Modal",
    });

    const closeButton = await screen.findByTestId("modal-close");
    expect(closeButton).toBeInTheDocument();
    expect(closeButton).toHaveClass("closeButton");
    expect(screen.getByTestId("modal-header")).toBeInTheDocument();
  });

  it("matches the default close button label when no custom close label is provided", async () => {
    renderModal();
    expect(
      await screen.findByRole("button", { name: "Close modal" }),
    ).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    jest.useRealTimers();
    fakeTimersActive = false;

    const { container } = render(
      <BaseModal
        onClose={onClose}
        IconButton={DummyIconButton}
        classMap={classMap}
        aria-describedby="a11y-description"
      >
        <div>
          <p id="a11y-description">Accessible modal content</p>
          <button>Proceed</button>
        </div>
      </BaseModal>,
    );

    await screen.findByRole("dialog");

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
