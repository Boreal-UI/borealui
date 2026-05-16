"use client";

import { expandClassMap } from "@/utils/propAliases";
import { forwardRef } from "react";
import styles from "./Legend.module.scss";
import LegendBase from "../LegendBase";
import { LegendProps } from "../Legend.types";

const Legend = forwardRef<HTMLDivElement, LegendProps>((props, ref) => (
  <LegendBase {...props} ref={ref} classMap={expandClassMap(styles)} />
));

Legend.displayName = "Legend";
export default Legend;
