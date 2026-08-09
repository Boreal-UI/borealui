"use client";

import { expandClassMap } from "@/utils/propAliases";
import { forwardRef } from "react";
import ChipGroupBase from "../ChipGroupBase";
import { Chip } from "../../../../index.next";
import styles from "./ChipGroup.module.scss";
import { ChipGroupProps, ChipGroupRef } from "../ChipGroup.types";

const ChipGroup = forwardRef<ChipGroupRef, ChipGroupProps>((props, ref) => (
  <ChipGroupBase
    {...props}
    ref={ref}
    ChipComponent={Chip}
    classMap={expandClassMap(styles)}
  />
));
ChipGroup.displayName = "ChipGroup";
export default ChipGroup;
