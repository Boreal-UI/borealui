import React, { useMemo, useId } from "react";
import { SliderProps } from "./Slider.types";
import { combineClassNames } from "../../utils/classNames";
import { capitalize } from "../../utils/capitalize";
import {
  getDefaultGlass,
  getDefaultRounding,
  getDefaultShadow,
  getDefaultSize,
  getDefaultTheme,
} from "../../config/boreal-style-config";

const SliderBase: React.FC<
  SliderProps & { classMap: Record<string, string> }
> = ({
  value,
  onChange,
  onValueChange,
  id,
  name,
  min = 0,
  max = 100,
  step = 1,
  label,
  size = getDefaultSize(),
  rounding = getDefaultRounding(),
  shadow = getDefaultShadow(),
  theme = getDefaultTheme(),
  glass = getDefaultGlass(),
  state,
  showValue = true,
  className,
  disabled = false,
  required = false,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  "aria-valuetext": ariaValueText,
  "aria-valuemin": ariaValueMin,
  "aria-valuemax": ariaValueMax,
  "aria-valuenow": ariaValueNow,
  "aria-invalid": ariaInvalid,
  "aria-required": ariaRequired,
  "aria-orientation": ariaOrientation = "horizontal",
  "data-testid": dataTestId,
  testId = dataTestId ?? "slider",
  classMap,
  ...rest
}) => {
  const uid = useId();

  const inputId = id || `${testId}-input-${uid}`;
  const labelId = label ? `${testId}-label-${uid}` : undefined;
  const valueId = showValue ? `${testId}-value-${uid}` : undefined;

  const safeMin = Number.isFinite(min) ? Number(min) : 0;
  const safeMax = Number.isFinite(max) ? Number(max) : 100;
  const safeStep = step > 0 ? step : 1;
  const clamped = Math.min(safeMax, Math.max(safeMin, Number(value)));

  const containerClasses = useMemo(
    () =>
      combineClassNames(
        classMap.container,
        classMap[size],
        classMap[theme],
        state && classMap[state],
        glass && classMap.glass,
        shadow && classMap[`shadow${capitalize(shadow)}`],
        rounding && classMap[`round${capitalize(rounding)}`],
        className,
      ),
    [classMap, size, theme, state, glass, className, shadow, rounding],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numeric = Number(e.target.value);
    onChange?.(e);
    onValueChange?.(numeric);
  };

  const computedAriaLabelledBy = label
    ? [labelId, ariaLabelledBy].filter(Boolean).join(" ")
    : ariaLabelledBy;

  const computedAriaDescribedBy =
    [ariaDescribedBy, showValue ? valueId : undefined]
      .filter(Boolean)
      .join(" ") || undefined;

  const computedAriaInvalid =
    ariaInvalid !== undefined
      ? ariaInvalid
      : state === "error"
        ? true
        : undefined;

  const computedAriaRequired =
    ariaRequired !== undefined ? ariaRequired : required ? true : undefined;

  return (
    <div className={containerClasses} data-testid={`${testId}-container`}>
      {label && (
        <label
          id={labelId}
          htmlFor={inputId}
          className={classMap.label}
          data-testid={`${testId}-label`}
        >
          {label}
        </label>
      )}

      <div className={classMap.wrapper} data-testid={`${testId}-wrapper`}>
        <input
          id={inputId}
          name={name}
          type="range"
          className={classMap.slider}
          value={clamped}
          onChange={handleChange}
          min={safeMin}
          max={safeMax}
          step={safeStep}
          disabled={disabled}
          required={required}
          aria-label={
            !computedAriaLabelledBy ? ariaLabel || "Slider" : undefined
          }
          aria-labelledby={computedAriaLabelledBy || undefined}
          aria-describedby={computedAriaDescribedBy}
          aria-valuetext={ariaValueText}
          aria-valuemin={ariaValueMin ?? safeMin}
          aria-valuemax={ariaValueMax ?? safeMax}
          aria-valuenow={ariaValueNow ?? clamped}
          aria-invalid={computedAriaInvalid}
          aria-required={computedAriaRequired}
          aria-orientation={ariaOrientation}
          data-testid={testId}
          {...rest}
        />

        {showValue && (
          <output
            id={valueId}
            className={classMap.value}
            htmlFor={inputId}
            data-testid={`${testId}-value`}
          >
            {clamped}
          </output>
        )}
      </div>
    </div>
  );
};

SliderBase.displayName = "SliderBase";
export default SliderBase;
