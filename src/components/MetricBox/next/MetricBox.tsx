"use client";

import { expandClassMap } from "@/utils/propAliases";
import React from "react";
import BaseMetricBox from "../MetricBoxBase";
import styles from "./MetricBox.module.scss";
import { MetricBoxProps } from "../MetricBox.types";

const MetricBox: React.FC<MetricBoxProps> = (props) => {
  return <BaseMetricBox {...props} classMap={expandClassMap(styles)} />;
};
MetricBox.displayName = "MetricBox";
export default MetricBox;
