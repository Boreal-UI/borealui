import { expandClassMap } from "@/utils/propAliases";
import DividerBase from "../DividerBase";
import { DividerProps } from "../Divider.types";
import styles from "../next/Divider.module.scss";

export default function Divider(props: DividerProps) {
  return <DividerBase {...props} classMap={expandClassMap(styles)} />;
}
