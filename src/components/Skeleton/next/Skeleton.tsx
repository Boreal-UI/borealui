"use client";

import { expandClassMap } from "@/utils/propAliases";
import React from "react";
import styles from "./Skeleton.module.scss";
import SkeletonBase from "../SkeletonBase";
import { SkeletonProps } from "../Skeleton.types";

const SkeletonLoader: React.FC<SkeletonProps> = (props) => {
  return (
    <SkeletonBase
      {...props}
      className={props.className}
      classMap={expandClassMap(styles)}
    />
  );
};
SkeletonLoader.displayName = "SkeletonLoader";
export default SkeletonLoader;
