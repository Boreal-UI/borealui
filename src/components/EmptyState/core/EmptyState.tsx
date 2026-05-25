import { expandClassMap } from "@/utils/propAliases";
import React from "react";
import BaseEmptyState from "../EmptyStateBase";
import { EmptyStateProps } from "../EmptyState.types";
import Button from "../../Button/core/Button";
import "./EmptyState.scss";

const classes = {
  empty_state: "empty_state",
  title: "empty_state_title",
  message: "empty_state_message",
  icon: "empty_state_icon",
  actionBtn: "empty_state_action_btn",

  outline: "empty_state_outline",
  glass: "empty_state_glass",
  disabled: "empty_state_disabled",

  primary: "empty_state_primary",
  secondary: "empty_state_secondary",
  tertiary: "empty_state_tertiary",
  quaternary: "empty_state_quaternary",

  success: "empty_state_success",
  info: "empty_state_info",
  error: "empty_state_error",
  warning: "empty_state_warning",

  clear: "empty_state_clear",

  small: "empty_state_small",
  medium: "empty_state_medium",
  large: "empty_state_large",
  xs: "empty_state_xs",
  xl: "empty_state_xl",

  shadowNone: "empty_state_shadow-None",
  shadowLight: "empty_state_shadow-Light",
  shadowMedium: "empty_state_shadow-Medium",
  shadowStrong: "empty_state_shadow-Strong",
  shadowIntense: "empty_state_shadow-Intense",

  roundNone: "empty_state_round-None",
  roundSmall: "empty_state_round-Small",
  roundMedium: "empty_state_round-Medium",
  roundLarge: "empty_state_round-Large",
};

const EmptyState: React.FC<EmptyStateProps> = (props) => {
  return (
    <BaseEmptyState
      {...props}
      Button={Button}
      classMap={expandClassMap(classes)}
    />
  );
};
EmptyState.displayName = "EmptyState";
export default EmptyState;
