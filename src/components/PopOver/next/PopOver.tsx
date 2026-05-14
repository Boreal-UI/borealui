"use client";

import { expandClassMap } from "@/utils/propAliases";
import React from "react";
import BasePopOver from "../PopOverBase";
import styles from "./PopOver.module.scss";
import { PopOverProps } from "../PopOver.types";

const PopOver: React.FC<PopOverProps> = (props) => {
  return <BasePopOver {...props} classMap={expandClassMap(styles)} />;
};
PopOver.displayName = "PopOver";
export default PopOver;
