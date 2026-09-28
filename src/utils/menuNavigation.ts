export const ROOT_MENU_PANEL_PATH = "root";
export const MENU_VIEWPORT_MARGIN = 8;

export const getMenuItemPath = (parentPath: string, index: number) =>
  parentPath ? `${parentPath}.${index}` : `${index}`;

export const getParentMenuPath = (path: string): string | null => {
  const segments = path.split(".");
  return segments.length > 1 ? segments.slice(0, -1).join(".") : null;
};

export const isMenuPathOpen = (openPath: string | null, path: string) =>
  openPath === path || openPath?.startsWith(`${path}.`) === true;

export const isDisabledMenuElement = (element: HTMLElement) =>
  element.getAttribute("aria-disabled") === "true" ||
  (element instanceof HTMLButtonElement && element.disabled);

export const getWrappedMenuIndex = (index: number, itemCount: number) =>
  itemCount > 0 ? (index + itemCount) % itemCount : -1;

export type MenuNavigationIntent =
  | { type: "none" }
  | { type: "dismiss" }
  | { type: "tab-dismiss" }
  | { type: "focus"; index: number }
  | { type: "open-submenu" }
  | { type: "close-submenu" }
  | { type: "activate" };

type ResolveMenuNavigationIntentOptions = {
  key: string;
  currentIndex: number;
  itemCount: number;
  activeHasSubmenu: boolean;
  activeItemAvailable: boolean;
  isSubmenuPanel: boolean;
};

/**
 * Resolves vertical menu keyboard input without reading or mutating the DOM.
 * The owning component remains responsible for focus, submenu state, and
 * dismissal side effects.
 */
export const resolveMenuNavigationIntent = ({
  key,
  currentIndex,
  itemCount,
  activeHasSubmenu,
  activeItemAvailable,
  isSubmenuPanel,
}: ResolveMenuNavigationIntentOptions): MenuNavigationIntent => {
  switch (key) {
    case "Escape":
      return { type: "dismiss" };
    case "Tab":
      return { type: "tab-dismiss" };
    case "ArrowDown":
      return {
        type: "focus",
        index: getWrappedMenuIndex(currentIndex + 1, itemCount),
      };
    case "ArrowUp":
      return {
        type: "focus",
        index: getWrappedMenuIndex(
          currentIndex < 0 ? itemCount - 1 : currentIndex - 1,
          itemCount,
        ),
      };
    case "Home":
      return { type: "focus", index: getWrappedMenuIndex(0, itemCount) };
    case "End":
      return {
        type: "focus",
        index: getWrappedMenuIndex(itemCount - 1, itemCount),
      };
    case "ArrowRight":
      return activeHasSubmenu
        ? { type: "open-submenu" }
        : { type: "none" };
    case "ArrowLeft":
      return isSubmenuPanel
        ? { type: "close-submenu" }
        : { type: "none" };
    case "Enter":
    case " ":
      return activeItemAvailable ? { type: "activate" } : { type: "none" };
    default:
      return { type: "none" };
  }
};
