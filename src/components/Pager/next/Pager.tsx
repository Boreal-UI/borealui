"use client";

import { expandClassMap } from "@/utils/propAliases";
import React from "react";
import BasePager from "../PagerBase";
import Button from "../../Button/next/Button";
import IconButton from "../../IconButton/next/IconButton";
import styles from "./Pager.module.scss";
import { PagerProps } from "../Pager.types";

const Pager: React.FC<PagerProps> = (props) => {
  return (
    <BasePager
      {...props}
      Button={Button}
      IconButton={IconButton}
      classMap={expandClassMap(styles)}
    />
  );
};
Pager.displayName = "Pager";
export default Pager;
