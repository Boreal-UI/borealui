"use client";
import { expandClassMap } from "@/utils/propAliases";
import React from "react";
import BaseMenu from "../MenuBase";
import { MenuProps } from "../Menu.types";
import styles from "./Menu.module.scss";

const Menu: React.FC<MenuProps> = (props) => {
  return <BaseMenu {...props} classMap={expandClassMap(styles)} />;
};

Menu.displayName = "Menu";
export default Menu;
