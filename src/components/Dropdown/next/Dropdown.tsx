"use client";
import { expandClassMap } from "@/utils/propAliases";
import React from "react";
import BaseDropdown from "../DropdownBase";
import { DropdownProps } from "../Dropdown.types";
import IconButton from "../../IconButton/next/IconButton";
import styles from "./Dropdown.module.scss";

const Dropdown: React.FC<DropdownProps> = (props) => {
  return (
    <BaseDropdown
      {...props}
      IconButton={IconButton}
      classMap={expandClassMap(styles)}
    />
  );
};
Dropdown.displayName = "Dropdown";
export default Dropdown;
