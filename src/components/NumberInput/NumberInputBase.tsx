import {
  forwardRef,
  useId,
  useMemo,
  useState,
  InputHTMLAttributes,
} from "react";
import { NumberInputBaseProps } from "./NumberInput.types";
import { combineClassNames } from "../../utils/classNames";
import { capitalize } from "../../utils/capitalize";
import { resolvePropAlias } from "../../utils/propAliases";
import {
  getDefaultGlass,
  getDefaultOutline,
  getDefaultRounding,
  getDefaultShadow,
  getDefaultTheme,
} from "../../config/boreal-style-config";

const getStepPrecision = (step: number): number => {
  const [, decimal = ""] = String(step).split(".");
  return decimal.length;
};

const normalizeValue = (value: number, step: number): number => {
  const precision = getStepPrecision(step);
  return Number(value.toFixed(precision));
};

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
      outline = getDefaultOutline(),
      glass = getDefaultGlass(),
      rounding = getDefaultRounding(),
      shadow = getDefaultShadow(),
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
    const safeStep = step > 0 ? step : 1;
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
    const srDescriptionId = srOnlyText ? `${inputId}-sr-description` : undefined;
    const computedAriaDescribedBy =
      [ariaDescribedBy, srDescriptionId].filter(Boolean).join(" ") ||
      undefined;
    const computedAriaLabel = label ? undefined : ariaLabel || placeholder;
    const computedAriaInvalid = ariaInvalid ?? (state === "error" || undefined);
    const computedAriaRequired = ariaRequired ?? (required || undefined);
    const computedAriaReadOnly = ariaReadOnly ?? (readOnly || undefined);
    const computedAriaDisabled = ariaDisabled ?? (disabled || undefined);

    const emitChange = (
      nextValue: number | "",
      event: React.ChangeEvent<HTMLInputElement>,
    ) => {
      if (!isControlled) setInternalValue(nextValue);
      onChange?.(nextValue, event);
      if (typeof nextValue === "number") onValueChange?.(nextValue);
    };

    const updateFromNumber = (nextValue: number) => {
      const normalized = normalizeValue(clampValue(nextValue, min, max), safeStep);
      if (!isControlled) setInternalValue(normalized);
      onValueChange?.(normalized);
    };

    const stepBy = (direction: -1 | 1) => {
      if (disabled || readOnly) return;
      const base =
        typeof currentValue === "number"
          ? currentValue
          : typeof min === "number"
            ? min
            : 0;
      updateFromNumber(base + safeStep * direction);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      emitChange(parseInputValue(event.currentTarget.value), event);
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      const parsed = parseInputValue(event.currentTarget.value);

      if (clampOnBlur && typeof parsed === "number") {
        const nextValue = normalizeValue(clampValue(parsed, min, max), safeStep);
        if (!isControlled) setInternalValue(nextValue);
        if (nextValue !== parsed) {
          onValueChange?.(nextValue);
        }
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
          classMap[theme],
          state && classMap[state],
          outline && classMap.outline,
          glass && classMap.glass,
          disabled && classMap.disabled,
          shadow && classMap[`shadow${capitalize(shadow)}`],
          rounding && classMap[`round${capitalize(rounding)}`],
          className,
        ),
      [
        classMap,
        theme,
        state,
        outline,
        glass,
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
            {...restInput}
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
                onClick={() => stepBy(-1)}
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
                onClick={() => stepBy(1)}
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
                classMap.srOnly ?? "sr_only",
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
