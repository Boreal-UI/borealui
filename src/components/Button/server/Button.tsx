import { ReactNode } from "react";
import { combineClassNames } from "@/utils/classNames";
import { expandClassMap } from "@/utils/propAliases";
import { capitalize } from "@/utils/capitalize";
import { mergeSafeRel, sanitizeNavigationHref } from "@/utils/navigationSecurity";
import {
  getDefaultVariant,
  getDefaultRounding,
  getDefaultSize,
  getDefaultTheme,
  getShadowClassName,
} from "@/config/boreal-style-config";
import { ButtonProps } from "../Button.types";
import styles from "../next/Button.module.scss";

export type ServerButtonProps = Omit<ButtonProps, "as" | "onClick"> & {
  children?: ReactNode;
};

export default function Button({
  children,
  icon: Icon,
  iconPosition = "left",
  theme = getDefaultTheme(),
  variant = getDefaultVariant(),
  state,
  rounding = getDefaultRounding(),
  shadow,
  disabled = false,
  href,
  target,
  rel,
  isExternal = false,
  size = getDefaultSize(),
  loading = false,
  loadingLabel = "Loading",
  fullWidth = false,
  className,
  iconWrapperClassName,
  iconClassName,
  labelClassName,
  loaderClassName,
  testId,
  "data-testid": dataTestId,
  type = "button",
  ...rest
}: ServerButtonProps) {
  const safeHref = sanitizeNavigationHref(href);
  const classMap = expandClassMap(styles);
  const resolvedTestId = testId ?? dataTestId ?? "button";
  const classes = combineClassNames(
    classMap.button,
    disabled && classMap.disabled,
    classMap[theme],
    state && classMap[state],
    classMap[size],
    (variant === "outline" || variant === "glassOutline") && classMap.outline,
    (variant === "glass" || variant === "glassOutline") && classMap.glass,
    getShadowClassName(classMap, theme, shadow),
    rounding && classMap[`round${capitalize(rounding)}`],
    fullWidth && classMap.fullWidth,
    classMap[`icon${capitalize(iconPosition)}`],
    className,
  );
  const icon = Icon ? (
    <span
      className={combineClassNames(classMap.buttonIcon, iconWrapperClassName)}
      aria-hidden="true"
    >
      <Icon
        className={combineClassNames(classMap.icon, iconClassName)}
        aria-hidden
      />
    </span>
  ) : null;
  const content = (
    <>
      {iconPosition === "left" && icon}
      <span className={combineClassNames(classMap.buttonLabel, labelClassName)}>
        {loading ? (
          <span
            className={combineClassNames(classMap.loader, loaderClassName)}
            aria-label={loadingLabel}
          />
        ) : (
          children
        )}
      </span>
      {iconPosition === "right" && icon}
    </>
  );

  if (safeHref) {
    const external =
      target === "_blank" || isExternal || /^https?:\/\//i.test(safeHref);
    const resolvedTarget = disabled ? undefined : (target ?? (external ? "_blank" : undefined));
    return (
      <a
        {...rest}
        href={disabled ? undefined : safeHref}
        target={resolvedTarget}
        rel={mergeSafeRel(resolvedTarget, rel)}
        className={combineClassNames(classes, classMap.link)}
        aria-disabled={disabled || loading || undefined}
        data-testid={resolvedTestId}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      {...rest}
      type={type}
      className={classes}
      disabled={disabled || loading}
      data-testid={resolvedTestId}
    >
      {content}
    </button>
  );
}
