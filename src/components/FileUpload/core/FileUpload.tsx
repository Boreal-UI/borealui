import { expandClassMap } from "@/utils/propAliases";
import React from "react";
import BaseFileUpload from "../FileUploadBase";
import { FileUploadProps } from "../FileUpload.types";
import Button from "../../Button/core/Button";
import IconButton from "../../IconButton/core/IconButton";
import ProgressBar from "../../ProgressBar/core/ProgressBar";
import FormGroup from "../../FormGroup/core/FormGroup";
import "./FileUpload.scss";

const classes = {
  fileUpload: "file_upload",
  hiddenInput: "file_upload_hidden_input",
  uploadActions: "file_upload_upload_actions",
  fileInput: "file_upload_file_input",
  removeButton: "file_upload_remove_button",
  uploadControls: "file_upload_upload_controls",
  uploadProgress: "file_upload_upload_progress",
  uploadButton: "file_upload_upload_button",
  rejectedFiles: "file_upload_rejected_files",
  fileList: "file_upload_file_list",
  fileListItem: "file_upload_file_list_item",
  fileListFileName: "file_upload_file_list_file_name",
  fileListRemoveButton: "file_upload_file_list_remove_button",

  primary: "file_upload_primary",
  secondary: "file_upload_secondary",
  tertiary: "file_upload_tertiary",
  quaternary: "file_upload_quaternary",
  clear: "file_upload_clear",

  disabled: "file_upload_disabled",
  error: "file_upload_error",
  success: "file_upload_success",
  info: "file_upload_info",
  warning: "file_upload_warning",

  shadowNone: "file_upload_shadow-None",
  shadowLight: "file_upload_shadow-Light",
  shadowMedium: "file_upload_shadow-Medium",
  shadowStrong: "file_upload_shadow-Strong",
  shadowIntense: "file_upload_shadow-Intense",

  roundNone: "file_upload_round-None",
  roundSmall: "file_upload_round-Small",
  roundMedium: "file_upload_round-Medium",
  roundLarge: "file_upload_round-Large",
  glass: "file_upload_glass",
};

const FileUpload: React.FC<FileUploadProps> = (props) => {
  return (
    <BaseFileUpload
      {...props}
      FormGroup={FormGroup}
      Button={Button}
      IconButton={IconButton}
      ProgressBar={ProgressBar}
      classMap={expandClassMap(classes)}
    />
  );
};
FileUpload.displayName = "FileUpload";
export default FileUpload;
