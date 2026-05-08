import React, { useMemo, useId } from "react";
import { BaseMetricBoxProps } from "./MetricBox.types";
import { combineClassNames } from "../../utils/classNames";
import { capitalize } from "../../utils/capitalize";
import {
  getDefaultOutline,
  getDefaultGlass,
  getDefaultRounding,
  getDefaultShadow,
  getDefaultSize,
  getDefaultTheme,
} from "../../config/boreal-style-config";

const BaseMetricBox: React.FC<BaseMetricBoxProps> = ({
  title,
  value,
  icon: Icon,
  subtext,
  theme = getDefaultTheme(),
  glass = getDefaultGlass(),
  shadow = getDefaultShadow(),
  rounding = getDefaultRounding(),
  state = "",
  outline = getDefaultOutline(),
  align = "center",
  size = getDefaultSize(),
  className = "",
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
        classMap[state],
        classMap[size],
        classMap[align],
        glass && classMap.glass,
        shadow && classMap[`shadow${capitalize(shadow)}`],
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
      outline,
      shadow,
      rounding,
      className,
    ],
  );

  const valueLabel =
    title && value != null ? `${value} ${title}` : String(value ?? "");

  const resolvedRole = role ?? (title ? "region" : undefined);
  const resolvedAriaLabelledBy =
    ariaLabelledBy ?? (title ? titleId : undefined);
  const resolvedAriaDescribedBy =
    ariaDescribedBy ?? (subtext ? subtextId : undefined);

  return (
    <div
      className={wrapperClass}
      role={resolvedRole}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabel ? undefined : resolvedAriaLabelledBy}
      aria-describedby={resolvedAriaDescribedBy}
      aria-live={ariaLive}
      aria-atomic={ariaAtomic}
      data-testid={testId}
    >
      {Icon && (
        <div
          className={classMap.icon}
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

      <div className={classMap.content}>
        {title && (
          <h3
            id={titleId}
            className={classMap.title}
            data-testid={`${testId}-title`}
          >
            {title}
          </h3>
        )}

        <div
          className={classMap.value}
          data-testid={`${testId}-value`}
          aria-label={valueLabel}
        >
          {value}
        </div>

        {subtext && (
          <div
            id={subtextId}
            className={classMap.subtext}
            data-testid={`${testId}-subtext`}
          >
            {subtext}
          </div>
        )}
      </div>
    </div>
  );
};

BaseMetricBox.displayName = "BaseMetricBox";
export default BaseMetricBox;
