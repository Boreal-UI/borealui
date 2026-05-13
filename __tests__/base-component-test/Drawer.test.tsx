import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import DrawerBase from "../../src/components/Drawer/DrawerBase";

expect.extend(toHaveNoViolations);

const classMap = {
  drawer: "drawer",
  open: "open",
  left: "left",
  right: "right",
  top: "top",
  bottom: "bottom",
  panel: "panel",
  overlay: "overlay",
  header: "header",
  headerContent: "headerContent",
  title: "title",
  body: "body",
  footer: "footer",
  closeButton: "closeButton",

  primary: "primary",
  secondary: "secondary",
  tertiary: "tertiary",
  quaternary: "quaternary",
  clear: "clear",

  glass: "glass",

  shadowNone: "shadowNone",
  shadowLight: "shadowLight",
  shadowMedium: "shadowMedium",
  shadowStrong: "shadowStrong",
  shadowIntense: "shadowIntense",

  roundNone: "roundNone",
  roundSmall: "roundSmall",
  roundMedium: "roundMedium",
  roundLarge: "roundLarge",
  roundFull: "roundFull",
};

const renderDrawer = (
  props: Partial<React.ComponentProps<typeof DrawerBase>> = {},
) => {
  const onClose = jest.fn();
  const { children = "Drawer content", ...restProps } = props;

  const result = render(
    <DrawerBase open onClose={onClose} classMap={classMap} {...restProps}>
      {children}
    </DrawerBase>,
  );

  return {
    ...result,
    onClose,
  };
};

