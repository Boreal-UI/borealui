import React, { useMemo } from "react";
import { combineClassNames } from "../../utils/classNames";
import type { ColorPickerBaseProps } from "./ColorPicker.types";
import { capitalize } from "../../utils/capitalize";
import {
  getDefaultShadow,
  getDefaultSize,
} from "../../config/boreal-style-config";

const ColorPickerBase: React.FC<ColorPickerBaseProps> = ({
  label = "Choose a color",
  colors,
  value,
  onValueChange,
  name = "color-picker",
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
  hideLabel = false,
  className,
  classMap,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  "data-testid": dataTestId,
  testId = dataTestId ?? "color-picker",
}) => {
  const legendId = `${testId}-legend`;
  const helperTextId = helperText ? `${testId}-helper-text` : undefined;
  const errorTextId = errorMessage ? `${testId}-errorMessage-text` : undefined;

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

      <div className={classMap.color_picker_grid} role="radiogroup">
        {colors.map((color, i) => {
          const id = `${testId}-color-${i}`;
          const optionLabelId = `${id}-label`;
          const isSelected = value === color.value;
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
                name={name}
                id={id}
                value={color.value}
                checked={isSelected}
                onChange={() => onValueChange(color.value)}
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
      </div>

      {helperText && (
        <div
          id={helperTextId}
          className={classMap.helper_text}
          data-testid={`${testId}-helper-text`}
        >
          {helperText}
        </div>
      )}

      {invalid && errorMessage && (
        <div
          id={errorTextId}
          className={classMap.error_text}
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
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
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
