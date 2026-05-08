import { expandClassMap } from "@/utils/propAliases";
import React, { useState } from "react";
import SidebarBase from "../SidebarBase";
import "./Sidebar.scss";
import { SidebarLink, SidebarProps } from "../Sidebar.types";
import {
  isActiveRecursive,
  isDescendantPath,
  normalizePath,
} from "../Sidebar.helpers";

const classes = {
  wrapper: "sidebar",
  nav: "sidebar_nav",
  list: "sidebar_list",
  childList: "sidebar_child_list",
  item: "sidebar_item",
  link: "sidebar_link",
  childLink: "sidebar_child_link",
  active: "sidebar_active",
  icon: "sidebar_icon",

  footer: "sidebar_footer",
  footerLink: "sidebar_footer_link",
  footerVersion: "sidebar_footer_version",

  chevron: "sidebar_chevron",
  chevronOpen: "sidebar_chevron_open",

  submenu: "sidebar_submenu",
  submenuOpen: "sidebar_submenu_open",

  outline: "sidebar_outline",
  glass: "sidebar_glass",

  primary: "sidebar_primary",
  secondary: "sidebar_secondary",
  tertiary: "sidebar_tertiary",
  quaternary: "sidebar_quaternary",

  success: "sidebar_success",
  error: "sidebar_error",
  warning: "sidebar_warning",

  clear: "sidebar_clear",

  shadowNone: "sidebar_shadow-None",
  shadowLight: "sidebar_shadow-Light",
  shadowMedium: "sidebar_shadow-Medium",
  shadowStrong: "sidebar_shadow-Strong",
  shadowIntense: "sidebar_shadow-Intense",

  roundNone: "sidebar_round-None",
  roundSmall: "sidebar_round-Small",
  roundMedium: "sidebar_round-Medium",
  roundLarge: "sidebar_round-Large",
};

const getInitialPath = () =>
  typeof window !== "undefined" ? window.location.pathname || "/" : "/";

const Sidebar: React.FC<SidebarProps> = ({
  isLinkActive: consumerIsLinkActive,
  hasActiveChild: consumerHasActiveChild,
  ...props
}) => {
  const [pathname] = useState(getInitialPath);

  const defaultIsLinkActive = (link: SidebarLink): boolean => {
    if (!link.href) return false;

    if (link.children?.length) {
      return isDescendantPath(link.href, pathname);
    }

    return normalizePath(link.href) === normalizePath(pathname);
  };

  const resolvedIsLinkActive = consumerIsLinkActive ?? defaultIsLinkActive;

  const defaultHasActiveChild = (link: SidebarLink): boolean =>
    !!link.children?.some((child) =>
      isActiveRecursive(child, resolvedIsLinkActive),
    );

  const resolvedHasActiveChild =
    consumerHasActiveChild ?? defaultHasActiveChild;

  return (
    <SidebarBase
      {...props}
      classMap={expandClassMap(classes)}
      isLinkActive={resolvedIsLinkActive}
      hasActiveChild={resolvedHasActiveChild}
    />
  );
};

Sidebar.displayName = "Sidebar";
export default Sidebar;
