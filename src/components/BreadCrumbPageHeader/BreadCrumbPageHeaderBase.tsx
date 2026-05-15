import { forwardRef } from "react";
import { BreadCrumbPageHeaderBaseProps } from "./BreadCrumbPageHeader.types";
import { combineClassNames } from "../../utils/classNames";
import { capitalize } from "../../utils/capitalize";
import { ArrowRightIcon } from "../../Icons";
import {
  getDefaultGlass,
  getDefaultOutline,
  getDefaultRounding,
  getDefaultShadow,
  getDefaultTheme,
} from "../../config/boreal-style-config";

const BreadCrumbPageHeaderBase = forwardRef<
  HTMLElement,
  BreadCrumbPageHeaderBaseProps
>(
  (
    {
      breadcrumbs = [],
      title,
      label,
      labelPosition: _labelPosition,
      subtitle,
      actions,
      children,
      separator,
      maxVisibleBreadcrumbs,
      theme = getDefaultTheme(),
      state,
      outline = getDefaultOutline(),
      glass = getDefaultGlass(),
      rounding = getDefaultRounding(),
      shadow = getDefaultShadow(),
      disabled = false,
      loading = false,
      classMap,
      className,
      containerClassName: _containerClassName,
      labelClassName: _labelClassName,
      contentClassName,
      srOnlyText,
      srOnlyClassName,
      "data-testid": dataTestId,
      testId = dataTestId ?? "bread-crumb-page-header",
      ...rest
    },
    ref,
  ) => {
    void _labelPosition;
    void _containerClassName;
    void _labelClassName;

    const rootClass = combineClassNames(
      classMap.root,
      classMap[theme],
      state && classMap[state],
      outline && classMap.outline,
      glass && classMap.glass,
      disabled && classMap.disabled,
      loading && classMap.loading,
      shadow && classMap[`shadow${capitalize(shadow)}`],
      rounding && classMap[`round${capitalize(rounding)}`],
      className,
    );

    const visibleBreadcrumbs =
      maxVisibleBreadcrumbs && breadcrumbs.length > maxVisibleBreadcrumbs
        ? [
            breadcrumbs[0],
            { label: "..." },
            ...breadcrumbs.slice(
              breadcrumbs.length - (maxVisibleBreadcrumbs - 2),
            ),
          ]
        : breadcrumbs;

    return (
      <header
        ref={ref}
        className={rootClass}
        aria-busy={loading || undefined}
        aria-disabled={disabled || undefined}
        data-testid={testId}
        {...rest}
      >
        {loading ? (
          <span
            className={classMap.loader}
            aria-hidden="true"
            data-testid={`${testId}-loader`}
          />
        ) : null}
        {visibleBreadcrumbs.length ? (
          <nav
            className={classMap.breadcrumbs}
            aria-label="Breadcrumbs"
            data-testid={`${testId}-breadcrumbs`}
          >
            <ol className={classMap.breadcrumbList}>
              {visibleBreadcrumbs.map((item, index) => {
                const isLast = index === visibleBreadcrumbs.length - 1;
                const key = `${item.label}-${item.href ?? index}`;
                return (
                  <li
                    key={key}
                    className={classMap.breadcrumbItem}
                    data-testid={`${testId}-breadcrumb`}
                  >
                    {item.href && !isLast && item.label !== "..." ? (
                      <a className={classMap.breadcrumbLink} href={item.href}>
                        {item.label}
                      </a>
                    ) : (
                      <span
                        className={combineClassNames(
                          classMap.breadcrumbCurrent,
                          isLast && classMap.current,
                        )}
                        aria-current={isLast ? "page" : undefined}
                      >
                        {item.label}
                      </span>
                    )}
                    {!isLast ? (
                      <span className={classMap.separator} aria-hidden="true">
                        {separator ?? <ArrowRightIcon />}
                      </span>
                    ) : null}
                  </li>
                );
              })}
            </ol>
          </nav>
        ) : null}
        <div className={classMap.main} data-testid={`${testId}-main`}>
          <div className={classMap.content} data-testid={`${testId}-content`}>
            {title || label ? (
              <h1 className={classMap.title} data-testid={`${testId}-title`}>
                {title ?? label}
              </h1>
            ) : null}
            {subtitle ? (
              <p
                className={classMap.subtitle}
                data-testid={`${testId}-subtitle`}
              >
                {subtitle}
              </p>
            ) : null}
            {children ? (
              <div
                className={combineClassNames(
                  classMap.bodyContent,
                  contentClassName,
                )}
              >
                {children}
              </div>
            ) : null}
            {srOnlyText ? (
              <span
                className={combineClassNames(
                  classMap.srOnly ?? "sr_only",
                  srOnlyClassName,
                )}
                data-testid={`${testId}-sr-only-text`}
              >
                {srOnlyText}
              </span>
            ) : null}
          </div>
          {actions ? (
            <div className={classMap.actions} data-testid={`${testId}-actions`}>
              {actions}
            </div>
          ) : null}
        </div>
      </header>
    );
  },
);

BreadCrumbPageHeaderBase.displayName = "BreadCrumbPageHeaderBase";
export default BreadCrumbPageHeaderBase;
