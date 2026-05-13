import { expandClassMap } from "@/utils/propAliases";
import React from "react";
import BaseMenu from "../MenuBase";
import { MenuProps } from "../Menu.types";
import "./Menu.scss";

const classes = {
  wrapper: "menu",
  target: "menu_target",
  trigger: "menu_trigger",
  menu: "menu_panel",
  item: "menu_item",
  itemWrapper: "menu_itemWrapper",
  itemContent: "menu_itemContent",
  icon: "menu_icon",
  label: "menu_label",
  shortcut: "menu_shortcut",
  separator: "menu_separator",
  sectionLabel: "menu_sectionLabel",
  hasSubmenu: "menu_hasSubmenu",
  submenu: "menu_submenu",
  submenuOpen: "menu_submenu_open",
  submenuTrigger: "menu_submenuTrigger",
  submenuIndicator: "menu_submenuIndicator",
  destructive: "menu_destructive",
  inset: "menu_inset",

  primary: "menu_primary",
  secondary: "menu_secondary",
  tertiary: "menu_tertiary",
  quaternary: "menu_quaternary",
  clear: "menu_clear",
  success: "menu_success",
  info: "menu_info",
  error: "menu_error",
  warning: "menu_warning",
  disabled: "menu_disabled",
  glass: "menu_glass",

  shadowNone: "menu_shadow-None",
  shadowLight: "menu_shadow-Light",
  shadowMedium: "menu_shadow-Medium",
  shadowStrong: "menu_shadow-Strong",
  shadowIntense: "menu_shadow-Intense",

  roundNone: "menu_round-None",
  roundSmall: "menu_round-Small",
  roundMedium: "menu_round-Medium",
  roundLarge: "menu_round-Large",
};

const Menu: React.FC<MenuProps> = (props) => {
  return <BaseMenu {...props} classMap={expandClassMap(classes)} />;
};

Menu.displayName = "Menu";
export default Menu;
