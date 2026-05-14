import React, { useMemo, MouseEvent } from "react";
import { BadgeBaseProps } from "./Badge.types";
import { combineClassNames } from "../../utils/classNames";
import { capitalize } from "../../utils/capitalize";
import {
  getDefaultOutline,
  getDefaultGlass,
  getDefaultRounding,
  getDefaultShadow,
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
  shadow = getDefaultShadow(),
  title,
  size = getDefaultSize(),
  outline = getDefaultOutline(),
  glass = getDefaultGlass(),
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
  if (children == null && !Icon) return null;

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
        shadow && classMap[`shadow${capitalize(shadow)}`],
        rounding && classMap[`round${capitalize(rounding)}`],
        disabled && classMap.disabled,
        outline && classMap.outline,
        glass && classMap.glass,
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
      outline,
      glass,
      onClick,
      className,
      classMap,
    ],
  );

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

  if (href) {
    const isHttp = /^https?:\/\//i.test(href);
    const target = disabled
      ? undefined
      : (targetProp ?? (isHttp ? "_blank" : undefined));
    const rel =
      relProp ?? (target === "_blank" ? "noopener noreferrer" : undefined);

    return (
      <a
        href={disabled ? undefined : href}
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
      {...(rest as React.HTMLAttributes<HTMLSpanElement>)}
    >
      {inner}
    </span>
  );
};
