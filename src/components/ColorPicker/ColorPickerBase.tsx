import React, { useEffect, useId, useMemo, useReducer, useRef, useState } from "react";
import { combineClassNames } from "../../utils/classNames";
import type { ColorPickerBaseProps } from "./ColorPicker.types";
import { capitalize } from "../../utils/capitalize";
import {
  getDefaultShadow,
  getDefaultSize,
} from "../../config/boreal-style-config";

const isHexColor = (color: string) => /^#[0-9a-f]{6}$/i.test(color);

const ColorPickerBase: React.FC<ColorPickerBaseProps> = ({
  label = "Choose a color",
  colors,
  value,
  defaultValue = "",
  onValueChange,
  name,
  disabled = false,
  size = getDefaultSize(),
  shadow = getDefaultShadow(),
  shape = "round",
  allowCustom = false,
  required = false,
  invalid = false,
  helperText,
  errorMessage,
  customInputAriaLabel = "Custom color picker",
  customOptionLabel = "Custom color",
  hideLabel = false,
  className,
  classMap,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  "data-testid": dataTestId,
  testId = dataTestId ?? "color-picker",
}) => {
  const generatedId = useId();
  const fieldsetRef = useRef<HTMLFieldSetElement>(null);
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = value ?? internalValue;
  const resolvedName = name ?? `color-picker-${generatedId}`;
  const hasPreset = colors.some(color => color.value === currentValue);
  const isCustomSelected = allowCustom && !hasPreset && isHexColor(currentValue);
  const [customValue, setCustomValue] = useState(isHexColor(currentValue) ? currentValue : "#000000");
  const [, refreshAfterReset] = useReducer((revision: number) => revision + 1, 0);
  const customOptionValue = isCustomSelected ? currentValue : customValue;

  useEffect(() => {
    if (isCustomSelected) setCustomValue(currentValue);
  }, [currentValue, isCustomSelected]);

  useEffect(() => {
    const form = fieldsetRef.current?.form;
    if (!form) return;
    let resetTimer: ReturnType<typeof setTimeout> | undefined;
    const reset = (event: Event) => {
      resetTimer = setTimeout(() => {
        if (event.defaultPrevented) return;
        if (!isControlled) {
          setInternalValue(defaultValue);
          setCustomValue(isHexColor(defaultValue) ? defaultValue : "#000000");
        }
        refreshAfterReset();
      }, 0);
    };
    form.addEventListener("reset", reset);
    return () => { form.removeEventListener("reset", reset); clearTimeout(resetTimer); };
  }, [currentValue, defaultValue, isControlled]);

  const changeValue = (next: string) => {
    if (disabled || fieldsetRef.current?.matches(":disabled")) return;
    if (!isControlled) setInternalValue(next);
    onValueChange?.(next);
  };
  const legendId = `${generatedId}-legend`;
  const helperTextId = helperText ? `${generatedId}-helper-text` : undefined;
  const errorTextId = errorMessage
    ? `${generatedId}-errorMessage-text`
    : undefined;

  const describedBy =
    [ariaDescribedBy, helperTextId, invalid ? errorTextId : undefined]
      .filter(Boolean)
      .join(" ") || undefined;

  const computedAriaLabelledBy =
    ariaLabelledBy ?? (!ariaLabel ? legendId : undefined);

  const labelClass = useMemo(
    () =>
      combineClassNames(
        classMap.swatch,
        classMap[size],
        classMap[shape],
        disabled && classMap.disabled,
      ),
    [classMap, size, shape, disabled],
  );

  return (
    <fieldset
      ref={fieldsetRef}
      className={combineClassNames(
        classMap.color_picker,
        invalid && classMap.invalid,
        disabled && classMap.disabled,
        className,
      )}
      disabled={disabled}
      data-testid={testId}
      aria-label={ariaLabel}
      aria-labelledby={computedAriaLabelledBy}
      aria-describedby={describedBy}
      aria-invalid={invalid || undefined}
    >
      <legend
        id={legendId}
        className={combineClassNames(classMap.legend, hideLabel && "sr_only")}
      >
        {label}
      </legend>

      <div className={classMap.grid} role="radiogroup">
        {colors.map((color, i) => {
          const id = `${generatedId}-color-${i}`;
          const optionLabelId = `${id}-label`;
          const isSelected = currentValue === color.value;
          const optionDisabled = disabled || color.disabled;

          return (
            <label
              key={`${color.value}-${i}`}
              className={combineClassNames(
                labelClass,
                optionDisabled && classMap.disabled,
              )}
              htmlFor={id}
              title={color.label}
              data-testid={`${testId}-option-${color.value}`}
            >
              <input
                type="radio"
                name={resolvedName}
                id={id}
                value={color.value}
                checked={isSelected}
                onChange={() => changeValue(color.value)}
                className={classMap.radio_input}
                disabled={optionDisabled}
                required={required}
                aria-describedby={describedBy}
                aria-labelledby={optionLabelId}
              />

              <span id={optionLabelId} className={"sr_only"}>
                {color.label}
              </span>

              <span
                className={combineClassNames(
                  classMap.preview,
                  classMap[shape],
                  isSelected && classMap.value,
                  optionDisabled && classMap.disabled,
                  shadow && classMap[`shadow${capitalize(shadow)}`],
                )}
                style={{ backgroundColor: color.value }}
                aria-hidden="true"
              />
            </label>
          );
        })}
        {allowCustom && (
          <label className={labelClass} htmlFor={`${generatedId}-custom-option`} title={customOptionLabel}>
            <input
              type="radio"
              id={`${generatedId}-custom-option`}
              name={resolvedName}
              value={customOptionValue}
              checked={isCustomSelected}
              onChange={() => changeValue(customOptionValue)}
              className={classMap.radio_input}
              required={required}
              disabled={disabled}
              aria-label={customOptionLabel}
              aria-describedby={describedBy}
              data-testid={`${testId}-custom-option`}
            />
            <span className={combineClassNames(classMap.preview, classMap[shape], isCustomSelected && classMap.value,
              shadow && classMap[`shadow${capitalize(shadow)}`])} style={{ backgroundColor: customOptionValue }} aria-hidden="true" />
          </label>
        )}
      </div>

      {helperText && (
        <div
          id={helperTextId}
          className={classMap.helperText}
          data-testid={`${testId}-helper-text`}
        >
          {helperText}
        </div>
      )}

      {invalid && errorMessage && (
        <div
          id={errorTextId}
          className={classMap.errorText}
          data-testid={`${testId}-errorMessage-text`}
          aria-live="polite"
        >
          {errorMessage}
        </div>
      )}

      {allowCustom && (
        <input
          type="color"
          className={classMap.custom_input}
          value={isHexColor(currentValue) ? currentValue : customValue}
          onChange={(event) => changeValue(event.target.value)}
          aria-label={customInputAriaLabel}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          data-testid={`${testId}-custom-input`}
          disabled={disabled}
        />
      )}
    </fieldset>
  );
};

ColorPickerBase.displayName = "ColorPickerBase";
export default ColorPickerBase;
