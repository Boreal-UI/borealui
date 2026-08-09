import React, { useMemo, useId } from "react";
import { SliderProps } from "./Slider.types";
import { combineClassNames } from "../../utils/classNames";
import { capitalize } from "../../utils/capitalize";
import { resolvePropAlias } from "../../utils/propAliases";
import {
  getDefaultVariant,
  getDefaultRounding,
  getShadowClassName,
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
  labelPosition = "top",
  size = getDefaultSize(),
  rounding = getDefaultRounding(),
  shadow,
  theme = getDefaultTheme(),
  variant = getDefaultVariant(),
  state,
  showValue = true,
  units,
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
  "aria-orientation": ariaOrientation = "horizontal",
  "data-testid": dataTestId,
  testId = dataTestId ?? "slider",
  classMap,
  ...rest
}) => {
  const uid = useId();
  const resolvedLabelPosition = resolvePropAlias(labelPosition);

  const inputId = id || `${testId}-input-${uid}`;
  const labelId = label ? `${testId}-label-${uid}` : undefined;
  const valueId = showValue ? `${testId}-value-${uid}` : undefined;

  const safeMin = Number.isFinite(min) ? Number(min) : 0;
  const safeMax = Number.isFinite(max) ? Number(max) : 100;
  const safeStep = step > 0 ? step : 1;
  const clamped = Math.min(safeMax, Math.max(safeMin, Number(value)));
  const showMetaRow =
    (resolvedLabelPosition === "top" || resolvedLabelPosition === "bottom") &&
    (label || showValue);

  const containerClasses = useMemo(
    () =>
      combineClassNames(
        classMap.container,
        classMap[`label${capitalize(resolvedLabelPosition)}`],
        classMap[size],
        classMap[theme],
        state && classMap[state],
        (variant === "glass" || variant === "glassOutline") && classMap.glass,
        getShadowClassName(classMap, theme, shadow),
        rounding && classMap[`round${capitalize(rounding)}`],
        className,
      ),
    [
      classMap,
      resolvedLabelPosition,
      size,
      theme,
      state,
      variant,
      className,
      shadow,
      rounding,
    ],
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

  const labelNode = label ? (
    <label
      id={labelId}
      htmlFor={inputId}
      className={classMap.label}
      data-testid={`${testId}-label`}
    >
      {label}
    </label>
  ) : null;

  const valueNode = showValue ? (
    <output
      id={valueId}
      className={classMap.value}
      htmlFor={inputId}
      data-testid={`${testId}-value`}
    >
      {clamped}
      {units}
    </output>
  ) : null;

  const metaNode = showMetaRow ? (
    <div
      className={combineClassNames(
        classMap.meta,
        !label && classMap.metaValueOnly,
      )}
      data-testid={`${testId}-meta`}
    >
      {labelNode}
      {valueNode}
    </div>
  ) : null;

  return (
    <div className={containerClasses} data-testid={`${testId}-container`}>
      {resolvedLabelPosition === "top" && metaNode}
      {resolvedLabelPosition === "left" && labelNode}

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
          aria-orientation={ariaOrientation}
          data-testid={testId}
          {...rest}
        />
      </div>
      {showValue &&
        !showMetaRow &&
        resolvedLabelPosition !== "right" &&
        valueNode}

      {resolvedLabelPosition === "bottom" && metaNode}
      {resolvedLabelPosition === "right" && labelNode}
      {showValue && resolvedLabelPosition === "right" && valueNode}
    </div>
  );
};

SliderBase.displayName = "SliderBase";
export default SliderBase;
