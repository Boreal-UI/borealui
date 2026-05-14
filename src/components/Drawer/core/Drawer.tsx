import { expandClassMap } from "@/utils/propAliases";
import DrawerBase from "../DrawerBase";
import { DrawerProps } from "../Drawer.types";
import "./Drawer.scss";

const classes = {
  drawer: "drawer",
  open: "drawer_open",
  overlay: "drawer_overlay",
  panel: "drawer_panel",
  header: "drawer_header",
  headerContent: "drawer_header_content",
  title: "drawer_title",
  body: "drawer_body",
  footer: "drawer_footer",
  closeButton: "drawer_close_button",
  left: "drawer_left",
  right: "drawer_right",
  top: "drawer_top",
  bottom: "drawer_bottom",
  glass: "drawer_glass",
  primary: "drawer_primary",
  secondary: "drawer_secondary",
  tertiary: "drawer_tertiary",
  quaternary: "drawer_quaternary",
  clear: "drawer_clear",
  success: "drawer_success",
  error: "drawer_error",
  warning: "drawer_warning",
  info: "drawer_info",
  shadowNone: "drawer_shadow-None",
  shadowLight: "drawer_shadow-Light",
  shadowMedium: "drawer_shadow-Medium",
  shadowStrong: "drawer_shadow-Strong",
  shadowIntense: "drawer_shadow-Intense",
  roundNone: "drawer_round-None",
  roundSmall: "drawer_round-Small",
  roundMedium: "drawer_round-Medium",
  roundLarge: "drawer_round-Large",
  roundFull: "drawer_round-Full",
};

export default function Drawer(props: DrawerProps) {
  return <DrawerBase {...props} classMap={expandClassMap(classes)} />;
}
