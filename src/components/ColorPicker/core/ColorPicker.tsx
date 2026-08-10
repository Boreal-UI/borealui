import { expandClassMap } from "@/utils/propAliases";
import React from "react";
import ColorPickerBase from "../ColorPickerBase";
import "./ColorPicker.scss";
import { ColorPickerProps } from "../ColorPicker.types";

const classes = {
  color_picker: "color_picker",
  disabled: "color_picker_disabled",
  legend: "color_picker_legend",
  grid: "color_picker_grid",
  swatch: "color_picker_swatch",
  preview: "color_picker_preview",
  radio_input: "color_picker_radio_input",
  custom_input: "color_picker_custom_input",
  value: "color_picker_selected",

  xs: "color_picker_xs",
  small: "color_picker_small",
  medium: "color_picker_medium",
  large: "color_picker_large",
  xl: "color_picker_xl",

  shadowNone: "color_picker_shadow-None",
  shadowLight: "color_picker_shadow-Light",
  shadowMedium: "color_picker_shadow-Medium",
  shadowStrong: "color_picker_shadow-Strong",
  shadowIntense: "color_picker_shadow-Intense",

  pill: "color_picker_pill",
  round: "color_picker_round",
  square: "color_picker_square",
};

const ColorPicker: React.FC<ColorPickerProps> = (props) => (
  <ColorPickerBase {...props} classMap={expandClassMap(classes)} />
);
ColorPicker.displayName = "ColorPicker";
export default ColorPicker;
