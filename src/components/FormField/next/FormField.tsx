"use client";

import { expandClassMap } from "@/utils/propAliases";
import FormFieldBase from "../FormFieldBase";
import { FormFieldProps } from "../FormField.types";
import styles from "./FormField.module.scss";

export default function FormField(props: FormFieldProps) {
  return <FormFieldBase {...props} classMap={expandClassMap(styles)} />;
}
