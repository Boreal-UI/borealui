import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import BaseMenu from "@/components/Menu/MenuBase";

expect.extend(toHaveNoViolations);

const classMap = {
  wrapper: "menu",
  target: "target",
  trigger: "trigger",
  triggerPlain: "triggerPlain",
  menu: "panel",
  item: "item",
  itemWrapper: "itemWrapper",
  itemContent: "itemContent",
  icon: "icon",
  label: "label",
  shortcut: "shortcut",
  separator: "separator",
  sectionLabel: "sectionLabel",
  hasSubmenu: "hasSubmenu",
  submenu: "submenu",
  submenuOpen: "submenuOpen",
  submenuTrigger: "submenuTrigger",
  submenuIndicator: "submenuIndicator",
  destructive: "destructive",
  inset: "inset",
  disabled: "disabled",
  primary: "primary",
  success: "success",
  glass: "glass",
  shadowLight: "shadowLight",
  shadowMedium: "shadowMedium",
  roundSmall: "roundSmall",
  roundMedium: "roundMedium",
};

const createItems = () => [
  {
    label: "Rename",
    shortcut: "R",
    onClick: jest.fn(),
    "data-testid": "menu-rename",
  },
  {
    type: "separator" as const,
    "data-testid": "menu-separator",
  },
  {
    label: "Delete",
    destructive: true,
    onClick: jest.fn(),
    "data-testid": "menu-delete",
  },
];

const renderMenu = (
  overrideProps: Partial<React.ComponentProps<typeof BaseMenu>> = {},
) => {
  const items = createItems();
  const utils = render(
    <BaseMenu
      items={items}
      classMap={classMap}
      data-testid="menu"
      aria-label="File actions"
      {...overrideProps}
    >
      <div>Context target</div>
    </BaseMenu>,
  );

  return { ...utils, items };
};

