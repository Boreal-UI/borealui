"use client";

import { expandClassMap } from "@/utils/propAliases";
import AlertBase from "../AlertBase";
import { AlertProps } from "../Alert.types";
import styles from "./Alert.module.scss";

export default function Alert(props: AlertProps) {
  return <AlertBase {...props} classMap={expandClassMap(styles)} />;
}
