import React, { forwardRef, useMemo } from "react";
import { IconButtonBaseProps } from "./IconButton.types";
import { combineClassNames } from "../../utils/classNames";
import { capitalize } from "../../utils/capitalize";
import {
  getDefaultRounding,
  getDefaultShadow,
  getDefaultSize,
  getDefaultTheme,
} from "../../config/boreal-style-config";

const IconButtonBase = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  IconButtonBaseProps
>(function IconButtonBase(
  {
    id,
    icon: Icon,
    theme = getDefaultTheme(),
    state = "",
    href,
    isExternal = false,
    onClick,
    onKeyDown,
    className = "",
    iconClassName = "",
    disabled = false,
    rel,
    target,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledby,
    "aria-describedby": ariaDescribedby,
    "aria-errormessage": ariaErrormessage,
    "aria-invalid": ariaInvalid,
    "aria-haspopup": ariaHaspopup,
    "aria-expanded": ariaExpanded,
    "aria-controls": ariaControls,
    "aria-pressed": ariaPressed,
    "aria-selected": ariaSelected,
    "aria-checked": ariaChecked,
    "aria-current": ariaCurrent,
    "aria-busy": ariaBusy,
    "aria-live": ariaLive,
    "aria-atomic": ariaAtomic,
    role,
    title,
    outline = false,
    glass = false,
    rounding = getDefaultRounding(),
    shadow = getDefaultShadow(),
    size = getDefaultSize(),
    loading = false,
    type = "button",
    classMap,
    LinkComponent = "a",
    "data-testid": testId = "icon-button",
    tabIndex,
    ...rest
  },
  ref,
) {
  const needsLabel = !ariaLabel && !ariaLabelledby && !title;
  if (process.env.NODE_ENV === "development" && needsLabel) {
    console.warn(
      "IconButtonBase: provide `aria-label`, `aria-labelledby`, or `title` for icon-only buttons.",
    );
  }

  const resolvedLabel =
    ariaLabel || (!ariaLabelledby ? title : undefined) || undefined;

  const resolvedBusy = loading || ariaBusy || undefined;
  const inert = disabled || loading;
  const renderAsLink = !!href;

  const classNames = useMemo(
    () =>
      combineClassNames(
        classMap.iconButton,
        classMap[theme],
        classMap[state],
        size && classMap[size],
        shadow && classMap[`shadow${capitalize(shadow)}`],
        rounding && classMap[`round${capitalize(rounding)}`],
        outline && classMap.outline,
        glass && classMap.glass,
        inert && classMap.disabled,
        className,
      ),
    [
      classMap,
      theme,
      state,
      size,
      shadow,
      rounding,
      outline,
      glass,
      inert,
      className,
    ],
  );

  const sharedAccessibilityProps = {
    id,
    role,
    title,
    "data-testid": testId,
    "aria-label": resolvedLabel,
    "aria-labelledby": ariaLabelledby,
    "aria-describedby": ariaDescribedby,
    "aria-errormessage": ariaErrormessage,
    "aria-invalid": ariaInvalid,
    "aria-haspopup": ariaHaspopup,
    "aria-expanded": ariaExpanded,
    "aria-controls": ariaControls,
    "aria-pressed": ariaPressed,
    "aria-selected": ariaSelected,
    "aria-checked": ariaChecked,
    "aria-current": ariaCurrent,
    "aria-busy": resolvedBusy,
  } as const;

  const iconContent = (
    <span
      className={classMap.buttonLabel}
      aria-live={ariaLive ?? "polite"}
      aria-atomic={ariaAtomic ?? true}
    >
      {loading ? (
        <>
          <div className={classMap.loader} aria-hidden="true" />
          <span className="sr_only">Loading</span>
        </>
      ) : Icon ? (
        <Icon
          data-testid="icon-button-icon"
          aria-hidden={true}
          focusable={false}
          className={iconClassName}
        />
      ) : null}
    </span>
  );

  if (renderAsLink) {
    const linkProps = {
      className: combineClassNames(classNames, classMap.link),
      ref: ref as React.Ref<HTMLAnchorElement>,
      onClick: inert
        ? (e: React.MouseEvent<HTMLElement>) => e.preventDefault()
        : onClick,
      onKeyDown,
      "aria-disabled": inert || undefined,
      ...sharedAccessibilityProps,
      ...rest,
      tabIndex: inert ? -1 : tabIndex,
    };

    if (isExternal) {
      return (
        <a
          {...linkProps}
          href={inert ? undefined : href}
          target={target ?? "_blank"}
          rel={rel ?? "noopener noreferrer"}
        >
          {iconContent}
        </a>
      );
    }

    return (
      <LinkComponent {...linkProps} href={inert ? undefined : href}>
        {iconContent}
      </LinkComponent>
    );
  }

  return (
    <button
      type={type}
      disabled={inert}
      className={classNames}
      onClick={inert ? (e) => e.preventDefault() : onClick}
      onKeyDown={onKeyDown}
      ref={ref as React.Ref<HTMLButtonElement>}
      {...sharedAccessibilityProps}
      {...rest}
      tabIndex={tabIndex}
    >
      {iconContent}
    </button>
  );
});

IconButtonBase.displayName = "IconButtonBase";
export default IconButtonBase;
