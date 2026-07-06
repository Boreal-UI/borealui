import { combineClassNames } from "@/utils/classNames";
import { expandClassMap } from "@/utils/propAliases";
import SkeletonBase from "../SkeletonBase";
import { SkeletonProps } from "../Skeleton.types";
import styles from "../next/Skeleton.module.scss";

export default function Skeleton(props: SkeletonProps) {
  return (
    <SkeletonBase
      {...props}
      className={combineClassNames(styles.skeletonLoader, props.className)}
      classMap={expandClassMap(styles)}
    />
  );
}
