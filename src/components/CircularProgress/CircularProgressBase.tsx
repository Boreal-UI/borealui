import React, { useEffect, useMemo, useState } from "react";
import type { CircularProgressBaseProps } from "./CircularProgress.types";
import { combineClassNames } from "../../utils/classNames";
import {
  appendUnits,
  formatDefaultValue,
  formatValueText,
} from "../../utils/chartUtils";
import {
  getDefaultGlass,
  getShadowClassName,
  getDefaultSize,
  getDefaultTheme,
} from "../../config/boreal-style-config";

const getColor = (percent: number): string => {
  if (percent <= 0) return "var(--background-color)";
  if (percent <= 40) return "var(--error-color)";
  if (percent <= 70) return "var(--warning-color)";
  return "var(--success-color)";
};

const CircularProgressBase: React.FC<CircularProgressBaseProps> = ({
  value,
  units,
  min = 0,
  max = 100,
  label = "Progress",
  shadow,
  showRaw = false,
  size = getDefaultSize(),
  theme = getDefaultTheme(),
  state,
  glass = getDefaultGlass(),
  className,
  classMap,
  decorative = false,
  announceInnerValue = false,
  ariaValueText,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  "data-testid": dataTestId,
  testId = dataTestId ?? "circular-progress",
  ...rest
}) => {
  const range = Math.max(0, max - min);
  const clamped = Math.min(max, Math.max(min, value));
  const percent = range === 0 ? 0 : ((clamped - min) / range) * 100;

  const [displayPercent, setDisplayPercent] = useState(0);

  useEffect(() => {
    setDisplayPercent(Math.round(percent));
  }, [percent]);

  const stateColorMap: Record<string, string> = {
    success: "var(--success-color)",
    error: "var(--error-color)",
    warning: "var(--warning-color)",
    info: "var(--info-color)",
  };

  const progressColor = state
    ? (stateColorMap[state] ?? getColor(percent))
    : getColor(percent);

  const angle = Math.min(360, (percent / 100) * 360);

  const combinedClassName = useMemo(
    () =>
      combineClassNames(
        classMap.circular_progress,
        classMap[theme],
        classMap[size],
        state && classMap[state],
        glass && classMap.glass,
        getShadowClassName(classMap, theme, shadow),
        className,
      ),
    [classMap, theme, size, state, glass, shadow, className],
  );

  const clampedText = formatDefaultValue(clamped);
  const maxText = formatDefaultValue(max);

  const percentText = formatValueText(
    displayPercent,
    (percentValue) => `${percentValue}%`,
  );

  const resolvedAriaValueText =
    ariaValueText ??
    (showRaw
      ? `${formatDefaultValue(clamped)} out of ${appendUnits(
          formatDefaultValue(max),
          units,
        )}`
      : percentText);

  const accessibleNameProps = decorative
    ? {}
    : ariaLabelledBy
      ? { "aria-labelledby": ariaLabelledBy }
      : ariaLabel
        ? { "aria-label": ariaLabel }
        : { "aria-label": label };

  return (
    <div
      className={combinedClassName}
      data-testid={testId}
      {...(!decorative && {
        role: "progressbar",
        "aria-valuemin": min,
        "aria-valuemax": max,
        "aria-valuenow": clamped,
        "aria-valuetext": resolvedAriaValueText,
        "aria-describedby": ariaDescribedBy,
        ...accessibleNameProps,
      })}
      {...(decorative && {
        "aria-hidden": true,
      })}
      {...rest}
    >
      <div
        className={combineClassNames(
          classMap.circle_border,
          state && classMap[`state_${state}`],
        )}
        style={
          progressColor
            ? ({
                "--circular-progress-fill": `conic-gradient(
          ${progressColor} 0deg,
          ${progressColor} ${angle}deg,
          transparent ${angle}deg 360deg
        )`,
              } as React.CSSProperties)
            : undefined
        }
      >
        <div
          className={combineClassNames(
            classMap.inner_circle,
            glass && classMap.glass,
          )}
        >
          <span
            className={classMap.value_text}
            aria-hidden={announceInnerValue ? undefined : true}
            aria-live={announceInnerValue ? "polite" : undefined}
            aria-atomic={announceInnerValue ? "true" : undefined}
          >
            {showRaw ? (
              <>
                <span className={classMap.valueNumber}>
                  {clampedText}/{maxText}
                </span>
                {units && <span className={classMap.valueUnits}>{units}</span>}
              </>
            ) : (
              <>
                <span className={classMap.valueNumber}>{displayPercent}</span>
                {units && <span className={classMap.valueUnits}>{units}</span>}
              </>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

CircularProgressBase.displayName = "CircularProgressBase";
export default CircularProgressBase;
