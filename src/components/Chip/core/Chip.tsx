import React from "react";
import ChipBase from "../ChipBase";
import { CloseIcon } from "@/Icons";
import "./Chip.scss";
import IconButton from "../../IconButton/core/IconButton";
import { ChipProps } from "../Chip.types";

const classes = {
  chip: "chip",
  icon: "chip_icon",
  inner_icon: "chip_icon_inner",
  message: "chip_message",
  close: "chip_close",
  relative: "chip_relative",
  fixed: "chip_fixed",
  fadeout: "chip_fadeout",

  topCenter: "chip_top_center",
  bottomCenter: "chip_bottom_center",
  topLeft: "chip_top_left",
  topRight: "chip_top_right",
  bottomLeft: "chip_bottom_left",
  bottomRight: "chip_bottom_right",

  primary: "chip_primary",
  secondary: "chip_secondary",
  tertiary: "chip_tertiary",
  quaternary: "chip_quaternary",

  success: "chip_success",
  error: "chip_error",
  warning: "chip_warning",

  clear: "chip_clear",
  glass: "chip_glass",

  xs: "chip_xs",
  small: "chip_small",
  medium: "chip_medium",
  large: "chip_large",
  xl: "chip_xl",

  shadowNone: "chip_shadow-None",
  shadowLight: "chip_shadow-Light",
  shadowMedium: "chip_shadow-Medium",
  shadowStrong: "chip_shadow-Strong",
  shadowIntense: "chip_shadow-Intense",

  roundNone: "chip_round-None",
  roundSmall: "chip_round-Small",
  roundMedium: "chip_round-Medium",
  roundLarge: "chip_round-Large",
};

const Chip: React.FC<ChipProps> = (props) => (
  <ChipBase
    {...props}
    classMap={classes}
    IconButtonComponent={IconButton}
    closeIcon={CloseIcon}
  />
);
Chip.displayName = "Chip";
export default Chip;
