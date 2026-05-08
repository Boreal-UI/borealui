import { NavItem } from "./NavBar.types";

export const normalizeNavPath = (path: string) =>
  path.endsWith("/") && path.length > 1 ? path.slice(0, -1) : path;

export const isNavItemActiveForPath = (item: NavItem, pathname: string) =>
  normalizeNavPath(item.path) === normalizeNavPath(pathname);
