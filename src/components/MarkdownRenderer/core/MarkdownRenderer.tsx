import { expandClassMap } from "@/utils/propAliases";
import React from "react";
import BaseMarkdownRenderer from "../MarkdownRendererBase";
import "./MarkdownRenderer.scss";
import { MarkdownRendererProps } from "../MarkdownRenderer.types";

const classes = {
  wrapper: "markdown",
  loading: "markdown_loading",

  shadowNone: "markdown_shadow-None",
  shadowLight: "markdown_shadow-Light",
  shadowMedium: "markdown_shadow-Medium",
  shadowStrong: "markdown_shadow-Strong",
  shadowIntense: "markdown_shadow-Intense",

  roundNone: "markdown_round-None",
  roundSmall: "markdown_round-Small",
  roundMedium: "markdown_round-Medium",
  roundLarge: "markdown_round-Large",
};

const MarkdownRenderer: React.FC<MarkdownRendererProps> = (props) => {
  return <BaseMarkdownRenderer {...props} classMap={expandClassMap(classes)} />;
};
MarkdownRenderer.displayName = "MarkdownRenderer";
export default MarkdownRenderer;
