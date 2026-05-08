import { forwardRef } from "react";
import "./Avatar.scss";
import { AvatarProps } from "../Avatar.types";
import { AvatarBase } from "../AvatarBase";

const classes = {
  avatar: "avatar",
  primary: "avatar_primary",
  secondary: "avatar_secondary",
  tertiary: "avatar_tertiary",
  quaternary: "avatar_quaternary",
  success: "avatar_success",
  warning: "avatar_warning",
  error: "avatar_error",
  clear: "avatar_clear",
  outline: "avatar_outline",
  glass: "avatar_glass",

  clickable: "avatar_clickable",
  disabled: "avatar_disabled",

  circle: "avatar_circle",
  square: "avatar_square",
  rounded: "avatar_rounded",

  xs: "avatar_xs",
  small: "avatar_small",
  medium: "avatar_medium",
  large: "avatar_large",
  xl: "avatar_xl",

  shadowNone: "avatar_shadow-None",
  shadowLight: "avatar_shadow-Light",
  shadowMedium: "avatar_shadow-Medium",
  shadowStrong: "avatar_shadow-Strong",
  shadowIntense: "avatar_shadow-Intense",

  image: "avatar_image",
  initials: "avatar_initials",
  fallback_icon: "avatar_fallback_icon",
  icon_only: "avatar_icon_only",
  status: "avatar_status",
  online: "avatar_status_online",
  offline: "avatar_status_offline",
  away: "avatar_status_away",
  busy: "avatar_status_busy",
  topRight: "avatar_status_topRight",
  bottomRight: "avatar_status_bottomRight",
  bottomLeft: "avatar_status_bottomLeft",
  topLeft: "avatar_status_topLeft",

  dot: "avatar_dot",
};

const Avatar = forwardRef<HTMLButtonElement | HTMLAnchorElement, AvatarProps>(
  (props, ref) => <AvatarBase {...props} classMap={classes} ref={ref} />
);
Avatar.displayName = "Avatar";
export default Avatar;
