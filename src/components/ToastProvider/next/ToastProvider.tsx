"use client";

import { expandClassMap } from "@/utils/propAliases";
import ToastProviderBase, { useToast } from "../ToastProviderBase";
import { ToastProviderProps } from "../ToastProvider.types";
import styles from "./ToastProvider.module.scss";

export { useToast };

export default function ToastProvider(props: ToastProviderProps) {
  return <ToastProviderBase {...props} classMap={expandClassMap(styles)} />;
}
