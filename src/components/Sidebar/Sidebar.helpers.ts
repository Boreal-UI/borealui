import type { SidebarLink } from "./Sidebar.types";

export const normalizePath = (path: string) =>
  path.endsWith("/") && path.length > 1 ? path.slice(0, -1) : path;

export const isDescendantPath = (
  parentPath: string,
  currentPath: string,
): boolean => {
  const parent = normalizePath(parentPath);
  const current = normalizePath(currentPath);

  if (parent === "/") return current === "/";
  return current === parent || current.startsWith(`${parent}/`);
};

export const isActiveRecursive = (
  link: SidebarLink,
  matcher: (link: SidebarLink) => boolean,
): boolean => {
  if (matcher(link)) return true;
  return !!link.children?.some((child) => isActiveRecursive(child, matcher));
};
