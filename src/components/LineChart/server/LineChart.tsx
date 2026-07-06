import { expandClassMap } from "@/utils/propAliases";
import LineChartBase from "../LineChartBase";
import { LineChartProps } from "../LineChart.types";
import styles from "../next/LineChart.module.scss";

export default function LineChart(props: LineChartProps) {
  return <LineChartBase {...props} classMap={expandClassMap(styles)} />;
}
