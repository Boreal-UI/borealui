"use client";

import { expandClassMap } from "@/utils/propAliases";
import { forwardRef } from "react";
import styles from "./SegmentedControl.module.scss";
import SegmentedControlBase from "../SegmentedControlBase";
import { SegmentedControlProps } from "../SegmentedControl.types";

const SegmentedControl = forwardRef<HTMLDivElement, SegmentedControlProps>(
  (props, ref) => (
    <SegmentedControlBase
      {...props}
      ref={ref}
      classMap={expandClassMap(styles)}
    />
  ),
);

SegmentedControl.displayName = "SegmentedControl";
export default SegmentedControl;
