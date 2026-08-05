import { combineClassNames } from "@/utils/classNames";
import { expandClassMap } from "@/utils/propAliases";
import { capitalize } from "@/utils/capitalize";
import {
  getDefaultVariant,
  getDefaultRounding,
  getDefaultSize,
  getDefaultTheme,
  getShadowClassName,
} from "@/config/boreal-style-config";
import { BadgeProps } from "../Badge.types";
import styles from "../next/Badge.module.scss";

export type ServerBadgeProps = Omit<BadgeProps, "onClick">;

export default function Badge({
  children,
  icon: Icon,
  href,
  disabled = false,
  theme = getDefaultTheme(),
  state,
  size = getDefaultSize(),
  rounding = getDefaultRounding(),
  shadow,
  variant = getDefaultVariant(),
  className,
  testId,
  "data-testid": dataTestId,
  target,
  rel,
  ...rest
}: ServerBadgeProps) {
  if (children == null && !Icon) return null;
  const classMap = expandClassMap(styles);
  const id = testId ?? dataTestId ?? "badge";
  const classes = combineClassNames(
    classMap.badge,
    classMap[size],
    classMap[theme],
    state && classMap[state],
    getShadowClassName(classMap, theme, shadow),
    rounding && classMap[`round${capitalize(rounding)}`],
    disabled && classMap.disabled,
    (variant === "outline" || variant === "glassOutline") && classMap.outline,
    (variant === "glass" || variant === "glassOutline") && classMap.glass,
    className,
  );
  const content = (
    <>
      {Icon ? <Icon className={classMap.badge_icon} aria-hidden /> : null}
      {children}
    </>
  );
  return href ? (
    <a
      {...rest}
      href={disabled ? undefined : href}
      target={target}
      rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)}
      className={classes}
      aria-disabled={disabled || undefined}
      data-testid={`${id}-main`}
    >
      {content}
    </a>
  ) : (
    <span
      {...rest}
      className={classes}
      role={rest.role ?? "status"}
      data-testid={`${id}-main`}
    >
      {content}
    </span>
  );
}
