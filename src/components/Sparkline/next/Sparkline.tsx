"use client";

import { expandClassMap } from "@/utils/propAliases";
import { forwardRef } from "react";
import styles from "./Sparkline.module.scss";
import SparklineBase from "../SparklineBase";
import { SparklineProps } from "../Sparkline.types";

const Sparkline = forwardRef<HTMLDivElement, SparklineProps>((props, ref) => (
  <SparklineBase {...props} ref={ref} classMap={expandClassMap(styles)} />
));

Sparkline.displayName = "Sparkline";
export default Sparkline;
