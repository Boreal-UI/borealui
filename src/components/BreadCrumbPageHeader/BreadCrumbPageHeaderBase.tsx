import { forwardRef } from "react";
import { BreadCrumbPageHeaderBaseProps } from "./BreadCrumbPageHeader.types";
import { combineClassNames } from "../../utils/classNames";
import { capitalize } from "../../utils/capitalize";
import {
  getDefaultVariant,
  getDefaultRounding,
  getShadowClassName,
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
      subtitle,
      actions,
      children,
      theme = getDefaultTheme(),
      state,
      variant = getDefaultVariant(),
      BreadCrumbsComponent,
      breadcrumbProps,
      rounding = getDefaultRounding(),
      shadow,
      disabled = false,
      loading = false,
      classMap,
      className,
      contentClassName,
      srOnlyText,
      srOnlyClassName,
      "data-testid": dataTestId,
      testId = dataTestId ?? "bread-crumb-page-header",
      ...rest
    },
    ref,
  ) => {
    const rootClass = combineClassNames(
      classMap.root,
      classMap[theme],
      state && classMap[state],
      (variant === "outline" || variant === "glassOutline") && classMap.outline,
      (variant === "glass" || variant === "glassOutline") && classMap.glass,
      disabled && classMap.disabled,
      loading && classMap.loading,
      getShadowClassName(classMap, theme, shadow),
      rounding && classMap[`round${capitalize(rounding)}`],
      className,
    );

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
        {breadcrumbs.length > 0 ? (
          <div
            className={classMap.breadcrumbs}
            data-testid={`${testId}-breadcrumbs`}
          >
            <BreadCrumbsComponent
              {...breadcrumbProps}
              items={breadcrumbs}
              theme={"clear"}
              shadow={"none"}
            />
          </div>
        ) : null}
        <div className={classMap.main} data-testid={`${testId}-main`}>
          <div className={classMap.content} data-testid={`${testId}-content`}>
            {title ? (
              <h1 className={classMap.title} data-testid={`${testId}-title`}>
                {title}
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
                  "sr_only",
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
