"use client";

import { expandClassMap } from "@/utils/propAliases";
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
        target,
        rel,
        children,
        className,
        isActive,
        "data-testid": dataTestId,
        testId = dataTestId,
      }) => (
        <Link
          href={href}
          target={target}
          rel={rel}
          className={className}
          aria-current={isActive ? "page" : undefined}
          data-testid={testId}
        >
          {children}
        </Link>
      )}
      classMap={expandClassMap(styles)}
    />
  );
};

NavBar.displayName = "NavBar";
export default NavBar;
