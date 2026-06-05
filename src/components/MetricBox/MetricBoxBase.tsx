import React, { useMemo, useId } from "react";
import { BaseMetricBoxProps } from "./MetricBox.types";
import { combineClassNames } from "../../utils/classNames";
import { capitalize } from "../../utils/capitalize";
import {
  getDefaultOutline,
  getDefaultGlass,
  getDefaultRounding,
  getShadowClassName,
  getDefaultSize,
  getDefaultTheme,
} from "../../config/boreal-style-config";

const BaseMetricBox: React.FC<BaseMetricBoxProps> = ({
  title,
  value,
  units,
  icon: Icon,
  subtext,
  loading = false,
  theme = getDefaultTheme(),
  glass = getDefaultGlass(),
  shadow,
  rounding = getDefaultRounding(),
  state,
  outline = getDefaultOutline(),
  align = "center",
  size = getDefaultSize(),
  className,
  iconClassName,
  contentClassName,
  titleClassName,
  valueClassName,
  subtextClassName,
  role,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  "aria-live": ariaLive,
  "aria-atomic": ariaAtomic,
  decorativeIcon = true,
  iconAriaLabel,
  "data-testid": dataTestId,
  testId = dataTestId ?? "metric-box",
  classMap,
  SkeletonComponent,
}) => {
  const uid = useId();

  const titleId = title ? `${testId}-title-${uid}` : undefined;
  const subtextId = subtext ? `${testId}-subtext-${uid}` : undefined;

  const wrapperClass = useMemo(
    () =>
      combineClassNames(
        classMap.wrapper,
        outline && classMap.outline,
        classMap[theme],
        state && classMap[state],
        classMap[size],
        classMap[align],
        glass && classMap.glass,
        loading && classMap.loading,
        getShadowClassName(classMap, theme, shadow),
        rounding && classMap[`round${capitalize(rounding)}`],
        className,
      ),
    [
      classMap,
      theme,
      state,
      size,
      align,
      glass,
      loading,
      outline,
      shadow,
      rounding,
      className,
    ],
  );

  const displayValue = units ? `${value} ${units}` : String(value ?? "");

  const valueLabel =
    title && value != null ? `${displayValue} ${title}` : displayValue;

  const resolvedRole = role ?? (title ? "region" : undefined);
  const resolvedAriaLabel =
    ariaLabel ?? (!ariaLabelledBy && loading && title ? title : undefined);
  const resolvedAriaLabelledBy =
    ariaLabelledBy ?? (!loading && title ? titleId : undefined);
  const resolvedAriaDescribedBy =
    ariaDescribedBy ?? (!loading && subtext ? subtextId : undefined);

  return (
    <div
      className={wrapperClass}
      role={resolvedRole}
      aria-label={resolvedAriaLabel}
      aria-labelledby={resolvedAriaLabel ? undefined : resolvedAriaLabelledBy}
      aria-describedby={resolvedAriaDescribedBy}
      aria-live={ariaLive}
      aria-atomic={ariaAtomic}
      aria-busy={loading || undefined}
      data-testid={testId}
    >
      {loading ? (
        <SkeletonComponent
          width="100%"
          height="100%"
          aria-hidden={true}
          className={classMap.loadingSkeleton}
          data-testid={`${testId}-skeleton`}
        />
      ) : (
        <>
          {Icon && (
            <div
              className={combineClassNames(classMap.icon, iconClassName)}
              data-testid={`${testId}-icon`}
              aria-hidden={decorativeIcon ? true : undefined}
            >
              <Icon
                aria-hidden={decorativeIcon ? true : undefined}
                aria-label={!decorativeIcon ? iconAriaLabel : undefined}
                focusable={false}
              />
            </div>
          )}

          <div
            className={combineClassNames(classMap.content, contentClassName)}
          >
            {title && (
              <h3
                id={titleId}
                className={combineClassNames(classMap.title, titleClassName)}
                data-testid={`${testId}-title`}
              >
                {title}
              </h3>
            )}

            <div
              className={combineClassNames(classMap.value, valueClassName)}
              data-testid={`${testId}-value`}
              aria-label={valueLabel}
            >
              {displayValue}
            </div>

            {subtext && (
              <div
                id={subtextId}
                className={combineClassNames(
                  classMap.subtext,
                  subtextClassName,
                )}
                data-testid={`${testId}-subtext`}
              >
                {subtext}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

BaseMetricBox.displayName = "BaseMetricBox";
export default BaseMetricBox;
