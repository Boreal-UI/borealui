"use client";

import { expandClassMap } from "@/utils/propAliases";
import { forwardRef } from "react";
import styles from "./BreadCrumbPageHeader.module.scss";
import BreadCrumbPageHeaderBase from "../BreadCrumbPageHeaderBase";
import { BreadCrumbPageHeaderProps } from "../BreadCrumbPageHeader.types";
import { Breadcrumbs } from "@/index.next";

const BreadCrumbPageHeader = forwardRef<HTMLElement, BreadCrumbPageHeaderProps>(
  (props, ref) => (
    <BreadCrumbPageHeaderBase
      {...props}
      ref={ref}
      classMap={expandClassMap(styles)}
      BreadCrumbsComponent={Breadcrumbs}
    />
  ),
);

BreadCrumbPageHeader.displayName = "BreadCrumbPageHeader";
export default BreadCrumbPageHeader;
