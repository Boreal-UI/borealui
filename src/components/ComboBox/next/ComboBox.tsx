"use client";

import { expandClassMap } from "@/utils/propAliases";
import ComboBoxBase from "../ComboBoxBase";
import { ComboBoxProps } from "../ComboBox.types";
import styles from "./ComboBox.module.scss";

export default function ComboBox(props: ComboBoxProps) {
  return <ComboBoxBase {...props} classMap={expandClassMap(styles)} />;
}
