"use client";

import { expandClassMap } from "@/utils/propAliases";
import React from "react";
import CommandPaletteBase from "../CommandPaletteBase";
import styles from "./CommandPalette.module.scss";
import TextInput from "../../TextInput/next/TextInput";
import { CommandPaletteProps } from "../CommandPalette.types";

const CommandPalette: React.FC<CommandPaletteProps> = (props) => (
  <CommandPaletteBase
    {...props}
    classMap={expandClassMap(styles)}
    TextInputComponent={TextInput}
  />
);
CommandPalette.displayName = "CommandPalette";
export default CommandPalette;
