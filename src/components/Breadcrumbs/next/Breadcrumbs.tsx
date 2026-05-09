"use client";

import { expandClassMap } from "@/utils/propAliases";
import React from "react";
import Link from "next/link";
import styles from "./Breadcrumbs.module.scss";
import { BreadcrumbsBase } from "../BreadcrumbsBase";
import { BreadcrumbsProps } from "../Breadcrumbs.types";
import Button from "../../Button/next/Button";

const Breadcrumbs: React.FC<BreadcrumbsProps> = (props) => {
  return (
    <BreadcrumbsBase
      {...props}
      classMap={expandClassMap(styles)}
      LinkComponent={Link}
      ButtonComponent={Button}
    />
  );
};
Breadcrumbs.displayName = "Breadcrumbs";
export default Breadcrumbs;
