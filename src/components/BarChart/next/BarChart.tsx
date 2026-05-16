"use client";

import { expandClassMap } from "@/utils/propAliases";
import { forwardRef } from "react";
import styles from "./BarChart.module.scss";
import BarChartBase from "../BarChartBase";
import { BarChartProps } from "../BarChart.types";

const BarChart = forwardRef<HTMLDivElement, BarChartProps>((props, ref) => (
  <BarChartBase {...props} ref={ref} classMap={expandClassMap(styles)} />
));

BarChart.displayName = "BarChart";
export default BarChart;
