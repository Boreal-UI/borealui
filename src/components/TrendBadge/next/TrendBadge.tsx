"use client";

import { expandClassMap } from "@/utils/propAliases";
import { forwardRef } from "react";
import styles from "./TrendBadge.module.scss";
import TrendBadgeBase from "../TrendBadgeBase";
import { TrendBadgeProps } from "../TrendBadge.types";

const TrendBadge = forwardRef<HTMLDivElement, TrendBadgeProps>((props, ref) => (
  <TrendBadgeBase {...props} ref={ref} classMap={expandClassMap(styles)} />
));

TrendBadge.displayName = "TrendBadge";
export default TrendBadge;
