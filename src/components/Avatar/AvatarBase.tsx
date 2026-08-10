import React, {
  useMemo,
  useState,
  MouseEvent,
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  forwardRef,
  useId,
} from "react";
import { AvatarBaseProps } from "./Avatar.types";
import { getInitials } from "../../utils/getInitials";
import { combineClassNames } from "../../utils/classNames";
import { mergeSafeRel, sanitizeNavigationHref } from "../../utils/navigationSecurity";
import { FallbackUserIcon } from "../../Icons/index";
import {
  getDefaultVariant,
  getShadowClassName,
  getDefaultSize,
  getDefaultTheme,
} from "../../config/boreal-style-config";

export const AvatarBase = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  AvatarBaseProps
>(function AvatarBase(
  {
    src,
    alt,
    name,
    label,
    onClick,
    disabled = false,
    href,
    target: targetProp,
    rel: relProp,
    status,
    statusLabel,
    statusIcon,
    statusPosition = "bottomRight",
    fallback,
    children,
    size = getDefaultSize(),
    shadow,
    shape = "circle",
    variant = getDefaultVariant(),
    theme = getDefaultTheme(),
    state,
    className,
    priority = false,
    imageFill = false,
    ImageComponent = "img",
    LinkComponent = "a",
    classMap,
    role,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-describedby": ariaDescribedBy,
    "aria-current": ariaCurrent,
    "data-testid": dataTestId,
    testId = dataTestId ?? "avatar",
    ...rest
  },
  ref,
) {
  const [imgError, setImgError] = useState(false);
  const generatedStatusId = useId();

  const computedLabel = label || alt || name || "User avatar";

  const describedBy = useMemo(() => {
    const ids: string[] = [];

    if (ariaDescribedBy) {
      ids.push(ariaDescribedBy);
    }

    if (statusLabel && (status || statusIcon)) {
      ids.push(generatedStatusId);
    }

    return ids.length > 0 ? ids.join(" ") : undefined;
  }, [ariaDescribedBy, statusLabel, status, statusIcon, generatedStatusId]);

  const linkAria = {
    role,
    "aria-label": ariaLabelledBy ? undefined : (ariaLabel ?? computedLabel),
    "aria-labelledby": ariaLabelledBy,
    "aria-describedby": describedBy,
    "aria-current": ariaCurrent,
    "aria-disabled": disabled || undefined,
  } as const;

  const buttonAria = {
    role,
    "aria-label": ariaLabelledBy ? undefined : (ariaLabel ?? computedLabel),
    "aria-labelledby": ariaLabelledBy,
    "aria-describedby": describedBy,
    "aria-current": ariaCurrent,
  } as const;

  const fallbackContent =
    fallback ??
    (name ? (
      getInitials(name)
    ) : (
      <FallbackUserIcon className={classMap.fallback_icon} />
    ));

  const combinedClassName = useMemo(
    () =>
      combineClassNames(
        classMap.avatar,
        classMap[theme],
        state && classMap[state],
        classMap[shape],
        classMap[size],
        getShadowClassName(classMap, theme, shadow),
        disabled && classMap.disabled,
        (variant === "outline" || variant === "glassOutline") &&
          classMap.outline,
        (variant === "glass" || variant === "glassOutline") && classMap.glass,
        onClick && classMap.clickable,
        className,
      ),
    [
      theme,
      state,
      shape,
      size,
      shadow,
      disabled,
      variant,
      onClick,
      className,
      classMap,
    ],
  );

  const avatarContent =
    !imgError && src ? (
      <ImageComponent
        src={src}
        alt={alt || computedLabel}
        className={classMap.image}
        onError={() => setImgError(true)}
        {...(priority
          ? { loading: "eager" as const }
          : { loading: "lazy" as const })}
        {...(imageFill ? { fill: true } : {})}
        data-testid={testId ? `${testId}-image` : undefined}
      />
    ) : (
      <span
        className={classMap.initials}
        title={computedLabel}
        aria-hidden={children ? true : undefined}
        data-testid={testId ? `${testId}-initials` : undefined}
      >
        {fallbackContent}
      </span>
    );

  const statusIndicator = (status || statusIcon) && (
    <>
      <span
        className={combineClassNames(
          classMap.status,
          status && classMap[status],
          statusIcon ? classMap.icon_only : undefined,
          classMap[statusPosition],
        )}
        aria-hidden="true"
        data-testid={testId ? `${testId}-status` : undefined}
      >
        {statusIcon || <span className={classMap.dot} />}
      </span>

      {statusLabel ? (
        <span
          id={generatedStatusId}
          className="sr_only"
          data-testid={testId ? `${testId}-status-label` : undefined}
        >
          {statusLabel}
        </span>
      ) : null}
    </>
  );

  const content = (
    <>
      {children ?? avatarContent}
      {statusIndicator}
    </>
  );

  const handleClick = (e: MouseEvent<HTMLElement>) => {
    if (disabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    onClick?.(e as MouseEvent<HTMLButtonElement | HTMLAnchorElement>);
  };

  const safeHref = sanitizeNavigationHref(href);

  if (safeHref) {
    const isHttp = /^https?:\/\//i.test(safeHref);
    const target = disabled
      ? undefined
      : (targetProp ?? (isHttp ? "_blank" : undefined));
    const rel = mergeSafeRel(target, relProp);

    return LinkComponent === "a" ? (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={disabled ? undefined : safeHref}
        className={combinedClassName}
        onClick={handleClick}
        data-testid={testId ? `${testId}-main` : undefined}
        target={target}
        rel={rel}
        tabIndex={disabled ? -1 : 0}
        {...linkAria}
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </a>
    ) : (
      <LinkComponent
        ref={ref}
        href={safeHref}
        className={combinedClassName}
        onClick={handleClick}
        data-testid={testId ? `${testId}-main` : undefined}
        tabIndex={disabled ? -1 : 0}
        target={target}
        rel={rel}
        {...linkAria}
        {...(rest as Record<string, unknown>)}
      >
        {content}
      </LinkComponent>
    );
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type="button"
      className={combinedClassName}
      onClick={handleClick}
      disabled={disabled}
      data-testid={testId ? `${testId}-main` : undefined}
      {...buttonAria}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );
});

AvatarBase.displayName = "AvatarBase";
