import { expandClassMap } from "@/utils/propAliases";
import { forwardRef } from "react";
import "./SplitPane.scss";
import SplitPaneBase from "../SplitPaneBase";
import { SplitPaneProps } from "../SplitPane.types";

const classes = {
  root: "splitPane",
  startPane: "splitPane_startPane",
  endPane: "splitPane_endPane",
  separator: "splitPane_separator",
  horizontal: "splitPane_horizontal",
  vertical: "splitPane_vertical",
  static: "splitPane_static",
  loader: "splitPane_loader",
  srOnly: "sr_only",

  primary: "splitPane_primary",
  secondary: "splitPane_secondary",
  tertiary: "splitPane_tertiary",
  quaternary: "splitPane_quaternary",

  success: "splitPane_success",
  info: "splitPane_info",
  warning: "splitPane_warning",
  error: "splitPane_error",

  clear: "splitPane_clear",
  disabled: "splitPane_disabled",
  loading: "splitPane_loading",

  shadowNone: "splitPane_shadow-None",
  shadowLight: "splitPane_shadow-Light",
  shadowMedium: "splitPane_shadow-Medium",
  shadowStrong: "splitPane_shadow-Strong",
  shadowIntense: "splitPane_shadow-Intense",

  roundNone: "splitPane_round-None",
  roundSmall: "splitPane_round-Small",
  roundMedium: "splitPane_round-Medium",
  roundLarge: "splitPane_round-Large",
  roundFull: "splitPane_round-Full",
  glass: "splitPane_glass",
  outline: "splitPane_outline",
};

const SplitPane = forwardRef<HTMLDivElement, SplitPaneProps>((props, ref) => (
  <SplitPaneBase {...props} ref={ref} classMap={expandClassMap(classes)} />
));

SplitPane.displayName = "SplitPane";
export default SplitPane;
