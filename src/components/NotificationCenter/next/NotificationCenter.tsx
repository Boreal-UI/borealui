"use client";

import { expandClassMap } from "@/utils/propAliases";
import React from "react";
import BaseNotificationCenter from "../NotificationCenterBase";
import Button from "../../Button/next/Button";
import IconButton from "../../IconButton/next/IconButton";
import styles from "./NotificationCenter.module.scss";
import { NotificationCenterProps } from "../NotificationCenter.types";

const NotificationCenter: React.FC<NotificationCenterProps> = (props) => {
  return (
    <BaseNotificationCenter
      {...props}
      Button={Button}
      IconButton={IconButton}
      classMap={expandClassMap(styles)}
    />
  );
};
NotificationCenter.displayName = "NotificationCenter";
export default NotificationCenter;
