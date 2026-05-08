import React, { useMemo, useId } from "react";
import { SpinnerProps } from "./Spinner.types";
import { combineClassNames } from "../../utils/classNames";
import { capitalize } from "../../utils/capitalize";
import {
  getDefaultShadow,
  getDefaultTheme,
} from "../../config/boreal-style-config";

const SpinnerBase: React.FC<
  SpinnerProps & { classMap: Record<string, string> }
> = ({
  theme = getDefaultTheme(),
  glass = false,
  state = "",
  size = 50,
  shadow = getDefaultShadow(),
  className = "",
  "data-testid": dataTestId,
  testId = dataTestId ?? "spinner",
  label,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  "aria-live": ariaLive = "polite",
  "aria-busy": ariaBusy = true,
  role = "status",
  classMap,
}) => {
  const uid = useId();
  const spinnerSize = `${size}px`;
  const strokeWidth = `${Math.max(2, Math.floor(size / 12))}px`;

  const visibleLabelId = label ? `${testId}-label-${uid}` : undefined;

  const wrapperClass = useMemo(
    () => combineClassNames(classMap.wrapper, className),
    [classMap, className],
  );

  const spinnerClasses = useMemo(
    () =>
      combineClassNames(
        classMap.spinner,
        classMap[theme],
        classMap[state],
        glass && classMap.glass,
      ),
    [classMap, theme, state, glass],
  );

  const shadowClass = useMemo(
    () =>
      combineClassNames(
        classMap.shadowElement,
        shadow && classMap[`shadow${capitalize(shadow)}`],
      ),
    [classMap, shadow],
  );

  const accessibleNameProps = ariaLabelledBy
    ? { "aria-labelledby": ariaLabelledBy }
    : ariaLabel
      ? { "aria-label": ariaLabel }
      : visibleLabelId
        ? { "aria-labelledby": visibleLabelId }
        : { "aria-label": "Loading" };

  return (
    <div
      className={wrapperClass}
      role={role}
      aria-live={ariaLive}
      aria-busy={ariaBusy}
      aria-describedby={ariaDescribedBy}
      data-testid={testId}
      {...accessibleNameProps}
    >
      <div
        className={shadowClass}
        style={{ width: spinnerSize, height: spinnerSize }}
        aria-hidden="true"
      />

      <div
        className={spinnerClasses}
        style={{
          width: spinnerSize,
          height: spinnerSize,
          borderWidth: strokeWidth,
        }}
        aria-hidden="true"
        data-testid={`${testId}-ring`}
      />

      {label && !ariaLabelledBy && (
        <span
          id={visibleLabelId}
          className={classMap.label}
          data-testid={`${testId}-label`}
        >
          {label}
        </span>
      )}
    </div>
  );
};

SpinnerBase.displayName = "SpinnerBase";
export default SpinnerBase;
