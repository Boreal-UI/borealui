import React from "react";
import BaseDropdown from "../DropdownBase";
import { DropdownProps } from "../Dropdown.types";
import IconButton from "../../IconButton/core/IconButton";
import "./Dropdown.scss";

const classes = {
  wrapper: "dropdown",
  menu: "dropdown_menu",
  item: "dropdown_item",
  icon: "dropdown_icon",

  alignRight: "dropdown_menu_right",
  alignLeft: "dropdown_menu_left",

  primary: "dropdown_primary",
  secondary: "dropdown_secondary",
  tertiary: "dropdown_tertiary",
  quaternary: "dropdown_quaternary",
  clear: "dropdown_clear",
  success: "dropdown_success",
  error: "dropdown_error",
  warning: "dropdown_warning",
  disabled: "dropdown_disabled",
  glass: "dropdown_glass",

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

const Dropdown: React.FC<DropdownProps> = (props) => {
  return <BaseDropdown {...props} IconButton={IconButton} classMap={classes} />;
};
Dropdown.displayName = "Dropdown";
export default Dropdown;
