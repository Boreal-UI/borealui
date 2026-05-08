import React, { useMemo } from "react";
import { combineClassNames } from "../../utils/classNames";
import { capitalize } from "../../utils/capitalize";
import {
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
  glass = false,
  rounding = getDefaultRounding(),
  shadow = getDefaultShadow(),
  className = "",
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
      ),
    [classMap, shadow, rounding],
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
        className={classMap.list}
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
              className={classMap.listItem}
              data-testid={`${testId}-nav-list-item-${slug}`}
            >
              <LinkWrapper
                href={item.path}
                isActive={isActive}
                className={combineClassNames(
                  itemClass,
                  isActive && classMap.item_active,
                )}
                data-testid={`${testId}-nav-item-${slug}`}
                aria-current={isActive ? "page" : undefined}
                aria-label={itemAriaLabel}
              >
                <span className={classMap.linkContent}>
                  {item.icon && (
                    <span
                      className={classMap.icon}
                      aria-hidden="true"
                      data-testid={`${testId}-nav-icon-${slug}`}
                    >
                      {item.icon}
                    </span>
                  )}
                  <span className={classMap.label}>{item.label}</span>
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
