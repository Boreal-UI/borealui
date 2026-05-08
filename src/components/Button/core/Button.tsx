import { forwardRef } from "react";
import ButtonBase from "../ButtonBase";
import "./Button.scss";
import { ButtonProps } from "../Button.types";

const classes = {
  button: "button",
  icon: "button_icon",
  iconLeft: "button_icon_left",
  iconRight: "button_icon_right",
  buttonIcon: "button_button_icon",
  buttonLabel: "button_label",
  loader: "button_loader",
  link: "button_link",

  fullWidth: "button_full_width",
  disabled: "button_disabled",
  outline: "button_outline",
  glass: "button_glass",

  primary: "button_primary",
  secondary: "button_secondary",
  tertiary: "button_tertiary",
  quaternary: "button_quaternary",
  clear: "button_clear",

  success: "button_success",
  warning: "button_warning",
  error: "button_error",

  xs: "button_xs",
  small: "button_small",
  medium: "button_medium",
  large: "button_large",
  xl: "button_xl",

  shadowNone: "button_shadow-None",
  shadowLight: "button_shadow-Light",
  shadowMedium: "button_shadow-Medium",
  shadowStrong: "button_shadow-Strong",
  shadowIntense: "button_shadow-Intense",

  roundNone: "button_round-None",
  roundSmall: "button_round-Small",
  roundMedium: "button_round-Medium",
  roundLarge: "button_round-Large",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => (
  <ButtonBase {...props} classMap={classes} ref={ref} />
));
Button.displayName = "Button";
export default Button;
