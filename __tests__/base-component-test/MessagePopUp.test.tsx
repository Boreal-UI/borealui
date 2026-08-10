import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import BaseMessagePopup from "@/components/MessagePopup/MessagePopupBase";
import { DummyButton, DummyIconButton } from "../test-utils/dummyComponents";

expect.extend(toHaveNoViolations);

const classMap = {
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
  shadowLight: "shadowLight",
  shadowMedium: "shadowMedium",
  shadowStrong: "shadowStrong",
  shadowIntense: "shadowIntense",
  roundSmall: "roundSmall",
  roundMedium: "roundMedium",
  roundLarge: "roundLarge",
  roundFull: "roundFull",
};

describe("BaseMessagePopup", () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="popup-portal"></div>';
    document.body.className = "";
  });

  afterEach(() => {
    cleanup();
    document.body.innerHTML = "";
    document.body.className = "";
    jest.clearAllMocks();
  });

  it("renders the dialog, message, and all available action buttons", async () => {
    render(
      <BaseMessagePopup
        message="Are you sure?"
        onClose={jest.fn()}
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classMap}
      />,
    );

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.getByTestId("message-popup-message")).toHaveTextContent(
      "Are you sure?",
    );
    expect(screen.getByTestId("message-popup-confirm")).toBeInTheDocument();
    expect(screen.getByTestId("message-popup-cancel")).toBeInTheDocument();
    expect(screen.getAllByTestId("message-popup-close")).toHaveLength(1);
    expect(screen.getByTestId("message-popup-actions")).toBeInTheDocument();
  });

  it("renders a title and header when title is provided", async () => {
    render(
      <BaseMessagePopup
        title="Delete item"
        message="This action cannot be undone."
        onClose={jest.fn()}
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classMap}
      />,
    );

    expect(
      await screen.findByTestId("message-popup-header"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("message-popup-title")).toHaveTextContent(
      "Delete item",
    );
    expect(
      screen.getByRole("heading", { name: "Delete item" }),
    ).toBeInTheDocument();
    expect(screen.getAllByTestId("message-popup-close")).toHaveLength(1);
  });

  it("does not render confirm or cancel buttons when handlers are not provided", async () => {
    render(
      <BaseMessagePopup
        message="Informational popup"
        onClose={jest.fn()}
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classMap}
      />,
    );

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(
      screen.queryByTestId("message-popup-confirm"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("message-popup-cancel"),
    ).not.toBeInTheDocument();
    expect(screen.getByTestId("message-popup-close")).toBeInTheDocument();
  });

  it("renders custom confirm and cancel button text", async () => {
    render(
      <BaseMessagePopup
        message="Choose an action"
        onClose={jest.fn()}
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
        confirmText="Yes, continue"
        cancelText="No, go back"
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classMap}
      />,
    );

    expect(
      await screen.findByTestId("message-popup-confirm"),
    ).toHaveTextContent("Yes, continue");
    expect(screen.getByTestId("message-popup-cancel")).toHaveTextContent(
      "No, go back",
    );
  });

  it("calls onClose when clicking the overlay", async () => {
    const onClose = jest.fn();

    render(
      <BaseMessagePopup
        message="Overlay test"
        onClose={onClose}
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classMap}
      />,
    );

    fireEvent.mouseDown(await screen.findByTestId("message-popup"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not call onClose when clicking inside the dialog content", async () => {
    const onClose = jest.fn();

    render(
      <BaseMessagePopup
        message="Inner click test"
        onClose={onClose}
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classMap}
      />,
    );

    fireEvent.click(await screen.findByTestId("message-popup-dialog"));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("calls onClose when Escape key is pressed", async () => {
    const onClose = jest.fn();

    render(
      <BaseMessagePopup
        message="Escape test"
        onClose={onClose}
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classMap}
      />,
    );

    await screen.findByRole("dialog");
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onConfirm and onCancel handlers", async () => {
    const onConfirm = jest.fn();
    const onCancel = jest.fn();

    render(
      <BaseMessagePopup
        message="Action test"
        onClose={jest.fn()}
        onConfirm={onConfirm}
        onCancel={onCancel}
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classMap}
      />,
    );

    fireEvent.click(await screen.findByTestId("message-popup-confirm"));
    fireEvent.click(screen.getByTestId("message-popup-cancel"));

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when the close button is clicked", async () => {
    const onClose = jest.fn();

    render(
      <BaseMessagePopup
        message="Close button test"
        onClose={onClose}
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classMap}
      />,
    );

    fireEvent.click(await screen.findByTestId("message-popup-close"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("focuses the confirm button on mount when confirm action exists", async () => {
    render(
      <BaseMessagePopup
        message="Focus test"
        onClose={jest.fn()}
        onConfirm={jest.fn()}
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classMap}
      />,
    );

    const confirmButton = await screen.findByTestId("message-popup-confirm");
    await waitFor(() => expect(confirmButton).toHaveFocus());
  });

  it("focuses the cancel button on mount when confirm does not exist but cancel does", async () => {
    render(
      <BaseMessagePopup
        message="Cancel focus test"
        onClose={jest.fn()}
        onCancel={jest.fn()}
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classMap}
      />,
    );

    const cancelButton = await screen.findByTestId("message-popup-cancel");
    await waitFor(() => expect(cancelButton).toHaveFocus());
  });

  it("focuses the close button on mount when no confirm or cancel buttons exist", async () => {
    render(
      <BaseMessagePopup
        message="Close focus fallback"
        onClose={jest.fn()}
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classMap}
      />,
    );

    const closeButton = await screen.findByTestId("message-popup-close");
    await waitFor(() => expect(closeButton).toHaveFocus());
  });

  it("traps focus when tabbing forward from the last focusable element", async () => {
    render(
      <BaseMessagePopup
        message="Focus trap forward"
        onClose={jest.fn()}
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classMap}
      />,
    );

    const dialog = await screen.findByTestId("message-popup-dialog");
    const closeButton = screen.getByTestId("message-popup-close");
    const cancelButton = screen.getByTestId("message-popup-cancel");

    cancelButton.focus();
    expect(cancelButton).toHaveFocus();

    fireEvent.keyDown(dialog, {
      key: "Tab",
    });

    await waitFor(() => expect(closeButton).toHaveFocus());
  });

  it("traps focus when tabbing backward from the first focusable element", async () => {
    render(
      <BaseMessagePopup
        message="Focus trap backward"
        onClose={jest.fn()}
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classMap}
      />,
    );

    const closeButton = await screen.findByTestId("message-popup-close");
    const cancelButton = screen.getByTestId("message-popup-cancel");

    closeButton.focus();
    expect(closeButton).toHaveFocus();

    fireEvent.keyDown(closeButton, {
      key: "Tab",
      shiftKey: true,
    });

    await waitFor(() => expect(cancelButton).toHaveFocus());
  });

  it("restores focus to the previously focused element on unmount", async () => {
    const trigger = document.createElement("button");
    trigger.textContent = "Open popup";
    document.body.appendChild(trigger);
    trigger.focus();

    const { unmount } = render(
      <BaseMessagePopup
        message="Restore focus test"
        onClose={jest.fn()}
        onConfirm={jest.fn()}
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classMap}
      />,
    );

    await screen.findByRole("dialog");
    unmount();

    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("adds and removes the no-scroll class on the body", async () => {
    const { unmount } = render(
      <BaseMessagePopup
        message="Scroll lock test"
        onClose={jest.fn()}
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classMap}
      />,
    );

    await screen.findByRole("dialog");
    expect(document.body).toHaveClass("no-scroll");

    unmount();
    expect(document.body).not.toHaveClass("no-scroll");
  });

  it("sets aria-hidden on sibling body elements while mounted and restores them on unmount", async () => {
    const sibling = document.createElement("div");
    sibling.setAttribute("data-testid", "outside-content");
    document.body.appendChild(sibling);

    const { unmount } = render(
      <BaseMessagePopup
        message="Aria hidden test"
        onClose={jest.fn()}
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classMap}
      />,
    );

    await screen.findByRole("dialog");
    expect(sibling).toHaveAttribute("aria-hidden", "true");

    unmount();
    expect(sibling).not.toHaveAttribute("aria-hidden");
  });

  it("applies default dialog accessibility attributes", async () => {
    render(
      <BaseMessagePopup
        message="Default accessibility"
        onClose={jest.fn()}
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classMap}
      />,
    );

    const dialog = await screen.findByRole("dialog");
    const message = screen.getByTestId("message-popup-message");

    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-describedby", message.id);
    expect(dialog).toHaveAttribute("aria-labelledby", message.id);
  });

  it("uses title id for aria-labelledby when title is provided", async () => {
    render(
      <BaseMessagePopup
        title="Warning"
        message="Proceed carefully."
        onClose={jest.fn()}
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classMap}
      />,
    );

    const dialog = await screen.findByRole("dialog");
    const title = screen.getByTestId("message-popup-title");
    const message = screen.getByTestId("message-popup-message");

    expect(dialog).toHaveAttribute("aria-labelledby", title.id);
    expect(dialog).toHaveAttribute("aria-describedby", message.id);
  });

  it("uses a custom aria-label and skips fallback aria-labelledby logic", async () => {
    render(
      <BaseMessagePopup
        message="Accessible label test"
        onClose={jest.fn()}
        aria-label="Confirmation popup"
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classMap}
      />,
    );

    const dialog = await screen.findByRole("dialog", {
      name: "Confirmation popup",
    });

    expect(dialog).toHaveAttribute("aria-label", "Confirmation popup");
    expect(dialog).not.toHaveAttribute("aria-labelledby");
  });

  it("uses custom aria-labelledby and aria-describedby values when provided", async () => {
    render(
      <>
        <h2 id="external-title">External Popup Title</h2>
        <p id="external-description">External popup description</p>

        <BaseMessagePopup
          message="Internal message"
          onClose={jest.fn()}
          aria-labelledby="external-title"
          aria-describedby="external-description"
          Button={DummyButton}
          IconButton={DummyIconButton}
          classMap={classMap}
        />
      </>,
    );

    const dialog = await screen.findByRole("dialog", {
      name: "External Popup Title",
    });

    expect(dialog).toHaveAttribute("aria-labelledby", "external-title");
    expect(dialog).toHaveAttribute("aria-describedby", "external-description");
  });

  it("applies aria-live to the message when provided", async () => {
    render(
      <BaseMessagePopup
        message="Live region message"
        onClose={jest.fn()}
        aria-live="polite"
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classMap}
      />,
    );

    expect(await screen.findByTestId("message-popup-message")).toHaveAttribute(
      "aria-live",
      "polite",
    );
  });

  it("applies a custom aria-label to the close button", async () => {
    render(
      <BaseMessagePopup
        message="Close label test"
        onClose={jest.fn()}
        aria-label-close-button="Dismiss popup"
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classMap}
      />,
    );

    expect(
      await screen.findByRole("button", { name: "Dismiss popup" }),
    ).toBeInTheDocument();
  });

  it("renders alertdialog role when dialogRole is alertdialog", async () => {
    render(
      <BaseMessagePopup
        message="Critical confirmation"
        onClose={jest.fn()}
        dialogRole="alertdialog"
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classMap}
      />,
    );

    const dialog = await screen.findByRole("alertdialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute("aria-modal", "true");
  });

  it("applies custom className, rounding, and shadow classes", async () => {
    render(
      <BaseMessagePopup
        message="Class test"
        onClose={jest.fn()}
        className="customPopupClass"
        rounding="medium"
        shadow="strong"
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classMap}
      />,
    );

    const wrapper = await screen.findByTestId("message-popup");
    expect(wrapper).toHaveClass("popupWrapper");
    expect(wrapper).toHaveClass("shadowStrong");
    expect(wrapper).toHaveClass("roundMedium");
    expect(wrapper).toHaveClass("customPopupClass");
  });

  it("applies custom class names to popup sections", async () => {
    render(
      <BaseMessagePopup
        title="Custom Popup"
        message="Class test"
        onClose={jest.fn()}
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
        contentClassName="custom-content"
        headerClassName="custom-header"
        titleClassName="custom-title"
        closeButtonClassName="custom-close"
        bodyClassName="custom-body"
        messageClassName="custom-message"
        actionsClassName="custom-actions"
        confirmButtonClassName="custom-confirm"
        cancelButtonClassName="custom-cancel"
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classMap}
      />,
    );

    expect(await screen.findByTestId("message-popup-dialog")).toHaveClass(
      "popupContent",
      "custom-content",
    );
    expect(screen.getByTestId("message-popup-header")).toHaveClass(
      "popupHeader",
      "custom-header",
    );
    expect(screen.getByTestId("message-popup-title")).toHaveClass(
      "popupTitle",
      "custom-title",
    );
    expect(screen.getByTestId("message-popup-close")).toHaveClass(
      "popupClose",
      "custom-close",
    );
    expect(screen.getByTestId("message-popup-body")).toHaveClass(
      "popupBody",
      "custom-body",
    );
    expect(screen.getByTestId("message-popup-message")).toHaveClass(
      "popupMessage",
      "custom-message",
    );
    expect(screen.getByTestId("message-popup-actions")).toHaveClass(
      "popupActions",
      "custom-actions",
    );
    expect(screen.getByTestId("message-popup-confirm")).toHaveClass(
      "popupConfirm",
      "custom-confirm",
    );
    expect(screen.getByTestId("message-popup-cancel")).toHaveClass(
      "popupCancel",
      "custom-cancel",
    );
  });

  it("uses a custom data-testid prefix", async () => {
    render(
      <BaseMessagePopup
        message="Custom test id"
        onClose={jest.fn()}
        data-testid="custom-popup"
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classMap}
      />,
    );

    expect(await screen.findByTestId("custom-popup")).toBeInTheDocument();
    expect(screen.getByTestId("custom-popup-dialog")).toBeInTheDocument();
    expect(screen.getByTestId("custom-popup-message")).toBeInTheDocument();
    expect(screen.getByTestId("custom-popup-confirm")).toBeInTheDocument();
    expect(screen.getByTestId("custom-popup-cancel")).toBeInTheDocument();
    expect(screen.getByTestId("custom-popup-close")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <BaseMessagePopup
        title="Accessibility test"
        message="Please confirm your selection."
        onClose={jest.fn()}
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classMap}
      />,
    );

    expect(await screen.findByRole("dialog")).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
