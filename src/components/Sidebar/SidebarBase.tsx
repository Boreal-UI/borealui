import React, { useState, useMemo, useRef, useEffect } from "react";
import { combineClassNames } from "@/utils/classNames";
import {
  getDefaultVariant,
  getDefaultRounding,
  getShadowClassName,
  getDefaultTheme,
} from "@/config/boreal-style-config";
import { capitalize } from "@/utils/capitalize";
import { ChevronDownIcon } from "@/Icons";
import { BaseSidebarProps, SidebarLink } from "./Sidebar.types";

const SidebarBase: React.FC<BaseSidebarProps> = ({
  links,
  classMap,
  LinkComponent = "a",
  isLinkActive,
  hasActiveChild,
  theme = getDefaultTheme(),
  rounding = getDefaultRounding(),
  shadow,
  state,
  showFooter = false,
  footerLinks,
  footerVersion,
  variant = getDefaultVariant(),
  className,

  navClassName,
  listClassName,
  childListClassName,
  itemClassName,
  linkClassName,
  childLinkClassName,
  activeClassName,
  expandButtonClassName,
  iconClassName,
  expandLabelClassName,
  chevronClassName,
  chevronOpenClassName,
  submenuClassName,
  submenuOpenClassName,
  footerClassName,
  footerLinkClassName,
  footerVersionClassName,

  "data-testid": dataTestId,
  testId = dataTestId ?? "sidebar",
  "aria-label": ariaLabel = "Sidebar navigation",
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  footerAriaLabel = "Sidebar footer",
  footerAriaLabelledBy,
  getExpandButtonAriaLabel,
  getExpandButtonAriaDescription,
  ...rest
}) => {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const idsRef = useRef<Record<string, string>>({});
  const seqRef = useRef(0);

  const idFor = (label: string) => {
    if (!idsRef.current[label]) {
      const slug = label
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9_-]/g, "");

      idsRef.current[label] = `${testId}-section-${slug}-${seqRef.current++}`;
    }

    return idsRef.current[label];
  };

  useEffect(() => {
    const next: Record<string, boolean> = {};

    const walk = (nodes: SidebarLink[]): boolean => {
      for (const node of nodes) {
        if (node.children?.length) {
          const childIsActive =
            hasActiveChild?.(node) ??
            node.children.some(
              (child) =>
                (isLinkActive?.(child) ?? false) ||
                (!!child.children?.length && walk(child.children)),
            );

          if (childIsActive) {
            next[node.label] = true;
          }
        }
      }

      return nodes.some(
        (node) =>
          (isLinkActive?.(node) ?? false) ||
          (!!node.children?.length && walk(node.children)),
      );
    };

    walk(links);
    setOpenItems((prev) => ({ ...prev, ...next }));
  }, [links, isLinkActive, hasActiveChild]);

  const toggleItem = (key: string) =>
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));

  const containerClasses = useMemo(
    () =>
      combineClassNames(
        classMap.wrapper,
        className,
        classMap[theme],
        state && classMap[state],
        getShadowClassName(classMap, theme, shadow),
        rounding && classMap[`round${capitalize(rounding)}`],
        (variant === "outline" || variant === "glassOutline") &&
          classMap.outline,
        (variant === "glass" || variant === "glassOutline") && classMap.glass,
      ),
    [classMap, className, theme, state, variant, rounding, shadow],
  );

  const renderLinks = (items: SidebarLink[], isChild = false) => (
    <ul
      className={combineClassNames(
        classMap.list,
        listClassName,
        isChild && classMap.childList,
        isChild && childListClassName,
      )}
      data-testid={`${testId}-list`}
    >
      {items.map((link, idx) => {
        const {
          label,
          href,
          target,
          rel,
          children,
          icon,
          "aria-label": linkAriaLabel,
          "aria-description": linkAriaDescription,
          "aria-disabled": linkAriaDisabled,
        } = link;

        const key = `${label}-${idx}`;

        const isActive = isLinkActive?.(link) ?? false;

        const containsActiveChild =
          hasActiveChild?.(link) ??
          !!children?.some(
            (child) =>
              (isLinkActive?.(child) ?? false) ||
              (child.children?.length && (hasActiveChild?.(child) ?? false)),
          );

        const isOpen = !!openItems[label];
        const sectionId = idFor(label);
        const buttonId = `${sectionId}-button`;
        const panelId = `${sectionId}-panel`;

        const linkRel =
          rel ?? (target === "_blank" ? "noopener noreferrer" : undefined);

        return (
          <li
            key={key}
            className={combineClassNames(classMap.item, itemClassName)}
            data-testid={`${testId}-listItem`}
          >
            {children && children.length > 0 ? (
              <>
                <button
                  type="button"
                  id={buttonId}
                  className={combineClassNames(
                    classMap.link,
                    linkClassName,
                    expandButtonClassName,
                    (isActive || isOpen || containsActiveChild) &&
                      classMap.active,
                    (isActive || isOpen || containsActiveChild) &&
                      activeClassName,
                  )}
                  onClick={() => toggleItem(label)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  aria-label={
                    getExpandButtonAriaLabel?.(link, isOpen) ?? linkAriaLabel
                  }
                  title={
                    getExpandButtonAriaDescription?.(link, isOpen) ??
                    linkAriaDescription
                  }
                  aria-disabled={linkAriaDisabled ? true : undefined}
                  data-testid={`${testId}-expandItemButton`}
                >
                  {icon && (
                    <span
                      className={combineClassNames(
                        classMap.icon,
                        iconClassName,
                      )}
                    >
                      {icon}
                    </span>
                  )}

                  <span
                    className={expandLabelClassName}
                    data-testid={`${testId}-expandItemLabel`}
                  >
                    {label}
                  </span>

                  <ChevronDownIcon
                    className={combineClassNames(
                      classMap.chevron,
                      chevronClassName,
                      isOpen && classMap.chevronOpen,
                      isOpen && chevronOpenClassName,
                    )}
                    aria-hidden="true"
                    focusable={false}
                    data-testid={`${testId}-expandIcon`}
                  />
                </button>

                <div
                  id={panelId}
                  className={combineClassNames(
                    classMap.submenu,
                    submenuClassName,
                    isOpen && classMap.submenuOpen,
                    isOpen && submenuOpenClassName,
                  )}
                  role="group"
                  aria-labelledby={buttonId}
                  hidden={!isOpen}
                  data-testid={`${testId}-subMenu`}
                >
                  {renderLinks(children, true)}
                </div>
              </>
            ) : href && !linkAriaDisabled ? (
              <LinkComponent
                href={href}
                target={target}
                rel={linkRel}
                className={combineClassNames(
                  classMap.link,
                  linkClassName,
                  isChild && classMap.childLink,
                  isChild && childLinkClassName,
                  isActive && classMap.active,
                  isActive && activeClassName,
                )}
                aria-current={isActive ? "page" : undefined}
                aria-label={linkAriaLabel}
                aria-description={linkAriaDescription}
                data-testid={`${testId}-sidebarLink`}
              >
                {icon && (
                  <span
                    className={combineClassNames(classMap.icon, iconClassName)}
                  >
                    {icon}
                  </span>
                )}
                {label}
              </LinkComponent>
            ) : (
              <span
                className={combineClassNames(
                  classMap.link,
                  linkClassName,
                  isChild && classMap.childLink,
                  isChild && childLinkClassName,
                  isActive && classMap.active,
                  isActive && activeClassName,
                )}
                aria-label={linkAriaLabel}
                aria-description={linkAriaDescription}
                aria-disabled={linkAriaDisabled ? true : undefined}
                data-testid={`${testId}-sidebarLabel`}
              >
                {icon && (
                  <span
                    className={combineClassNames(classMap.icon, iconClassName)}
                  >
                    {icon}
                  </span>
                )}
                {label}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <nav
      className={containerClasses}
      aria-label={ariaLabelledBy ? undefined : ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      data-testid={testId}
      {...rest}
    >
      <div className={combineClassNames(classMap.nav, navClassName)}>
        {renderLinks(links)}
      </div>

      {showFooter && (
        <footer
          className={combineClassNames(classMap.footer, footerClassName)}
          aria-label={footerAriaLabelledBy ? undefined : footerAriaLabel}
          aria-labelledby={footerAriaLabelledBy}
          data-testid={`${testId}-footer`}
        >
          {footerLinks?.map(
            (
              {
                label,
                href,
                target,
                rel,
                icon,
                "aria-label": footerLinkAriaLabel,
                "aria-description": footerLinkAriaDescription,
                "aria-disabled": footerLinkAriaDisabled,
              },
              i,
            ) => (
              <LinkComponent
                key={`${label}-${i}`}
                href={href}
                target={target}
                rel={
                  rel ??
                  (target === "_blank" ? "noopener noreferrer" : undefined)
                }
                className={combineClassNames(
                  classMap.footerLink,
                  footerLinkClassName,
                )}
                aria-label={footerLinkAriaLabel}
                aria-description={footerLinkAriaDescription}
                aria-disabled={footerLinkAriaDisabled ? true : undefined}
                data-testid={`${testId}-footerLink`}
              >
                {icon && (
                  <span
                    className={combineClassNames(classMap.icon, iconClassName)}
                  >
                    {icon}
                  </span>
                )}
                {label}
              </LinkComponent>
            ),
          )}

          {footerVersion && (
            <span
              className={combineClassNames(
                classMap.footerVersion,
                footerVersionClassName,
              )}
              data-testid={`${testId}-footerVersion`}
            >
              {footerVersion}
            </span>
          )}
        </footer>
      )}
    </nav>
  );
};

SidebarBase.displayName = "SidebarBase";

export default SidebarBase;
