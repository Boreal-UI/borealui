"use client";

import { expandClassMap } from "@/utils/propAliases";
import { forwardRef } from "react";
import TextAreaBase from "../TextAreaBase";
import type { TextAreaProps } from "../TextArea.types";
import styles from "./TextArea.module.scss";

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (props, ref) => {
    return <TextAreaBase {...props} ref={ref} classMap={expandClassMap(styles)} />;
  }
);

TextArea.displayName = "TextArea";

export default TextArea;
