import { forwardRef, useMemo } from "react";
import { PageHeaderBaseProps } from "./PageHeader.types";
import { combineClassNames } from "../../utils/classNames";
import { capitalize } from "../../utils/capitalize";
import {
  getDefaultGlass,
  getDefaultOutline,
  getDefaultRounding,
  getDefaultShadow,
  getDefaultTheme,
} from "../../config/boreal-style-config";

const PageHeaderBase = forwardRef<HTMLElement, PageHeaderBaseProps>(
  (
    {
      title,
      label,
      labelPosition: _labelPosition,
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
    void _labelPosition;
    void _containerClassName;
    void _labelClassName;

    const rootClass = useMemo(
      () =>
        combineClassNames(
          classMap.root,
          classMap[theme],
          state && classMap[state],
          outline && classMap.outline,
          glass && classMap.glass,
          disabled && classMap.disabled,
          loading && classMap.loading,
          compact && classMap.compact,
          fullWidth && classMap.fullWidth,
          shadow && classMap[`shadow${capitalize(shadow)}`],
          rounding && classMap[`round${capitalize(rounding)}`],
          className,
        ),
      [
        classMap,
        theme,
        state,
        outline,
        glass,
        disabled,
        loading,
        compact,
        fullWidth,
        shadow,
        rounding,
        className,
      ],
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
