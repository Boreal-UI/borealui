import { expandClassMap } from "@/utils/propAliases";
import { forwardRef } from "react";
import "./AppShell.scss";
import AppShellBase from "../AppShellBase";
import { AppShellProps } from "../AppShell.types";

const classes = {
  container: "appShell_container",
  label: "appShell_label",
  labelTop: "appShell_labelTop",
  labelBottom: "appShell_labelBottom",
  labelLeft: "appShell_labelLeft",
  labelRight: "appShell_labelRight",

  root: "appShell",
  header: "appShell_header",
  body: "appShell_body",
  sidebar: "appShell_sidebar",
  main: "appShell_main",
  aside: "appShell_aside",
  footer: "appShell_footer",
  sidebarCollapsed: "appShell_sidebarCollapsed",
  stickyHeader: "appShell_stickyHeader",
  content: "appShell_content",
  loader: "appShell_loader",
  srOnly: "sr_only",

  primary: "appShell_primary",
  secondary: "appShell_secondary",
  tertiary: "appShell_tertiary",
  quaternary: "appShell_quaternary",

  success: "appShell_success",
  info: "appShell_info",
  warning: "appShell_warning",
  error: "appShell_error",

  clear: "appShell_clear",
  outline: "appShell_outline",
  glass: "appShell_glass",
  disabled: "appShell_disabled",
  loading: "appShell_loading",

  shadowNone: "appShell_shadow-None",
  shadowLight: "appShell_shadow-Light",
  shadowMedium: "appShell_shadow-Medium",
  shadowStrong: "appShell_shadow-Strong",
  shadowIntense: "appShell_shadow-Intense",

  roundNone: "appShell_round-None",
  roundSmall: "appShell_round-Small",
  roundMedium: "appShell_round-Medium",
  roundLarge: "appShell_round-Large",
  roundFull: "appShell_round-Full",
};

const AppShell = forwardRef<HTMLDivElement, AppShellProps>((props, ref) => (
  <AppShellBase {...props} ref={ref} classMap={expandClassMap(classes)} />
));

AppShell.displayName = "AppShell";
export default AppShell;
