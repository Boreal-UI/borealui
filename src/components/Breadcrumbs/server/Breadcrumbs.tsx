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
import { BreadcrumbsProps } from "../Breadcrumbs.types";
import styles from "../next/Breadcrumbs.module.scss";

export type ServerBreadcrumbsProps = Omit<BreadcrumbsProps, "maxVisible">;

export default function Breadcrumbs({
  items,
  separator = "/",
  disabled = false,
  theme = getDefaultTheme(),
  state,
  size = getDefaultSize(),
  shadow,
  rounding = getDefaultRounding(),
  variant = getDefaultVariant(),
  className,
  testId,
  "data-testid": dataTestId,
  "aria-label": ariaLabel = "Breadcrumbs",
  ...rest
}: ServerBreadcrumbsProps) {
  if (!items.length) return null;
  const classMap = expandClassMap(styles);
  const id = testId ?? dataTestId ?? "breadcrumbs";
  return (
    <nav
      {...rest}
      aria-label={ariaLabel}
      data-testid={`${id}-nav-container`}
      className={combineClassNames(
        classMap.breadcrumbs,
        classMap[theme],
        state && classMap[state],
        classMap[size],
        getShadowClassName(classMap, theme, shadow),
        rounding && classMap[`round${capitalize(rounding)}`],
        disabled && classMap.disabled,
        (variant === "outline" || variant === "glassOutline") &&
          classMap.outline,
        (variant === "glass" || variant === "glassOutline") && classMap.glass,
        className,
      )}
    >
      <ol className={classMap.list}>
        {items.map((item, index) => {
          const last = index === items.length - 1;
          const itemDisabled = disabled || item.disabled;
          return (
            <li
              key={`${item.label}-${item.href ?? index}`}
              className={combineClassNames(
                classMap.item,
                last && classMap.item_active,
                itemDisabled && classMap.disabled,
              )}
            >
              {item.href && !last && !itemDisabled ? (
                <a
                  href={item.href}
                  target={item.target}
                  rel={
                    item.rel ??
                    (item.target === "_blank"
                      ? "noopener noreferrer"
                      : undefined)
                  }
                  className={classMap.link}
                >
                  <span className={classMap.link_label}>{item.label}</span>
                </a>
              ) : (
                <span
                  className={classMap.current}
                  aria-current={last ? "page" : undefined}
                  aria-disabled={itemDisabled || undefined}
                >
                  {item.label}
                </span>
              )}
              {!last ? (
                <span className={classMap.separator} aria-hidden="true">
                  {separator}
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
