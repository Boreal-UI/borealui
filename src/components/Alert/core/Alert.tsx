import { expandClassMap } from "@/utils/propAliases";
import AlertBase from "../AlertBase";
import { AlertProps } from "../Alert.types";
import "./Alert.scss";

const classes = {
  alert: "alert",
  icon: "alert_icon",
  content: "alert_content",
  title: "alert_title",
  message: "alert_message",
  actions: "alert_actions",
  hasIcon: "alert_has_icon",
  hasActions: "alert_has_actions",
  dismissible: "alert_dismissible",
  dismissButton: "alert_dismiss_button",
  solid: "alert_solid",
  soft: "alert_soft",
  primary: "alert_primary",
  secondary: "alert_secondary",
  tertiary: "alert_tertiary",
  quaternary: "alert_quaternary",
  clear: "alert_clear",
  success: "alert_success",
  info: "alert_info",
  warning: "alert_warning",
  error: "alert_error",
  disabled: "alert_disabled",
  shadowNone: "alert_shadow-None",
  shadowLight: "alert_shadow-Light",
  shadowMedium: "alert_shadow-Medium",
  shadowStrong: "alert_shadow-Strong",
  shadowIntense: "alert_shadow-Intense",
  roundNone: "alert_round-None",
  roundSmall: "alert_round-Small",
  roundMedium: "alert_round-Medium",
  roundLarge: "alert_round-Large",
  roundFull: "alert_round-Full",
  glass: "alert_glass",
  outline: "alert_outline",
};

export default function Alert(props: AlertProps) {
  return <AlertBase {...props} classMap={expandClassMap(classes)} />;
}
