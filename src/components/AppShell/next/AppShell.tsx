"use client";

import { expandClassMap } from "@/utils/propAliases";
import { forwardRef } from "react";
import styles from "./AppShell.module.scss";
import AppShellBase from "../AppShellBase";
import { AppShellProps } from "../AppShell.types";

const AppShell = forwardRef<HTMLDivElement, AppShellProps>((props, ref) => (
  <AppShellBase {...props} ref={ref} classMap={expandClassMap(styles)} />
));

AppShell.displayName = "AppShell";
export default AppShell;
