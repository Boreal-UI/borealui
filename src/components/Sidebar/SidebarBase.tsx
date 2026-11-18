import React, { useState, useMemo, useRef, useEffect, useId } from "react";
import { combineClassNames } from "@/utils/classNames";
import {
  getDefaultVariant,
  getDefaultRounding,
  getShadowClassName,
  getDefaultTheme,
} from "@/config/boreal-style-config";
import { capitalize } from "@/utils/capitalize";
import { mergeSafeRel, sanitizeNavigationHref } from "@/utils/navigationSecurity";
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
  const generatedId = useId();
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const idsRef = useRef<Record<string, string>>({});
  const seqRef = useRef(0);

  const itemKey = (node: SidebarLink, index: number, parent: string) =>
    `${parent}/${node.id === undefined ? `index:${index}` : `id:${encodeURIComponent(node.id)}`}`;

  const idFor = (key: string) => {
    if (!idsRef.current[key]) idsRef.current[key] = `${generatedId}-section-${seqRef.current++}`;
    return idsRef.current[key];
  };

  useEffect(() => {
    const next: Record<string, boolean> = {};
    const walk = (nodes: SidebarLink[], parent = ""): boolean => {
      let active = false;
      nodes.forEach((node, index) => {
        const key = itemKey(node, index, parent);
        const descendantActive = node.children?.length ? walk(node.children, key) : false;
        const childActive = hasActiveChild?.(node) ?? descendantActive;
        if (childActive && !node["aria-disabled"]) next[key] = true;
        active = active || childActive || (isLinkActive?.(node) ?? false);
      });
      return active;
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

  const renderLinks = (items: SidebarLink[], isChild = false, parent = "") => (
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

        const key = itemKey(link, idx, parent);

        const isActive = isLinkActive?.(link) ?? false;

        const containsActiveChild =
          hasActiveChild?.(link) ??
          !!children?.some(
            (child) =>
              (isLinkActive?.(child) ?? false) ||
              (child.children?.length && (hasActiveChild?.(child) ?? false)),
          );

        const isOpen = !!openItems[key];
        const sectionId = idFor(key);
        const buttonId = `${sectionId}-button`;
        const panelId = `${sectionId}-panel`;

        const safeHref = sanitizeNavigationHref(href);
        const linkRel = mergeSafeRel(target, rel);

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
                  onClick={() => { if (!linkAriaDisabled) toggleItem(key); }}
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
                  {renderLinks(children, true, key)}
                </div>
              </>
            ) : safeHref && !linkAriaDisabled ? (
              <LinkComponent
                href={safeHref}
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
            ) => {
              const safeHref = sanitizeNavigationHref(href);
              const content = (
                <>
                  {icon && (
                    <span
                      className={combineClassNames(classMap.icon, iconClassName)}
                    >
                      {icon}
                    </span>
                  )}
                  {label}
                </>
              );
              const sharedProps = {
                className: combineClassNames(
                  classMap.footerLink,
                  footerLinkClassName,
                ),
                "aria-label": footerLinkAriaLabel,
                "aria-description": footerLinkAriaDescription,
                "aria-disabled": footerLinkAriaDisabled ? true : undefined,
                "data-testid": `${testId}-footerLink`,
              };

              return safeHref ? (
                <LinkComponent
                  key={`${label}-${i}`}
                  {...sharedProps}
                  href={safeHref}
                  target={target}
                  rel={mergeSafeRel(target, rel)}
                >
                  {content}
                </LinkComponent>
              ) : (
                <span key={`${label}-${i}`} {...sharedProps}>{content}</span>
              );
            },
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
