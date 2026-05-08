"use client";

import React from "react";
import BaseNavBar from "../NavBarBase";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./NavBar.module.scss";
import { NavBarProps, NavItem } from "../NavBar.types";
import { isNavItemActiveForPath } from "../NavBar.utils";

const NavBar: React.FC<NavBarProps & { mockPath?: string }> = ({
  mockPath,
  isItemActive: consumerIsItemActive,
  ...props
}) => {
  const pathname = usePathname();
  const resolvedPath = mockPath ?? pathname ?? "/";

  const defaultIsItemActive = (item: NavItem) =>
    isNavItemActiveForPath(item, resolvedPath);

  const resolvedIsItemActive = consumerIsItemActive ?? defaultIsItemActive;

  return (
    <BaseNavBar
      {...props}
      isItemActive={resolvedIsItemActive}
      LinkWrapper={({
        href,
        children,
        className,
        isActive,
        "data-testid": testId,
      }) => (
        <Link
          href={href}
          className={className}
          aria-current={isActive ? "page" : undefined}
          data-testid={testId}
        >
          {children}
        </Link>
      )}
      classMap={styles}
    />
  );
};

NavBar.displayName = "NavBar";
export default NavBar;
