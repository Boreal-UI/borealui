import { createElement, JSX, useMemo } from "react";
import {
  TypographyAlign,
  TypographyBaseProps,
  TypographyTheme,
  TypographyVariant,
  TypographyWeight,
} from "./Typography.types";

const DEFAULT_TAG_BY_VARIANT: Record<
  TypographyVariant,
  keyof JSX.IntrinsicElements
> = {
  display: "h1",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  "body-lg": "p",
  body: "p",
  "body-sm": "p",
  label: "span",
  caption: "span",
  overline: "span",
  code: "code",
};

const variantClassMap: Record<TypographyVariant, string> = {
  display: "display",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  "body-lg": "bodyLg",
  body: "body",
  "body-sm": "bodySm",
  label: "label",
  caption: "caption",
  overline: "overline",
  code: "code",
};

const alignClassMap: Record<TypographyAlign, string> = {
  left: "alignLeft",
  center: "alignCenter",
  right: "alignRight",
  inherit: "alignInherit",
};

const weightClassMap: Record<TypographyWeight, string> = {
  light: "weightLight",
  normal: "weightNormal",
  medium: "weightMedium",
  bold: "weightBold",
  bolder: "weightBolder",
  inherit: "weightInherit",
};

const themeClassMap: Record<TypographyTheme, string> = {
  primary: "primary",
  secondary: "secondary",
  tertiary: "tertiary",
  quaternary: "quaternary",
  clear: "clear",
  success: "success",
  warning: "warning",
  error: "error",
  inherit: "themeInherit",
};

function TypographyBase({
  children,
  variant = "body",
  as,
  align = "inherit",
  weight = "inherit",
  theme = "inherit",
  glass = false,
  italic = false,
  underline = false,
  truncate = false,
  noWrap = false,
  srOnly = false,
  className,
  style,
  id,
  title,
  testId,
  role,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  "aria-hidden": ariaHidden,
  "aria-live": ariaLive,
  "aria-atomic": ariaAtomic,
  "aria-busy": ariaBusy,
  classMap,
  combineClassNames,
}: TypographyBaseProps): JSX.Element {
  const Component = as ?? DEFAULT_TAG_BY_VARIANT[variant];

  const resolvedClassName = useMemo(
    () =>
      combineClassNames(
        classMap.typography,
        classMap[variantClassMap[variant]],
        classMap[alignClassMap[align]],
        classMap[weightClassMap[weight]],
        classMap[themeClassMap[theme]],
        glass && classMap.glass,
        italic && classMap.italic,
        underline && classMap.underline,
        truncate && classMap.truncate,
        noWrap && classMap.noWrap,
        srOnly && classMap.srOnly,
        className,
      ),
    [
      classMap,
      variant,
      align,
      weight,
      theme,
      glass,
      italic,
      underline,
      truncate,
      noWrap,
      srOnly,
      className,
      combineClassNames,
    ],
  );

  return createElement(
    Component,
    {
      id,
      title,
      style,
      role,
      className: resolvedClassName,
      "data-testid": testId ?? "typography",

      "aria-label": ariaLabelledBy ? undefined : ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": ariaDescribedBy,
      "aria-hidden": ariaHidden,
      "aria-live": ariaLive,
      "aria-atomic": ariaLive ? ariaAtomic : undefined,
      "aria-busy": ariaLive ? ariaBusy : undefined,
    },
    children,
  );
}

TypographyBase.displayName = "TypographyBase";
export default TypographyBase;
