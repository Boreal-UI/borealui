import React, { forwardRef, useMemo } from "react";
import { ButtonBaseProps } from "./Button.types";
import { combineClassNames } from "../../utils/classNames";
import { capitalize } from "../../utils/capitalize";
import {
  getDefaultVariant,
  getDefaultRounding,
  getShadowClassName,
  getDefaultSize,
  getDefaultTheme,
} from "../../config/boreal-style-config";

const ButtonBase = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonBaseProps
>(
  (
    {
      icon: Icon,
      iconPosition = "left",

      theme = getDefaultTheme(),
      variant = getDefaultVariant(),

      state,
      onClick,
      type = "button",
      rounding = getDefaultRounding(),
      shadow,
      children,
      className,
      iconWrapperClassName,
      iconClassName,
      labelClassName,
      loaderClassName,
      disabled = false,

      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": ariaDescribedBy,
      "aria-controls": ariaControls,
      "aria-expanded": ariaExpanded,
      "aria-pressed": ariaPressed,
      "aria-current": ariaCurrent,
      "aria-haspopup": ariaHasPopup,
      "aria-live": ariaLive,
      "aria-atomic": ariaAtomic,
      "aria-busy": ariaBusy,
      "aria-disabled": ariaDisabled,

      href,
      target: targetProp,
      rel: relProp,
      as,
      isExternal = false,
      size = getDefaultSize(),
      loading = false,
      loadingLabel = "Loading",
      fullWidth = false,
      "data-testid": dataTestId,
      testId = dataTestId ?? "button",
      classMap,
      LinkComponent = "a",
      ...rest
    },
    ref,
  ) => {
    const iconOnly =
      !children ||
      (typeof children !== "string" && React.Children.count(children) === 0);

    const computedAriaLabel =
      iconOnly && !ariaLabelledBy ? ariaLabel : undefined;

    if (
      process.env.NODE_ENV === "development" &&
      iconOnly &&
      !ariaLabel &&
      !ariaLabelledBy
    ) {
      console.warn(
        "ButtonBase: icon-only buttons must provide `aria-label` or `aria-labelledby`.",
      );
    }

    const combinedClassName = useMemo(
      () =>
        combineClassNames(
          classMap.button,
          disabled && classMap.disabled,
          classMap[theme],
          state && classMap[state],
          classMap[size],
          (variant === "outline" || variant === "glassOutline") &&
            classMap.outline,
          (variant === "glass" || variant === "glassOutline") && classMap.glass,
          getShadowClassName(classMap, theme, shadow),
          rounding && classMap[`round${capitalize(rounding)}`],
          fullWidth && classMap.fullWidth,
          iconPosition === "left" && classMap.iconLeft,
          iconPosition === "right" && classMap.iconRight,
          className,
        ),
      [
        theme,
        state,
        variant,
        size,
        shadow,
        rounding,
        fullWidth,
        disabled,
        iconPosition,
        className,
        classMap,
      ],
    );

    const iconElement = Icon ? (
      <span
        className={combineClassNames(classMap.buttonIcon, iconWrapperClassName)}
        aria-hidden="true"
        data-testid={testId ? `${testId}-icon` : undefined}
      >
        <Icon
          className={combineClassNames(classMap.icon, iconClassName)}
          aria-hidden={true}
          focusable={false}
        />
      </span>
    ) : null;

    const labelElement = (
      <span
        className={combineClassNames(classMap.buttonLabel, labelClassName)}
        aria-live={loading ? (ariaLive ?? "polite") : undefined}
        aria-atomic={loading ? (ariaAtomic ?? true) : undefined}
        data-testid={testId ? `${testId}-loading` : undefined}
      >
        {loading ? (
          <>
            <div
              className={combineClassNames(classMap.loader, loaderClassName)}
              aria-hidden="true"
            />
            <span className="sr_only">{loadingLabel}</span>
          </>
        ) : (
          <>
            {children}
            {href &&
              (targetProp === "_blank" ||
                (isExternal ?? /^https?:\/\//i.test(href))) && (
                <span className="sr_only"> (opens in a new tab)</span>
              )}
          </>
        )}
      </span>
    );

    const content = (
      <>
        {iconPosition === "left" && iconElement}
        {labelElement}
        {iconPosition === "right" && iconElement}
      </>
    );

    if (href) {
      const external =
        (targetProp === "_blank" || isExternal || /^https?:\/\//i.test(href)) &&
        !disabled;

      const Comp = external ? "a" : (as ?? LinkComponent ?? "a");

      const target = disabled
        ? undefined
        : (targetProp ?? (external ? "_blank" : undefined));

      const rel =
        relProp ?? (target === "_blank" ? "noopener noreferrer" : undefined);

      const linkCommon = {
        ref: ref as React.Ref<HTMLAnchorElement>,
        className: combineClassNames(combinedClassName, classMap.link),
        onClick: disabled
          ? (e: React.MouseEvent) => e.preventDefault()
          : onClick,
        "aria-label": computedAriaLabel,
        "aria-labelledby": ariaLabelledBy,
        "aria-describedby": ariaDescribedBy,
        "aria-controls": ariaControls,
        "aria-expanded": ariaExpanded,
        "aria-current": ariaCurrent,
        "aria-haspopup": ariaHasPopup,
        "aria-busy": loading ? (ariaBusy ?? true) : ariaBusy,
        "aria-disabled": disabled ? (ariaDisabled ?? true) : ariaDisabled,
        tabIndex: disabled ? -1 : undefined,
        "data-testid": testId,
      } as const;

      if (Comp === "a") {
        return (
          <a
            {...linkCommon}
            href={disabled ? undefined : href}
            target={target}
            rel={rel}
            {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
          >
            {content}
          </a>
        );
      }

      return (
        <Comp
          {...(linkCommon as Omit<
            React.ComponentPropsWithoutRef<typeof Comp>,
            "children"
          >)}
          href={href as never}
          target={target}
          rel={rel}
          {...(rest as React.ComponentPropsWithoutRef<typeof Comp>)}
        >
          {content}
        </Comp>
      );
    }

    const Comp = as ?? "button";

    if (Comp === "button") {
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type={type}
          className={combinedClassName}
          disabled={disabled || loading}
          aria-label={computedAriaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          aria-controls={ariaControls}
          aria-expanded={ariaExpanded}
          aria-pressed={ariaPressed}
          aria-current={ariaCurrent}
          aria-haspopup={ariaHasPopup}
          aria-busy={loading ? (ariaBusy ?? true) : ariaBusy}
          aria-disabled={ariaDisabled}
          data-testid={testId}
          onClick={disabled || loading ? undefined : onClick}
          {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        >
          {content}
        </button>
      );
    }

    return (
      <Comp
        ref={ref as React.Ref<HTMLElement>}
        className={combinedClassName}
        role="button"
        tabIndex={disabled || loading ? -1 : 0}
        aria-label={computedAriaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-controls={ariaControls}
        aria-expanded={ariaExpanded}
        aria-pressed={ariaPressed}
        aria-current={ariaCurrent}
        aria-haspopup={ariaHasPopup}
        aria-busy={loading ? (ariaBusy ?? true) : ariaBusy}
        aria-disabled={disabled || loading ? true : ariaDisabled}
        data-testid={testId}
        onClick={disabled || loading ? undefined : onClick}
        onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
          if (disabled || loading) return;

          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick?.(e as unknown as React.MouseEvent<HTMLElement>);
          }
        }}
        {...(rest as React.ComponentPropsWithoutRef<typeof Comp>)}
      >
        {content}
      </Comp>
    );
  },
);

ButtonBase.displayName = "ButtonBase";

export default ButtonBase;
