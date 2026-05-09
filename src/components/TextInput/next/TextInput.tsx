"use client";

import { expandClassMap } from "@/utils/propAliases";
import { forwardRef } from "react";
import styles from "./TextInput.module.scss";
import { TextInputProps } from "../TextInput.types";
import TextInputBase from "../TextInputBase";
import IconButton from "../../IconButton/next/IconButton";

const TextInput = forwardRef<HTMLInputElement, TextInputProps>((props, ref) => {
  return (
    <TextInputBase
      {...props}
      IconButton={IconButton}
      ref={ref}
      classMap={expandClassMap(styles)}
    />
  );
});

TextInput.displayName = "TextInput";
export default TextInput;
