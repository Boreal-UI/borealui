import { expandClassMap } from "@/utils/propAliases";
import { forwardRef } from "react";
import "./Portal.scss";
import PortalBase from "../PortalBase";
import { PortalProps } from "../Portal.types";

const classes = {
  container: "portal_container",
  label: "portal_label",
  labelTop: "portal_labelTop",
  labelBottom: "portal_labelBottom",
  labelLeft: "portal_labelLeft",
  labelRight: "portal_labelRight",

  root: "portal",
  content: "portal_content",
  loader: "portal_loader",
  srOnly: "sr_only",

  primary: "portal_primary",
  secondary: "portal_secondary",
  tertiary: "portal_tertiary",
  quaternary: "portal_quaternary",

  success: "portal_success",
  info: "portal_info",
  warning: "portal_warning",
  error: "portal_error",

  clear: "portal_clear",
  outline: "portal_outline",
  glass: "portal_glass",
  disabled: "portal_disabled",
  loading: "portal_loading",

  shadowNone: "portal_shadow-None",
  shadowLight: "portal_shadow-Light",
  shadowMedium: "portal_shadow-Medium",
  shadowStrong: "portal_shadow-Strong",
  shadowIntense: "portal_shadow-Intense",

  roundNone: "portal_round-None",
  roundSmall: "portal_round-Small",
  roundMedium: "portal_round-Medium",
  roundLarge: "portal_round-Large",
  roundFull: "portal_round-Full",
};

const Portal = forwardRef<HTMLDivElement, PortalProps>((props, ref) => (
  <PortalBase {...props} ref={ref} classMap={expandClassMap(classes)} />
));

Portal.displayName = "Portal";
export default Portal;
