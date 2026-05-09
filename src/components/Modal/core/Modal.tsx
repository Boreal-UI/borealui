import { expandClassMap } from "@/utils/propAliases";
import React from "react";
import BaseModal from "../ModalBase";
import "./Modal.scss";
import IconButton from "../../IconButton/core/IconButton";
import { ModalProps } from "../Modal.types";

const classes = {
  overlay: "modal_overlay",
  visible: "modal_visible",
  hidden: "modal_hidden",
  header: "modal_header",
  headerContent: "modal_header_content",
  title: "modal_title",
  body: "modal_body",
  footer: "modal_footer",
  content: "modal_content",
  closeButton: "modal_close_button",

  shadowNone: "modal_shadow-None",
  shadowLight: "modal_shadow-Light",
  shadowMedium: "modal_shadow-Medium",
  shadowStrong: "modal_shadow-Strong",
  shadowIntense: "modal_shadow-Intense",

  roundNone: "modal_round-None",
  roundSmall: "modal_round-Small",
  roundMedium: "modal_round-Medium",
  roundLarge: "modal_round-Large",
};

const Modal: React.FC<ModalProps> = (props) => {
  return <BaseModal {...props} IconButton={IconButton} classMap={expandClassMap(classes)} />;
};
Modal.displayName = "Modal";
export default Modal;
