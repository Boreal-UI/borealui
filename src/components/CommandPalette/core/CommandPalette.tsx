import { expandClassMap } from "@/utils/propAliases";
import React from "react";
import CommandPaletteBase from "../CommandPaletteBase";
import "./CommandPalette.scss";
import TextInput from "../../TextInput/core/TextInput";
import { CommandPaletteProps } from "../CommandPalette.types";

const classes = {
  overlay: "command_palette_overlay",
  command_palette: "command_palette",
  input: "command_palette_input",
  label: "command_palette_label",
  list: "command_palette_list",
  item: "command_palette_item",
  itemLabel: "command_palette_item_label",
  icon: "command_palette_icon",
  active: "command_palette_active",
  disabled: "command_palette_disabled",
  empty: "command_palette_empty",

  primary: "command_palette_primary",
  secondary: "command_palette_secondary",
  tertiary: "command_palette_tertiary",
  quaternary: "command_palette_quaternary",

  success: "command_palette_success",
  info: "command_palette_info",
  error: "command_palette_error",
  warning: "command_palette_warning",

  clear: "command_palette_clear",

  shadowNone: "command_palette_shadow-None",
  shadowLight: "command_palette_shadow-Light",
  shadowMedium: "command_palette_shadow-Medium",
  shadowStrong: "command_palette_shadow-Strong",
  shadowIntense: "command_palette_shadow-Intense",

  roundNone: "command_palette_round-None",
  roundSmall: "command_palette_round-Small",
  roundMedium: "command_palette_round-Medium",
  roundLarge: "command_palette_round-Large",
  glass: "command_palette_glass",
};

const CommandPalette: React.FC<CommandPaletteProps> = (props) => (
  <CommandPaletteBase
    {...props}
    classMap={expandClassMap(classes)}
    TextInputComponent={TextInput}
  />
);
CommandPalette.displayName = "CommandPalette";
export default CommandPalette;
