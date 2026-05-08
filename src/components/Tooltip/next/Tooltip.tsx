"use client";

import { expandClassMap } from "@/utils/propAliases";
import { forwardRef } from "react";
import styles from "./Tooltip.module.scss";
import TooltipBase from "../TooltipBase";
import { TooltipProps } from "../Tooltip.types";

const Tooltip = forwardRef<HTMLDivElement, TooltipProps>((props, ref) => (
  <TooltipBase {...props} ref={ref} classMap={expandClassMap(styles)} />
));

Tooltip.displayName = "Tooltip";

export default Tooltip;
