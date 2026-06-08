import { expandClassMap } from "@/utils/propAliases";
import AlertBase from "../AlertBase";
import { AlertProps } from "../Alert.types";
import styles from "../next/Alert.module.scss";

export type ServerAlertProps = Omit<AlertProps, "dismissible" | "onDismiss">;

export default function Alert(props: ServerAlertProps) {
  return <AlertBase {...props} dismissible={false} classMap={expandClassMap(styles)} />;
}
