import { expandClassMap } from "@/utils/propAliases";
import LegendBase from "../LegendBase";
import { LegendProps } from "../Legend.types";
import styles from "../next/Legend.module.scss";

export default function Legend(props: LegendProps) {
  return <LegendBase {...props} classMap={expandClassMap(styles)} />;
}
