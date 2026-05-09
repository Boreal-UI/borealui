"use client";

import { expandClassMap } from "@/utils/propAliases";
import React from "react";
import BaseModal from "../ModalBase";
import styles from "./Modal.module.scss";
import IconButton from "../../IconButton/next/IconButton";
import { ModalProps } from "../Modal.types";

const Modal: React.FC<ModalProps> = (props) => {
  return <BaseModal {...props} IconButton={IconButton} classMap={expandClassMap(styles)} />;
};
Modal.displayName = "Modal";
export default Modal;
