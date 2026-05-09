"use client";

import { expandClassMap } from "@/utils/propAliases";
import styles from "./DataTable.module.scss";
import DataTableBase from "../DataTableBase";
import { DataTableProps } from "../DataTable.types";

function DataTable<T extends object>(props: DataTableProps<T>) {
  return <DataTableBase {...props} classMap={expandClassMap(styles)} />;
}
DataTable.displayName = "DataTable";
export default DataTable;
