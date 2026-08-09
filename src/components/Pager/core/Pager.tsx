import { expandClassMap } from "@/utils/propAliases";
import React from "react";
import BasePager from "../PagerBase";
import Button from "../../Button/core/Button";
import IconButton from "../../IconButton/core/IconButton";
import "./Pager.scss";
import { PagerProps } from "../Pager.types";

const classes = {
  wrapper: "pagination",
  controls: "pagination_controls",
  controlButton: "pagination_control_button",
  buttonWrapper: "pagination_button_wrapper",
  button: "pagination_button",
  active: "pagination_active",
  primary: "pagination_primary",
  secondary: "pagination_secondary",
  tertiary: "pagination_tertiary",
  quaternary: "pagination_quaternary",
  clear: "pagination_clear",
  success: "pagination_success",
  info: "pagination_info",
  error: "pagination_error",
  warning: "pagination_warning",
  xs: "pagination_xs",
  small: "pagination_small",
  medium: "pagination_medium",
  large: "pagination_large",
  xl: "pagination_xl",
  glass: "pagination_glass",
};

const Pager: React.FC<PagerProps> = (props) => {
  return (
    <BasePager
      {...props}
      Button={Button}
      IconButton={IconButton}
      classMap={expandClassMap(classes)}
    />
  );
};
Pager.displayName = "Pager";
export default Pager;
