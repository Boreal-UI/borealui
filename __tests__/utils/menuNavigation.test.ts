import {
  getMenuItemPath,
  getParentMenuPath,
  getWrappedMenuIndex,
  isDisabledMenuElement,
  isMenuPathOpen,
  resolveMenuNavigationIntent,
} from "@/utils/menuNavigation";

describe("menuNavigation", () => {
  it("derives stable nested paths and parent relationships", () => {
    expect(getMenuItemPath("", 2)).toBe("2");
    expect(getMenuItemPath("2.4", 1)).toBe("2.4.1");
    expect(getParentMenuPath("2.4.1")).toBe("2.4");
    expect(getParentMenuPath("2")).toBeNull();
  });

  it("treats an open descendant as keeping each ancestor path open", () => {
    expect(isMenuPathOpen("2.4.1", "2")).toBe(true);
    expect(isMenuPathOpen("2.4.1", "2.4")).toBe(true);
    expect(isMenuPathOpen("2.4.1", "2.4.1")).toBe(true);
    expect(isMenuPathOpen("2.4.1", "2.5")).toBe(false);
    expect(isMenuPathOpen(null, "2")).toBe(false);
  });

  it("identifies native and ARIA-disabled menu elements", () => {
    const button = document.createElement("button");
    const link = document.createElement("a");

    expect(isDisabledMenuElement(button)).toBe(false);
    button.disabled = true;
    expect(isDisabledMenuElement(button)).toBe(true);
    link.setAttribute("aria-disabled", "true");
    expect(isDisabledMenuElement(link)).toBe(true);
  });

  it("wraps focus indexes and reports empty panels without a target", () => {
    expect(getWrappedMenuIndex(3, 3)).toBe(0);
    expect(getWrappedMenuIndex(-1, 3)).toBe(2);
    expect(getWrappedMenuIndex(1, 3)).toBe(1);
    expect(getWrappedMenuIndex(0, 0)).toBe(-1);
  });

  it.each([
    ["ArrowDown", 1, { type: "focus", index: 2 }],
    ["ArrowDown", 2, { type: "focus", index: 0 }],
    ["ArrowUp", 0, { type: "focus", index: 2 }],
    ["ArrowUp", -1, { type: "focus", index: 2 }],
    ["Home", 2, { type: "focus", index: 0 }],
    ["End", 0, { type: "focus", index: 2 }],
  ])(
    "resolves %s as vertical, wrapping focus navigation",
    (key, currentIndex, expected) => {
      expect(
        resolveMenuNavigationIntent({
          key,
          currentIndex,
          itemCount: 3,
          activeHasSubmenu: false,
          activeItemAvailable: currentIndex >= 0,
          isSubmenuPanel: false,
        }),
      ).toEqual(expected);
    },
  );

  it("only resolves horizontal arrows when a submenu relationship exists", () => {
    const common = {
      currentIndex: 0,
      itemCount: 2,
      activeItemAvailable: true,
    };

    expect(
      resolveMenuNavigationIntent({
        ...common,
        key: "ArrowRight",
        activeHasSubmenu: true,
        isSubmenuPanel: false,
      }),
    ).toEqual({ type: "open-submenu" });
    expect(
      resolveMenuNavigationIntent({
        ...common,
        key: "ArrowRight",
        activeHasSubmenu: false,
        isSubmenuPanel: false,
      }),
    ).toEqual({ type: "none" });
    expect(
      resolveMenuNavigationIntent({
        ...common,
        key: "ArrowLeft",
        activeHasSubmenu: false,
        isSubmenuPanel: true,
      }),
    ).toEqual({ type: "close-submenu" });
    expect(
      resolveMenuNavigationIntent({
        ...common,
        key: "ArrowLeft",
        activeHasSubmenu: false,
        isSubmenuPanel: false,
      }),
    ).toEqual({ type: "none" });
  });

  it("resolves activation only for an available active item", () => {
    for (const key of ["Enter", " "]) {
      expect(
        resolveMenuNavigationIntent({
          key,
          currentIndex: 0,
          itemCount: 1,
          activeHasSubmenu: false,
          activeItemAvailable: true,
          isSubmenuPanel: false,
        }),
      ).toEqual({ type: "activate" });
      expect(
        resolveMenuNavigationIntent({
          key,
          currentIndex: -1,
          itemCount: 1,
          activeHasSubmenu: false,
          activeItemAvailable: false,
          isSubmenuPanel: false,
        }),
      ).toEqual({ type: "none" });
    }
  });

  it("distinguishes full dismissal, tab dismissal, and unsupported keys", () => {
    const input = {
      currentIndex: 0,
      itemCount: 1,
      activeHasSubmenu: false,
      activeItemAvailable: true,
      isSubmenuPanel: true,
    };

    expect(resolveMenuNavigationIntent({ ...input, key: "Escape" })).toEqual({
      type: "dismiss",
    });
    expect(resolveMenuNavigationIntent({ ...input, key: "Tab" })).toEqual({
      type: "tab-dismiss",
    });
    expect(resolveMenuNavigationIntent({ ...input, key: "a" })).toEqual({
      type: "none",
    });
  });
});
