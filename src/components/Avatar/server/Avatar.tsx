import { combineClassNames } from "@/utils/classNames";
import { expandClassMap } from "@/utils/propAliases";
import { getInitials } from "@/utils/getInitials";
import {
  getDefaultVariant,
  getDefaultSize,
  getDefaultTheme,
  getShadowClassName,
} from "@/config/boreal-style-config";
import { FallbackUserIcon } from "@/Icons";
import { AvatarProps } from "../Avatar.types";
import styles from "../next/Avatar.module.scss";

export type ServerAvatarProps = Omit<AvatarProps, "onClick" | "imageFill">;

export default function Avatar({
  src,
  alt,
  name,
  label,
  href,
  disabled = false,
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
  testId,
  "data-testid": dataTestId,
  target,
  rel,
  ...rest
}: ServerAvatarProps) {
  const classMap = expandClassMap(styles);
  const id = testId ?? dataTestId ?? "avatar";
  const computedLabel = label || alt || name || "User avatar";
  const classes = combineClassNames(
    classMap.avatar,
    classMap[theme],
    state && classMap[state],
    classMap[shape],
    classMap[size],
    getShadowClassName(classMap, theme, shadow),
    disabled && classMap.disabled,
    (variant === "outline" || variant === "glassOutline") && classMap.outline,
    (variant === "glass" || variant === "glassOutline") && classMap.glass,
    className,
  );
  const imageSrc = typeof src === "string" ? src : undefined;
  const content =
    children ??
    (imageSrc ? (
      <img
        src={imageSrc}
        alt={alt || computedLabel}
        className={classMap.image}
        loading="lazy"
        data-testid={`${id}-image`}
      />
    ) : (
      <span className={classMap.initials} title={computedLabel}>
        {fallback ??
          (name ? (
            getInitials(name)
          ) : (
            <FallbackUserIcon className={classMap.fallback_icon} />
          ))}
      </span>
    ));
  const inner = (
    <>
      {content}
      {status || statusIcon ? (
        <>
          <span
            className={combineClassNames(
              classMap.status,
              status && classMap[status],
              Boolean(statusIcon) && classMap.icon_only,
              classMap[statusPosition],
            )}
            aria-hidden="true"
          >
            {statusIcon || <span className={classMap.dot} />}
          </span>
          {statusLabel ? (
            <span className="sr_only">{statusLabel}</span>
          ) : null}
        </>
      ) : null}
    </>
  );
  return href ? (
    <a
      {...rest}
      href={disabled ? undefined : href}
      target={target}
      rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)}
      className={classes}
      aria-label={computedLabel}
      aria-disabled={disabled || undefined}
      data-testid={`${id}-main`}
    >
      {inner}
    </a>
  ) : (
    <span
      {...rest}
      className={classes}
      role="img"
      aria-label={computedLabel}
      data-testid={`${id}-main`}
    >
      {inner}
    </span>
  );
}
