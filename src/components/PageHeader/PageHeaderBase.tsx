import { forwardRef } from "react";
import { PageHeaderBaseProps } from "./PageHeader.types";
import { combineClassNames } from "../../utils/classNames";
import { capitalize } from "../../utils/capitalize";
import {
  getDefaultVariant,
  getDefaultRounding,
  getShadowClassName,
  getDefaultTheme,
} from "../../config/boreal-style-config";

const PageHeaderBase = forwardRef<HTMLElement, PageHeaderBaseProps>(
  (
    {
      title,
      label,
      subtitle,
      eyebrow,
      icon,
      meta,
      actions,
      before,
      footer,
      children,
      as: Component = "header",
      compact = false,
      fullWidth = true,
      theme = getDefaultTheme(),
      state,
      variant = getDefaultVariant(),
      rounding = getDefaultRounding(),
      shadow,
      disabled = false,
      loading = false,
      classMap,
      className,
      contentClassName,
      titleClassName,
      subtitleClassName,
      actionsClassName,
      srOnlyText,
      srOnlyClassName,
      "data-testid": dataTestId,
      testId = dataTestId ?? "page-header",
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
      compact && classMap.compact,
      fullWidth && classMap.fullWidth,
      getShadowClassName(classMap, theme, shadow),
      rounding && classMap[`round${capitalize(rounding)}`],
      className,
    );

    const Root = Component as "header";

    return (
      <Root
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
        {before ? (
          <div className={classMap.before} data-testid={`${testId}-before`}>
            {before}
          </div>
        ) : null}
        <div className={classMap.main} data-testid={`${testId}-main`}>
          {icon ? (
            <div className={classMap.icon} data-testid={`${testId}-icon`}>
              {icon}
            </div>
          ) : null}
          <div className={classMap.content} data-testid={`${testId}-content`}>
            {eyebrow ? (
              <div
                className={classMap.eyebrow}
                data-testid={`${testId}-eyebrow`}
              >
                {eyebrow}
              </div>
            ) : null}
            {title || label ? (
              <h1
                className={combineClassNames(classMap.title, titleClassName)}
                data-testid={`${testId}-title`}
              >
                {title ?? label}
              </h1>
            ) : null}
            {subtitle ? (
              <p
                className={combineClassNames(
                  classMap.subtitle,
                  subtitleClassName,
                )}
                data-testid={`${testId}-subtitle`}
              >
                {subtitle}
              </p>
            ) : null}
            {meta ? (
              <div className={classMap.meta} data-testid={`${testId}-meta`}>
                {meta}
              </div>
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
            <div
              className={combineClassNames(classMap.actions, actionsClassName)}
              data-testid={`${testId}-actions`}
            >
              {actions}
            </div>
          ) : null}
        </div>
        {footer ? (
          <div className={classMap.footer} data-testid={`${testId}-footer`}>
            {footer}
          </div>
        ) : null}
      </Root>
    );
  },
);

PageHeaderBase.displayName = "PageHeaderBase";
export default PageHeaderBase;
