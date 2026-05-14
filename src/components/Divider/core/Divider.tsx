import { expandClassMap } from "@/utils/propAliases";
import { forwardRef } from "react";
import DividerBase from "../DividerBase";
import "./Divider.scss";
import { DividerProps } from "../Divider.types";

const classes = {
  divider: "divider",
  horizontal: "divider_horizontal",
  vertical: "divider_vertical",
  dashed: "divider_dashed",
  glass: "divider_glass",
  primary: "divider_primary",
  secondary: "divider_secondary",
  tertiary: "divider_tertiary",
  quaternary: "divider_quaternary",
  clear: "divider_clear",
  success: "divider_success",
  info: "divider_info",
  warning: "divider_warning",
  error: "divider_error",
};

const Divider = forwardRef<HTMLDivElement, DividerProps>((props, ref) => (
  <DividerBase {...props} classMap={expandClassMap(classes)} ref={ref} />
));
Divider.displayName = "Divider";
export default Divider;
