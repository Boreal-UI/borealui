import {
  forwardRef,
  useId,
  useMemo,
  useState,
  InputHTMLAttributes,
} from "react";
import { NumberInputBaseProps, NumberInputChangeEvent } from "./NumberInput.types";
import { combineClassNames } from "../../utils/classNames";
import { capitalize } from "../../utils/capitalize";
import { resolvePropAlias } from "../../utils/propAliases";
import {
  getDefaultVariant,
  getDefaultRounding,
  getDefaultSize,
  getShadowClassName,
  getDefaultTheme,
} from "../../config/boreal-style-config";

// Preserve input/bound precision; step controls increments, not a rounding grid.
const precisionOf = (value: number): number => {
  const [coefficient, exponent = "0"] = String(value).toLowerCase().split("e");
  return Math.max(0, (coefficient.split(".")[1]?.length ?? 0) - Number(exponent));
};

const normalizeValue = (value: number, step: number, base: number): number =>
  Number(value.toFixed(Math.min(100, Math.max(precisionOf(step), precisionOf(base)))));

const parseInputValue = (value: string): number | "" => {
  if (value.trim() === "") return "";
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : "";
};

const clampValue = (
  value: number,
  min: number | undefined,
  max: number | undefined,
): number => {
  let next = value;
  if (typeof min === "number") next = Math.max(min, next);
  if (typeof max === "number") next = Math.min(max, next);
  return next;
};

