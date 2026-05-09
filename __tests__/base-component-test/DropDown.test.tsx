import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import BaseDropdown from "@/components/Dropdown/DropdownBase";
import { FaEllipsisV, FaUser, FaSignOutAlt, FaCog } from "react-icons/fa";
import { axe, toHaveNoViolations } from "jest-axe";
import { DummyIconButton } from "../test-utils/dummyComponents";

expect.extend(toHaveNoViolations);

const classMap = {
  wrapper: "dropdownWrapper",
  menu: "dropdownMenu",
  item: "dropdownItem",
  itemWrapper: "dropdownItemWrapper",
  icon: "dropdownIcon",
  disabled: "disabled",
  alignLeft: "alignLeft",
  alignRight: "alignRight",
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
    label: "Profile",
    icon: <FaUser />,
    onClick: jest.fn(),
    "data-testid": "dropdown-profile",
  },
  {
    label: "Logout",
    icon: <FaSignOutAlt />,
    onClick: jest.fn(),
    "data-testid": "dropdown-logout",
  },
];

const renderDropdown = (
  overrideProps: Partial<React.ComponentProps<typeof BaseDropdown>> = {},
) => {
  const items = createItems();

  const utils = render(
    <BaseDropdown
      triggerIcon={FaEllipsisV}
      items={items}
      IconButton={DummyIconButton}
      classMap={classMap}
      data-testid="dropdown"
      aria-label="More options"
      {...overrideProps}
    />,
  );

  return {
    ...utils,
    items,
  };
};

