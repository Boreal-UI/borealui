"use client";

import { expandClassMap } from "@/utils/propAliases";
import { forwardRef } from "react";
import styles from "./Toggle.module.scss";
import ToggleBase from "../ToggleBase";
import { ToggleProps } from "../Toggle.types";

const Toggle = forwardRef<HTMLButtonElement, ToggleProps>((props, ref) => {
  return <ToggleBase {...props} classMap={expandClassMap(styles)} ref={ref} />;
});
Toggle.displayName = "Toggle";
export default Toggle;
