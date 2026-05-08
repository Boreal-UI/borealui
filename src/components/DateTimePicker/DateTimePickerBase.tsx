import React, { useId, useMemo, useRef } from "react";
import { DateTimePickerBaseProps } from "./DateTimePicker.types";
import { combineClassNames } from "../../utils/classNames";
import { CalendarIcon } from "../../Icons";
import { capitalize } from "../../utils/capitalize";
import {
  getDefaultRounding,
  getDefaultShadow,
  getDefaultSize,
  getDefaultTheme,
} from "../../config/boreal-style-config";

const DateTimePickerBase: React.FC<DateTimePickerBaseProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  name,
  required = false,
  disabled = false,
  readOnly = false,
  placeholder,
  autoComplete = "off",
  title,
  size = getDefaultSize(),
  outline,
  theme = getDefaultTheme(),
  glass = false,
  state = "",
  rounding = getDefaultRounding(),
  shadow = getDefaultShadow(),
  className = "",
  "data-testid": dataTestId,
  testId = dataTestId ?? "datetime-picker",
  classMap,
  error,
  description,
  id,
  labelId,
  descriptionId,
  errorId,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  "aria-errormessage": ariaErrorMessage,
  "aria-invalid": ariaInvalid,
  "aria-required": ariaRequired,
  pickerButtonAriaLabel,
  pickerButtonAriaLabelledBy,
  pickerButtonAriaDescribedBy,
  pickerButtonTitle,
  inputProps,
  buttonProps,
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const computedLabelId = labelId || (label ? `${inputId}-label` : undefined);
  const computedDescriptionId =
    descriptionId || (description ? `${inputId}-description` : undefined);
  const computedErrorId = errorId || (error ? `${inputId}-error` : undefined);

  const inputRef = useRef<HTMLInputElement>(null);

  const invalidRange = min && max ? min > max : false;
  const outOfBounds = value
    ? (min ? value < min : false) || (max ? value > max : false)
    : false;

  const openPicker = () => {
    const el = inputRef.current;
    if (!el || disabled || readOnly) return;

    if (typeof el.showPicker === "function") {
      el.showPicker();
    } else {
      el.focus();
    }
  };

  const pickerClass = useMemo(
    () =>
      combineClassNames(
        classMap.wrapper,
        classMap[theme],
        classMap[state],
        classMap[size],
        glass && classMap.glass,
        shadow && classMap[`shadow${capitalize(shadow)}`],
        rounding && classMap[`round${capitalize(rounding)}`],
        outline && classMap.outline,
        disabled && classMap.disabled,
        readOnly && classMap.readOnly,
        className,
      ),
    [
      classMap,
      theme,
      state,
      size,
      glass,
      shadow,
      rounding,
      outline,
      disabled,
      readOnly,
      className,
    ],
  );

  const mergedDescribedBy =
    [ariaDescribedBy, computedDescriptionId, computedErrorId]
      .filter(Boolean)
      .join(" ") || undefined;

  const resolvedAriaInvalid =
    (ariaInvalid ?? Boolean(error || invalidRange || outOfBounds)) || undefined;

  const resolvedAriaRequired = (ariaRequired ?? required) || undefined;

  const resolvedAriaLabel =
    ariaLabel || (!label && !ariaLabelledBy ? "Date and time" : undefined);

  const resolvedAriaLabelledBy =
    ariaLabelledBy ||
    (!ariaLabel && computedLabelId ? computedLabelId : undefined);

  const resolvedAriaErrorMessage =
    ariaErrorMessage || (error ? computedErrorId : undefined);

  return (
    <div className={pickerClass} data-testid={testId}>
      {label && (
        <label
          id={computedLabelId}
          htmlFor={inputId}
          className={classMap.label}
          data-testid={`${testId}-label`}
        >
          {label}
          {required && <span aria-hidden="true"> *</span>}
        </label>
      )}

      <div className={classMap.inputWrapper}>
        <input
          id={inputId}
          ref={inputRef}
          type="datetime-local"
          className={classMap.input}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          min={min}
          max={max}
          name={name}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          placeholder={placeholder}
          autoComplete={autoComplete}
          title={title}
          aria-label={resolvedAriaLabel}
          aria-labelledby={resolvedAriaLabelledBy}
          aria-describedby={mergedDescribedBy}
          aria-errormessage={resolvedAriaErrorMessage}
          aria-invalid={resolvedAriaInvalid}
          aria-required={resolvedAriaRequired}
          data-testid={`${testId}-input`}
          {...inputProps}
        />

        <button
          type="button"
          className={classMap.icon}
          onClick={openPicker}
          disabled={disabled || readOnly}
          aria-label={pickerButtonAriaLabel || "Open date and time picker"}
          aria-labelledby={pickerButtonAriaLabelledBy}
          aria-describedby={pickerButtonAriaDescribedBy}
          title={
            pickerButtonTitle ||
            pickerButtonAriaLabel ||
            "Open date and time picker"
          }
          data-testid={`${testId}-button`}
          {...buttonProps}
        >
          <CalendarIcon aria-hidden={true} focusable={false} />
        </button>
      </div>

      {description && !error && (
        <p
          id={computedDescriptionId}
          className={classMap.description}
          data-testid={`${testId}-description`}
        >
          {description}
        </p>
      )}

      {error && (
        <p
          id={computedErrorId}
          className={classMap.error}
          role="alert"
          data-testid={`${testId}-error`}
        >
          {error}
        </p>
      )}
    </div>
  );
};

DateTimePickerBase.displayName = "DateTimePickerBase";

export default DateTimePickerBase;
