"use client";

import { expandClassMap } from "@/utils/propAliases";
import React from "react";
import BaseMarkdownRenderer from "../MarkdownRendererBase";
import styles from "./MarkdownRenderer.module.scss";
import { MarkdownRendererProps } from "../MarkdownRenderer.types";

const MarkdownRenderer: React.FC<MarkdownRendererProps> = (props) => {
  return <BaseMarkdownRenderer {...props} classMap={expandClassMap(styles)} />;
};
MarkdownRenderer.displayName = "MarkdownRenderer";
export default MarkdownRenderer;
