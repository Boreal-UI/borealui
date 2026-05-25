"use client";

import { expandClassMap } from "@/utils/propAliases";
import React from "react";
import styles from "./Timeline.module.scss";
import TimelineBase from "../TimelineBase";
import Skeleton from "../../Skeleton/next/Skeleton";
import { TimelineProps } from "../Timeline.types";

const Timeline: React.FC<TimelineProps> = (props) => {
  return (
    <TimelineBase
      {...props}
      classMap={expandClassMap(styles)}
      SkeletonComponent={Skeleton}
    />
  );
};
Timeline.displayName = "Timeline";
export default Timeline;
