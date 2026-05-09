"use client";

import { expandClassMap } from "@/utils/propAliases";
import React from "react";
import styles from "./Timeline.module.scss";
import TimelineBase from "../TimelineBase";
import { TimelineProps } from "../Timeline.types";

const Timeline: React.FC<TimelineProps> = (props) => {
  return <TimelineBase {...props} classMap={expandClassMap(styles)} />;
};
Timeline.displayName = "Timeline";
export default Timeline;
