"use client";

import { expandClassMap } from "@/utils/propAliases";
import React from "react";
import BaseEmptyState from "../EmptyStateBase";
import { EmptyStateProps } from "../EmptyState.types";
import Button from "../../Button/next/Button";
import styles from "./EmptyState.module.scss";

const EmptyState: React.FC<EmptyStateProps> = (props) => {
  return <BaseEmptyState {...props} Button={Button} classMap={expandClassMap(styles)} />;
};
EmptyState.displayName = "EmptyState";
export default EmptyState;
