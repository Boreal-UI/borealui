import { expandClassMap } from "@/utils/propAliases";
import React from "react";
import BaseMessagePopup from "../MessagePopupBase";
import Button from "../../Button/core/Button";
import IconButton from "../../IconButton/core/IconButton";
import "./MessagePopup.scss";
import { MessagePopupProps } from "../MessagePopup.types";

const classes = {
  wrapper: "messagePopup",
  content: "messagePopup_popup_content",
  close: "messagePopup_close_button",
  message: "messagePopup_popupMessage",
  header: "messagePopup_header",
  title: "messagePopup_title",
  body: "messagePopup_body",
  actions: "messagePopup_popupActions",
  confirm: "messagePopup_confirmBtn",
  cancel: "messagePopup_cancelBtn",

  shadowNone: "messagePopup_shadow-None",
  shadowLight: "messagePopup_shadow-Light",
  shadowMedium: "messagePopup_shadow-Medium",
  shadowStrong: "messagePopup_shadow-Strong",
  shadowIntense: "messagePopup_shadow-Intense",

  roundNone: "messagePopup_round-None",
  roundSmall: "messagePopup_round-Small",
  roundMedium: "messagePopup_round-Medium",
  roundLarge: "messagePopup_round-Large",
};

const MessagePopup: React.FC<MessagePopupProps> = (props) => {
  return (
    <BaseMessagePopup
      {...props}
      Button={Button}
      IconButton={IconButton}
      classMap={expandClassMap(classes)}
    />
  );
};
MessagePopup.displayName = "MessagePopup";
export default MessagePopup;
