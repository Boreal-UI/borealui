"use client";

import React from "react";
import BaseMessagePopup from "../MessagePopupBase";
import styles from "./MessagePopup.module.scss";
import Button from "../../Button/next/Button";
import IconButton from "../../IconButton/next/IconButton";
import { MessagePopupProps } from "../MessagePopup.types";

const MessagePopup: React.FC<MessagePopupProps> = (props) => {
  return (
    <BaseMessagePopup
      {...props}
      Button={Button}
      IconButton={IconButton}
      classMap={styles}
    />
  );
};

MessagePopup.displayName = "MessagePopup";
export default MessagePopup;
