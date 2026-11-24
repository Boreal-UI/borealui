import {
  forwardRef,
  useId,
  useMemo,
  useState,
  useRef,
  useImperativeHandle,
  InputHTMLAttributes,
} from "react";
import { NumberInputBaseProps, NumberInputChangeEvent } from "./NumberInput.types";
import { useFormReset } from "../../hooks/useFormReset";
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
    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => inputRef.current!, []);
    const resolvedLabelPosition = resolvePropAlias(labelPosition);
    const safeStep = Number.isFinite(step) && step > 0 ? step : 1;
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState<number | "">(
      defaultValue,
    );
    const currentValue = isControlled ? value : internalValue;
    useFormReset(inputRef, () => {
      if (!isControlled) setInternalValue(defaultValue);
      if (inputRef.current) inputRef.current.value = String(isControlled ? value : defaultValue);
    });

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
      const input = inputRef.current;
      if (disabled || readOnly || !input || input.matches(":disabled")) return;
      const previous = input.value;
      if (direction === 1) input.stepUp();
      else input.stepDown();
      let next = parseInputValue(input.value);
      // WebKit can leave an empty field unchanged when stepping toward a bound
      // that excludes zero. Start on a valid grid point inside those bounds.
      if (previous === "" && next === "" && (min === undefined || max === undefined || min <= max)) {
        const base = min ?? 0;
        const bounded = clampValue(0, min, max);
        const gridIndex = Math.floor(Number(((bounded - base) / safeStep).toPrecision(15)));
        next = Number((base + gridIndex * safeStep).toPrecision(15));
      }
      input.value = previous;
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
            ref={inputRef}
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
