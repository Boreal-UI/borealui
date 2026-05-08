import {
  forwardRef,
  useId,
  useRef,
  useEffect,
  useImperativeHandle,
  useMemo,
} from "react";
import type { CheckboxBaseProps } from "./Checkbox.types";
import { combineClassNames } from "../../utils/classNames";
import { capitalize } from "../../utils/capitalize";
import {
  getDefaultRounding,
  getDefaultShadow,
  getDefaultSize,
  getDefaultTheme,
} from "../../config/boreal-style-config";

const CheckboxBase = forwardRef<HTMLInputElement, CheckboxBaseProps>(
  (
    {
      checked,
      onChange,
      indeterminate = false,
      theme = getDefaultTheme(),
      rounding = getDefaultRounding(),
      size = getDefaultSize(),
      shadow = getDefaultShadow(),
      state = "",
      glass = false,
      disabled = false,
      required = false,
      invalid = false,
      label = "",
      description,
      errorMessage,
      labelPosition = "right",
      className = "",
      id,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": ariaDescribedBy,
      "aria-errormessage": ariaErrorMessage,
      "data-testid": testId = "checkbox",
      classMap,
      ...props
    },
    ref,
  ) => {
    const internalId = useId();
    const checkboxId = id || internalId;

    const labelId = label ? `${checkboxId}-label` : undefined;
    const descriptionId = description ? `${checkboxId}-description` : undefined;
    const errorId = errorMessage ? `${checkboxId}-error` : undefined;

    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    const combinedClassName = useMemo(
      () =>
        combineClassNames(
          classMap.checkbox,
          classMap[theme],
          classMap[state],
          classMap[labelPosition],
          classMap[size],
          shadow && classMap[`shadow${capitalize(shadow)}`],
          rounding && classMap[`round${capitalize(rounding)}`],
          disabled && classMap.disabled,
          invalid && classMap.invalid,
          glass && classMap.glass,
          className,
        ),
      [
        classMap,
        theme,
        state,
        labelPosition,
        size,
        shadow,
        rounding,
        disabled,
        invalid,
        glass,
        className,
      ],
    );

    const resolvedAriaLabelledBy =
      ariaLabelledBy ?? (!ariaLabel ? labelId : undefined);

    const resolvedAriaDescribedBy =
      [ariaDescribedBy, descriptionId, errorId].filter(Boolean).join(" ") ||
      undefined;

    const resolvedAriaErrorMessage = ariaErrorMessage ?? errorId;

    return (
      <div
        className={combinedClassName}
        data-testid={testId ? `${testId}-wrapper` : undefined}
      >
        <label htmlFor={checkboxId} className={classMap.labelWrapper}>
          {label && labelPosition === "left" && (
            <span
              className={classMap.label}
              id={labelId}
              data-testid={testId ? `${testId}-label` : undefined}
            >
              {label}
            </span>
          )}

          <input
            id={checkboxId}
            ref={inputRef}
            type="checkbox"
            className={classMap.input}
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            required={required}
            aria-label={ariaLabel}
            aria-labelledby={resolvedAriaLabelledBy}
            aria-describedby={resolvedAriaDescribedBy}
            aria-invalid={invalid || state === "error" ? true : undefined}
            aria-errormessage={
              invalid || state === "error"
                ? resolvedAriaErrorMessage
                : undefined
            }
            aria-checked={indeterminate ? "mixed" : checked}
            {...props}
          />

          <span
            className={combineClassNames(
              classMap.box,
              indeterminate && classMap.indeterminate,
            )}
            aria-hidden="true"
            data-testid={testId ? `${testId}-box` : undefined}
          />

          {label && labelPosition === "right" && (
            <span
              className={classMap.label}
              id={labelId}
              data-testid={testId ? `${testId}-label` : undefined}
            >
              {label}
            </span>
          )}
        </label>

        {description && (
          <div
            id={descriptionId}
            className={classMap.description}
            data-testid={testId ? `${testId}-description` : undefined}
          >
            {description}
          </div>
        )}

        {errorMessage && (
          <div
            id={errorId}
            className={classMap.errorMessage}
            data-testid={testId ? `${testId}-error` : undefined}
          >
            {errorMessage}
          </div>
        )}
      </div>
    );
  },
);

CheckboxBase.displayName = "CheckboxBase";
export default CheckboxBase;
