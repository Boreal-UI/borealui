import { useId, useMemo } from "react";
import { combineClassNames } from "../../utils/classNames";
import { capitalize } from "../../utils/capitalize";
import {
  getDefaultGlass,
  getDefaultOutline,
  getDefaultRounding,
  getDefaultShadow,
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
  labelPosition = "top",
  min,
  max,
  disabled = false,
  required = false,
  name,
  id,
  helperText,
  DatePickerComponent,
  error,
  theme = getDefaultTheme(),
  state,
  outline = getDefaultOutline(),
  glass = getDefaultGlass(),
  rounding = getDefaultRounding(),
  shadow = getDefaultShadow(),
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
  const errorId = error ? `${resolvedId}-error` : undefined;
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
        classMap[theme],
        state && classMap[state],
        outline && classMap.outline,
        glass && classMap.glass,
        shadow && classMap[`shadow${capitalize(shadow)}`],
        rounding && classMap[`round${capitalize(rounding)}`],
        disabled && classMap.disabled,
        groupClassName,
      ),
    [
      classMap,
      theme,
      state,
      outline,
      glass,
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
      {label ? (
        <>
          <legend className={classMap.legend}>{label}</legend>

          <span
            className={combineClassNames(classMap.label, labelClassName)}
            aria-hidden="true"
          >
            {label}
          </span>
        </>
      ) : null}
      <div className={groupClass}>
        <label className={classMap.field}>
          <span className={classMap.fieldLabel}>{startLabel}</span>
          <DatePickerComponent
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
            glass={glass}
            outline={outline}
            rounding={rounding}
            disabled={disabled}
            required={required}
            aria-invalid={Boolean(error) || state === "error" || undefined}
            onChange={(next: DateInputChange) => {
              onChange?.({
                ...value,
                start: getDateInputValue(next),
              });
            }}
            className={combineClassNames(classMap.input, inputClassName)}
            data-testid={`${resolvedTestId}-start`}
          />
        </label>
        <span className={classMap.separator} aria-hidden="true">
          –
        </span>
        <label className={classMap.field}>
          <span className={classMap.fieldLabel}>{endLabel}</span>
          <DatePickerComponent
            theme={theme}
            state={state}
            fullWidth
            glass={glass}
            id={`${resolvedId}-end`}
            name={name ? `${name}-end` : undefined}
            type="date"
            min={value.start || min}
            max={max}
            outline={outline}
            shadow="none"
            rounding={rounding}
            value={value.end}
            disabled={disabled}
            required={required}
            aria-invalid={Boolean(error) || state === "error" || undefined}
            onChange={(next: DateInputChange) => {
              onChange?.({
                ...value,
                end: getDateInputValue(next),
              });
            }}
            className={combineClassNames(classMap.input, inputClassName)}
            data-testid={`${resolvedTestId}-end`}
          />
        </label>
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
      {error ? (
        <div
          id={errorId}
          className={combineClassNames(classMap.errorText, errorClassName)}
          role="alert"
        >
          {error}
        </div>
      ) : null}
    </fieldset>
  );
}
