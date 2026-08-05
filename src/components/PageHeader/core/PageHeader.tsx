import { expandClassMap } from "@/utils/propAliases";
import { forwardRef } from "react";
import "./PageHeader.scss";
import PageHeaderBase from "../PageHeaderBase";
import { PageHeaderProps } from "../PageHeader.types";

const classes = {
  root: "pageHeader",
  main: "pageHeader_main",
  before: "pageHeader_before",
  icon: "pageHeader_icon",
  eyebrow: "pageHeader_eyebrow",
  title: "pageHeader_title",
  subtitle: "pageHeader_subtitle",
  meta: "pageHeader_meta",
  actions: "pageHeader_actions",
  footer: "pageHeader_footer",
  content: "pageHeader_content",
  bodyContent: "pageHeader_bodyContent",
  compact: "pageHeader_compact",
  fullWidth: "pageHeader_fullWidth",
  loader: "pageHeader_loader",

  primary: "pageHeader_primary",
  secondary: "pageHeader_secondary",
  tertiary: "pageHeader_tertiary",
  quaternary: "pageHeader_quaternary",

  success: "pageHeader_success",
  info: "pageHeader_info",
  warning: "pageHeader_warning",
  error: "pageHeader_error",

  clear: "pageHeader_clear",
  disabled: "pageHeader_disabled",
  loading: "pageHeader_loading",

  shadowNone: "pageHeader_shadow-None",
  shadowLight: "pageHeader_shadow-Light",
  shadowMedium: "pageHeader_shadow-Medium",
  shadowStrong: "pageHeader_shadow-Strong",
  shadowIntense: "pageHeader_shadow-Intense",

  roundNone: "pageHeader_round-None",
  roundSmall: "pageHeader_round-Small",
  roundMedium: "pageHeader_round-Medium",
  roundLarge: "pageHeader_round-Large",
  roundFull: "pageHeader_round-Full",
  glass: "pageHeader_glass",
  outline: "pageHeader_outline",
};

const PageHeader = forwardRef<HTMLElement, PageHeaderProps>((props, ref) => (
  <PageHeaderBase {...props} ref={ref} classMap={expandClassMap(classes)} />
));

PageHeader.displayName = "PageHeader";
export default PageHeader;
