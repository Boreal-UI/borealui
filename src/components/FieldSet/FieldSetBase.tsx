import { forwardRef, useId, useMemo, FieldsetHTMLAttributes } from "react";
import { FieldSetBaseProps } from "./FieldSet.types";
import { combineClassNames } from "../../utils/classNames";
import { capitalize } from "../../utils/capitalize";
import { resolvePropAlias } from "../../utils/propAliases";
import {
  getDefaultVariant,
  getDefaultRounding,
  getShadowClassName,
  getDefaultTheme,
} from "../../config/boreal-style-config";

const FieldSetBase = forwardRef<HTMLFieldSetElement, FieldSetBaseProps>(
  (
    {
      children,
      legend,
      label,
      labelPosition = "top",
      helperText,
      errorMessage,
      required = false,
      requiredIndicator = "*",
      optionalText,
      hideLegend = false,
      layout = "stack",
      spacing = "md",
      theme = getDefaultTheme(),
      state,
      variant = getDefaultVariant(),
      rounding = getDefaultRounding(),
      shadow,
      disabled = false,
      loading = false,
      loadingMessage = "Loading",
      actions,
      footer,
      classMap,
      className,
      containerClassName,
      labelClassName,
      legendClassName,
      descriptionClassName,
      bodyClassName,
      contentClassName,
      helperTextClassName,
      errorClassName,
      actionsClassName,
      footerClassName,
      srOnlyText,
      srOnlyClassName,
      "data-testid": dataTestId,
      testId = dataTestId ?? "field-set",
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const resolvedLabelPosition = resolvePropAlias(labelPosition);
    const resolvedLayout = resolvePropAlias(layout);
    const resolvedSpacing = resolvePropAlias(spacing);
    const resolvedLegend = legend ?? label;
    const hasError = Boolean(errorMessage) || state === "error";
    const resolvedState = hasError ? "error" : state;

    const {
      id: idProp,
      "aria-describedby": ariaDescribedBy,
      "aria-labelledby": ariaLabelledBy,
      ...restRoot
    } = rest as FieldsetHTMLAttributes<HTMLFieldSetElement> & {
      "aria-describedby"?: string;
      "aria-labelledby"?: string;
    };

    const rootId = idProp ?? `${testId}-${generatedId}`;
    const legendId = resolvedLegend ? `${rootId}-legend` : undefined;
    const descriptionId = helperText ? `${rootId}-helperText` : undefined;
    const helperTextId = helperText ? `${rootId}-helper-text` : undefined;
    const errorId = errorMessage ? `${rootId}-errorMessage` : undefined;
    const srDescriptionId = srOnlyText ? `${rootId}-sr-helperText` : undefined;
    const computedAriaDescribedBy =
      [ariaDescribedBy, descriptionId, helperTextId, errorId, srDescriptionId]
        .filter(Boolean)
        .join(" ") || undefined;
    const computedAriaLabelledBy =
      [ariaLabelledBy, !resolvedLegend && srDescriptionId]
        .filter(Boolean)
        .join(" ") || undefined;

    const containerClass = useMemo(
      () =>
        combineClassNames(
          classMap.container,
          classMap[theme],
          resolvedState && classMap[resolvedState],
          classMap[`label${capitalize(resolvedLabelPosition)}`],
          (variant === "outline" || variant === "glassOutline") &&
            classMap.outline,
          (variant === "glass" || variant === "glassOutline") && classMap.glass,
          disabled && classMap.disabled,
          getShadowClassName(classMap, theme, shadow),
          rounding && classMap[`round${capitalize(rounding)}`],
          containerClassName,
        ),
      [
        classMap,
        theme,
        resolvedState,
        resolvedLabelPosition,
        variant,
        disabled,
        shadow,
        rounding,
        containerClassName,
      ],
    );

    const rootClass = useMemo(
      () =>
        combineClassNames(
          classMap.root,
          loading && classMap.loading,
          className,
        ),
      [classMap, loading, className],
    );

    const contentClass = useMemo(
      () =>
        combineClassNames(
          classMap.content,
          classMap[`layout${capitalize(resolvedLayout)}`],
          classMap[`spacing${capitalize(resolvedSpacing)}`],
          bodyClassName,
          contentClassName,
        ),
      [
        classMap,
        resolvedLayout,
        resolvedSpacing,
        bodyClassName,
        contentClassName,
      ],
    );

    return (
      <div className={containerClass} data-testid={testId}>
        <fieldset
          ref={ref}
          id={rootId}
          className={rootClass}
          aria-busy={loading || undefined}
          aria-describedby={computedAriaDescribedBy}
          aria-labelledby={computedAriaLabelledBy}
          aria-invalid={hasError || undefined}
          disabled={disabled}
          data-testid={`${testId}-root`}
          {...restRoot}
        >
          {resolvedLegend ? (
            <legend
              id={legendId}
              className={combineClassNames(
                classMap.legend,
                classMap.label,
                hideLegend && (classMap.legendHidden ?? classMap.srOnly),
                labelClassName,
                legendClassName,
              )}
              data-testid={`${testId}-label`}
            >
              <span
                className={classMap.legendText}
                data-testid={`${testId}-legend-text`}
              >
                {resolvedLegend}
              </span>
              {required ? (
                <span
                  className={classMap.required}
                  aria-hidden="true"
                  data-testid={`${testId}-required-indicator`}
                >
                  {requiredIndicator}
                </span>
              ) : optionalText ? (
                <span
                  className={classMap.optional}
                  data-testid={`${testId}-optional-text`}
                >
                  {optionalText}
                </span>
              ) : null}
            </legend>
          ) : null}

          {helperText ? (
            <p
              id={descriptionId}
              className={combineClassNames(
                classMap.helperText,
                descriptionClassName,
              )}
              data-testid={`${testId}-helperText`}
            >
              {helperText}
            </p>
          ) : null}

          {loading ? (
            <div
              className={classMap.loadingRow}
              role="status"
              data-testid={`${testId}-loading`}
            >
              <span
                className={classMap.loader}
                aria-hidden="true"
                data-testid={`${testId}-loader`}
              />
              <span className={classMap.loadingMessage}>{loadingMessage}</span>
            </div>
          ) : null}

          <div className={contentClass} data-testid={`${testId}-content`}>
            {children}
          </div>

          {helperText ? (
            <p
              id={helperTextId}
              className={combineClassNames(
                classMap.helperText,
                helperTextClassName,
              )}
              data-testid={`${testId}-helper-text`}
            >
              {helperText}
            </p>
          ) : null}

          {errorMessage ? (
            <p
              id={errorId}
              className={combineClassNames(classMap.errorText, errorClassName)}
              role="alert"
              data-testid={`${testId}-errorMessage`}
            >
              {errorMessage}
            </p>
          ) : null}

          {actions ? (
            <div
              className={combineClassNames(classMap.actions, actionsClassName)}
              data-testid={`${testId}-actions`}
            >
              {actions}
            </div>
          ) : null}

          {footer ? (
            <div
              className={combineClassNames(classMap.footer, footerClassName)}
              data-testid={`${testId}-footer`}
            >
              {footer}
            </div>
          ) : null}

          {srOnlyText ? (
            <span
              id={srDescriptionId}
              className={combineClassNames(
                classMap.srOnly ?? "sr_only",
                srOnlyClassName,
              )}
              data-testid={`${testId}-sr-only-text`}
            >
              {srOnlyText}
            </span>
          ) : null}
        </fieldset>
      </div>
    );
  },
);

FieldSetBase.displayName = "FieldSetBase";
export default FieldSetBase;
