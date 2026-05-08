"use client";

import { expandClassMap } from "@/utils/propAliases";
import React from "react";
import styles from "./Skeleton.module.scss";
import SkeletonBase from "../SkeletonBase";
import { SkeletonProps } from "../Skeleton.types";
import { combineClassNames } from "@/utils/classNames";

const SkeletonLoader: React.FC<SkeletonProps> = (props) => {
  return (
    <SkeletonBase
      {...props}
      className={combineClassNames(styles.skeletonLoader, props.className)}
      classMap={expandClassMap(styles)}
    />
  );
};
SkeletonLoader.displayName = "SkeletonLoader";
export default SkeletonLoader;
