"use client";

import { expandClassMap } from "@/utils/propAliases";
import { forwardRef } from "react";
import styles from "./SplitPane.module.scss";
import SplitPaneBase from "../SplitPaneBase";
import { SplitPaneProps } from "../SplitPane.types";

const SplitPane = forwardRef<HTMLDivElement, SplitPaneProps>((props, ref) => (
  <SplitPaneBase {...props} ref={ref} classMap={expandClassMap(styles)} />
));

SplitPane.displayName = "SplitPane";
export default SplitPane;
