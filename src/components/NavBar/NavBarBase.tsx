import React, { useMemo } from "react";
import { combineClassNames } from "../../utils/classNames";
import { capitalize } from "../../utils/capitalize";
import {
  getDefaultGlass,
  getDefaultRounding,
  getDefaultShadow,
  getDefaultTheme,
} from "../../config/boreal-style-config";
import { BaseNavBarProps } from "./NavBar.types";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9]/g, "");

const BaseNavBar: React.FC<BaseNavBarProps> = ({
  items,
  LinkWrapper,
  classMap,
  isItemActive,
  theme = getDefaultTheme(),
  glass = getDefaultGlass(),
  rounding = getDefaultRounding(),
  shadow = getDefaultShadow(),
  className = "",
  listClassName = "",
  listItemClassName = "",
  itemClassName = "",
  linkContentClassName = "",
  iconClassName = "",
  labelClassName = "",
  "data-testid": dataTestId,
  testId = dataTestId ?? "nav-bar",
  "aria-label": ariaLabel = "Main navigation",
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  "list-aria-label": listAriaLabel = "Main navigation items",
  getItemAriaLabel,
}) => {
  const wrapperClass = useMemo(
    () =>
      combineClassNames(
        classMap.container,
        classMap[theme],
        glass && classMap.glass,
        className,
      ),
    [classMap, theme, glass, className],
  );

  const itemClass = useMemo(
    () =>
      combineClassNames(
        classMap.item,
        shadow && classMap[`shadow${capitalize(shadow)}`],
        rounding && classMap[`round${capitalize(rounding)}`],
        itemClassName,
      ),
    [classMap, shadow, rounding, itemClassName],
  );

  return (
    <nav
      aria-label={ariaLabelledBy ? undefined : ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      className={wrapperClass}
      data-testid={`${testId}-nav-bar`}
    >
      <ul
        className={combineClassNames(classMap.list, listClassName)}
        aria-label={listAriaLabel}
        data-testid={`${testId}-nav-list`}
      >
        {items.map((item) => {
          const isActive = isItemActive?.(item) ?? false;
          const slug = slugify(item.label || item.path);
          const itemAriaLabel = getItemAriaLabel?.(item) ?? item.label;

          return (
            <li
              key={`${item.path}-${slug}`}
              className={combineClassNames(classMap.listItem, listItemClassName)}
              data-testid={`${testId}-nav-list-item-${slug}`}
            >
              <LinkWrapper
                href={item.path}
                target={item.target}
                rel={
                  item.rel ??
                  (item.target === "_blank" ? "noopener noreferrer" : undefined)
                }
                isActive={isActive}
                className={combineClassNames(
                  itemClass,
                  isActive && classMap.item_active,
                )}
                data-testid={`${testId}-nav-item-${slug}`}
                aria-current={isActive ? "page" : undefined}
                aria-label={itemAriaLabel}
              >
                <span
                  className={combineClassNames(
                    classMap.linkContent,
                    linkContentClassName,
                  )}
                >
                  {item.icon && (
                    <span
                      className={combineClassNames(classMap.icon, iconClassName)}
                      aria-hidden="true"
                      data-testid={`${testId}-nav-icon-${slug}`}
                    >
                      {item.icon}
                    </span>
                  )}
                  <span
                    className={combineClassNames(classMap.label, labelClassName)}
                  >
                    {item.label}
                  </span>
                </span>
              </LinkWrapper>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

BaseNavBar.displayName = "BaseNavBar";
export default BaseNavBar;
