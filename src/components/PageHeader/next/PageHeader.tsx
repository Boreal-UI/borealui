"use client";

import { expandClassMap } from "@/utils/propAliases";
import { forwardRef } from "react";
import styles from "./PageHeader.module.scss";
import PageHeaderBase from "../PageHeaderBase";
import { PageHeaderProps } from "../PageHeader.types";

const PageHeader = forwardRef<HTMLElement, PageHeaderProps>((props, ref) => (
  <PageHeaderBase {...props} ref={ref} classMap={expandClassMap(styles)} />
));

PageHeader.displayName = "PageHeader";
export default PageHeader;
