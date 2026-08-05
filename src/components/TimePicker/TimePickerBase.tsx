import { ChangeEvent, forwardRef, useId, useMemo, useRef } from "react";
import { TimePickerBaseProps } from "./TimePicker.types";
import { combineClassNames } from "../../utils/classNames";
import { CalendarIcon } from "../../Icons";
import { capitalize } from "../../utils/capitalize";
import { resolvePropAlias } from "../../utils/propAliases";
import {
  getDefaultVariant,
  getDefaultRounding,
  getDefaultSize,
  getShadowClassName,
  getDefaultTheme,
} from "../../config/boreal-style-config";

const TimePickerBase = forwardRef<HTMLDivElement, TimePickerBaseProps>(
  (
    {
      value,
      defaultValue,
      onChange,
      name,
      min,
      max,
      step,
      required = false,
      readOnly = false,
      placeholder,
      autoComplete = "off",
      title,
      label,
      labelPosition = "top",
      helperText,
      errorMessage,
      fullWidth = false,
      theme = getDefaultTheme(),
      state,
      variant = getDefaultVariant(),
      rounding = getDefaultRounding(),
      shadow,
      size = getDefaultSize(),
      disabled = false,
      loading = false,
      pickerButtonAriaLabel = "Open time picker",
      pickerButtonTitle,
      classMap,
      className,
      containerClassName,
      labelClassName,
      inputWrapperClassName,
      inputClassName,
      buttonClassName,
      helperTextClassName,
      errorClassName,
      srOnlyText,
      srOnlyClassName,
      inputProps,
      buttonProps,
      "data-testid": dataTestId,
      testId = dataTestId ?? "time-picker",
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputRef = useRef<HTMLInputElement>(null);
    const resolvedLabelPosition = resolvePropAlias(labelPosition);

    const {
      id: idProp,
      role: roleProp,
      "aria-describedby": ariaDescribedBy,
      "aria-disabled": ariaDisabled,
      ...restRoot
    } = rest;

    const rootId = idProp ?? `${testId}-${generatedId}`;
    const inputId = `${rootId}-input`;
    const labelId = label ? `${rootId}-label` : undefined;
    const helperId = helperText ? `${rootId}-helperText` : undefined;
    const errorId = errorMessage ? `${rootId}-errorMessage` : undefined;
    const srDescriptionId = srOnlyText ? `${rootId}-sr-helperText` : undefined;
    const describedBy =
      [ariaDescribedBy, helperId, errorId, srDescriptionId]
        .filter(Boolean)
        .join(" ") || undefined;
    const invalidRange = min && max ? min > max : false;
    const outOfBounds = value
      ? (min ? value < min : false) || (max ? value > max : false)
      : false;
    const invalid = Boolean(errorMessage || invalidRange || outOfBounds);
    const computedAriaDisabled = ariaDisabled ?? (disabled || undefined);
    const isControlled = value !== undefined;

    const containerClass = useMemo(
      () =>
        combineClassNames(
          classMap.container,
          classMap[`label${capitalize(resolvedLabelPosition)}`],
          fullWidth && classMap.fullWidth,
          containerClassName,
        ),
      [classMap, resolvedLabelPosition, fullWidth, containerClassName],
    );

    const rootClass = useMemo(
      () =>
        combineClassNames(
          classMap.root,
          classMap[size],
          classMap[theme],
          state && classMap[state],
          invalid && classMap.error,
          (variant === "outline" || variant === "glassOutline") &&
            classMap.outline,
          (variant === "glass" || variant === "glassOutline") && classMap.glass,
          disabled && classMap.disabled,
          readOnly && classMap.readOnly,
          loading && classMap.loading,
          fullWidth && classMap.fullWidth,
          getShadowClassName(classMap, theme, shadow),
          rounding && classMap[`round${capitalize(rounding)}`],
          className,
        ),
      [
        classMap,
        size,
        theme,
        state,
        invalid,
        variant,
        disabled,
        readOnly,
        loading,
        fullWidth,
        shadow,
        rounding,
        className,
      ],
    );

    const openPicker = () => {
      const input = inputRef.current;
      if (!input || disabled || readOnly || loading) return;

      if (typeof input.showPicker === "function") {
        input.showPicker();
        return;
      }

      input.focus();
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      onChange?.(event.target.value);
    };

    return (
      <div className={containerClass} data-testid={testId}>
        {label ? (
          <label
            id={labelId}
            htmlFor={inputId}
            className={combineClassNames(classMap.label, labelClassName)}
            data-testid={`${testId}-label`}
          >
            {label}
            {required ? <span aria-hidden="true"> *</span> : null}
          </label>
        ) : null}

        <div
          ref={ref}
          id={rootId}
          role={roleProp}
          className={rootClass}
          aria-busy={loading || undefined}
          aria-disabled={computedAriaDisabled}
          data-testid={`${testId}-root`}
          {...restRoot}
        >
          {loading ? (
            <span
              className={classMap.loader}
              aria-hidden="true"
              data-testid={`${testId}-loader`}
            />
          ) : null}

          <div
            className={combineClassNames(
              classMap.inputWrapper,
              inputWrapperClassName,
            )}
            data-testid={`${testId}-input-wrapper`}
          >
            <input
              {...inputProps}
              ref={inputRef}
              id={inputId}
              type="time"
              className={combineClassNames(classMap.input, inputClassName)}
              value={value}
              defaultValue={isControlled ? undefined : defaultValue}
              onChange={handleChange}
              name={name}
              min={min}
              max={max}
              step={step}
              required={required}
              disabled={disabled || loading}
              readOnly={readOnly}
              placeholder={placeholder}
              autoComplete={autoComplete}
              title={title}
              aria-label={
                inputProps?.["aria-label"] ??
                (!label && !inputProps?.["aria-labelledby"]
                  ? "Time"
                  : undefined)
              }
              aria-labelledby={
                inputProps?.["aria-labelledby"] ??
                (!inputProps?.["aria-label"] ? labelId : undefined)
              }
              aria-describedby={describedBy}
              aria-invalid={invalid || undefined}
              aria-errormessage={errorMessage ? errorId : undefined}
              aria-required={required || undefined}
              data-testid={`${testId}-input`}
            />

            <button
              {...buttonProps}
              type="button"
              className={combineClassNames(classMap.button, buttonClassName)}
              onClick={openPicker}
              disabled={disabled || readOnly || loading}
              aria-label={pickerButtonAriaLabel}
              title={pickerButtonTitle ?? pickerButtonAriaLabel}
              data-testid={`${testId}-button`}
            >
              <CalendarIcon aria-hidden="true" focusable={false} />
            </button>
          </div>

          {srOnlyText ? (
            <span
              id={srDescriptionId}
              className={combineClassNames(
                "sr_only",
                srOnlyClassName,
              )}
              data-testid={`${testId}-sr-only-text`}
            >
              {srOnlyText}
            </span>
          ) : null}
        </div>

        {helperText ? (
          <p
            id={helperId}
            className={combineClassNames(
              classMap.helperText,
              helperTextClassName,
            )}
            data-testid={`${testId}-helperText`}
          >
            {helperText}
          </p>
        ) : null}

        {errorMessage ? (
          <p
            id={errorId}
            className={combineClassNames(classMap.error, errorClassName)}
            role="alert"
            data-testid={`${testId}-errorMessage`}
          >
            {errorMessage}
          </p>
        ) : null}
      </div>
    );
  },
);

TimePickerBase.displayName = "TimePickerBase";
export default TimePickerBase;
