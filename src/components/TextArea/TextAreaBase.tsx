import { forwardRef, useId, useMemo } from "react";
import { combineClassNames } from "../../utils/classNames";
import { TextAreaProps } from "./TextArea.types";
import { capitalize } from "../../utils/capitalize";
import { resolvePropAlias } from "../../utils/propAliases";
import {
  getDefaultOutline,
  getDefaultGlass,
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
      outline = getDefaultOutline(),
      autocomplete = false,
      onChange,
      theme = getDefaultTheme(),
      glass = getDefaultGlass(),
      rounding = getDefaultRounding(),
      shadow = getDefaultShadow(),
      state = "",
      resizable = true,
      "aria-description": ariaDescription,
      helperText,
      errorMessage,
      describedBy,
      disabled = false,
      height,
      classMap,
      className = "",
      containerClassName = "",
      labelClassName = "",
      iconClassName = "",
      inputClassName = "",
      resizeHandleClassName = "",
      helperTextClassName = "",
      errorMessageClassName = "",
      srOnlyClassName = "",
      "data-testid": dataTestId,
      testId = dataTestId ?? "text-area",
      id: idProp,
      required,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": ariaDescribedByProp,
      "aria-errormessage": ariaErrorMessageProp,

      ...props
    },
    ref,
  ) => {
    const resolvedLabelPosition = resolvePropAlias(labelPosition);
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
      !ariaLabelledBy && !label ? ariaLabel || placeholder : undefined;

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
          classMap[`label${capitalize(resolvedLabelPosition)}`],
          containerClassName,
        )}
        data-testid={testId}
      >
        {label && (
          <label
            id={labelId}
            htmlFor={id}
            className={combineClassNames(classMap.label, labelClassName)}
            data-testid={`${testId}-label`}
          >
            {label}
          </label>
        )}

        <div className={wrapperClass} data-testid={`${testId}-wrapper`}>
          {Icon && (
            <div
              className={combineClassNames(
                classMap.iconContainer,
                iconClassName,
              )}
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
            className={combineClassNames(classMap.textInput, inputClassName)}
            data-testid={`${testId}-input`}
            {...props}
          />

          <div
            className={combineClassNames(
              classMap.customResizeHandle,
              resizeHandleClassName,
            )}
            aria-hidden="true"
            data-testid={`${testId}-resize-handle`}
          />

          {ariaDescription && (
            <span
              id={descriptionId}
              className={combineClassNames("sr_only", srOnlyClassName)}
              data-testid={`${testId}-description`}
            >
              {ariaDescription}
            </span>
          )}
        </div>

        {helperText && (
          <div
            id={helperTextId}
            className={combineClassNames(
              classMap.helperText,
              helperTextClassName,
            )}
            data-testid={`${testId}-helper-text`}
          >
            {helperText}
          </div>
        )}

        {errorMessage && (
          <div
            id={internalErrorId}
            className={combineClassNames(
              classMap.errorMessage,
              errorMessageClassName,
            )}
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
