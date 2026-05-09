"use client";

import { expandClassMap } from "@/utils/propAliases";
import React from "react";
import BaseProgressBar from "../ProgressBarBase";
import styles from "./ProgressBar.module.scss";
import { ProgressBarProps } from "../ProgressBar.types";

const ProgressBar: React.FC<ProgressBarProps> = (props) => {
  return <BaseProgressBar {...props} classMap={expandClassMap(styles)} />;
};
ProgressBar.displayName = "ProgressBar";
export default ProgressBar;
