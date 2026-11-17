import { useId, useMemo } from "react";
import { combineClassNames } from "../../utils/classNames";
import { capitalize } from "../../utils/capitalize";
import {
  getDefaultVariant,
  getDefaultRounding,
  getDefaultSize,
  getShadowClassName,
  getDefaultTheme,
} from "../../config/boreal-style-config";
import {
  DateInputChange,
  DateRangePickerBaseProps,
} from "./DateRangePicker.types";

export default function DateRangePickerBase({
  value,
  onChange,
  label,
  startLabel = "Start date",
  endLabel = "End date",
  startInputProps,
  endInputProps,
  startPickerButtonAriaLabel,
  endPickerButtonAriaLabel,
  labelPosition = "top",
  min,
  max,
  disabled = false,
  required = false,
  name,
  id,
  helperText,
  DatePickerComponent,
  errorMessage,
  theme = getDefaultTheme(),
  state,
  variant = getDefaultVariant(),
  rounding = getDefaultRounding(),
  shadow,
  size = getDefaultSize(),
  className,
  labelClassName,
  groupClassName,
  inputClassName,
  helperTextClassName,
  errorClassName,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  testId,
  "data-testid": dataTestId,
  classMap,
}: DateRangePickerBaseProps) {
  const generatedId = useId();
  const resolvedId = id ?? `${generatedId}-date-range`;
  const resolvedTestId = testId ?? dataTestId ?? "date-range-picker";
  const helperId = helperText ? `${resolvedId}-helper` : undefined;
  const errorId = errorMessage ? `${resolvedId}-errorMessage` : undefined;
  const describedBy = [ariaDescribedBy, helperId, errorId]
    .filter(Boolean)
    .join(" ");

  const getDateInputValue = (next: DateInputChange): string => {
    if (typeof next === "string") return next;

    return next.currentTarget?.value ?? next.target?.value ?? "";
  };

  const groupClass = useMemo(
    () =>
      combineClassNames(
        classMap.group,
        classMap[size],
        classMap[theme],
        state && classMap[state],
        (variant === "outline" || variant === "glassOutline") &&
          classMap.outline,
        (variant === "glass" || variant === "glassOutline") && classMap.glass,
        getShadowClassName(classMap, theme, shadow),
        rounding && classMap[`round${capitalize(rounding)}`],
        disabled && classMap.disabled,
        groupClassName,
      ),
    [
      classMap,
      size,
      theme,
      state,
      variant,
      shadow,
      rounding,
      disabled,
      groupClassName,
    ],
  );

  return (
    <fieldset
      className={combineClassNames(
        classMap.dateRangePicker,
        classMap[`label${capitalize(labelPosition)}`],
        className,
      )}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={describedBy || undefined}
      data-testid={resolvedTestId}
    >
      {label ? <legend className={classMap.legend}>{label}</legend> : null}
      <div className={classMap.layout}>
        {label ? (
          <span
            className={combineClassNames(classMap.label, labelClassName)}
            aria-hidden="true"
          >
            {label}
          </span>
        ) : null}
        <div className={groupClass}>
          <div className={classMap.field}>
            <label id={`${resolvedId}-start-label`} htmlFor={`${resolvedId}-start-input`} className={classMap.fieldLabel}>{startLabel}</label>
            <span id={`${resolvedId}-start-action`} className="sr_only">Open date picker for</span>
            <DatePickerComponent
              inputProps={{ "aria-labelledby": startInputProps?.["aria-label"] ? undefined : `${resolvedId}-start-label`, ...startInputProps }}
              buttonProps={{ "aria-labelledby": startPickerButtonAriaLabel ? undefined : `${resolvedId}-start-action ${resolvedId}-start-label` }}
              pickerButtonAriaLabel={startPickerButtonAriaLabel}
              aria-describedby={describedBy || undefined}
              theme={theme}
              state={state}
              fullWidth
              id={`${resolvedId}-start`}
              name={name ? `${name}-start` : undefined}
              type="date"
              min={min}
              max={value.end || max}
              value={value.start}
              shadow="none"
              size={size}
              variant={variant}
              rounding={rounding}
              disabled={disabled}
              required={required}
              aria-invalid={
                Boolean(errorMessage) || state === "error" || undefined
              }
              onChange={(next: DateInputChange) => {
                onChange?.({
                  ...value,
                  start: getDateInputValue(next),
                });
              }}
              className={combineClassNames(classMap.input, inputClassName)}
              data-testid={`${resolvedTestId}-start`}
            />
          </div>
          <span className={classMap.separator} aria-hidden="true">
            –
          </span>
          <div className={classMap.field}>
            <label id={`${resolvedId}-end-label`} htmlFor={`${resolvedId}-end-input`} className={classMap.fieldLabel}>{endLabel}</label>
            <span id={`${resolvedId}-end-action`} className="sr_only">Open date picker for</span>
            <DatePickerComponent
              inputProps={{ "aria-labelledby": endInputProps?.["aria-label"] ? undefined : `${resolvedId}-end-label`, ...endInputProps }}
              buttonProps={{ "aria-labelledby": endPickerButtonAriaLabel ? undefined : `${resolvedId}-end-action ${resolvedId}-end-label` }}
              pickerButtonAriaLabel={endPickerButtonAriaLabel}
              aria-describedby={describedBy || undefined}
              theme={theme}
              state={state}
              fullWidth
              id={`${resolvedId}-end`}
              name={name ? `${name}-end` : undefined}
              type="date"
              min={value.start || min}
              max={max}
              variant={variant}
              shadow="none"
              size={size}
              rounding={rounding}
              value={value.end}
              disabled={disabled}
              required={required}
              aria-invalid={
                Boolean(errorMessage) || state === "error" || undefined
              }
              onChange={(next: DateInputChange) => {
                onChange?.({
                  ...value,
                  end: getDateInputValue(next),
                });
              }}
              className={combineClassNames(classMap.input, inputClassName)}
              data-testid={`${resolvedTestId}-end`}
            />
          </div>
        </div>
        {helperText ? (
          <div
            id={helperId}
            className={combineClassNames(
              classMap.helperText,
              helperTextClassName,
            )}
          >
            {helperText}
          </div>
        ) : null}
        {errorMessage ? (
          <div
            id={errorId}
            className={combineClassNames(classMap.errorText, errorClassName)}
            role="alert"
          >
            {errorMessage}
          </div>
        ) : null}
      </div>
    </fieldset>
  );
}
