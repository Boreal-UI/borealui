"use client";

import { expandClassMap } from "@/utils/propAliases";
import { forwardRef } from "react";
import DividerBase from "../DividerBase";
import styles from "./Divider.module.scss";
import { DividerProps } from "../Divider.types";

const Divider = forwardRef<HTMLDivElement, DividerProps>((props, ref) => (
  <DividerBase {...props} classMap={expandClassMap(styles)} ref={ref} />
));
Divider.displayName = "Divider";
export default Divider;
