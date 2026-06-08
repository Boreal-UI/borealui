import { expandClassMap } from "@/utils/propAliases";
import SparklineBase from "../SparklineBase";
import { SparklineProps } from "../Sparkline.types";
import styles from "../next/Sparkline.module.scss";

export default function Sparkline(props: SparklineProps) {
  return <SparklineBase {...props} classMap={expandClassMap(styles)} />;
}
