"use client";

import { expandClassMap } from "@/utils/propAliases";
import { forwardRef } from "react";
import styles from "./LineChart.module.scss";
import LineChartBase from "../LineChartBase";
import { LineChartProps } from "../LineChart.types";

const LineChart = forwardRef<HTMLDivElement, LineChartProps>((props, ref) => (
  <LineChartBase {...props} ref={ref} classMap={expandClassMap(styles)} />
));

LineChart.displayName = "LineChart";
export default LineChart;
