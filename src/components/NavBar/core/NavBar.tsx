import { expandClassMap } from "@/utils/propAliases";
import React, { useEffect, useState } from "react";
import BaseNavBar from "../NavBarBase";
import "./NavBar.scss";
import { NavBarProps, NavItem } from "../NavBar.types";
import { isNavItemActiveForPath } from "../NavBar.utils";

const classes = {
  container: "nav",
  item: "nav_item",
  list: "nav_list",
  listItem: "nav_list_item",
  item_active: "nav_active",
  icon: "nav_icon_container",
  label: "nav_label",
  linkContent: "nav_link_container",

  primary: "nav_primary",
  secondary: "nav_secondary",
  tertiary: "nav_tertiary",
  quaternary: "nav_quaternary",
  clear: "nav_clear",
  glass: "nav_glass",

  shadowNone: "nav_shadow-None",
  shadowLight: "nav_shadow-Light",
  shadowMedium: "nav_shadow-Medium",
  shadowStrong: "nav_shadow-Strong",
  shadowIntense: "nav_shadow-Intense",

  roundNone: "nav_round-None",
  roundSmall: "nav_round-Small",
  roundMedium: "nav_round-Medium",
  roundLarge: "nav_round-Large",
  roundFull: "nav_round-Full",
};

const NavBar: React.FC<NavBarProps> = ({
  isItemActive: consumerIsItemActive,
  ...props
}) => {
  const [pathname, setPathname] = useState("/");

  useEffect(() => {
    setPathname(window.location.pathname || "/");
  }, []);

  const defaultIsItemActive = (item: NavItem) =>
    isNavItemActiveForPath(item, pathname);

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
        "data-testid": dataTestId,
        testId = dataTestId,
      }) => (
        <a
          href={href}
          className={className}
          aria-current={isActive ? "page" : undefined}
          data-testid={testId}
        >
          {children}
        </a>
      )}
      classMap={expandClassMap(classes)}
    />
  );
};

NavBar.displayName = "NavBar";
export default NavBar;
