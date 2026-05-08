"use client";

import { JSX } from "react";
import TypographyBase from "../TypographyBase";
import { TypographyProps } from "../Typography.types";
import { combineClassNames } from "@/utils/classNames";
import "./Typography.scss";

const classMap = {
  typography: "typography",
  display: "typography_display",
  h1: "typography_h1",
  h2: "typography_h2",
  h3: "typography_h3",
  h4: "typography_h4",
  h5: "typography_h5",
  h6: "typography_h6",
  bodyLg: "typography_body-lg",
  body: "typography_body",
  bodySm: "typography_body-sm",
  label: "typography_label",
  caption: "typography_caption",
  overline: "typography_overline",
  code: "typography_code",
  alignLeft: "typography_align-left",
  alignCenter: "typography_align-center",
  alignRight: "typography_align-right",
  alignInherit: "typography_align-inherit",
  weightLight: "typography_weight-light",
  weightNormal: "typography_weight-normal",
  weightMedium: "typography_weight-medium",
  weightBold: "typography_weight-bold",
  weightBolder: "typography_weight-bolder",
  weightInherit: "typography_weight-inherit",
  primary: "typography_primary",
  secondary: "typography_secondary",
  tertiary: "typography_tertiary",
  quaternary: "typography_quaternary",
  clear: "typography_clear",
  success: "typography_success",
  warning: "typography_warning",
  error: "typography_error",
  themeInherit: "typography_theme-inherit",
  glass: "typography_glass",
  italic: "typography_italic",
  underline: "typography_underline",
  truncate: "typography_truncate",
  noWrap: "typography_no-wrap",
};

export default function Typography(props: TypographyProps): JSX.Element {
  return (
    <TypographyBase
      {...props}
      classMap={classMap}
      combineClassNames={combineClassNames}
    />
  );
}
