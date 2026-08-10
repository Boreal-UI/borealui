import React, { useId } from "react";
import { combineClassNames } from "../../utils/classNames";
import { capitalize } from "../../utils/capitalize";
import { FormFieldBaseProps } from "./FormField.types";

export default function FormFieldBase({
  children,
  id,
  label,
  helperText,
  errorMessage,
  required = false,
  optionalText = "Optional",
  labelPosition = "top",
  state,
  className,
  labelClassName,
  controlClassName,
  helperTextClassName,
  errorClassName,
  testId,
  "data-testid": dataTestId,
  classMap,
}: FormFieldBaseProps) {
  const generatedId = useId();
  const childProps = children.props;
  const resolvedId =
    id ??
    (typeof childProps.id === "string" ? childProps.id : undefined) ??
    `${generatedId}-field`;
  const resolvedTestId = testId ?? dataTestId ?? "form-field";
  const helperId = helperText ? `${resolvedId}-helper` : undefined;
  const errorId = errorMessage ? `${resolvedId}-errorMessage` : undefined;
  const describedBy = [childProps["aria-describedby"], helperId, errorId]
    .filter(Boolean)
    .join(" ");

  const control = React.cloneElement(children, {
    id: resolvedId,
    required: childProps.required ?? required,
    "aria-required": childProps["aria-required"] ?? (required || undefined),
    "aria-invalid":
      childProps["aria-invalid"] ?? (Boolean(errorMessage) || undefined),
    "aria-describedby": describedBy || undefined,
  });

  return (
    <div
      className={combineClassNames(
        classMap.formField,
        classMap[`label${capitalize(labelPosition)}`],
        state && classMap[state],
        className,
      )}
      data-testid={resolvedTestId}
    >
      {label ? (
        <label
          htmlFor={resolvedId}
          className={combineClassNames(classMap.label, labelClassName)}
        >
          <span>{label}</span>
          {!required && optionalText ? (
            <span className={classMap.optional}>{optionalText}</span>
          ) : null}
        </label>
      ) : null}
      <div
        className={combineClassNames(classMap.control, controlClassName)}
        data-testid={`${resolvedTestId}-control`}
      >
        {control}
      </div>
      {helperText ? (
        <div
          id={helperId}
          className={combineClassNames(
            classMap.helperText,
            helperTextClassName,
          )}
          data-testid={`${resolvedTestId}-helper`}
        >
          {helperText}
        </div>
      ) : null}
      {errorMessage ? (
        <div
          id={errorId}
          className={combineClassNames(classMap.errorText, errorClassName)}
          role="alert"
          data-testid={`${resolvedTestId}-errorMessage`}
        >
          {errorMessage}
        </div>
      ) : null}
    </div>
  );
}
