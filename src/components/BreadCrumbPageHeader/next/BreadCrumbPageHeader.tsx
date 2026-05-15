"use client";

import { expandClassMap } from "@/utils/propAliases";
import { forwardRef } from "react";
import styles from "./BreadCrumbPageHeader.module.scss";
import BreadCrumbPageHeaderBase from "../BreadCrumbPageHeaderBase";
import { BreadCrumbPageHeaderProps } from "../BreadCrumbPageHeader.types";

const BreadCrumbPageHeader = forwardRef<HTMLElement, BreadCrumbPageHeaderProps>(
  (props, ref) => (
    <BreadCrumbPageHeaderBase
      {...props}
      ref={ref}
      classMap={expandClassMap(styles)}
    />
  ),
);

BreadCrumbPageHeader.displayName = "BreadCrumbPageHeader";
export default BreadCrumbPageHeader;
