import React, { useMemo } from "react";
import { combineClassNames } from "../../utils/classNames";
import { capitalize } from "../../utils/capitalize";
import {
  getDefaultRounding,
  getDefaultShadow,
  getDefaultSize,
  getDefaultTheme,
} from "../../config/boreal-style-config";
import { BaseProgressBarProps } from "./ProgressBar.types";

const BaseProgressBar: React.FC<BaseProgressBarProps> = ({
  value = 0,
  theme = getDefaultTheme(),
  glass = false,
  state = "",
  size = getDefaultSize(),
  rounding = getDefaultRounding(),
  shadow = getDefaultShadow(),
  animated = true,
  indeterminate = false,
  className = "",
  "aria-label": ariaLabel = "Progress",
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  "aria-valuetext": ariaValueText,
  label,
  labelPosition = "top",
  labelId,
  description,
  descriptionId,
  "data-testid": dataTestId,
  testId = dataTestId ?? "progressbar",
  classMap,
}) => {
  const numeric = Number(value);
  const clamped = Number.isFinite(numeric)
    ? Math.min(100, Math.max(0, numeric))
    : 0;
  const progressValue = Math.round(clamped);

  const resolvedLabelId = label ? labelId || `${testId}-label` : undefined;
  const resolvedDescriptionId = description
    ? descriptionId || `${testId}-description`
    : undefined;

  const computedAriaLabel =
    !ariaLabelledBy && !resolvedLabelId ? ariaLabel : undefined;

  const computedAriaLabelledBy = ariaLabelledBy || resolvedLabelId;
  const computedAriaDescribedBy = ariaDescribedBy || resolvedDescriptionId;

  const computedAriaValueText =
    ariaValueText || (indeterminate ? "Loading" : `${progressValue}% complete`);

  const layoutClass = useMemo(() => {
    const posClass = classMap[`label${capitalize(labelPosition)}`];
    return combineClassNames(classMap.layout, Boolean(label) && posClass);
  }, [classMap, label, labelPosition]);

  const wrapperClass = useMemo(
    () =>
      combineClassNames(
        classMap.container,
        classMap[size],
        glass && classMap[theme],
        glass && state && classMap[state],
        glass && classMap.glass,
        shadow && classMap[`shadow${capitalize(shadow)}`],
        rounding && classMap[`round${capitalize(rounding)}`],
        className,
      ),
    [classMap, size, theme, state, glass, shadow, rounding, className],
  );

  const barClass = useMemo(
    () =>
      combineClassNames(
        classMap.bar,
        classMap[theme],
        classMap[state],
        glass && classMap.glassBar,
        animated && classMap.animated,
        rounding && classMap[`round${capitalize(rounding)}`],
        indeterminate && classMap.indeterminate,
      ),
    [classMap, theme, state, glass, rounding, indeterminate, animated],
  );

  const labelNode = label ? (
    <div
      id={resolvedLabelId}
      className={classMap.label}
      data-testid={`${testId}-label`}
    >
      {label}
    </div>
  ) : null;

  const descriptionNode = description ? (
    <div id={resolvedDescriptionId} data-testid={`${testId}-description`}>
      {description}
    </div>
  ) : null;

  return (
    <div className={layoutClass}>
      {(labelPosition === "top" || labelPosition === "left") && labelNode}

      <div
        className={wrapperClass}
        role="progressbar"
        aria-label={computedAriaLabel}
        aria-labelledby={computedAriaLabelledBy}
        aria-describedby={computedAriaDescribedBy}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={indeterminate ? undefined : progressValue}
        aria-valuetext={computedAriaValueText}
        aria-busy={indeterminate || undefined}
        data-testid={testId}
      >
        <div
          className={barClass}
          style={{ width: indeterminate ? undefined : `${progressValue}%` }}
          data-testid={`${testId}-bar`}
        />
      </div>

      {(labelPosition === "bottom" || labelPosition === "right") && labelNode}
      {descriptionNode}
    </div>
  );
};

BaseProgressBar.displayName = "BaseProgressBar";
export default BaseProgressBar;