describe("BaseMenu", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      writable: true,
      value: jest.fn().mockImplementation((query: string) => ({
        matches: query.includes("479.98px")
          ? window.innerWidth <= 479.98
          : false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      writable: true,
      value: 1024,
    });
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      writable: true,
      value: 768,
    });
  });

  it("renders a context target without opening the menu initially", () => {
    renderMenu();

    expect(screen.getByTestId("menu")).toHaveClass("menu");
    expect(screen.getByTestId("menu-target")).toHaveTextContent(
      "Context target",
    );
    expect(screen.queryByTestId("menu-menu")).not.toBeInTheDocument();
  });

  it("opens from a contextmenu event at the requested position", async () => {
    renderMenu();

    fireEvent.contextMenu(screen.getByTestId("menu-target"), {
      clientX: 120,
      clientY: 80,
    });

    const menu = screen.getByTestId("menu-menu");
    expect(menu).toHaveAttribute("role", "menu");
    expect(menu).toHaveAttribute("aria-label", "File actions");
    expect(screen.getByTestId("menu-rename")).toHaveFocus();

    await waitFor(() => {
      expect(menu.style.left).toBe("120px");
      expect(menu.style.top).toBe("80px");
    });
  });

  it("supports trigger-based menus", () => {
    render(
      <BaseMenu
        items={createItems()}
        classMap={classMap}
        data-testid="menu"
        trigger="Actions"
      />,
    );

    const trigger = screen.getByTestId("menu-trigger");
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByTestId("menu-menu")).toBeInTheDocument();
  });

  it("uses default styling for text triggers and enhances custom trigger content directly", () => {
    const { rerender } = render(
      <BaseMenu
        items={createItems()}
        classMap={classMap}
        data-testid="menu"
        trigger="Actions"
      />,
    );

    expect(screen.getByTestId("menu-trigger")).toHaveClass("triggerPlain");

    rerender(
      <BaseMenu
        items={createItems()}
        classMap={classMap}
        data-testid="menu"
        trigger={<button type="button">Custom actions</button>}
      />,
    );

    expect(screen.getByTestId("menu-trigger")).not.toHaveClass("triggerPlain");
    expect(screen.getByTestId("menu-trigger")).toHaveTextContent(
      "Custom actions",
    );
    expect(
      screen.getByTestId("menu-trigger").querySelector("button"),
    ).not.toBeInTheDocument();
  });

  it("calls an item onClick and closes after selection", () => {
    const { items } = renderMenu();

    fireEvent.contextMenu(screen.getByTestId("menu-target"));
    fireEvent.click(screen.getByTestId("menu-rename"));

    expect(items[0].onClick).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId("menu-menu")).not.toBeInTheDocument();
  });

  it("keeps the menu open after selection when closeOnSelect is false", () => {
    const { items } = renderMenu({ closeOnSelect: false });

    fireEvent.contextMenu(screen.getByTestId("menu-target"));
    fireEvent.click(screen.getByTestId("menu-rename"));

    expect(items[0].onClick).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("menu-menu")).toBeInTheDocument();
  });

  it("renders separators, labels, shortcuts, destructive and inset classes", () => {
    renderMenu({
      items: [
        {
          type: "label",
          label: "Project",
          "data-testid": "menu-label",
        },
        {
          label: "Move",
          shortcut: "M",
          inset: true,
          "data-testid": "menu-move",
        },
        {
          type: "separator",
          "data-testid": "menu-separator",
        },
        {
          label: "Delete",
          destructive: true,
          "data-testid": "menu-delete",
        },
      ],
    });

    fireEvent.contextMenu(screen.getByTestId("menu-target"));

    expect(screen.getByTestId("menu-label")).toHaveClass("sectionLabel");
    expect(screen.getByTestId("menu-separator")).toHaveAttribute(
      "role",
      "separator",
    );
    expect(screen.getByTestId("menu-move")).toHaveClass("inset");
    expect(screen.getByTestId("menu-move")).toHaveTextContent("M");
    expect(screen.getByTestId("menu-delete")).toHaveClass("destructive");
  });

  it("supports links and disabled items", () => {
    const disabledClick = jest.fn();

    renderMenu({
      items: [
        {
          label: "Docs",
          href: "/docs",
          target: "_blank",
          "data-testid": "menu-docs",
        },
        {
          label: "Disabled",
          disabled: true,
          onClick: disabledClick,
          "data-testid": "menu-disabled",
        },
      ],
    });

    fireEvent.contextMenu(screen.getByTestId("menu-target"));

    const link = screen.getByTestId("menu-docs");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/docs");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");

    fireEvent.click(screen.getByTestId("menu-disabled"));
    expect(disabledClick).not.toHaveBeenCalled();
    expect(screen.getByTestId("menu-disabled")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("applies theme, state, glass, rounding, shadow, and custom menu classes", () => {
    renderMenu({
      theme: "primary",
      state: "success",
      glass: true,
      rounding: "medium",
      shadow: "light",
      menuClassName: "customMenu",
    });

    fireEvent.contextMenu(screen.getByTestId("menu-target"));

    expect(screen.getByTestId("menu-menu")).toHaveClass(
      "panel",
      "primary",
      "success",
      "glass",
      "roundMedium",
      "shadowLight",
      "customMenu",
    );
  });

  it("supports checkbox and radio menu item roles", () => {
    renderMenu({
      items: [
        {
          label: "Show grid",
          role: "menuitemcheckbox",
          checked: true,
          "data-testid": "menu-grid",
        },
        {
          label: "Compact",
          role: "menuitemradio",
          checked: false,
          "data-testid": "menu-compact",
        },
      ],
    });

    fireEvent.contextMenu(screen.getByTestId("menu-target"));

    expect(screen.getByTestId("menu-grid")).toHaveAttribute(
      "role",
      "menuitemcheckbox",
    );
    expect(screen.getByTestId("menu-grid")).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(screen.getByTestId("menu-compact")).toHaveAttribute(
      "role",
      "menuitemradio",
    );
  });

  it("supports keyboard navigation and activation", () => {
    const { items } = renderMenu();

    fireEvent.contextMenu(screen.getByTestId("menu-target"));

    fireEvent.keyDown(screen.getByTestId("menu"), { key: "ArrowDown" });
    expect(screen.getByTestId("menu-delete")).toHaveFocus();

    fireEvent.keyDown(screen.getByTestId("menu"), { key: "Enter" });
    expect(items[2].onClick).toHaveBeenCalledTimes(1);
  });

  it("opens with keyboard context menu keys", () => {
    renderMenu();

    fireEvent.keyDown(screen.getByTestId("menu"), {
      key: "F10",
      shiftKey: true,
    });

    expect(screen.getByTestId("menu-menu")).toBeInTheDocument();
  });

  it("opens nested submenus and supports ArrowLeft return", async () => {
    renderMenu({
      items: [
        {
          label: "Create",
          "data-testid": "menu-create",
          items: [
            {
              label: "Document",
              "data-testid": "menu-document",
            },
          ],
        },
      ],
    });

    fireEvent.contextMenu(screen.getByTestId("menu-target"));
    const create = screen.getByTestId("menu-create");
    create.focus();

    fireEvent.keyDown(screen.getByTestId("menu"), { key: "ArrowRight" });

    await waitFor(() => {
      expect(screen.getByTestId("menu-document")).toHaveFocus();
    });

    fireEvent.keyDown(screen.getByTestId("menu"), { key: "ArrowLeft" });
    expect(create).toHaveFocus();
  });

  it("does not open nested submenus from pointer hover on stacked mobile layouts", () => {
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      writable: true,
      value: 390,
    });

    renderMenu({
      items: [
        {
          label: "Settings",
          "data-testid": "menu-settings",
          items: [
            {
              label: "Advanced",
              "data-testid": "menu-advanced",
              items: [
                {
                  label: "API access",
                  "data-testid": "menu-api-access",
                  onClick: jest.fn(),
                },
              ],
            },
          ],
        },
      ],
    });

    fireEvent.contextMenu(screen.getByTestId("menu-target"));

    fireEvent.pointerOver(screen.getByTestId("menu-settings"));
    expect(screen.queryByTestId("menu-advanced")).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId("menu-settings"));
    expect(screen.getByTestId("menu-advanced")).toBeInTheDocument();

    fireEvent.pointerOver(screen.getByTestId("menu-advanced"));
    expect(screen.queryByTestId("menu-api-access")).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId("menu-advanced"));
    expect(screen.getByTestId("menu-api-access")).toBeInTheDocument();
  });

  it("closes on Escape and outside clicks", () => {
    render(
      <div>
        <button type="button" data-testid="outside">
          Outside
        </button>
        <BaseMenu items={createItems()} classMap={classMap} data-testid="menu">
          <div>Context target</div>
        </BaseMenu>
      </div>,
    );

    fireEvent.contextMenu(screen.getByTestId("menu-target"));
    fireEvent.keyDown(screen.getByTestId("menu"), { key: "Escape" });
    expect(screen.queryByTestId("menu-menu")).not.toBeInTheDocument();

    fireEvent.contextMenu(screen.getByTestId("menu-target"));
    fireEvent.mouseDown(screen.getByTestId("outside"));
    expect(screen.queryByTestId("menu-menu")).not.toBeInTheDocument();
  });

  it("has no accessibility violations when closed", async () => {
    const { container } = renderMenu();

    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no accessibility violations when open", async () => {
    const { container } = renderMenu();

    fireEvent.contextMenu(screen.getByTestId("menu-target"));

    expect(await axe(container)).toHaveNoViolations();
  });
});
