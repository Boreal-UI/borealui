import { ChangeEvent, forwardRef, useId, useMemo, useRef } from "react";
import { TimePickerBaseProps } from "./TimePicker.types";
import { combineClassNames } from "../../utils/classNames";
import { CalendarIcon } from "../../Icons";
import { capitalize } from "../../utils/capitalize";
import { resolvePropAlias } from "../../utils/propAliases";
import {
  getDefaultGlass,
  getDefaultOutline,
  getDefaultRounding,
  getDefaultShadow,
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
      description,
      helperText,
      error,
      fullWidth = false,
      theme = getDefaultTheme(),
      state,
      outline = getDefaultOutline(),
      glass = getDefaultGlass(),
      rounding = getDefaultRounding(),
      shadow = getDefaultShadow(),
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
      descriptionClassName,
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
    const descriptionId = description ? `${rootId}-description` : undefined;
    const helperId = helperText && !error ? `${rootId}-helper` : undefined;
    const errorId = error ? `${rootId}-error` : undefined;
    const srDescriptionId = srOnlyText ? `${rootId}-sr-description` : undefined;
    const describedBy =
      [ariaDescribedBy, descriptionId, helperId, errorId, srDescriptionId]
        .filter(Boolean)
        .join(" ") || undefined;
    const invalidRange = min && max ? min > max : false;
    const outOfBounds = value
      ? (min ? value < min : false) || (max ? value > max : false)
      : false;
    const invalid = Boolean(error || invalidRange || outOfBounds);
    const computedAriaDisabled = ariaDisabled ?? (disabled || undefined);

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
          classMap[theme],
          state && classMap[state],
          invalid && classMap.error,
          outline && classMap.outline,
          glass && classMap.glass,
          disabled && classMap.disabled,
          readOnly && classMap.readOnly,
          loading && classMap.loading,
          fullWidth && classMap.fullWidth,
          shadow && classMap[`shadow${capitalize(shadow)}`],
          rounding && classMap[`round${capitalize(rounding)}`],
          className,
        ),
      [
        classMap,
        theme,
        state,
        invalid,
        outline,
        glass,
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
              defaultValue={defaultValue}
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
              aria-errormessage={error ? errorId : undefined}
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
                classMap.srOnly ?? "sr_only",
                srOnlyClassName,
              )}
              data-testid={`${testId}-sr-only-text`}
            >
              {srOnlyText}
            </span>
          ) : null}
        </div>

        {description ? (
          <p
            id={descriptionId}
            className={combineClassNames(
              classMap.description,
              descriptionClassName,
            )}
            data-testid={`${testId}-description`}
          >
            {description}
          </p>
        ) : null}

        {helperText && !error ? (
          <p
            id={helperId}
            className={combineClassNames(
              classMap.helperText,
              helperTextClassName,
            )}
            data-testid={`${testId}-helper`}
          >
            {helperText}
          </p>
        ) : null}

        {error ? (
          <p
            id={errorId}
            className={combineClassNames(classMap.errorText, errorClassName)}
            role="alert"
            data-testid={`${testId}-error`}
          >
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);

TimePickerBase.displayName = "TimePickerBase";
export default TimePickerBase;
