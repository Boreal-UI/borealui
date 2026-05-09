import { expandClassMap } from "@/utils/propAliases";
import React from "react";
import BaseNotificationCenter from "../NotificationCenterBase";
import Button from "../../Button/core/Button";
import IconButton from "../../IconButton/core/IconButton";
import "./NotificationCenter.scss";
import { NotificationCenterProps } from "../NotificationCenter.types";

const classes = {
  wrapper: "notification_center",
  header: "notification_center_header",
  body: "notification_center_body",
  list: "notification_center_list",
  notification: "notification_center_notification",
  icon: "notification_center_icon",
  content: "notification_center_content",
  message: "notification_center_message",
  timestamp: "notification_center_timestamp",
  close: "notification_center_close",
  clearAll: "notification_center_clear_all",

  general: "notification_center_general",
  success: "notification_center_success",
  error: "notification_center_error",
  warning: "notification_center_warning",
  info: "notification_center_info",

  shadowNone: "notification_center_shadow-None",
  shadowLight: "notification_center_shadow-Light",
  shadowMedium: "notification_center_shadow-Medium",
  shadowStrong: "notification_center_shadow-Strong",
  shadowIntense: "notification_center_shadow-Intense",

  roundNone: "notification_center_round-None",
  roundSmall: "notification_center_round-Small",
  roundMedium: "notification_center_round-Medium",
  roundLarge: "notification_center_round-Large",
};

const NotificationCenter: React.FC<NotificationCenterProps> = (props) => {
  return (
    <BaseNotificationCenter
      {...props}
      Button={Button}
      IconButton={IconButton}
      classMap={expandClassMap(classes)}
    />
  );
};
NotificationCenter.displayName = "NotificationCenter";
export default NotificationCenter;
