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
