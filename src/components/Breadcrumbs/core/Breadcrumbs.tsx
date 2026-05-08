import React from "react";
import "./Breadcrumbs.scss";
import { BreadcrumbsBase } from "../BreadcrumbsBase";
import { BreadcrumbsProps } from "../Breadcrumbs.types";
import Button from "../../Button/core/Button";

const classes = {
  breadcrumbs: "breadcrumbs",

  primary: "breadcrumbs_primary",
  secondary: "breadcrumbs_secondary",
  tertiary: "breadcrumbs_tertiary",
  quaternary: "breadcrumbs_quaternary",

  success: "breadcrumbs_success",
  warning: "breadcrumbs_warning",
  error: "breadcrumbs_error",

  clear: "breadcrumbs_clear",

  outline: "breadcrumbs_outline",
  glass: "breadcrumbs_glass",
  disabled: "breadcrumbs_disabled",

  shadowNone: "breadcrumbs_shadow-None",
  shadowLight: "breadcrumbs_shadow-Light",
  shadowMedium: "breadcrumbs_shadow-Medium",
  shadowStrong: "breadcrumbs_shadow-Strong",
  shadowIntense: "breadcrumbs_shadow-Intense",

  roundNone: "breadcrumbs_round-None",
  roundSmall: "breadcrumbs_round-Small",
  roundMedium: "breadcrumbs_round-Medium",
  roundLarge: "breadcrumbs_round-Large",

  xs: "breadcrumbs_xs",
  small: "breadcrumbs_small",
  medium: "breadcrumbs_medium",
  large: "breadcrumbs_large",
  xl: "breadcrumbs_xl",

  list: "breadcrumbs_list",
  item: "breadcrumbs_item",
  item_animate: "breadcrumbs_item_animate",
  item_active: "breadcrumbs_item_active",
  ellipsis: "breadcrumbs_ellipsis",
  link: "breadcrumbs_link",
  link_label: "breadcrumbs_link_label",
  current: "breadcrumbs_current",
  separator: "breadcrumbs_separator",
  separator_icon: "breadcrumbs_separator_icon",
};

const Breadcrumbs: React.FC<BreadcrumbsProps> = (props) => {
  return (
    <BreadcrumbsBase {...props} classMap={classes} ButtonComponent={Button} />
  );
};
Breadcrumbs.displayName = "Breadcrumbs";
export default Breadcrumbs;
