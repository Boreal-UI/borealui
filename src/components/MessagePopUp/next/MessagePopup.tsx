"use client";

import { expandClassMap } from "@/utils/propAliases";
import React from "react";
import BaseMessagePopUp from "../MessagePopupBase";
import Button from "../../Button/next/Button";
import IconButton from "../../IconButton/next/IconButton";
import styles from "./MessagePopup.module.scss";
import { MessagePopupProps } from "../MessagePopup.types";

const MessagePopup: React.FC<MessagePopupProps> = (props) => {
  return (
    <BaseMessagePopUp
      {...props}
      Button={Button}
      IconButton={IconButton}
      classMap={expandClassMap(styles)}
    />
  );
};
MessagePopup.displayName = "MessagePopup";
export default MessagePopup;
