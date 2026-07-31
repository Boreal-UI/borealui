import {
  forwardRef,
  useId,
  useRef,
  useEffect,
  useImperativeHandle,
  useMemo,
} from "react";
import type { CheckBoxBaseProps } from "./CheckBox.types";
import { combineClassNames } from "../../utils/classNames";
import { capitalize } from "../../utils/capitalize";
import { resolvePropAlias } from "../../utils/propAliases";
import {
  getDefaultVariant,
  getDefaultRounding,
  getShadowClassName,
  getDefaultSize,
  getDefaultTheme,
} from "../../config/boreal-style-config";

const CheckBoxBase = forwardRef<HTMLInputElement, CheckBoxBaseProps>(
  (
    {
      checked,
      onChange,
      indeterminate = false,
      theme = getDefaultTheme(),
      rounding = getDefaultRounding(),
      size = getDefaultSize(),
      shadow,
      state,
      variant = getDefaultVariant(),
      disabled = false,
      required = false,
      invalid = false,
      label,
      helperText,
      errorMessage,
      labelPosition = "right",
      className,
      labelWrapperClassName,
      inputClassName,
      boxClassName,
      labelClassName,
      descriptionClassName,
      errorMessageClassName,
      id,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": ariaDescribedBy,
      "aria-errormessage": ariaErrorMessage,
      "data-testid": dataTestId,
      testId = dataTestId ?? "checkbox",
      classMap,
      ...props
    },
    ref,
  ) => {
    const resolvedLabelPosition = resolvePropAlias(labelPosition);
    const internalId = useId();
    const checkboxId = id || internalId;

    const labelId = label ? `${checkboxId}-label` : undefined;
    const descriptionId = helperText ? `${checkboxId}-helperText` : undefined;
    const errorId = errorMessage ? `${checkboxId}-errorMessage` : undefined;

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
          state && classMap[state],
          classMap[resolvedLabelPosition],
          classMap[size],
          getShadowClassName(classMap, theme, shadow),
          rounding && classMap[`round${capitalize(rounding)}`],
          disabled && classMap.disabled,
          invalid && classMap.invalid,
          (variant === "glass" || variant === "glassOutline") && classMap.glass,
          className,
        ),
      [
        classMap,
        theme,
        state,
        resolvedLabelPosition,
        size,
        shadow,
        rounding,
        disabled,
        invalid,
        variant,
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
        <label
          htmlFor={checkboxId}
          className={combineClassNames(
            classMap.labelWrapper,
            labelWrapperClassName,
          )}
        >
          {label && resolvedLabelPosition === "left" && (
            <span
              className={combineClassNames(classMap.label, labelClassName)}
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
            className={combineClassNames(classMap.input, inputClassName)}
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
              boxClassName,
            )}
            aria-hidden="true"
            data-testid={testId ? `${testId}-box` : undefined}
          />

          {label && resolvedLabelPosition === "right" && (
            <span
              className={combineClassNames(classMap.label, labelClassName)}
              id={labelId}
              data-testid={testId ? `${testId}-label` : undefined}
            >
              {label}
            </span>
          )}
        </label>

        {helperText && (
          <div
            id={descriptionId}
            className={combineClassNames(
              classMap.description,
              descriptionClassName,
            )}
            data-testid={testId ? `${testId}-helperText` : undefined}
          >
            {helperText}
          </div>
        )}

        {errorMessage && (
          <div
            id={errorId}
            className={combineClassNames(
              classMap.errorMessage,
              errorMessageClassName,
            )}
            data-testid={testId ? `${testId}-errorMessage` : undefined}
          >
            {errorMessage}
          </div>
        )}
      </div>
    );
  },
);

CheckBoxBase.displayName = "CheckBoxBase";
export default CheckBoxBase;
