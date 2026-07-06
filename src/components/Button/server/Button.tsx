import { ReactNode } from "react";
import { combineClassNames } from "@/utils/classNames";
import { expandClassMap } from "@/utils/propAliases";
import { capitalize } from "@/utils/capitalize";
import {
  getDefaultGlass,
  getDefaultOutline,
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
  glass = getDefaultGlass(),
  state,
  rounding = getDefaultRounding(),
  shadow,
  disabled = false,
  href,
  target,
  rel,
  isExternal = false,
  outline = getDefaultOutline(),
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
  const classMap = expandClassMap(styles);
  const resolvedTestId = testId ?? dataTestId ?? "button";
  const classes = combineClassNames(
    classMap.button,
    disabled && classMap.disabled,
    classMap[theme],
    state && classMap[state],
    classMap[size],
    outline && classMap.outline,
    glass && classMap.glass,
    getShadowClassName(classMap, theme, shadow),
    rounding && classMap[`round${capitalize(rounding)}`],
    fullWidth && classMap.fullWidth,
    classMap[`icon${capitalize(iconPosition)}`],
    className,
  );
  const icon = Icon ? (
    <span className={combineClassNames(classMap.buttonIcon, iconWrapperClassName)} aria-hidden="true">
      <Icon className={combineClassNames(classMap.icon, iconClassName)} aria-hidden />
    </span>
  ) : null;
  const content = (
    <>
      {iconPosition === "left" && icon}
      <span className={combineClassNames(classMap.buttonLabel, labelClassName)}>
        {loading ? <span className={combineClassNames(classMap.loader, loaderClassName)} aria-label={loadingLabel} /> : children}
      </span>
      {iconPosition === "right" && icon}
    </>
  );

  if (href) {
    const external = target === "_blank" || isExternal || /^https?:\/\//i.test(href);
    return (
      <a
        {...rest}
        href={disabled ? undefined : href}
        target={disabled ? undefined : target ?? (external ? "_blank" : undefined)}
        rel={rel ?? (external ? "noopener noreferrer" : undefined)}
        className={combineClassNames(classes, classMap.link)}
        aria-disabled={disabled || loading || undefined}
        data-testid={resolvedTestId}
      >
        {content}
      </a>
    );
  }

  return (
    <button {...rest} type={type} className={classes} disabled={disabled || loading} data-testid={resolvedTestId}>
      {content}
    </button>
  );
}
