import { expandClassMap } from "@/utils/propAliases";
import { forwardRef } from "react";
import "./SegmentedControl.scss";
import SegmentedControlBase from "../SegmentedControlBase";
import { SegmentedControlProps } from "../SegmentedControl.types";

const classes = {
  container: "segmentedControl_container",
  label: "segmentedControl_label",
  labelTop: "segmentedControl_labelTop",
  labelBottom: "segmentedControl_labelBottom",
  labelLeft: "segmentedControl_labelLeft",
  labelRight: "segmentedControl_labelRight",

  root: "segmentedControl",
  content: "segmentedControl_content",
  option: "segmentedControl_option",
  optionSelected: "segmentedControl_optionSelected",
  optionDisabled: "segmentedControl_optionDisabled",
  optionIcon: "segmentedControl_optionIcon",
  optionLabel: "segmentedControl_optionLabel",
  loader: "segmentedControl_loader",
  srOnly: "sr_only",
  vertical: "segmentedControl_vertical",
  fullWidth: "segmentedControl_fullWidth",
  equalWidth: "segmentedControl_equalWidth",

  primary: "segmentedControl_primary",
  secondary: "segmentedControl_secondary",
  tertiary: "segmentedControl_tertiary",
  quaternary: "segmentedControl_quaternary",

  success: "segmentedControl_success",
  info: "segmentedControl_info",
  warning: "segmentedControl_warning",
  error: "segmentedControl_error",

  clear: "segmentedControl_clear",
  disabled: "segmentedControl_disabled",
  loading: "segmentedControl_loading",

  shadowNone: "segmentedControl_shadow-None",
  shadowLight: "segmentedControl_shadow-Light",
  shadowMedium: "segmentedControl_shadow-Medium",
  shadowStrong: "segmentedControl_shadow-Strong",
  shadowIntense: "segmentedControl_shadow-Intense",

  roundNone: "segmentedControl_round-None",
  roundSmall: "segmentedControl_round-Small",
  roundMedium: "segmentedControl_round-Medium",
  roundLarge: "segmentedControl_round-Large",
  roundFull: "segmentedControl_round-Full",
  glass: "segmentedControl_glass",
  outline: "segmentedControl_outline",
};

const SegmentedControl = forwardRef<HTMLDivElement, SegmentedControlProps>(
  (props, ref) => (
    <SegmentedControlBase
      {...props}
      ref={ref}
      classMap={expandClassMap(classes)}
    />
  ),
);

SegmentedControl.displayName = "SegmentedControl";
export default SegmentedControl;
