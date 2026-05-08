import { forwardRef, useId, useMemo } from "react";
import { combineClassNames } from "../../utils/classNames";
import { TextAreaProps } from "./TextArea.types";
import { capitalize } from "../../utils/capitalize";
import {
  getDefaultRounding,
  getDefaultShadow,
  getDefaultTheme,
} from "../../config/boreal-style-config";

const TextAreaBase = forwardRef<
  HTMLTextAreaElement,
  TextAreaProps & { classMap: Record<string, string> }
>(
  (
    {
      label,
      labelPosition = "top",
      icon: Icon,
      placeholder = "Enter text",
      readOnly = false,
      outline = false,
      autocomplete = false,
      onChange,
      theme = getDefaultTheme(),
      glass = false,
      rounding = getDefaultRounding(),
      shadow = getDefaultShadow(),
      state = "",
      resizable = true,

      "aria-label": ariaLabel,
      "aria-description": ariaDescription,
      helperText,
      errorMessage,
      describedBy,
      disabled = false,
      height,
      classMap,
      className = "",
      "data-testid": testId = "text-area",
      id: idProp,
      required,

      // Native accessibility props
      "aria-label": ariaLabelProp,
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": ariaDescribedByProp,
      "aria-errormessage": ariaErrorMessageProp,

      ...props
    },
    ref,
  ) => {
    const autoId = useId();
    const id = idProp || autoId;

    const labelId = label ? `${id}-label` : undefined;
    const descriptionId = ariaDescription ? `${id}-description` : undefined;
    const helperTextId = helperText ? `${id}-helper-text` : undefined;
    const internalErrorId = errorMessage ? `${id}-error-message` : undefined;

    const wrapperClass = useMemo(
      () =>
        combineClassNames(
          classMap.textArea,
          classMap[theme],
          classMap[state],
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

    const isError = state === "error";

    const computedAriaLabel =
      !ariaLabelledBy && !label
        ? ariaLabelProp || ariaLabel || placeholder
        : undefined;

    const describedByIds =
      [
        ariaDescribedByProp,
        describedBy,
        descriptionId,
        helperTextId,
        isError ? internalErrorId : undefined,
      ]
        .filter(Boolean)
        .join(" ") || undefined;

    const errorMessageId =
      isError && (ariaErrorMessageProp || internalErrorId)
        ? ariaErrorMessageProp || internalErrorId
        : undefined;

    return (
      <div
        className={combineClassNames(
          classMap.container,
          classMap[`label${capitalize(labelPosition)}`],
        )}
        data-testid={testId}
      >
        {label && (
          <label
            id={labelId}
            htmlFor={id}
            className={classMap.label}
            data-testid={`${testId}-label`}
          >
            {label}
          </label>
        )}

        <div className={wrapperClass} data-testid={`${testId}-wrapper`}>
          {Icon && (
            <div
              className={classMap.iconContainer}
              aria-hidden="true"
              data-testid={`${testId}-icon`}
            >
              <Icon aria-hidden={true} />
            </div>
          )}

          <textarea
            ref={ref}
            id={id}
            placeholder={placeholder}
            aria-label={computedAriaLabel}
            aria-labelledby={
              ariaLabelledBy || (!ariaLabelledBy && label ? labelId : undefined)
            }
            aria-describedby={describedByIds}
            aria-errormessage={errorMessageId}
            aria-invalid={isError || undefined}
            aria-required={required || undefined}
            aria-readonly={readOnly || undefined}
            aria-disabled={disabled || undefined}
            autoComplete={autocomplete ? "on" : "off"}
            onChange={(e) => onChange?.(e.currentTarget.value, e)}
            readOnly={readOnly}
            disabled={disabled}
            required={required}
            style={{
              height,
              resize: resizable ? undefined : "none",
            }}
            className={classMap.textInput}
            data-testid={`${testId}-input`}
            {...props}
          />

          <div
            className={classMap.customResizeHandle}
            aria-hidden="true"
            data-testid={`${testId}-resize-handle`}
          />

          {ariaDescription && (
            <span
              id={descriptionId}
              className="sr_only"
              data-testid={`${testId}-description`}
            >
              {ariaDescription}
            </span>
          )}
        </div>

        {helperText && (
          <div
            id={helperTextId}
            className={classMap.helperText}
            data-testid={`${testId}-helper-text`}
          >
            {helperText}
          </div>
        )}

        {errorMessage && (
          <div
            id={internalErrorId}
            className={classMap.errorMessage}
            role={isError ? "alert" : undefined}
            data-testid={`${testId}-error-message`}
          >
            {errorMessage}
          </div>
        )}
      </div>
    );
  },
);

TextAreaBase.displayName = "TextAreaBase";

export default TextAreaBase;
