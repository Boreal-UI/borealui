import { expandClassMap } from "@/utils/propAliases";
import BarChartBase from "../BarChartBase";
import { BarChartProps } from "../BarChart.types";
import styles from "../next/BarChart.module.scss";

export default function BarChart(props: BarChartProps) {
  return <BarChartBase {...props} classMap={expandClassMap(styles)} />;
}
