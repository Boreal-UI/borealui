"use client";

import { expandClassMap } from "@/utils/propAliases";
import DrawerBase from "../DrawerBase";
import { DrawerProps } from "../Drawer.types";
import styles from "./Drawer.module.scss";

export default function Drawer(props: DrawerProps) {
  return <DrawerBase {...props} classMap={expandClassMap(styles)} />;
}
