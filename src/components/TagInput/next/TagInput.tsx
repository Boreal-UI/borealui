"use client";

import React from "react";
import styles from "./TagInput.module.scss";
import IconButton from "../../IconButton/next/IconButton";
import TextInput from "../../TextInput/next/TextInput";
import TagInputBase from "../TagInputBase";
import { TagInputProps } from "../TagInput.types";

const TagInput: React.FC<TagInputProps> = (props) => {
  return (
    <TagInputBase
      {...props}
      classMap={styles}
      IconButton={IconButton}
      TextInput={TextInput}
    />
  );
};
TagInput.displayName = "TagInput";
export default TagInput;