describe("DrawerBase", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("does not render when open is false", () => {
    render(
      <DrawerBase open={false} onClose={jest.fn()} classMap={classMap}>
        Hidden drawer
      </DrawerBase>,
    );

    expect(screen.queryByTestId("drawer")).not.toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders an accessible dialog when open", async () => {
    const { container } = renderDrawer({
      title: "Menu",
    });

    const dialog = screen.getByRole("dialog", { name: "Menu" });

    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(screen.getByTestId("drawer-body")).toHaveTextContent(
      "Drawer content",
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("uses aria-label when provided", () => {
    renderDrawer({
      "aria-label": "Navigation drawer",
    });

    expect(
      screen.getByRole("dialog", { name: "Navigation drawer" }),
    ).toBeInTheDocument();
  });

  it("uses aria-labelledby when provided", () => {
    renderDrawer({
      "aria-labelledby": "custom-heading",
      children: (
        <>
          <h2 id="custom-heading">Custom labelled drawer</h2>
          <p>Drawer body</p>
        </>
      ),
    });

    const dialog = screen.getByRole("dialog", {
      name: "Custom labelled drawer",
    });

    expect(dialog).toHaveAttribute("aria-labelledby", "custom-heading");
  });

  it("passes aria-describedby to the dialog", () => {
    renderDrawer({
      "aria-label": "Help drawer",
      "aria-describedby": "drawer-description",
      children: (
        <>
          <p id="drawer-description">Extra help content.</p>
          <p>Drawer body</p>
        </>
      ),
    });

    expect(screen.getByRole("dialog")).toHaveAttribute(
      "aria-describedby",
      "drawer-description",
    );
  });

  it("renders title with generated labelledby when title is provided", () => {
    renderDrawer({
      title: "Settings",
    });

    const dialog = screen.getByRole("dialog", { name: "Settings" });
    const title = screen.getByTestId("drawer-title");

    expect(title).toHaveTextContent("Settings");
    expect(title).toHaveAttribute("id");
    expect(dialog).toHaveAttribute("aria-labelledby", title.id);
  });

  it("renders custom header instead of generated title", () => {
    renderDrawer({
      title: "Generated title",
      header: <div data-testid="custom-header">Custom header</div>,
    });

    expect(screen.getByTestId("custom-header")).toHaveTextContent(
      "Custom header",
    );
    expect(screen.queryByTestId("drawer-title")).not.toBeInTheDocument();
  });

  it("renders footer when provided", () => {
    renderDrawer({
      footer: <button type="button">Save</button>,
    });

    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("calls onClose when the close button is clicked", () => {
    const { onClose } = renderDrawer({
      title: "Closable drawer",
    });

    fireEvent.click(screen.getByTestId("drawer-close"));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when overlay is clicked by default", () => {
    const { onClose } = renderDrawer();

    fireEvent.click(screen.getByTestId("drawer-overlay"));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not call onClose when overlay is clicked and closeOnOverlayClick is false", () => {
    const { onClose } = renderDrawer({
      closeOnOverlayClick: false,
    });

    fireEvent.click(screen.getByTestId("drawer-overlay"));

    expect(onClose).not.toHaveBeenCalled();
  });

  it("calls onClose when Escape is pressed by default", () => {
    const { onClose } = renderDrawer();

    fireEvent.keyDown(document, { key: "Escape" });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not call onClose on Escape when closeOnEscape is false", () => {
    const { onClose } = renderDrawer({
      closeOnEscape: false,
    });

    fireEvent.keyDown(document, { key: "Escape" });

    expect(onClose).not.toHaveBeenCalled();
  });

  it("does not call onClose for non-Escape keys", () => {
    const { onClose } = renderDrawer();

    fireEvent.keyDown(document, { key: "Enter" });

    expect(onClose).not.toHaveBeenCalled();
  });

  it("focuses the close button when opened", () => {
    renderDrawer();

    expect(screen.getByTestId("drawer-close")).toHaveFocus();
  });

  it("restores focus to the previously focused element when closed", () => {
    const onClose = jest.fn();

    const { rerender } = render(
      <>
        <button type="button" data-testid="trigger">
          Open drawer
        </button>
        <DrawerBase open={false} onClose={onClose} classMap={classMap}>
          Drawer content
        </DrawerBase>
      </>,
    );

    const trigger = screen.getByTestId("trigger");
    trigger.focus();

    expect(trigger).toHaveFocus();

    rerender(
      <>
        <button type="button" data-testid="trigger">
          Open drawer
        </button>
        <DrawerBase open onClose={onClose} classMap={classMap}>
          Drawer content
        </DrawerBase>
      </>,
    );

    expect(screen.getByTestId("drawer-close")).toHaveFocus();

    rerender(
      <>
        <button type="button" data-testid="trigger">
          Open drawer
        </button>
        <DrawerBase open={false} onClose={onClose} classMap={classMap}>
          Drawer content
        </DrawerBase>
      </>,
    );

    expect(screen.getByTestId("trigger")).toHaveFocus();
  });

  it("uses testId before data-testid", () => {
    renderDrawer({
      testId: "custom-drawer",
      "data-testid": "ignored-drawer",
    });

    expect(screen.getByTestId("custom-drawer")).toBeInTheDocument();
    expect(screen.getByTestId("custom-drawer-panel")).toBeInTheDocument();
    expect(screen.getByTestId("custom-drawer-close")).toBeInTheDocument();
    expect(screen.queryByTestId("ignored-drawer")).not.toBeInTheDocument();
  });

  it("uses data-testid when testId is not provided", () => {
    renderDrawer({
      "data-testid": "data-drawer",
    });

    expect(screen.getByTestId("data-drawer")).toBeInTheDocument();
    expect(screen.getByTestId("data-drawer-panel")).toBeInTheDocument();
    expect(screen.getByTestId("data-drawer-body")).toBeInTheDocument();
  });

  it("applies placement, theme, glass, shadow, rounding, and custom classes", () => {
    renderDrawer({
      placement: "left",
      theme: "secondary",
      glass: true,
      shadow: "strong",
      rounding: "large",
      className: "custom-root",
      overlayClassName: "custom-overlay",
      panelClassName: "custom-panel",
      headerClassName: "custom-header",
      titleClassName: "custom-title",
      bodyClassName: "custom-body",
      footerClassName: "custom-footer",
      closeButtonClassName: "custom-close",
      title: "Styled drawer",
      footer: <div>Footer content</div>,
    });

    expect(screen.getByTestId("drawer")).toHaveClass(
      "drawer",
      "open",
      "left",
      "custom-root",
    );

    expect(screen.getByTestId("drawer-overlay")).toHaveClass(
      "overlay",
      "custom-overlay",
    );

    expect(screen.getByTestId("drawer-panel")).toHaveClass(
      "panel",
      "secondary",
      "glass",
      "shadowStrong",
      "roundLarge",
      "custom-panel",
    );

    expect(screen.getByTestId("drawer-title")).toHaveClass(
      "title",
      "custom-title",
    );

    expect(screen.getByTestId("drawer-body")).toHaveClass(
      "body",
      "custom-body",
    );

    expect(screen.getByTestId("drawer-close")).toHaveClass(
      "closeButton",
      "custom-close",
    );

    expect(screen.getByText("Footer content").parentElement).toHaveClass(
      "footer",
      "custom-footer",
    );
  });

  it("does not apply glass, shadow, or rounding modifier classes when disabled", () => {
    renderDrawer({
      glass: false,
      shadow: "none",
      rounding: "none",
    });

    const panel = screen.getByTestId("drawer-panel");

    expect(panel).not.toHaveClass("glass");
    expect(panel).toHaveClass("shadowNone");
    expect(panel).toHaveClass("roundNone");
  });

  it("uses the custom close button aria label for both overlay and close button", () => {
    renderDrawer({
      closeButtonAriaLabel: "Dismiss navigation drawer",
    });

    expect(
      screen.getAllByRole("button", { name: "Dismiss navigation drawer" }),
    ).toHaveLength(2);
  });

  it("removes the keydown listener when unmounted", () => {
    const onClose = jest.fn();

    const { unmount } = render(
      <DrawerBase open onClose={onClose} classMap={classMap}>
        Drawer content
      </DrawerBase>,
    );

    unmount();

    fireEvent.keyDown(document, { key: "Escape" });

    expect(onClose).not.toHaveBeenCalled();
  });
});
