import React, { useMemo, useState } from "react";
import { Breadcrumb, BreadcrumbsBaseProps } from "./Breadcrumbs.types";
import { combineClassNames } from "../../utils/classNames";
import { capitalize } from "../../utils/capitalize";
import {
  getDefaultVariant,
  getDefaultRounding,
  getShadowClassName,
  getDefaultSize,
  getDefaultTheme,
} from "../../config/boreal-style-config";

export const ELLIPSIS_LABEL = "…";

export const BreadcrumbsBase: React.FC<BreadcrumbsBaseProps> = ({
  items,
  "aria-label": ariaLabel = "Breadcrumbs",
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  theme = getDefaultTheme(),
  rounding = getDefaultRounding(),
  shadow,
  state,
  separator,
  classMap,
  disabled = false,
  size = getDefaultSize(),
  variant = getDefaultVariant(),
  className,
  maxVisible,
  LinkComponent = "a",
  ButtonComponent = "button",
  "data-testid": dataTestId,
  testId = dataTestId ?? "breadcrumbs",
  ...rest
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpand = () => {
    setIsExpanded(true);
  };

  const visibleItems: Breadcrumb[] = useMemo(() => {
    if (isExpanded || !maxVisible || items.length <= maxVisible) return items;

    const first = items[0];
    const lastItems = items.slice(items.length - (maxVisible - 2));

    return [first, { label: ELLIPSIS_LABEL }, ...lastItems];
  }, [items, isExpanded, maxVisible]);

  const breadcrumbsClass = useMemo(
    () =>
      combineClassNames(
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
      ),
    [
      theme,
      state,
      size,
      shadow,
      rounding,
      disabled,
      variant,
      className,
      classMap,
    ],
  );

  if (!items || items.length === 0) return null;

  return (
    <nav
      {...rest}
      aria-label={ariaLabelledBy ? undefined : ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      data-testid={testId ? `${testId}-nav-container` : undefined}
      className={breadcrumbsClass}
    >
      <ol
        className={classMap.list}
        data-testid={testId ? `${testId}-nav-list` : undefined}
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        {visibleItems.map((item, index) => {
          const isLast = index === visibleItems.length - 1;
          const isEllipsis = item.label === ELLIPSIS_LABEL;
          const isItemDisabled = disabled || item.disabled;

          const itemClassName = combineClassNames(
            classMap.item,
            isExpanded && !isEllipsis && classMap.item_animate,
            isLast && classMap.item_active,
            isItemDisabled && classMap.disabled,
          );

          const itemTitle = item.title ?? item.label;
          const linkTarget = isItemDisabled ? undefined : item.target;
          const linkRel =
            item.rel ??
            (linkTarget === "_blank" ? "noopener noreferrer" : undefined);

          return (
            <li
              data-testid={testId ? `${testId}-nav-item` : undefined}
              key={`${item.label}-${item.href ?? index}`}
              className={itemClassName}
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {isEllipsis ? (
                <ButtonComponent
                  theme="clear"
                  size="xs"
                  className={classMap.ellipsis}
                  aria-label="Show all breadcrumbs"
                  aria-expanded={isExpanded}
                  aria-disabled={isItemDisabled || undefined}
                  onClick={isItemDisabled ? undefined : handleExpand}
                  disabled={isItemDisabled}
                  tabIndex={isItemDisabled ? -1 : 0}
                  data-testid={testId ? `${testId}-ellipsis` : undefined}
                >
                  {item.label}
                </ButtonComponent>
              ) : item.href && !isLast ? (
                isItemDisabled ? (
                  <span
                    className={combineClassNames(
                      classMap.link_disabled,
                      classMap.current,
                    )}
                    title={itemTitle}
                    aria-label={item["aria-label"]}
                    aria-disabled="true"
                    itemProp="name"
                    data-testid={
                      testId ? `${testId}-nav-item-label` : undefined
                    }
                  >
                    {item.label}
                  </span>
                ) : (
                  <LinkComponent
                    href={item.href}
                    target={linkTarget}
                    rel={linkRel}
                    className={classMap.link}
                    title={itemTitle}
                    aria-label={item["aria-label"]}
                    itemProp="item"
                    data-testid={
                      testId ? `${testId}-nav-item-label` : undefined
                    }
                  >
                    <span itemProp="name" className={classMap.link_label}>
                      {item.label}
                    </span>
                  </LinkComponent>
                )
              ) : (
                <span
                  className={classMap.current}
                  itemProp="name"
                  aria-current="page"
                  aria-label={item["aria-label"]}
                  title={itemTitle}
                  data-testid={
                    testId ? `${testId}-nav-item-current` : undefined
                  }
                >
                  {item.label}
                </span>
              )}

              {!isLast && (
                <span className={classMap.separator} aria-hidden="true">
                  {separator ?? "/"}
                </span>
              )}

              <meta itemProp="position" content={`${index + 1}`} />
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

BreadcrumbsBase.displayName = "BreadcrumbsBase";