describe("BaseDropdown", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the trigger button with expected default aria attributes", () => {
    renderDropdown();

    const dropdown = screen.getByTestId("dropdown");
    const trigger = screen.getByTestId("dropdown-trigger");

    expect(dropdown).toBeInTheDocument();
    expect(dropdown).toHaveClass("dropdownWrapper");

    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-label", "More options");
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByTestId("dropdown-menu")).not.toBeInTheDocument();
  });

  it("opens the menu when the trigger is clicked", () => {
    renderDropdown();

    const trigger = screen.getByTestId("dropdown-trigger");
    fireEvent.click(trigger);

    const menu = screen.getByTestId("dropdown-menu");

    expect(menu).toBeInTheDocument();
    expect(menu).toHaveAttribute("aria-label", "More options");
    expect(menu).not.toHaveAttribute("role");
    expect(menu).not.toHaveAttribute("aria-orientation");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("renders all menu items with icons and labels when open", () => {
    renderDropdown();

    fireEvent.click(screen.getByTestId("dropdown-trigger"));

    const profile = screen.getByTestId("dropdown-profile");
    const logout = screen.getByTestId("dropdown-logout");

    expect(profile).toBeInTheDocument();
    expect(profile).toHaveTextContent("Profile");
    expect(profile.tagName).toBe("BUTTON");
    expect(profile).not.toHaveAttribute("role");

    expect(logout).toBeInTheDocument();
    expect(logout).toHaveTextContent("Logout");
    expect(logout.tagName).toBe("BUTTON");
    expect(logout).not.toHaveAttribute("role");
  });

  it("applies right alignment class by default", () => {
    renderDropdown();

    fireEvent.click(screen.getByTestId("dropdown-trigger"));

    const menu = screen.getByTestId("dropdown-menu");
    expect(menu).toHaveClass("dropdownMenu");
    expect(menu).toHaveClass("alignRight");
    expect(menu).not.toHaveClass("alignLeft");
  });

  it("applies left alignment class when align is left", () => {
    renderDropdown({ align: "left" });

    fireEvent.click(screen.getByTestId("dropdown-trigger"));

    const menu = screen.getByTestId("dropdown-menu");
    expect(menu).toHaveClass("alignLeft");
    expect(menu).not.toHaveClass("alignRight");
  });

  it("applies menu rounding, shadow, and custom class names", () => {
    renderDropdown({
      menuRounding: "medium",
      menuShadow: "light",
      menuClassName: "customMenuClass",
      theme: "primary",
      state: "success",
      glass: true,
    });

    expect(screen.getByTestId("dropdown-trigger")).toHaveAttribute(
      "data-glass",
      "true",
    );

    fireEvent.click(screen.getByTestId("dropdown-trigger"));

    const menu = screen.getByTestId("dropdown-menu");
    expect(menu).toHaveClass("dropdownMenu");
    expect(menu).toHaveClass("primary");
    expect(menu).toHaveClass("success");
    expect(menu).toHaveClass("glass");
    expect(menu).toHaveClass("roundMedium");
    expect(menu).toHaveClass("shadowLight");
    expect(menu).toHaveClass("customMenuClass");
  });

  it("calls a menu item onClick and closes the menu when a button item is clicked", () => {
    const { items } = renderDropdown();

    fireEvent.click(screen.getByTestId("dropdown-trigger"));
    fireEvent.click(screen.getByTestId("dropdown-profile"));

    expect(items[0].onClick).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId("dropdown-menu")).not.toBeInTheDocument();
  });

  it("supports href items and still calls onClick before closing", () => {
    const linkClick = jest.fn();

    renderDropdown({
      items: [
        {
          label: "Settings",
          icon: <FaCog />,
          href: "/settings",
          onClick: linkClick,
          "data-testid": "dropdown-settings",
        },
      ],
    });

    fireEvent.click(screen.getByTestId("dropdown-trigger"));

    const linkItem = screen.getByTestId("dropdown-settings");
    expect(linkItem.tagName).toBe("A");
    expect(linkItem).toHaveAttribute("href", "/settings");
    expect(linkItem).not.toHaveAttribute("role");

    fireEvent.click(linkItem);

    expect(linkClick).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId("dropdown-menu")).not.toBeInTheDocument();
  });

  it("applies target and rel to href items", () => {
    renderDropdown({
      items: [
        {
          label: "Docs",
          href: "/docs",
          target: "_blank",
          rel: "external",
          "data-testid": "dropdown-docs",
        },
      ],
    });

    fireEvent.click(screen.getByTestId("dropdown-trigger"));

    const linkItem = screen.getByTestId("dropdown-docs");
    expect(linkItem).toHaveAttribute("target", "_blank");
    expect(linkItem).toHaveAttribute("rel", "external");
  });

  it("supports trigger aria-labelledby instead of aria-label", () => {
    render(
      <>
        <span id="dropdown-trigger-label">Actions</span>
        <BaseDropdown
          triggerIcon={FaEllipsisV}
          items={createItems()}
          IconButton={DummyIconButton}
          classMap={classMap}
          data-testid="dropdown"
          aria-labelledby="dropdown-trigger-label"
        />
      </>,
    );

    const trigger = screen.getByTestId("dropdown-trigger");
    expect(trigger).toHaveAttribute(
      "aria-labelledby",
      "dropdown-trigger-label",
    );
    expect(trigger).not.toHaveAttribute("aria-label");
  });

  it("supports aria-describedby on the trigger", () => {
    render(
      <>
        <span id="dropdown-description">Opens more actions</span>
        <BaseDropdown
          triggerIcon={FaEllipsisV}
          items={createItems()}
          IconButton={DummyIconButton}
          classMap={classMap}
          data-testid="dropdown"
          aria-label="More options"
          aria-describedby="dropdown-description"
        />
      </>,
    );

    const trigger = screen.getByTestId("dropdown-trigger");
    expect(trigger).toHaveAttribute("aria-describedby", "dropdown-description");
  });

  it("supports menuAriaLabel when open", () => {
    renderDropdown({ menuAriaLabel: "Actions list" });

    fireEvent.click(screen.getByTestId("dropdown-trigger"));

    const menu = screen.getByTestId("dropdown-menu");
    expect(menu).toHaveAttribute("aria-label", "Actions list");
  });

  it("supports menuAriaLabelledby when open", () => {
    render(
      <>
        <span id="menu-label">Actions list</span>
        <BaseDropdown
          triggerIcon={FaEllipsisV}
          items={createItems()}
          IconButton={DummyIconButton}
          classMap={classMap}
          data-testid="dropdown"
          aria-label="More options"
          menuAriaLabelledby="menu-label"
        />
      </>,
    );

    fireEvent.click(screen.getByTestId("dropdown-trigger"));

    const menu = screen.getByTestId("dropdown-menu");
    expect(menu).toHaveAttribute("aria-labelledby", "menu-label");
    expect(menu).not.toHaveAttribute("aria-label");
  });

  it("supports menuAriaDescribedby when open", () => {
    render(
      <>
        <span id="menu-description">Choose an action</span>
        <BaseDropdown
          triggerIcon={FaEllipsisV}
          items={createItems()}
          IconButton={DummyIconButton}
          classMap={classMap}
          data-testid="dropdown"
          aria-label="More options"
          menuAriaDescribedby="menu-description"
        />
      </>,
    );

    fireEvent.click(screen.getByTestId("dropdown-trigger"));

    const menu = screen.getByTestId("dropdown-menu");
    expect(menu).toHaveAttribute("aria-describedby", "menu-description");
  });

  it("supports custom menuId and triggerId", () => {
    renderDropdown({
      menuId: "custom-menu-id",
      triggerId: "custom-trigger-id",
    });

    const trigger = screen.getByTestId("dropdown-trigger");
    expect(trigger).toHaveAttribute("id", "custom-trigger-id");
    expect(trigger).toHaveAttribute("aria-controls", "custom-menu-id");

    fireEvent.click(trigger);

    const menu = screen.getByTestId("dropdown-menu");
    expect(menu).toHaveAttribute("id", "custom-menu-id");
  });

  it("focuses the first enabled menu item when opened", () => {
    renderDropdown();

    fireEvent.click(screen.getByTestId("dropdown-trigger"));

    expect(screen.getByTestId("dropdown-profile")).toHaveFocus();
  });

  it("does not focus the first item when focusFirstItemOnOpen is false", () => {
    renderDropdown({ focusFirstItemOnOpen: false });

    fireEvent.click(screen.getByTestId("dropdown-trigger"));

    expect(screen.getByTestId("dropdown-profile")).not.toHaveFocus();
  });

  it("supports ArrowDown navigation and Enter activation", () => {
    const { items } = renderDropdown();

    fireEvent.click(screen.getByTestId("dropdown-trigger"));

    const wrapper = screen.getByTestId("dropdown");

    fireEvent.keyDown(wrapper, { key: "ArrowDown" });
    expect(screen.getByTestId("dropdown-logout")).toHaveFocus();

    fireEvent.keyDown(wrapper, { key: "Enter" });

    expect(items[1].onClick).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId("dropdown-menu")).not.toBeInTheDocument();
  });

  it("supports ArrowUp navigation wrapping from first item to last item", () => {
    renderDropdown();

    fireEvent.click(screen.getByTestId("dropdown-trigger"));
    fireEvent.keyDown(screen.getByTestId("dropdown"), { key: "ArrowUp" });

    expect(screen.getByTestId("dropdown-logout")).toHaveFocus();
  });

  it("supports Home and End keyboard navigation", () => {
    renderDropdown();

    fireEvent.click(screen.getByTestId("dropdown-trigger"));

    const wrapper = screen.getByTestId("dropdown");

    fireEvent.keyDown(wrapper, { key: "End" });
    expect(screen.getByTestId("dropdown-logout")).toHaveFocus();

    fireEvent.keyDown(wrapper, { key: "Home" });
    expect(screen.getByTestId("dropdown-profile")).toHaveFocus();
  });

  it("supports Space key activation for the active menu item", () => {
    const { items } = renderDropdown();

    fireEvent.click(screen.getByTestId("dropdown-trigger"));
    fireEvent.keyDown(screen.getByTestId("dropdown"), { key: " " });

    expect(items[0].onClick).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId("dropdown-menu")).not.toBeInTheDocument();
  });

  it("skips disabled items during keyboard navigation", () => {
    renderDropdown({
      items: [
        {
          label: "Profile",
          icon: <FaUser />,
          onClick: jest.fn(),
          disabled: true,
          "data-testid": "dropdown-profile",
        },
        {
          label: "Logout",
          icon: <FaSignOutAlt />,
          onClick: jest.fn(),
          "data-testid": "dropdown-logout",
        },
      ],
    });

    fireEvent.click(screen.getByTestId("dropdown-trigger"));

    expect(screen.getByTestId("dropdown-logout")).toHaveFocus();
  });

  it("does not call onClick for a disabled button item", () => {
    const clickSpy = jest.fn();

    renderDropdown({
      items: [
        {
          label: "Disabled item",
          onClick: clickSpy,
          disabled: true,
          "data-testid": "dropdown-disabled",
        },
      ],
    });

    fireEvent.click(screen.getByTestId("dropdown-trigger"));
    fireEvent.click(screen.getByTestId("dropdown-disabled"));

    expect(clickSpy).not.toHaveBeenCalled();
    expect(screen.getByTestId("dropdown-menu")).toBeInTheDocument();
  });

  it("prevents navigation for a disabled href item", () => {
    const clickSpy = jest.fn();

    renderDropdown({
      items: [
        {
          label: "Disabled link",
          href: "/disabled",
          onClick: clickSpy,
          disabled: true,
          "data-testid": "dropdown-disabled-link",
        },
      ],
    });

    fireEvent.click(screen.getByTestId("dropdown-trigger"));

    const linkItem = screen.getByTestId("dropdown-disabled-link");
    fireEvent.click(linkItem);

    expect(clickSpy).not.toHaveBeenCalled();
    expect(screen.getByTestId("dropdown-menu")).toBeInTheDocument();
    expect(linkItem).not.toHaveAttribute("href");
    expect(linkItem).toHaveAttribute("aria-disabled", "true");
  });

  it("keeps the menu open after selection when closeOnSelect is false", () => {
    const clickSpy = jest.fn();

    renderDropdown({
      closeOnSelect: false,
      items: [
        {
          label: "Profile",
          onClick: clickSpy,
          "data-testid": "dropdown-profile",
        },
      ],
    });

    fireEvent.click(screen.getByTestId("dropdown-trigger"));
    fireEvent.click(screen.getByTestId("dropdown-profile"));

    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("dropdown-menu")).toBeInTheDocument();
  });

  it("closes the menu on Escape and returns focus to the trigger", () => {
    renderDropdown();

    const trigger = screen.getByTestId("dropdown-trigger");
    fireEvent.click(trigger);

    fireEvent.keyDown(screen.getByTestId("dropdown"), { key: "Escape" });

    expect(screen.queryByTestId("dropdown-menu")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("closes the menu on Tab and returns focus to the trigger", () => {
    renderDropdown();

    const trigger = screen.getByTestId("dropdown-trigger");
    fireEvent.click(trigger);

    fireEvent.keyDown(screen.getByTestId("dropdown"), { key: "Tab" });

    expect(screen.queryByTestId("dropdown-menu")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("closes when clicking outside the dropdown", () => {
    render(
      <div>
        <button type="button" data-testid="outside-button">
          Outside
        </button>
        <BaseDropdown
          triggerIcon={FaEllipsisV}
          items={createItems()}
          IconButton={DummyIconButton}
          classMap={classMap}
          data-testid="dropdown"
          aria-label="More options"
        />
      </div>,
    );

    fireEvent.click(screen.getByTestId("dropdown-trigger"));
    expect(screen.getByTestId("dropdown-menu")).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByTestId("outside-button"));

    expect(screen.queryByTestId("dropdown-menu")).not.toBeInTheDocument();
  });

  it("does not close when clicking inside the dropdown", () => {
    renderDropdown();

    fireEvent.click(screen.getByTestId("dropdown-trigger"));
    fireEvent.mouseDown(screen.getByTestId("dropdown-menu"));

    expect(screen.getByTestId("dropdown-menu")).toBeInTheDocument();
  });

  it("does not respond to navigation keys when closed", () => {
    const { items } = renderDropdown();

    fireEvent.keyDown(screen.getByTestId("dropdown"), { key: "ArrowDown" });
    fireEvent.keyDown(screen.getByTestId("dropdown"), { key: "Enter" });

    expect(items[0].onClick).not.toHaveBeenCalled();
    expect(items[1].onClick).not.toHaveBeenCalled();
    expect(screen.queryByTestId("dropdown-menu")).not.toBeInTheDocument();
  });

  it("handles an empty items array without crashing", () => {
    renderDropdown({ items: [] });

    fireEvent.click(screen.getByTestId("dropdown-trigger"));

    expect(screen.getByTestId("dropdown-menu")).toBeInTheDocument();

    fireEvent.keyDown(screen.getByTestId("dropdown"), { key: "ArrowDown" });
    fireEvent.keyDown(screen.getByTestId("dropdown"), { key: "Enter" });

    expect(screen.getByTestId("dropdown-menu")).toBeInTheDocument();
  });

  it("passes triggerProps through to the trigger button", () => {
    renderDropdown({
      triggerProps: {
        "data-extra": "trigger-extra",
      } as React.ComponentProps<typeof BaseDropdown>["triggerProps"],
    });

    const trigger = screen.getByTestId("dropdown-trigger");
    expect(trigger).toHaveAttribute("data-extra", "trigger-extra");
  });

  it("passes menuProps through to the menu", () => {
    renderDropdown({
      menuProps: {
        "data-extra": "menu-extra",
      } as React.HTMLProps<HTMLDivElement>,
    });

    fireEvent.click(screen.getByTestId("dropdown-trigger"));

    const menu = screen.getByTestId("dropdown-menu");
    expect(menu).toHaveAttribute("data-extra", "menu-extra");
  });

  it("has no accessibility violations when closed", async () => {
    const { container } = renderDropdown();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations when open", async () => {
    const { container } = renderDropdown();

    fireEvent.click(screen.getByTestId("dropdown-trigger"));

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
