"use client";

import { expandClassMap } from "@/utils/propAliases";
import React from "react";
import ChipBase from "../ChipBase";
import { CloseIcon } from "@/Icons";
import IconButton from "../../IconButton/next/IconButton";
import styles from "./Chip.module.scss";
import { ChipProps } from "../Chip.types";

const Chip: React.FC<ChipProps> = (props) => (
  <ChipBase
    {...props}
    classMap={expandClassMap(styles)}
    IconButtonComponent={IconButton}
    closeIcon={CloseIcon}
  />
);
Chip.displayName = "Chip";
export default Chip;
