import React from "react";
import BaseMessagePopup from "../MessagePopupBase";
import "./MessagePopup.scss";
import Button from "../../Button/core/Button";
import IconButton from "../../IconButton/core/IconButton";
import { MessagePopupProps } from "../MessagePopup.types";

const classes = {
  wrapper: "message_popup_wrapper",
  content: "message_popup_content",
  header: "message_popup_header",
  title: "message_popup_title",
  body: "message_popup_body",
  close: "message_popup_close",
  message: "message_popup_message",
  actions: "message_popup_actions",
  confirm: "message_popup_confirm",
  cancel: "message_popup_cancel",

  shadowNone: "message_popup_shadow-None",
  shadowLight: "message_popup_shadow-Light",
  shadowMedium: "message_popup_shadow-Medium",
  shadowStrong: "message_popup_shadow-Strong",
  shadowIntense: "message_popup_shadow-Intense",

  roundNone: "message_popup_round-None",
  roundSmall: "message_popup_round-Small",
  roundMedium: "message_popup_round-Medium",
  roundLarge: "message_popup_round-Large",
  roundFull: "message_popup_round-Full",
};

const MessagePopup: React.FC<MessagePopupProps> = (props) => {
  return (
    <BaseMessagePopup
      {...props}
      Button={Button}
      IconButton={IconButton}
      classMap={classes}
    />
  );
};

MessagePopup.displayName = "MessagePopup";
export default MessagePopup;
