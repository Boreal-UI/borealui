import React from "react";
import "./Toolbar.scss";
import Avatar from "../../Avatar/core/Avatar";
import ToolbarBase from "../ToolbarBase";
import { ToolbarProps } from "../Toolbar.types";

const classes = {
  toolbar: "toolbar",
  glass: "toolbar_glass",

  fixed: "toolbar_fixed",
  sticky: "toolbar_sticky",
  static: "toolbar_static",

  section: "toolbar_section",
  title: "toolbar_title",
  avatarWrapper: "toolbar_avatarWrapper",

  primary: "toolbar_primary",
  secondary: "toolbar_secondary",
  tertiary: "toolbar_tertiary",
  quaternary: "toolbar_quaternary",

  clear: "toolbar_clear",

  shadowNone: "toolbar_shadow-None",
  shadowLight: "toolbar_shadow-Light",
  shadowMedium: "toolbar_shadow-Medium",
  shadowStrong: "toolbar_shadow-Strong",
  shadowIntense: "toolbar_shadow-Intense",

  roundNone: "toolbar_round-None",
  roundSmall: "toolbar_round-Small",
  roundMedium: "toolbar_round-Medium",
  roundLarge: "toolbar_round-Large",
};

const Toolbar: React.FC<ToolbarProps> = (props) => (
  <ToolbarBase {...props} AvatarComponent={Avatar} classMap={classes} />
);
Toolbar.displayName = "Toolbar";
export default Toolbar;
