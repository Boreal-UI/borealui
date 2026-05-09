"use client";

import { expandClassMap } from "@/utils/propAliases";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SidebarBase from "../SidebarBase";
import styles from "./Sidebar.module.scss";
import { SidebarLink, SidebarProps } from "../Sidebar.types";
import {
  isActiveRecursive,
  isDescendantPath,
  normalizePath,
} from "../Sidebar.helpers";

const Sidebar: React.FC<SidebarProps> = ({
  links,
  isLinkActive: consumerIsLinkActive,
  hasActiveChild: consumerHasActiveChild,
  ...rest
}) => {
  const pathname = usePathname() || "/";

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
      links={links}
      classMap={expandClassMap(styles)}
      LinkComponent={Link}
      isLinkActive={resolvedIsLinkActive}
      hasActiveChild={resolvedHasActiveChild}
      {...rest}
    />
  );
};

Sidebar.displayName = "Sidebar";
export default Sidebar;
