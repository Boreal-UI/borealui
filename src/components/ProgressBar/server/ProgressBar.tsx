import { expandClassMap } from "@/utils/propAliases";
import ProgressBarBase from "../ProgressBarBase";
import { ProgressBarProps } from "../ProgressBar.types";
import styles from "../next/ProgressBar.module.scss";

export default function ProgressBar(props: ProgressBarProps) {
  return <ProgressBarBase {...props} classMap={expandClassMap(styles)} />;
}
