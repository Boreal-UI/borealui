import IconButtonBase from "../IconButtonBase";
import "./IconButton.scss";
import { IconButtonProps } from "../IconButton.types";
import { forwardRef } from "react";

const classes = {
  iconButton: "icon_button",
  buttonLabel: "icon_button_button_label",
  loader: "icon_button_loader",

  disabled: "icon_button_disabled",
  outline: "icon_button_outline",
  glass: "icon_button_glass",

  primary: "icon_button_primary",
  secondary: "icon_button_secondary",
  tertiary: "icon_button_tertiary",
  quaternary: "icon_button_quaternary",

  success: "icon_button_success",
  warning: "icon_button_warning",
  error: "icon_button_error",

  clear: "icon_button_clear",

  xs: "icon_button_xs",
  small: "icon_button_small",
  medium: "icon_button_medium",
  large: "icon_button_large",
  xl: "icon_button_xl",

  shadowNone: "icon_button_shadow-None",
  shadowLight: "icon_button_shadow-Light",
  shadowMedium: "icon_button_shadow-Medium",
  shadowStrong: "icon_button_shadow-Strong",
  shadowIntense: "icon_button_shadow-Intense",

  roundNone: "icon_button_round-None",
  roundSmall: "icon_button_round-Small",
  roundMedium: "icon_button_round-Medium",
  roundLarge: "icon_button_round-Large",
  roundFull: "icon_button_round-Full",
};

const IconButton = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  IconButtonProps
>((props, ref) => <IconButtonBase ref={ref} {...props} classMap={classes} />);
IconButton.displayName = "IconButton";
export default IconButton;
