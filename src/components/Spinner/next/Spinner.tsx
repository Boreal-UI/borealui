"use client";

import { expandClassMap } from "@/utils/propAliases";
import React from "react";
import styles from "./Spinner.module.scss";
import SpinnerBase from "../SpinnerBase";
import { SpinnerProps } from "../Spinner.types";

const Spinner: React.FC<SpinnerProps> = (props) => {
  return <SpinnerBase {...props} classMap={expandClassMap(styles)} />;
};
Spinner.displayName = "Spinner";
export default Spinner;
