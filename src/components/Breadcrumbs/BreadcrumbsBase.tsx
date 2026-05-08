import React, { useMemo, useState } from "react";
import { Breadcrumb, BreadcrumbsBaseProps } from "./Breadcrumbs.types";
import { combineClassNames } from "../../utils/classNames";
import { ArrowRightIcon } from "../../Icons/index";
import { capitalize } from "../../utils/capitalize";
import {
  getDefaultRounding,
  getDefaultShadow,
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
  shadow = getDefaultShadow(),
  state = "",
  separator,
  classMap,
  disabled = false,
  size = getDefaultSize(),
  outline = false,
  glass = false,
  className = "",
  maxVisible,
  LinkComponent = "a",
  ButtonComponent = "button",
  "data-testid": testId = "breadcrumbs",
  ...rest
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpand = () => {
    setIsExpanded(true);
  };

  if (!items || items.length === 0) return null;

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
        classMap[state],
        classMap[size],
        shadow && classMap[`shadow${capitalize(shadow)}`],
        rounding && classMap[`round${capitalize(rounding)}`],
        disabled && classMap.disabled,
        outline && classMap.outline,
        glass && classMap.glass,
        className,
      ),
    [
      theme,
      state,
      size,
      shadow,
      rounding,
      disabled,
      outline,
      glass,
      className,
      classMap,
    ],
  );

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
                  {separator ?? <ArrowRightIcon />}
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
