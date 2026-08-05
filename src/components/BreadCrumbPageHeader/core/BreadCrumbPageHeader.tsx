import { expandClassMap } from "@/utils/propAliases";
import { forwardRef } from "react";
import "./BreadCrumbPageHeader.scss";
import BreadCrumbPageHeaderBase from "../BreadCrumbPageHeaderBase";
import { BreadCrumbPageHeaderProps } from "../BreadCrumbPageHeader.types";
import { Breadcrumbs } from "@/index.core";

const classes = {
  container: "breadCrumbPageHeader_container",
  label: "breadCrumbPageHeader_label",
  labelTop: "breadCrumbPageHeader_labelTop",
  labelBottom: "breadCrumbPageHeader_labelBottom",
  labelLeft: "breadCrumbPageHeader_labelLeft",
  labelRight: "breadCrumbPageHeader_labelRight",

  root: "breadCrumbPageHeader",
  breadcrumbs: "breadCrumbPageHeader_breadcrumbs",
  breadcrumbList: "breadCrumbPageHeader_breadcrumbList",
  breadcrumbItem: "breadCrumbPageHeader_breadcrumbItem",
  breadcrumbLink: "breadCrumbPageHeader_breadcrumbLink",
  breadcrumbCurrent: "breadCrumbPageHeader_breadcrumbCurrent",
  current: "breadCrumbPageHeader_current",
  separator: "breadCrumbPageHeader_separator",
  main: "breadCrumbPageHeader_main",
  title: "breadCrumbPageHeader_title",
  subtitle: "breadCrumbPageHeader_subtitle",
  actions: "breadCrumbPageHeader_actions",
  bodyContent: "breadCrumbPageHeader_bodyContent",
  loader: "breadCrumbPageHeader_loader",

  primary: "breadCrumbPageHeader_primary",
  secondary: "breadCrumbPageHeader_secondary",
  tertiary: "breadCrumbPageHeader_tertiary",
  quaternary: "breadCrumbPageHeader_quaternary",

  success: "breadCrumbPageHeader_success",
  info: "breadCrumbPageHeader_info",
  warning: "breadCrumbPageHeader_warning",
  error: "breadCrumbPageHeader_error",

  clear: "breadCrumbPageHeader_clear",
  disabled: "breadCrumbPageHeader_disabled",
  loading: "breadCrumbPageHeader_loading",

  shadowNone: "breadCrumbPageHeader_shadow-None",
  shadowLight: "breadCrumbPageHeader_shadow-Light",
  shadowMedium: "breadCrumbPageHeader_shadow-Medium",
  shadowStrong: "breadCrumbPageHeader_shadow-Strong",
  shadowIntense: "breadCrumbPageHeader_shadow-Intense",

  roundNone: "breadCrumbPageHeader_round-None",
  roundSmall: "breadCrumbPageHeader_round-Small",
  roundMedium: "breadCrumbPageHeader_round-Medium",
  roundLarge: "breadCrumbPageHeader_round-Large",
  roundFull: "breadCrumbPageHeader_round-Full",
  glass: "breadCrumbPageHeader_glass",
  outline: "breadCrumbPageHeader_outline",
};

const BreadCrumbPageHeader = forwardRef<HTMLElement, BreadCrumbPageHeaderProps>(
  (props, ref) => (
    <BreadCrumbPageHeaderBase
      {...props}
      ref={ref}
      classMap={expandClassMap(classes)}
      BreadCrumbsComponent={Breadcrumbs}
    />
  ),
);

BreadCrumbPageHeader.displayName = "BreadCrumbPageHeader";
export default BreadCrumbPageHeader;
