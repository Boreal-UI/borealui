"use client";

import { expandClassMap } from "@/utils/propAliases";
import { forwardRef } from "react";
import styles from "./DonutChart.module.scss";
import DonutChartBase from "../DonutChartBase";
import { DonutChartProps } from "../DonutChart.types";

const DonutChart = forwardRef<HTMLDivElement, DonutChartProps>((props, ref) => (
  <DonutChartBase {...props} ref={ref} classMap={expandClassMap(styles)} />
));

DonutChart.displayName = "DonutChart";
export default DonutChart;
