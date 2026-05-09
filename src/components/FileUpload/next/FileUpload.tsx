"use client";

import { expandClassMap } from "@/utils/propAliases";
import React from "react";
import BaseFileUpload from "../FileUploadBase";
import { FileUploadProps } from "../FileUpload.types";
import Button from "../../Button/next/Button";
import IconButton from "../../IconButton/next/IconButton";
import Progressbar from "../../ProgressBar/next/ProgressBar";
import FormGroup from "../../FormGroup/next/FormGroup";
import styles from "./FileUpload.module.scss";

const FileUpload: React.FC<FileUploadProps> = (props) => {
  return (
    <BaseFileUpload
      {...props}
      FormGroup={FormGroup}
      Button={Button}
      IconButton={IconButton}
      ProgressBar={Progressbar}
      classMap={expandClassMap(styles)}
    />
  );
};
FileUpload.displayName = "FileUpload";
export default FileUpload;