const NumberInputBase = forwardRef<HTMLInputElement, NumberInputBaseProps>(
  (
    {
      value,
      defaultValue = "",
      onChange,
      onValueChange,
      label,
      labelPosition = "top",
      placeholder = "Enter number",
      min,
      max,
      step = 1,
      clampOnBlur = true,
      showControls = true,
      decrementAriaLabel = "Decrease value",
      incrementAriaLabel = "Increase value",
      theme = getDefaultTheme(),
      state,
      variant = getDefaultVariant(),
      rounding = getDefaultRounding(),
      shadow,
      size = getDefaultSize(),
      disabled = false,
      readOnly = false,
      required = false,
      classMap,
      className,
      containerClassName,
      labelClassName,
      inputClassName,
      controlsClassName,
      decrementButtonClassName,
      incrementButtonClassName,
      srOnlyText,
      srOnlyClassName,
      "data-testid": dataTestId,
      testId = dataTestId ?? "number-input",
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const resolvedLabelPosition = resolvePropAlias(labelPosition);
    const safeStep = Number.isFinite(step) && step > 0 ? step : 1;
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState<number | "">(
      defaultValue,
    );
    const currentValue = isControlled ? value : internalValue;

    const {
      id: idProp,
      onBlur,
      role,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": ariaDescribedBy,
      "aria-invalid": ariaInvalid,
      "aria-required": ariaRequired,
      "aria-readonly": ariaReadOnly,
      "aria-disabled": ariaDisabled,
      "aria-description": ariaDescription,
      ...restInput
    } = rest as InputHTMLAttributes<HTMLInputElement> & {
      role?: React.AriaRole;
      "aria-label"?: string;
      "aria-labelledby"?: string;
      "aria-describedby"?: string;
      "aria-invalid"?: boolean | "true" | "false" | "grammar" | "spelling";
      "aria-required"?: boolean;
      "aria-readonly"?: boolean;
      "aria-disabled"?: boolean;
      "aria-description"?: string;
    };

    const inputId = idProp ?? `${testId}-input-${generatedId}`;
    const srDescriptionId = srOnlyText
      ? `${inputId}-sr-description`
      : undefined;
    const computedAriaDescribedBy =
      [ariaDescribedBy, srDescriptionId].filter(Boolean).join(" ") || undefined;
    const computedAriaLabel = label ? undefined : ariaLabel || placeholder;
    const computedAriaInvalid = ariaInvalid ?? (state === "error" || undefined);
    const computedAriaRequired = ariaRequired ?? (required || undefined);
    const computedAriaReadOnly = ariaReadOnly ?? (readOnly || undefined);
    const computedAriaDisabled = ariaDisabled ?? (disabled || undefined);

    const emitChange = (
      nextValue: number | "",
      event: NumberInputChangeEvent,
    ) => {
      if (!isControlled) setInternalValue(nextValue);
      onChange?.(nextValue, event);
      if (typeof nextValue === "number") onValueChange?.(nextValue);
    };

    const stepBy = (direction: -1 | 1, event: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || readOnly) return;
      const base = typeof currentValue === "number" ? currentValue : min ?? 0;
      const next = clampValue(normalizeValue(base + safeStep * direction, safeStep, base), min, max);
      if (next !== currentValue) emitChange(next, event);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!disabled && !readOnly) emitChange(parseInputValue(event.currentTarget.value), event);
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      const parsed = parseInputValue(event.currentTarget.value);

      if (!disabled && !readOnly && clampOnBlur && typeof parsed === "number") {
        const nextValue = clampValue(parsed, min, max);
        if (nextValue !== parsed) emitChange(nextValue, event);
      }

      onBlur?.(event);
    };

    const containerClass = useMemo(
      () =>
        combineClassNames(
          classMap.container,
          classMap[`label${capitalize(resolvedLabelPosition)}`],
          containerClassName,
        ),
      [classMap, resolvedLabelPosition, containerClassName],
    );

    const wrapperClass = useMemo(
      () =>
        combineClassNames(
          classMap.numberInput,
          classMap[size],
          classMap[theme],
          state && classMap[state],
          (variant === "outline" || variant === "glassOutline") &&
            classMap.outline,
          (variant === "glass" || variant === "glassOutline") && classMap.glass,
          disabled && classMap.disabled,
          getShadowClassName(classMap, theme, shadow),
          rounding && classMap[`round${capitalize(rounding)}`],
          className,
        ),
      [
        classMap,
        size,
        theme,
        state,
        variant,
        disabled,
        shadow,
        rounding,
        className,
      ],
    );

    const canDecrement =
      !disabled &&
      !readOnly &&
      (typeof min !== "number" ||
        currentValue === "" ||
        Number(currentValue) > min);
    const canIncrement =
      !disabled &&
      !readOnly &&
      (typeof max !== "number" ||
        currentValue === "" ||
        Number(currentValue) < max);

    return (
      <div className={containerClass} data-testid={testId}>
        {label ? (
          <label
            htmlFor={inputId}
            className={combineClassNames(classMap.label, labelClassName)}
            data-testid={`${testId}-label`}
          >
            {label}
          </label>
        ) : null}

        <div className={wrapperClass} data-testid={`${testId}-wrapper`}>
          <input
            {...restInput}
            ref={ref}
            id={inputId}
            type="number"
            className={combineClassNames(classMap.input, inputClassName)}
            value={currentValue}
            placeholder={label ? " " : placeholder}
            min={min}
            max={max}
            step={safeStep}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            role={role}
            aria-label={computedAriaLabel}
            aria-labelledby={ariaLabelledBy}
            aria-describedby={computedAriaDescribedBy}
            aria-invalid={computedAriaInvalid}
            aria-required={computedAriaRequired}
            aria-readonly={computedAriaReadOnly}
            aria-disabled={computedAriaDisabled}
            aria-description={ariaDescription}
            onChange={handleChange}
            onBlur={handleBlur}
            data-testid={`${testId}-input`}
          />

          {showControls ? (
            <div
              className={combineClassNames(
                classMap.controls,
                controlsClassName,
              )}
              data-testid={`${testId}-controls`}
            >
              <button
                type="button"
                className={combineClassNames(
                  classMap.controlButton,
                  decrementButtonClassName,
                )}
                onClick={(event) => stepBy(-1, event)}
                disabled={!canDecrement}
                aria-label={decrementAriaLabel}
                data-testid={`${testId}-decrement`}
              >
                -
              </button>
              <button
                type="button"
                className={combineClassNames(
                  classMap.controlButton,
                  incrementButtonClassName,
                )}
                onClick={(event) => stepBy(1, event)}
                disabled={!canIncrement}
                aria-label={incrementAriaLabel}
                data-testid={`${testId}-increment`}
              >
                +
              </button>
            </div>
          ) : null}

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
      </div>
    );
  },
);

NumberInputBase.displayName = "NumberInputBase";
export default NumberInputBase;
