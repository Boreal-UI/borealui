import React, { useMemo, MouseEvent } from "react";
import { BadgeBaseProps } from "./Badge.types";
import { combineClassNames } from "../../utils/classNames";
import { capitalize } from "../../utils/capitalize";
import { mergeSafeRel, sanitizeNavigationHref } from "../../utils/navigationSecurity";
import {
  getDefaultVariant,
  getDefaultRounding,
  getShadowClassName,
  getDefaultSize,
  getDefaultTheme,
} from "../../config/boreal-style-config";

export const BadgeBase: React.FC<BadgeBaseProps> = ({
  children,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  "aria-live": ariaLive,
  "aria-atomic": ariaAtomic,
  role,
  tabIndex,
  theme = getDefaultTheme(),
  state,
  disabled = false,
  rounding = getDefaultRounding(),
  shadow,
  title,
  size = getDefaultSize(),
  variant = getDefaultVariant(),
  icon: Icon,
  className,
  classMap,
  "data-testid": dataTestId,
  testId = dataTestId ?? "badge",
  onClick,
  href,
  target: targetProp,
  rel: relProp,
  ...rest
}: BadgeBaseProps) => {
  const isTextContent =
    typeof children === "string" || typeof children === "number";

  const accessibleLabel =
    ariaLabel ?? (isTextContent ? String(children) : undefined);

  const combinedClassName = useMemo(
    () =>
      combineClassNames(
        classMap.badge,
        classMap[size],
        classMap[theme],
        state && classMap[state],
        getShadowClassName(classMap, theme, shadow),
        rounding && classMap[`round${capitalize(rounding)}`],
        disabled && classMap.disabled,
        (variant === "outline" || variant === "glassOutline") &&
          classMap.outline,
        (variant === "glass" || variant === "glassOutline") && classMap.glass,
        onClick && classMap.clickable,
        className,
      ),
    [
      size,
      theme,
      state,
      shadow,
      rounding,
      disabled,
      variant,
      onClick,
      className,
      classMap,
    ],
  );

  if (children == null && !Icon) return null;

  const handleClick = (e: MouseEvent<HTMLElement>) => {
    if (disabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    onClick?.(e as MouseEvent<HTMLButtonElement | HTMLAnchorElement>);
  };

  const sharedAccessibilityProps = {
    ...(accessibleLabel ? { "aria-label": accessibleLabel } : {}),
    ...(ariaLabelledBy ? { "aria-labelledby": ariaLabelledBy } : {}),
    ...(ariaDescribedBy ? { "aria-describedby": ariaDescribedBy } : {}),
    ...(ariaLive ? { "aria-live": ariaLive } : {}),
    ...(ariaAtomic !== undefined ? { "aria-atomic": ariaAtomic } : {}),
    ...(role ? { role } : {}),
    ...(tabIndex !== undefined ? { tabIndex } : {}),
  };

  const inner = (
    <>
      {Icon && (
        <Icon
          className={classMap.badge_icon}
          aria-hidden="true"
          focusable="false"
          data-testid={testId ? `${testId}-icon` : undefined}
        />
      )}
      {children}
    </>
  );

  const safeHref = sanitizeNavigationHref(href);

  if (safeHref) {
    const isHttp = /^https?:\/\//i.test(safeHref);
    const target = disabled
      ? undefined
      : (targetProp ?? (isHttp ? "_blank" : undefined));
    const rel = mergeSafeRel(target, relProp);

    return (
      <a
        href={disabled ? undefined : safeHref}
        className={combinedClassName}
        onClick={handleClick}
        data-testid={testId ? `${testId}-main` : undefined}
        title={title ?? accessibleLabel}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : tabIndex}
        target={target}
        rel={rel}
        {...sharedAccessibilityProps}
        {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {inner}
      </a>
    );
  }

  if (onClick) {
    return (
      <button
        type="button"
        className={combinedClassName}
        onClick={handleClick}
        disabled={disabled}
        data-testid={testId ? `${testId}-main` : undefined}
        title={title ?? accessibleLabel}
        {...sharedAccessibilityProps}
        {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {inner}
      </button>
    );
  }

  return (
    <span
      className={combinedClassName}
      data-testid={testId ? `${testId}-main` : undefined}
      title={title ?? accessibleLabel}
      role={role ?? "status"}
      tabIndex={tabIndex}
      {...(accessibleLabel ? { "aria-label": accessibleLabel } : {})}
      {...(ariaLabelledBy ? { "aria-labelledby": ariaLabelledBy } : {})}
      {...(ariaDescribedBy ? { "aria-describedby": ariaDescribedBy } : {})}
      {...(ariaLive ? { "aria-live": ariaLive } : {})}
      {...(ariaAtomic !== undefined ? { "aria-atomic": ariaAtomic } : {})}
      {...rest}
    >
      {inner}
    </span>
  );
};
