"use client";

import { expandClassMap } from "@/utils/propAliases";
import React from "react";
import styles from "./Badge.module.scss";
import { BadgeBase } from "../BadgeBase";
import { BadgeProps } from "../Badge.types";

const Badge: React.FC<BadgeProps> = (props) => {
  return <BadgeBase {...props} classMap={expandClassMap(styles)} />;
};
Badge.displayName = "Badge";
export default Badge;
