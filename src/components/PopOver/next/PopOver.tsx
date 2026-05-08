"use client";

import { expandClassMap } from "@/utils/propAliases";
import React from "react";
import BasePopover from "../PopOverBase";
import styles from "./PopOver.module.scss";
import { PopoverProps } from "../PopOver.types";

const Popover: React.FC<PopoverProps> = (props) => {
  return <BasePopover {...props} classMap={expandClassMap(styles)} />;
};
Popover.displayName = "Popover";
export default Popover;
