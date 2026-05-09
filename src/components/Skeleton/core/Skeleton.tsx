import { expandClassMap } from "@/utils/propAliases";
import React from "react";
import "./Skeleton.scss";
import SkeletonBase from "../SkeletonBase";
import { SkeletonProps } from "../Skeleton.types";
import { combineClassNames } from "../../../utils/classNames";

const classes = {
  shadowNone: "skeleton_shadow-None",
  shadowLight: "skeleton_shadow-Light",
  shadowMedium: "skeleton_shadow-Medium",
  shadowStrong: "skeleton_shadow-Strong",
  shadowIntense: "skeleton_shadow-Intense",

  roundNone: "skeleton_round-None",
  roundSmall: "skeleton_round-Small",
  roundMedium: "skeleton_round-Medium",
  roundLarge: "skeleton_round-Large",
};

const SkeletonLoader: React.FC<SkeletonProps> = (props) => {
  return (
    <SkeletonBase
      {...props}
      className={combineClassNames("skeleton_loader", props.className)}
      classMap={expandClassMap(classes)}
    />
  );
};
SkeletonLoader.displayName = "SkeletonLoader";
export default SkeletonLoader;
